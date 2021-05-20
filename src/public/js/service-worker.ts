const CACHE_NAME = "dashboard-pwa-cache";
const to_cache = [
  "/public/manifest.json",
  "/public/js/vendor/jquery.min.js",
  "/public/js/vendor/bootstrap.bundle.min.js",
  "/public/js/vendor/d3.min.js",
  "/public/images/favicon.png",
  "/public/images/splash-screen.png",
  "/public/images/icon_192.png",
  "/public/images/icon_512.png",
  "/public/images/icon_maskable_bg.png",
  "/offline.html"
];

/**
 * Initial caching of static assets
 */
self.addEventListener("install", function (event: any) {
  console.info("Installing Service Workers");
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(to_cache);
    })
  );
});

/**
 * Intercepts network requests and tries to load from cache, fallback to network
 */
self.addEventListener("fetch", function (event: any) {
  event.respondWith(
    caches.open(CACHE_NAME).then(async function (cache) {
      const cache_response = await cache.match(event.request);
      return cache_response || fetch(event.request)
        .then(function (network_response) {
          cache.put(event.request, network_response.clone());
          return network_response;
        }).catch(function () {
          return caches.match("/offline.html");
        });
    })
  );
});

/**
 * Removes old caches (Disabled for now)
 */
self.addEventListener("activate", function (event: any) {
  console.info("Activate Service Worker", event);
  // event.waitUntil(
  //     caches.keys().then(function(cacheNames) {
  //         return Promise.all(cacheNames.map(function (key) {
  //             if (cacheNames.indexOf(key) === -1) {
  //                 return caches.delete(key);
  //             }
  //         }));
  //     })
  // );
});

self.addEventListener("push", function () {
  console.log("Push Event for SW");
});

/**
 * Handle notification interaction
 */
self.addEventListener("notificationclick", (event: any) => {
  const notification = event.notification;
  const kpi_id = notification.data.kpi;
  const action = event.action;

  const url = "/kpi/" + encodeURIComponent(kpi_id);

  if (action === "close") {
    notification.close();
  } else {
    const channel = new BroadcastChannel("sw-messages");
    channel.postMessage({
      redirect: url
    });
    notification.close();
  }
});