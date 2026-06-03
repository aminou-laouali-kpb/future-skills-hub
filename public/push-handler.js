// Future Skills — Web Push handler
// Imported via vite-plugin-pwa workbox.importScripts into the generated SW.
// Only adds `push` and `notificationclick` listeners — no caching logic.

self.addEventListener("push", (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch (_) {
    payload = { title: "Future Skills", body: event.data ? event.data.text() : "" };
  }

  const title = payload.title || "Future Skills";
  const options = {
    body: payload.body || "",
    icon: payload.icon || "/placeholder.svg",
    badge: payload.badge || "/placeholder.svg",
    tag: payload.tag || payload.kind || "future-skills",
    renotify: true,
    data: {
      url: payload.url || "/dashboard",
      kind: payload.kind || "custom",
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || "/dashboard";

  event.waitUntil(
    (async () => {
      const allClients = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      for (const client of allClients) {
        const url = new URL(client.url);
        if (url.origin === self.location.origin) {
          await client.focus();
          if ("navigate" in client) {
            try {
              await client.navigate(targetUrl);
            } catch (_) {}
          }
          return;
        }
      }
      await self.clients.openWindow(targetUrl);
    })()
  );
});
