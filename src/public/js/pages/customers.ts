import { BasePage } from "./basePage.js";

/**
 * Executes on document ready
 * Loads data and renders dashboards
 */
$(async function () {
    const dashboard = new CustomerDashboard();
    await dashboard.renderChart("overview", dashboard.kpis[0], "ColumnChart", "partner");
});

class CustomerDashboard extends BasePage {

    brick = {}

    constructor() {
        super();
        this.kpis = [
            {id: "74351e8d7097", masterdata: {}, filter: {period: "YTD"}}
        ];
    }

    /**
     * Set up event listeners
     */
    configureEventListener() {
        const self = this;
        window.addEventListener("resize", () => self.resizeHandler());

        // Drill-Down on bar click
        $(document).on("click", "#overview svg rect", (evt) => {
            const partner = $(evt.target).data("id");
            window.location.href = "/partner/" + partner;
        });

        // Manual entry of ID
        $(document).on("click", "#searchBtn", () => {
            const partner = $("#search").val();
            if (partner !== "" && !isNaN(Number(partner))) {
                window.location.href = "/partner/" + partner;
            } else {
                $("#search").addClass("is-invalid");
            }
        });
    }
}