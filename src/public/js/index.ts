console.debug("index.js linked");

$(function () {
    console.info("Document Ready");
    new App();
});

class App {

    constructor() {
        console.info("Initializing App");
        this.navigationHandlers();

        // Initialize popovers
        $("[data-toggle='popover']").popover();

        // Register Service Workers in Prod
        if (window.location.protocol === "https:" || window.location.host.startsWith("172")) {
            this.registerSW();
        }

        this.setupNotifications();
        this.displayNotification();
    }

    /**
     * Setup event listeners to toggle the navigation sidebar
     */
    navigationHandlers () {

        // Remove sidebar on click on overlay or the dismiss-button
        $("#dismiss, .overlay").on("click", function () {
            $("#sidebar").removeClass("active");
            $(".overlay").removeClass("active");
        });

        // Remove sidebar on click on a nav-link
        $(".nav-link").on("click", function () {
            $("#sidebar").removeClass("active");
            $(".overlay").removeClass("active");
            $($("li.active > .nav-link")[0].parentElement).removeClass("active");
            $(this.parentElement).addClass("active");
        });

        // Show sidebar on menu button click
        $("#sidebarCollapse").on("click", function () {
            $("#sidebar").addClass("active");
            $(".overlay").addClass("active");
            $(".collapse.in").toggleClass("in");
            $("a[aria-expanded=true]").attr("aria-expanded", "false");
        });
    }

    /**
     * Registers the service workers for PWA completeness
     */
    registerSW() {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.register("/public/js/service-worker.js", {scope: "/"})
              .then((reg) => {
                console.log("Service worker registered:", reg);
              }, (err) => {
                console.error("Service worker not registered:", err);
            });
        }
    }

    setupNotifications() {
        Notification.requestPermission(function(status) {
            console.log('Notification permission status:', status);
        });
        
    }

    displayNotification() {
        if (Notification.permission == 'granted') {
          navigator.serviceWorker.getRegistration().then(function(reg) {
            var options = {
              body: 'Here is a notification body!',
              icon: 'images/example.png',
              vibrate: [100, 50, 100],
              data: {
                dateOfArrival: Date.now(),
                primaryKey: 1
              }
            };
            reg.showNotification('Hello world!', options);
          });
        }
      }
      

}