import * as API from "./../components/api.js";
import * as Helper from "./../components/helperFunctions.js";

import { BasePage } from "./basePage.js";

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
});

class Dashboard extends BasePage {

    constructor() {
        super();
        this.kpis = [
            {id: "9efcb5361969", masterdata: {}, filter: {period: "MTD"}},
            {id: "53c6cd0b443b", masterdata: {}, filter: {period: "YTD"}},
            {id: "74351e8d7097", masterdata: {}, filter: {period: "YTD"}},
            {id: "eb9f9dc3efb7", masterdata: {}, filter: {period: "YTD"}},
            {id: "3f6e4e8df453", masterdata: {}, filter: {period: "YTD"}},
            {id: "255e926dc950", masterdata: {}, filter: {period: "YTD"}}
        ];
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
                kpi.sparkData = await Helper.movingAvg(data, 14);
            }
        }
    }
}