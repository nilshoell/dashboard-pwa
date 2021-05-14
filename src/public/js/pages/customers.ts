import * as API from "../components/api.js";
import ColumnChart from "../charts/columnChart.js";
import KPIBar from "../charts/kpiBar.js";

$(async function () {
    const dashboard = new CustomerDashboard();
    await dashboard.getMasterData();
    await dashboard.getChartData();
    dashboard.renderColumn("overview", dashboard.kpis[0]);
});

class CustomerDashboard {

    charts = [];
    kpis = [];
    brick = {}

    constructor() {

        this.kpis = [
            {id: "74351e8d7097", masterdata: {}, filter: {period: "YTD"}}
        ];

        this.configureEventListener();
    }

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

    async getMasterData() {
        for (let i = 0; i < this.kpis.length; i++) {
            const id = this.kpis[i].id;
            this.kpis[i].masterdata = await API.callApi("masterdata", id);
        }
    }

    async getChartData() {
        for (let i = 0; i < this.kpis.length; i++) {
            const id = this.kpis[i].id;
            this.kpis[i]["data"] = await API.callApi("partner", id);
        }
    }

    renderColumn(canvasID:string, chartData:any) {
        const chart = new ColumnChart(canvasID);
        chart.drawChart(chartData);
        this.charts.push(chart);
    }

    resizeHandler() {
        this.charts.forEach((chart:KPIBar) => {
            chart.resizeChart();
        });
    }
}