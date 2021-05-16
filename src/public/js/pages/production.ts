import { BasePage, KPI } from "./basePage.js";

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
    dashboard.renderChart("brickwall", dashboard.brick, "BrickWall");
});


class Dashboard extends BasePage {

    brick:KPI;

    constructor() {
        super();
        this.kpis = [
            {id: "3f6e4e8df453", filter: {period: "M"}},
            {id: "a9d7701c54d1", filter: {period: "W", avg: 3}},
            {id: "02141abb649b", filter: {period: "W", avg: 3}},
            {id: "255e926dc950", filter: {period: "W", avg: 3}}
        ];

        this.brick = {id: "215570b6b5dd", filter: {period: "Q"}};
    }
}