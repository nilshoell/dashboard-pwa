import * as API from "./../components/api.js";
import * as Helper from "./../components/helperFunctions.js";
import KPIBar from "./../charts/kpiBar.js";
import Sparkline from "./../charts/sparkline.js";

$(async function () {
    const dashboard = new Dashboard();
    await dashboard.getMasterData();
    await dashboard.getChartData();
    dashboard.kpis.forEach((kpi, i) => {
        dashboard.renderBar("kpibar_" + (i+1), kpi);
        dashboard.renderSpark("sparkline_" + (i+1), kpi);
    });
});

class Dashboard {

    charts = [];
    kpis = [];

    constructor() {

        this.kpis = [
            {id: "9efcb5361969", masterdata: {}, filter: {period: "YTD"}},
            {id: "53c6cd0b443b", masterdata: {}, filter: {period: "YTD"}},
            {id: "74351e8d7097", masterdata: {}, filter: {period: "YTD"}},
            {id: "eb9f9dc3efb7", masterdata: {}, filter: {period: "YTD"}},
            {id: "3f6e4e8df453", masterdata: {}, filter: {period: "YTD"}},
            {id: "255e926dc950", masterdata: {}, filter: {period: "YTD"}}
        ];
        
        this.configureEventListener();
    }

    configureEventListener() {
        const self = this;
        window.addEventListener("resize", () => self.resizeHandler());
        
        // Toggle view button
        $(document).on("click", "#toggleSwitch", () => {
            const invisible = $(".kpi-col.d-none");
            const visible = $(".kpi-col").not("d-none");

            visible.addClass("d-none d-sm-block");
            invisible.removeClass("d-none d-sm-block");

            this.resizeHandler();
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
            if (this.kpis[i]["masterdata"].aggregate === "sum") {
                this.kpis[i]["barData"] = await API.getBarData(id);
                this.kpis[i]["sparkData"] = await API.getCumulativeTimeData(id);
            } else {
                this.kpis[i]["barData"] = await API.getLatestBarData(id);
                const data = await API.getTimeData(id);
                this.kpis[i]["sparkData"] = await Helper.movingAvg(data, 14);
            }
        }
    }

    renderBar(canvasID:string, kpi) {
        const chart = new KPIBar(canvasID);
        const chartData = {};

        chartData["kpi"] = kpi.id;
        chartData["data"] = kpi.barData;
        chartData["masterdata"] = kpi.masterdata;
        chartData["filter"] = kpi.filter;

        chart.drawChart(chartData);
        this.charts.push(chart);
    }

    renderSpark(canvasID:string, kpi) {
        const chart = new Sparkline(canvasID);
        const chartData = {};

        chartData["kpi"] = kpi.id;
        chartData["data"] = kpi.sparkData;
        chartData["masterdata"] = kpi.masterdata;
        chartData["filter"] = kpi.filter;

        chart.drawChart(chartData);
        this.charts.push(chart);
    }

    resizeHandler() {
        this.charts.forEach((chart:KPIBar) => {
            chart.resizeChart();
        });
    }
}