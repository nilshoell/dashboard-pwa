import * as Helper from "../components/helperFunctions.js";
import * as PN from "../components/notifications.js";
import * as modal from "../components/modals.js";

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
        const channel = new BroadcastChannel("sw-messages");
        channel.addEventListener("message", event => {
          console.log("Received", event.data);
          window.location.href = event.data.redirect;
        });
    }

    async getData() {
        this.data = await Helper.callApi("masterdata", "74351e8d7097", {});
    }

    configureEventListener() {
        
        $(document).on("click", "#pn-setup", (event) => {
            event.preventDefault();
            PN.setupNotifications();
        });

        $(document).on("click", "#pn-trigger", (event) => {
            event.preventDefault();
            PN.displayNotification(this.data);
        });

        $(document).on("longtouch", "#content", () => {
            const modalContent = [
                {name:"Short Name", val: "Gross Sales"},
                {name:"Unit", val: "$"},
                {name:"Type", val: "Aggregate"},
                {name:"Formula", val: "{4b9ad3f2ec7c} * {066642e39dac}"},
                {name:"ID", val: "74351e8d7097"}
            ];
            modal.fill("Gross Sales", modalContent);
            modal.display();
        });
    }
}