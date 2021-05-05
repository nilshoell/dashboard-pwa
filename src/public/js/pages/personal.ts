import KPITile from "../charts/kpiTile.js";
import * as Helper from "../components/helperFunctions.js";
import * as PN from "../components/notifications.js"

$(async function () {
    // Setup Object
    const personal = new Personal();
    await personal.getData();
    // $(".row.chart")[0].innerText = JSON.stringify(personal.data);
});

class Personal {

    charts = [];
    kpis = [];
    data;

    constructor() {
        this.configureEventListener();
        const channel = new BroadcastChannel('sw-messages');
        channel.addEventListener('message', event => {
          console.log('Received', event.data);
          window.location.href = event.data.redirect;
        });
    }

    async getData() {
        this.data = await Helper.callApi("test", "74351e8d7097", {param1: "foo"});
    }

    configureEventListener() {
        
        $(document).on("click", "#pn-setup", (event) => {
            event.preventDefault();
            PN.setupNotifications();
        });

        $(document).on("click", "#pn-trigger", (event) => {
            event.preventDefault();
            PN.displayNotification("74351e8d7097");
        });
    }
}