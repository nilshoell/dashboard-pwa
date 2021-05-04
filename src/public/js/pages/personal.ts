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
        Helper.callApi("masterdata", "74351e8d7097", {param1: "foo"})
            .then(response => {
                console.log(response);
            });
        
        const channel = new BroadcastChannel('sw-messages');
        channel.addEventListener('message', event => {
          console.log('Received', event.data);
          window.location.href = event.data.redirect;
        });
    }

    configureEventListener() {
        
        $(document).on("click", "#pn-setup", (event) => {
            event.preventDefault();
            PN.setupNotifications();
        });

        $(document).on("click", "#pn-trigger", (event) => {
            event.preventDefault();
            PN.displayNotification("test");
        });
    }
}