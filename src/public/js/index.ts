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

        // Setup long touch event listener for all charts
        // $(document).on("longtouch", ".chart-canvas", (e) => {
        //     console.log("Long touch on", e.currentTarget);
        // });

        // Register Service Workers in Prod
        if (window.location.protocol === "https:" || window.location.host.startsWith("172")) {
            this.registerSW();
        }

    }

    /**
     * Setup event listeners to toggle the navigation sidebar
     */
    navigationHandlers () {

        // Remove sidebar on click on overlay or the dismiss-button
        $(document).on("click", "#dismiss, .overlay", () => {
            $("#sidebar").removeClass("active");
            $(".overlay").removeClass("active");
        });

        // Remove sidebar on click on a nav-link
        $(document).on("click", ".nav-link", function () {
            $("#sidebar").removeClass("active");
            $(".overlay").removeClass("active");
            $($("li.active > .nav-link")[0].parentElement).removeClass("active");
            $(this.parentElement).addClass("active");
        });

        // Show sidebar on menu button click
        $(document).on("click", "#sidebarCollapse", () => {
            $("#sidebar").addClass("active");
            $(".overlay").addClass("active");
            $(".collapse.in").toggleClass("in");
            $("a[aria-expanded=true]").attr("aria-expanded", "false");
        });

        // Share the current URL on click
        $(document).on("click", "#shareBtn", () => {

            const url = window.location.href;

            // Use the new share API if available
            if ("share" in navigator) {
                const shareData = {
                    title: "Mobile Dashboard",
                    text: "Check out this dashboard!",
                    url: url,
                  };
                navigator.share(shareData).then(() => {
                    return;
                });
            }

            // If not supported or failed, copy to clipboard
            const dummy = document.createElement("input");
            document.body.appendChild(dummy);
            dummy.value = url;
            dummy.select();
            document.execCommand("copy");
            document.body.removeChild(dummy);

        });

        // Reload the page
        $(document).on("click", "#refreshBtn", () => {
            window.location.reload();
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
}