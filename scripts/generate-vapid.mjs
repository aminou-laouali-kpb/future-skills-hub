// Generate a VAPID key pair for Web Push.
// Usage: node scripts/generate-vapid.mjs
import { generateKeyPairSync } from "node:crypto";

const { publicKey, privateKey } = generateKeyPairSync("ec", { namedCurve: "prime256v1" });
const pub = publicKey.export({ format: "jwk" });
const priv = privateKey.export({ format: "jwk" });

const b64url = (b64) => b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const publicB64 = b64url(
  Buffer.concat([
    Buffer.from([0x04]),
    Buffer.from(pub.x, "base64url"),
    Buffer.from(pub.y, "base64url"),
  ]).toString("base64")
);

console.log("VAPID_PUBLIC_KEY:", publicB64);
console.log("VAPID_PRIVATE_KEY:", priv.d);
console.log("");
console.log("→ Copy VAPID_PUBLIC_KEY into src/lib/vapidConfig.ts");
console.log("→ Add VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT as edge function secrets");
