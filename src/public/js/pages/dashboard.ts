import { BasePage } from "./basePage.js";

/**
 * Executes on document ready
 * Loads data and renders dashboards
 */
$(async function () {
    const dashboard = new Dashboard();
    dashboard.kpis.forEach((kpi, i) => {
        dashboard.renderChart("kpibar_" + (i+1), kpi, "KPIBar");
        dashboard.renderChart("sparkline_" + (i+1), kpi, "Sparkline");
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
}