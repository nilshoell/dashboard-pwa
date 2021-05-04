import KPITile from "../charts/kpiTile.js";
import * as Helper from "../components/helperFunctions.js";
import * as PN from "../components/notifications.js"

$(function () {
    // Setup Object
    new Personal();
});

class Personal {

    charts = [];
    kpis = [];

    constructor() {
        this.configureEventListener();
    }

    configureEventListener() {
        console.log("Configureevent");
        
        $(document).on("#pn-setup", "click", (event) => {
            event.preventDefault();
            PN.setupNotifications();
        });

        $(document).on("#pn-trigger", "click", (event) => {
            event.preventDefault();
            PN.displayNotification();
        });
    }
}