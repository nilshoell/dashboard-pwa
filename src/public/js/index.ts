import * as Modal from "./components/modals.js";
import * as API from "./components/api.js";

$(function () {
    console.info("Document Ready");
    new App();
});

class App {

    constructor() {
        console.info("Initializing App");
        this.navigationHandlers();
        this.canvasHandlers();

        // Initialize popovers
        $("[data-toggle='popover']").popover();
        $(".popover-dismiss").popover({
            trigger: "focus"
          });

        // Register Service Workers in Prod
        if (window.location.protocol === "https:" || window.location.host.startsWith("172")) {
            this.registerSW();
            this.broadcastChannel();
        }
    }

    /**
     * Sets up event handlers for global chart interactions
     */
    canvasHandlers () {
        // Setup canvas long touch event
        $(document).on("longtouch", ".chart-canvas", async (evt) => {
            const target = evt.currentTarget;
            const kpi = $(target).data("kpi");
            const filter = $(target).data("filter");

            if (kpi === undefined) {
                return;
            }

            // Get master data from API
            const data = await API.callApi("masterdata", kpi);
            let formula = await API.convertFormula(data.formula);
            if (formula === "Direct Measurement") {
                formula = "";
            }

            // Fill and display modal
            const modalContent = [
                {name:"Short Name", val: data.shortname},
                {name:"Unit", val: data.unit},
                {name:"Formula", val: formula},
                {name:"Formula", val: data.formula},
                {name:"Description", val: data.help},
                {name:"ID", val: data.id},
            ];
            Modal.fill(data.name, modalContent, filter);
            Modal.display();
        });

        // Setup KPI drill-down
        $(document).on("click", ".chart-canvas", (evt) => {
            const target = evt.currentTarget;
            const kpi = $(target).data("kpi");

            if (kpi === undefined) {
                return;
            }

            window.location.href = "/kpi/" + kpi;
        });
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
            $("li.nav-link.active").removeClass("active");
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
    registerSW () {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.register("/public/js/service-worker.js", {scope: "/"})
              .then((reg) => {
                console.log("Service worker registered:", reg);
              }, (err) => {
                console.error("Service worker not registered:", err);
            });
        }
    }

    /**
     * Listens for messages from the push service worker
     */
    broadcastChannel() {
        const channel = new BroadcastChannel("sw-messages");
        channel.addEventListener("message", event => {
          window.location.href = event.data.redirect;
        });
    }

}