// Minimal Web Push (VAPID) sender for Deno. Uses Web Crypto only.
// Implements: VAPID JWT (ES256), aes128gcm content encoding (single record).

const enc = new TextEncoder();

function b64urlEncode(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlDecode(s: string): Uint8Array {
  const pad = "=".repeat((4 - (s.length % 4)) % 4);
  const b64 = (s + pad).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(b64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

function concat(...arrs: Uint8Array[]): Uint8Array {
  const total = arrs.reduce((s, a) => s + a.length, 0);
  const out = new Uint8Array(total);
  let off = 0;
  for (const a of arrs) {
    out.set(a, off);
    off += a.length;
  }
  return out;
}

async function importVapidPrivate(privateKeyB64Url: string, publicKeyB64Url: string): Promise<CryptoKey> {
  const pub = b64urlDecode(publicKeyB64Url); // 65 bytes: 0x04 || X(32) || Y(32)
  if (pub.length !== 65 || pub[0] !== 0x04) throw new Error("invalid_vapid_public_key");
  const x = b64urlEncode(pub.subarray(1, 33));
  const y = b64urlEncode(pub.subarray(33, 65));
  const jwk: JsonWebKey = {
    kty: "EC",
    crv: "P-256",
    d: privateKeyB64Url,
    x,
    y,
    ext: true,
  };
  return await crypto.subtle.importKey("jwk", jwk, { name: "ECDSA", namedCurve: "P-256" }, false, ["sign"]);
}

async function signVapidJwt(audience: string, subject: string, privateKey: CryptoKey, expSec: number): Promise<string> {
  const header = { typ: "JWT", alg: "ES256" };
  const payload = { aud: audience, exp: expSec, sub: subject };
  const headerB64 = b64urlEncode(enc.encode(JSON.stringify(header)));
  const payloadB64 = b64urlEncode(enc.encode(JSON.stringify(payload)));
  const signingInput = `${headerB64}.${payloadB64}`;
  const sig = await crypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" },
    privateKey,
    enc.encode(signingInput)
  );
  return `${signingInput}.${b64urlEncode(new Uint8Array(sig))}`;
}

async function hkdf(salt: Uint8Array, ikm: Uint8Array, info: Uint8Array, length: number): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey("raw", ikm, "HKDF", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "HKDF", hash: "SHA-256", salt, info },
    key,
    length * 8
  );
  return new Uint8Array(bits);
}

async function generateEcdhP256(): Promise<{ publicRaw: Uint8Array; privateKey: CryptoKey }> {
  const kp = await crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, [
    "deriveBits",
  ]);
  const publicRaw = new Uint8Array(await crypto.subtle.exportKey("raw", kp.publicKey));
  return { publicRaw, privateKey: kp.privateKey };
}

async function deriveSharedSecret(privateKey: CryptoKey, peerPublicRaw: Uint8Array): Promise<Uint8Array> {
  const peer = await crypto.subtle.importKey(
    "raw",
    peerPublicRaw,
    { name: "ECDH", namedCurve: "P-256" },
    true,
    []
  );
  const bits = await crypto.subtle.deriveBits({ name: "ECDH", public: peer }, privateKey, 256);
  return new Uint8Array(bits);
}

// aes128gcm content encoding (RFC 8188 + RFC 8291)
async function encryptPayload(
  payload: Uint8Array,
  uaPublicB64Url: string,
  authB64Url: string
): Promise<{ body: Uint8Array; serverPublicRaw: Uint8Array }> {
  const uaPublic = b64urlDecode(uaPublicB64Url);
  const authSecret = b64urlDecode(authB64Url);

  const { publicRaw: serverPublicRaw, privateKey: serverPrivate } = await generateEcdhP256();
  const ecdhSecret = await deriveSharedSecret(serverPrivate, uaPublic);

  // PRK_key = HKDF-Extract(auth_secret, ecdh_secret)
  // key_info = "WebPush: info\x00" || ua_public || as_public
  const keyInfo = concat(
    enc.encode("WebPush: info\0"),
    uaPublic,
    serverPublicRaw
  );
  const ikm = await hkdf(authSecret, ecdhSecret, keyInfo, 32);

  // Salt + HKDF for content-encryption key & nonce
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const cek = await hkdf(salt, ikm, concat(enc.encode("Content-Encoding: aes128gcm\0")), 16);
  const nonce = await hkdf(salt, ikm, concat(enc.encode("Content-Encoding: nonce\0")), 12);

  // Plaintext: payload || 0x02 (padding delimiter for last record)
  const plaintext = concat(payload, new Uint8Array([0x02]));

  const cryptoKey = await crypto.subtle.importKey("raw", cek, { name: "AES-GCM" }, false, ["encrypt"]);
  const ciphertext = new Uint8Array(
    await crypto.subtle.encrypt({ name: "AES-GCM", iv: nonce }, cryptoKey, plaintext)
  );

  // Header: salt(16) || rs(4, big-endian) || idlen(1) || keyid (idlen)
  // keyid = server public key (65 bytes) for Web Push
  const rs = new Uint8Array(4);
  new DataView(rs.buffer).setUint32(0, 4096, false);
  const idlen = new Uint8Array([serverPublicRaw.length]);
  const header = concat(salt, rs, idlen, serverPublicRaw);

  return { body: concat(header, ciphertext), serverPublicRaw };
}

export interface PushSubscriptionRow {
  endpoint: string;
  p256dh: string;
  auth: string;
}

export interface WebPushResult {
  ok: boolean;
  status: number;
  gone: boolean;
  body?: string;
}

let cachedPrivate: { key: CryptoKey; publicB64: string } | null = null;

async function getVapidPrivateKey(): Promise<{ key: CryptoKey; publicB64: string; subject: string }> {
  const privB64 = Deno.env.get("VAPID_PRIVATE_KEY");
  const pubB64 = Deno.env.get("VAPID_PUBLIC_KEY");
  const subject = Deno.env.get("VAPID_SUBJECT") || "mailto:contact@futureskills.app";
  if (!privB64 || !pubB64) throw new Error("vapid_keys_missing");
  if (!cachedPrivate || cachedPrivate.publicB64 !== pubB64) {
    cachedPrivate = { key: await importVapidPrivate(privB64, pubB64), publicB64: pubB64 };
  }
  return { key: cachedPrivate.key, publicB64: pubB64, subject };
}

export async function sendWebPush(
  sub: PushSubscriptionRow,
  payload: Record<string, unknown>,
  ttlSeconds = 60 * 60 * 24
): Promise<WebPushResult> {
  const { key, publicB64, subject } = await getVapidPrivateKey();
  const url = new URL(sub.endpoint);
  const audience = `${url.protocol}//${url.host}`;
  const exp = Math.floor(Date.now() / 1000) + 12 * 60 * 60;
  const jwt = await signVapidJwt(audience, subject, key, exp);

  const payloadBytes = enc.encode(JSON.stringify(payload));
  const { body } = await encryptPayload(payloadBytes, sub.p256dh, sub.auth);

  const res = await fetch(sub.endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Encoding": "aes128gcm",
      TTL: String(ttlSeconds),
      Authorization: `vapid t=${jwt}, k=${publicB64}`,
    },
    body,
  });

  const gone = res.status === 404 || res.status === 410;
  if (!res.ok) {
    let text = "";
    try {
      text = await res.text();
    } catch {}
    return { ok: false, status: res.status, gone, body: text };
  }
  await res.body?.cancel();
  return { ok: true, status: res.status, gone: false };
}
