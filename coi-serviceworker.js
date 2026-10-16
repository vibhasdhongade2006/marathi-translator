/*! coi-serviceworker v0.1.7 - Guido Zuidhof, licensed under MIT */
let n = navigator;
if ("serviceWorker" in n) {
  n.serviceWorker.register(window.document.currentScript.src).catch(e => console.error("COOP/COEP Service Worker failed to register:", e));
}
if (typeof window === 'undefined') {
  self.addEventListener("install", () => self.skipWaiting());
  self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
  self.addEventListener("fetch", function (e) {
    const { request: r } = e;
    if (r.cache === "only-if-cached" && r.mode !== "same-origin") return;
    e.respondWith(
      fetch(r).then(res => {
        if (res.status === 0) return res;
        const newHeaders = new Headers(res.headers);
        newHeaders.set("Cross-Origin-Embedder-Policy", "require-corp");
        newHeaders.set("Cross-Origin-Opener-Policy", "same-origin");
        return new Response(res.body, {
          status: res.status,
          statusText: res.statusText,
          headers: newHeaders,
        });
      })
    );
  });
}
