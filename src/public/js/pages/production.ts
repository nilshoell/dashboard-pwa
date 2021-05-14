import * as API from "../components/api.js";
import * as Helper from "../components/helperFunctions.js";

import { BasePage, KPI } from "./basePage.js";

/**
 * Executes on document ready
 * Loads data and renders dashboards
 */
$(async function () {
    const dashboard = new Dashboard();
    await dashboard.getMasterData();
    await dashboard.getChartData();
    dashboard.kpis.forEach((kpi, i) => {
        dashboard.renderKPIBar("kpibar_" + (i+1), kpi);
        dashboard.renderSparkline("sparkline_" + (i+1), kpi);
    });
    dashboard.renderBrickWall("brickwall", dashboard.brick);
});


class Dashboard extends BasePage {

    brick:KPI;

    constructor() {
        super();
        this.kpis = [
            {id: "3f6e4e8df453", filter: {period: "M"}},
            {id: "a9d7701c54d1", filter: {period: "MTD"}},
            {id: "02141abb649b", filter: {period: "M"}},
            {id: "255e926dc950", filter: {period: "MTD"}}
        ];

        this.brick = {id: "215570b6b5dd", filter: {period: "Q"}};
    }


    /**
     * Override parent method to get master data
     */
    async getMasterData() {
        for (let i = 0; i < this.kpis.length; i++) {
            const id = this.kpis[i].id;
            this.kpis[i].masterdata = await API.callApi("masterdata", id);
        }
        this.brick["masterdata"] = await API.callApi("masterdata", this.brick["id"]);
    }

    /**
     * Override parent method to get chart data
     */
    async getChartData() {
        for (let i = 0; i < this.kpis.length; i++) {
            const id = this.kpis[i].id;
            if (this.kpis[i]["masterdata"].aggregate === "sum") {
                this.kpis[i]["barData"] = await API.getBarData(id);
                this.kpis[i]["sparkData"] = await API.getCumulativeTimeData(id);
            } else {
                this.kpis[i]["barData"] = await API.getLatestBarData(id, {aggregate: "avg"});
                const data = await API.getTimeData(id);
                this.kpis[i]["sparkData"] = await Helper.movingAvg(data, 14);
            }
        }
        this.brick["data"] = await API.getBrickData(this.brick["id"]);
    }
}