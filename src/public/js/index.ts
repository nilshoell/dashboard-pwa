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
        if (window.location.protocol === "https:") {
            this.registerSW();
        }
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
            navigator.serviceWorker.register("./public/js/service-worker.js")
              .then((reg) => {
                console.log("Service worker registered:", reg);
              }, (err) => {
                console.error("Service worker not registered:", err);
            });
        }
    }

}