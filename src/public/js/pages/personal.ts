import * as PN from "../components/notifications.js";
import { BasePage, KPI } from "./basePage.js";

/**
 * Executes on document ready
 * Loads data and renders dashboards
 */
$(async function () {
    // Setup Object
    const personal = new Personal();
    personal.kpis.forEach((kpi, i) => {
        personal.renderChart("kpibar_" + (i+1), kpi, "KPIBar");
        personal.renderChart("sparkline_" + (i+1), kpi, "Sparkline");
    });
    personal.renderChart("brickwall", personal.brick, "BrickWall");
});

class Personal extends BasePage {

    kpis:KPI[] = [
        {id: "7a0c8fcbc047", filter: {period: "Q", avg: 7}},
        {id: "250e42977eb7", filter: {period: "MTD"}},
        {id: "a474fee353a1", filter: {period: "MTD", avg: 7}},
        {id: "5171156a1720", filter: {period: "M", avg: 3, py:false, fc: false}}
    ];
    brick:KPI = {id: "dd751c6b67fb", filter: {period: "Q"}};

    /**
     * Setup event listeners
     */
    configureEventListener() {
        const self = this;
        window.addEventListener("resize", () => self.resizeHandler());

        // Push notification test
        $(document).on("click", "#pn-setup", (event) => {
            event.preventDefault();
            PN.setupNotifications();
        });

        $(document).on("click", "#pn-trigger", (event) => {
            event.preventDefault();
            const max = this.kpis.length - 1;
            const kpi = this.kpis[d3.randomInt(max)()];
            PN.displayNotification(kpi.masterdata);
        });

        // Toggle KPIBar/Sparkline button
        $(document).on("click", "#toggleSwitch", () => {
            const invisible = $(".kpi-col.d-none");
            const visible = $(".kpi-col").not("d-none");

            visible.addClass("d-none d-sm-block");
            invisible.removeClass("d-none d-sm-block");

            this.resizeHandler();
        });
    }
}