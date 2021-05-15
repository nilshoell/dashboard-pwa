const CACHE_NAME = "dashboard-pwa-cache";
const to_cache = [
  "/public/manifest.json",
  "/public/js/vendor/jquery.min.js",
  "/public/js/vendor/bootstrap.bundle.min.js",
  "/public/js/vendor/d3.min.js",
  "/public/images/favicon.png",
  "/public/images/splash-screen.png",
];

self.addEventListener("install", function(event:any) {
    console.log("Install Event for SW");
    event.waitUntil(
      caches.open(CACHE_NAME).then(function(cache) {
        return cache.addAll(to_cache);
      })
    );
});

self.addEventListener("fetch", function(event:any) {
  console.log("Fetch Event for SW", event);

  caches.open(CACHE_NAME).then(async function(cache) {
    const response = await cache.match(event.request);
    return response || fetch(event.request).then(function (response_1) {
      cache.put(event.request, response_1.clone());
      return response_1;
    });
  });

  // event.respondWith(
  //   caches.match(event.request).then(function(response) {
  //     return response || fetch(event.request);
  //   })
  // );
});

self.addEventListener("activate", function(event) {
  console.log("Activate Event for SW", event);
});

self.addEventListener("push", function(event) {
  console.log("Push Event for SW", event);
});

self.addEventListener("notificationclick", (event:any) => {
  const notification = event.notification;
  const kpi_id = notification.data.kpi;
  const action = event.action;

  console.log("Click on notification detected", event);
  
  const url = "/kpi/" + encodeURIComponent(kpi_id);

  if (action === "close") {
    notification.close();
  } else {
    const channel = new BroadcastChannel("sw-messages");
    channel.postMessage({redirect: url});
    notification.close();
  }

});
