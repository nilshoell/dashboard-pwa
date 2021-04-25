const CACHE_NAME = "sw-cache-example";
const to_cache = [
  "/",
  "public/manifest.json",
  "public/images/favicon.png",
  "public/images/splash-screen.png",
];

self.addEventListener("install", function(event) {
    console.log("Install Event for SW");
    caches.open(CACHE_NAME).then((cache) => cache.addAll(to_cache));
});
  
self.addEventListener("fetch", function(event) {
  console.log("Fetch Event for SW");
});

self.addEventListener("activate", function(event) {
  console.log("Activate Event for SW");
});
