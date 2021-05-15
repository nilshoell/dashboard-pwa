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
self.addEventListener("install", function(event:any) {
    console.info("Installing Service Workers");
    event.waitUntil(
      caches.open(CACHE_NAME).then(function(cache) {
        return cache.addAll(to_cache);
      })
    );
});

/**
 * Intercepts network requests and tries to load from cache, fallback to network
 */
self.addEventListener("fetch", function(event:any) {
  event.respondWith(
    caches.open(CACHE_NAME).then(async function(cache) {
      const response = await cache.match(event.request);
      return response || fetch(event.request).then(function (response_1) {
        cache.put(event.request, response_1.clone());
        return response_1;
      }).catch(function() {
        return caches.match("/offline");
      });
    })
  );
});

/**
 * Removes old caches
 */
self.addEventListener("activate", function(event:any) {
  console.info("Activate Service Worker");
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          if (cacheName == CACHE_NAME) {
            return true;
          }
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener("push", function() {
  console.log("Push Event for SW");
});

/**
 * Handle notification interaction
 */
self.addEventListener("notificationclick", (event:any) => {
  const notification = event.notification;
  const kpi_id = notification.data.kpi;
  const action = event.action;

  const url = "/kpi/" + encodeURIComponent(kpi_id);

  if (action === "close") {
    notification.close();
  } else {
    const channel = new BroadcastChannel("sw-messages");
    channel.postMessage({redirect: url});
    notification.close();
  }

});
