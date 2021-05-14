import * as API from "../components/api.js";
import * as PN from "../components/notifications.js";
import * as Helper from "../components/helperFunctions.js";

import { BasePage, KPI } from "./basePage.js";

/**
 * Executes on document ready
 * Loads data and renders dashboards
 */
$(async function () {
    // Setup Object
    const personal = new Personal();
    await personal.getMasterData();
    await personal.getChartData();
    personal.kpis.forEach((kpi, i) => {
        personal.renderKPIBar("kpibar_" + (i+1), kpi);
        personal.renderSparkline("sparkline_" + (i+1), kpi);
    });
    personal.renderBrickWall("brickwall", personal.brick);
});

class Personal extends BasePage {

    kpis:KPI[] = [
        {id: "7a0c8fcbc047", filter: {period: "Q"}},
        {id: "250e42977eb7", filter: {period: "MTD"}},
        {id: "a474fee353a1", filter: {period: "MTD"}}
    ];
    brick:KPI = {id: "dd751c6b67fb"};

    /**
     * Override parent method to get master data
     */
     async getMasterData() {
        for (let i = 0; i < this.kpis.length; i++) {
            const kpi = this.kpis[i];
            const id = kpi.id;
            kpi.masterdata = await API.callApi("masterdata", id);
            const filter = {aggregate: kpi.masterdata.aggregate, scenario: "AC", period: "YTD"};
            kpi.filter = Object.assign(filter, kpi.filter);
        }
        this.brick.masterdata = await API.callApi("masterdata", this.brick["id"]);
        const filter = {aggregate: this.brick.masterdata.aggregate, scenario: "AC", period: "YTD"};
        this.brick.filter = Object.assign(filter, this.brick.filter);
    }

    /**
     * Override parent method to get chart data
     */
    async getChartData() {
        for (let i = 0; i < this.kpis.length; i++) {
            const kpi = this.kpis[i];
            const id = kpi.id;
            console.log("KPI", kpi);
            
            if (kpi.masterdata.aggregate === "sum") {
                kpi.barData = await API.getBarData(id, kpi.filter);
                kpi.sparkData = await API.getCumulativeTimeData(id, kpi.filter);
            } else {
                kpi.barData = await API.getLatestBarData(id, kpi.filter);
                const data = await API.getTimeData(id, kpi.filter);
                kpi.sparkData = await Helper.movingAvg(data, 7);
            }
            console.log("Data", kpi);
        }
        this.brick.data = await API.getBrickData(this.brick.id, this.brick.filter);
    }


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
            PN.displayNotification(this.kpis[1]["masterdata"]);
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