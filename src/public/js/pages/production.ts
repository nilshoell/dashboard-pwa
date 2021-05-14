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
            const kpi = this.kpis[i];
            const id = kpi.id;
            kpi.masterdata = await API.callApi("masterdata", id);
            const filter = {aggregate: kpi.masterdata.aggregate, scenario: "AC", period: "YTD"};
            kpi.filter = Object.assign(filter, kpi.filter);
        }
        this.brick.masterdata = await API.callApi("masterdata", this.brick.id);
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
            if (kpi.masterdata.aggregate === "sum") {
                kpi.barData = await API.getBarData(id, kpi.filter);
                kpi.sparkData = await API.getCumulativeTimeData(id, kpi.filter);
            } else {
                kpi.barData = await API.getLatestBarData(id, kpi.filter);
                const data = await API.getTimeData(id, kpi.filter);
                kpi.sparkData = await Helper.movingAvg(data, 7);
            }
        }
        this.brick.data = await API.getBrickData(this.brick.id, this.brick.filter);
    }
}