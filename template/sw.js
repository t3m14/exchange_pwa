var cacheName = "mPay App";
var filesToCache = [
  "./",
  "./index.html",
  "./assets/css/vendors/aos.css",
  "./assets/css/vendors/bootstrap.min.css",
  "./assets/css/vendors/bootstrap.rtl.min.css",
  "./assets/css/vendors/swiper-bundle.min.css",
  "./assets/css/vendors/iconsax.css",
  "./assets/css/style.css",
  "./assets/js/aos.js",
  "./assets/js/apexcharts.js",
  "./assets/js/bootstrap.bundle.min.js",
  " ./assets/js/chatting-chat.js",
  "./assets/js/custom-candlestick-chart.js",
  "./assets/js/custom-chart2.js",
  "./assets/js/custom-coin-chart.js",
  "./assets/js/custom-revenue-chart.js",
  "./assets/js/custom-swiper.js",
  "./assets/js/custom-feather.js",
  "./assets/js/custom-popover.js",
  "./assets/js/custom-tooltip.js",
  "./assets/js/feather.min.js",
  "./assets/js/homescreen-popup.js",
  "./assets/js/iconsax.js",
  "./assets/js/init-aos.js",
  "./assets/js/loader.js",
  "./assets/js/offcanvas-popup.js",
  "./assets/js/onload-modal.js",
  "./assets/js/onload.js",
  "./assets/js/otp.js",
  "./assets/js/range-slider.js",
  "./assets/js/script.js",
  "./assets/js/scrollspy.js",
  "./assets/js/swiper-bundle.min.js",
];

/* Start the service worker and cache all of the app's content */
self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(cacheName).then(function (cache) {
      return cache.addAll(filesToCache);
    })
  );
  self.skipWaiting();
});

/* Serve cached content when offline */
self.addEventListener("fetch", function (e) {
  e.respondWith(
    caches.match(e.request).then(function (response) {
      return response || fetch(e.request);
    })
  );
});