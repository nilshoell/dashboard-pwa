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
        
        $(document).on("click", "#pn-setup", (event) => {
            event.preventDefault();
            PN.setupNotifications();
        });

        $(document).on("click", "#pn-trigger", (event) => {
            event.preventDefault();
            PN.displayNotification();
        });
    }
}