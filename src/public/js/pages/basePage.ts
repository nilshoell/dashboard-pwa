import * as API from "../components/api.js";
import * as Helper from "../components/helperFunctions.js";

// Chart imports
import BarChart from "../charts/barChart.js";
import BrickWall from "../charts/brickWall.js";
import ColumnChart from "../charts/columnChart.js";
import KPIBar from "../charts/kpiBar.js";
import KPITile from "./../charts/kpiTile.js";
import Sparkline from "../charts/sparkline.js";
import TimeLine from "../charts/timeline.js";
import Timeline from "../charts/timeline.js";

/**
 * Common page setup
 */
class BasePage {

    charts = [];
    kpis:KPI[] = [];

    constructor() {
        this.configureEventListener();
    }

    /**
     * Set up event listeners
     */
    configureEventListener() {
        const self = this;
        window.addEventListener("resize", () => self.resizeHandler());
        
        // Toggle KPIBar/Sparkline button
        $(document).on("click", "#toggleSwitch", () => {
            const invisible = $(".kpi-col.d-none");
            const visible = $(".kpi-col").not("d-none");

            visible.addClass("d-none d-sm-block");
            invisible.removeClass("d-none d-sm-block");

            this.resizeHandler();
        });
    }


    /**
     * Loads the master data for a KPI
     */
    async getMasterData() {
        for (let i = 0; i < this.kpis.length; i++) {
            const id = this.kpis[i].id;
            this.kpis[i].masterdata = await API.callApi("masterdata", id);
        }
    }

    /**
     * Gets data from the API using the assigned filters
     * @param defaultMethod The API method, defaults to time frame
     */
    async getChartData(defaultMethod = "timeframe") {
        for (let i = 0; i < this.kpis.length; i++) {
            const kpi = this.kpis[i];
            const id = kpi.id;
            this.kpis[i]["data"] = await API.callApi(defaultMethod, id, kpi.filter);
        }
    }

    /**
     * Renders a new BarChart with the given data
     * @param canvasID The HTML ID of the chart container
     * @param kpi A KPI object containing all necessary data
     */
    renderBarChart(canvasID:string, kpi:KPI) {
        const chart = new BarChart(canvasID);
        const chartData = kpi;
        chartData["kpi"] = kpi.id;
        chart.drawChart(chartData);
        this.charts.push(chart);
    }

    /**
     * Renders a new BrickWall with the given data
     * @param canvasID The HTML ID of the chart container
     * @param kpi A KPI object containing all necessary data
     */
     renderBrickWall(canvasID:string, kpi:KPI) {
        const chart = new BrickWall(canvasID);
        const chartData = kpi;
        chartData["kpi"] = kpi.id;
        chart.drawChart(chartData);
        this.charts.push(chart);
    }

    /**
     * Renders a new ColumnChart with the given data
     * @param canvasID The HTML ID of the chart container
     * @param kpi A KPI object containing all necessary data
     */
     renderColumnChart(canvasID:string, kpi:KPI) {
        const chart = new ColumnChart(canvasID);
        const chartData = kpi;
        chartData["kpi"] = kpi.id;
        chart.drawChart(chartData);
        this.charts.push(chart);
    }

    /**
     * Renders a new KPIBar with the given data
     * @param canvasID The HTML ID of the chart container
     * @param kpi A KPI object containing all necessary data
     */
    renderKPIBar(canvasID:string, kpi:KPI) {
        const chart = new KPIBar(canvasID);
        const chartData = {};

        chartData["kpi"] = kpi.id;
        chartData["data"] = kpi.barData;
        chartData["masterdata"] = kpi.masterdata;
        chartData["filter"] = kpi.filter;

        chart.drawChart(chartData);
        this.charts.push(chart);
    }

    /**
     * Renders a new KPITile with the given data
     * @param canvasID The HTML ID of the chart container
     * @param kpi A KPI object containing all necessary data
     */
     renderKPITile(canvasID:string, kpi:KPI) {
        const chart = new KPITile(canvasID);
        const chartData = kpi;
        chartData["kpi"] = kpi.id;
        chart.drawChart(chartData);
        this.charts.push(chart);
    }

    /**
     * Renders a new Sparkline with the given data
     * @param canvasID The HTML ID of the chart container
     * @param kpi A KPI object containing all necessary data
     */
    renderSparkline(canvasID:string, kpi:KPI) {
        const chart = new Sparkline(canvasID);
        const chartData = {};

        chartData["kpi"] = kpi.id;
        chartData["data"] = kpi.sparkData;
        chartData["masterdata"] = kpi.masterdata;
        chartData["filter"] = kpi.filter;

        chart.drawChart(chartData);
        this.charts.push(chart);
    }

    /**
     * Renders a new Timeline with the given data
     * @param canvasID The HTML ID of the chart container
     * @param kpi A KPI object containing all necessary data
     */
     renderTimeLine(canvasID:string, kpi:KPI) {
        const chart = new TimeLine(canvasID);
        const chartData = kpi;
        chartData["kpi"] = kpi.id;
        chart.drawChart(chartData);
        this.charts.push(chart);
    }

    /**
     * Resizes all charts
     */
    resizeHandler() {
        this.charts.forEach((chart) => {
            chart.resizeChart();
        });
    }

}

interface KPI {
    id:string,
    masterdata?:Record<string, any>,
    data?:any[],
    filter?:Record<string, any>,
    barData?:any[],
    sparkData?:any[]
}

export { BasePage, KPI };