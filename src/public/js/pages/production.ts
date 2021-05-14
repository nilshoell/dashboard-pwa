import * as API from "../components/api.js";
import * as Helper from "../components/helperFunctions.js";
import KPIBar from "../charts/kpiBar.js";
import Sparkline from "../charts/sparkline.js";
import BrickWall from "../charts/brickWall.js";

$(async function () {
    const dashboard = new Dashboard();
    await dashboard.getMasterData();
    await dashboard.getChartData();
    dashboard.kpis.forEach((kpi, i) => {
        dashboard.renderBar("kpibar_" + (i+1), kpi);
        dashboard.renderSpark("sparkline_" + (i+1), kpi);
    });
    dashboard.renderBrick("brickwall", dashboard.brick);
});

class Dashboard {

    charts = [];
    kpis = [];
    brick = {}

    constructor() {

        this.kpis = [
            {id: "3f6e4e8df453", masterdata: {}, filter: {period: "M"}},
            {id: "a9d7701c54d1", masterdata: {}, filter: {period: "MTD"}},
            {id: "02141abb649b", masterdata: {}, filter: {period: "M"}},
            {id: "255e926dc950", masterdata: {}, filter: {period: "MTD"}}
        ];

        this.brick = {id: "215570b6b5dd", masterdata: {}, filter: {period: "Q"}};
        
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
        this.brick["masterdata"] = await API.callApi("masterdata", this.brick["id"]);
    }

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

    renderBar(canvasID:string, kpi:any) {
        const chart = new KPIBar(canvasID);
        const chartData = {};

        chartData["kpi"] = kpi.id;
        chartData["data"] = kpi.barData;
        chartData["masterdata"] = kpi.masterdata;
        chartData["filter"] = kpi.filter;

        chart.drawChart(chartData);
        this.charts.push(chart);
    }

    renderSpark(canvasID:string, kpi:any) {
        const chart = new Sparkline(canvasID);
        const chartData = {};

        chartData["kpi"] = kpi.id;
        chartData["data"] = kpi.sparkData;
        chartData["masterdata"] = kpi.masterdata;
        chartData["filter"] = kpi.filter;

        chart.drawChart(chartData);
        this.charts.push(chart);
    }

    renderBrick(canvasID:string, chartData:any) {
        const chart = new BrickWall(canvasID);
        chart.drawChart(chartData);
        this.charts.push(chart);
    }

    resizeHandler() {
        this.charts.forEach((chart:KPIBar) => {
            chart.resizeChart();
        });
    }
}