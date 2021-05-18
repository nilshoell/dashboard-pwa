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
     * Unifies access to data retrieval and drawing into one method for parallelization
     * @param canvasID The HTML ID to draw on
     * @param kpi A KPI object with all filters etc.
     * @param chartType The type of chart to render
     * @param apiMethod The method on the server API; currently only used for bar/column charts
     */
    async renderChart(canvasID:string, kpi:KPI, chartType:string, apiMethod = "timeframe", baseData = {}) {

        kpi.masterdata = await API.callApi("masterdata", kpi.id);
        const filter = {aggregate: kpi.masterdata.aggregate, scenario: "AC", period: "YTD"};

        if (filter.aggregate === "avg" && filter["avg"] === undefined) {
            filter["avg"] = 7;
        }

        kpi.filter = Object.assign(filter, kpi.filter);

        switch (chartType) {
            case "BarChart":
            case "ColumnChart":
                kpi.data = await API.callApi(apiMethod, kpi.id, kpi.filter);
                break;
            
            case "BrickWall":
                kpi.data = await API.getBrickData(kpi.id, kpi.filter);
                break;
            
            case "KPIBar":
                if (kpi.masterdata.aggregate === "sum") {
                    kpi.barData = await API.getBarData(kpi.id, kpi.filter);
                } else {
                    kpi.barData = await API.getLatestBarData(kpi.id, kpi.filter);
                }
                break;
            
            case "KPITile":
                kpi.data = {barData: [], sparkData: []};
                if (kpi.masterdata.aggregate === "sum") {
                    kpi.data.barData = await API.getBarData(kpi.id, kpi.filter);
                    kpi.data.sparkData = await API.getCumulativeTimeData(kpi.id, kpi.filter);
                } else {
                    kpi.data.barData = await API.getLatestBarData(kpi.id, kpi.filter);
                    const data = await API.getTimeData(kpi.id, kpi.filter);
                    kpi.data.sparkData = await Helper.movingAvg(data, kpi.filter.avg ?? 5);
                }
                break;
            
            case "Sparkline":
                if (kpi.masterdata.aggregate === "sum") {
                    kpi.sparkData = await API.getCumulativeTimeData(kpi.id, kpi.filter);
                } else {
                    const data = await API.getTimeData(kpi.id, kpi.filter);
                    kpi.sparkData = await Helper.movingAvg(data, kpi.filter.avg ?? 7);
                }
                break;

            case "Timeline":
                if (kpi.masterdata.aggregate === "sum") {
                    kpi.data= await API.getCumulativeTimeData(kpi.id, kpi.filter);
                } else {
                    const data = await API.getTimeData(kpi.id, kpi.filter);
                    kpi.data = await Helper.movingAvg(data, kpi.filter.avg ?? 7);
                }
                break;

            default:
                console.error("Invalid chart type '" + String(chartType) + "' provided.");
        }
        this["render" + chartType](canvasID, kpi, baseData);
    }


    /**
     * Loads the master data for a KPI
     */
    async getMasterData() {
        for (let i = 0; i < this.kpis.length; i++) {
            const kpi = this.kpis[i];
            const id = kpi.id;
            kpi.masterdata = await API.callApi("masterdata", id);
            const filter = {aggregate: kpi.masterdata.aggregate, scenario: "AC", period: "YTD"};
            kpi.filter = Object.assign(filter, kpi.filter);
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
            kpi["data"] = await API.callApi(defaultMethod, id, kpi.filter);
        }
    }

    /**
     * Renders a new BarChart with the given data
     * @param canvasID The HTML ID of the chart container
     * @param kpi A KPI object containing all necessary data
     */
    renderBarChart(canvasID:string, kpi:KPI, baseData = {}) {
        const chart = new BarChart(canvasID, baseData);
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
     renderBrickWall(canvasID:string, kpi:KPI, baseData = {}) {
        const chart = new BrickWall(canvasID, baseData);
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
     renderColumnChart(canvasID:string, kpi:KPI, baseData = {}) {
        const chart = new ColumnChart(canvasID, baseData);
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
    renderKPIBar(canvasID:string, kpi:KPI, baseData = {}) {
        const chart = new KPIBar(canvasID, baseData);
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
     renderKPITile(canvasID:string, kpi:KPI, baseData = {}) {
        const chart = new KPITile(canvasID, baseData);
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
    renderSparkline(canvasID:string, kpi:KPI, baseData = {}) {
        const chart = new Sparkline(canvasID, baseData);
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
     renderTimeLine(canvasID:string, kpi:KPI, baseData = {}) {
        const chart = new TimeLine(canvasID, baseData);
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
    id: string,
    masterdata?: Record<string, any>,
    data?: any[] | Record<string, any>,
    filter?: Record<string, any>,
    barData?: any[],
    sparkData?: any[],
    rendered?: boolean
}

export { BasePage, KPI };