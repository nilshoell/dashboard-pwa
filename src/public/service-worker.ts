const CACHE_NAME = "dashboard-pwa-cache";
const to_cache = [
  "/public/",
  "/public/js/manifest.json",
  "/public/js/vendor/*",
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

self.addEventListener("fetch", function(event) {
  console.log("Fetch Event for SW");
});

self.addEventListener("activate", function(event) {
  console.log("Activate Event for SW");
});

self.addEventListener("push", function(event) {
  console.log("Push Event for SW");
});