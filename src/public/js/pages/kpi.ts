import * as API from "./../components/api.js";
import KPIBar from "./../charts/kpiBar.js";
import Sparkline from "./../charts/sparkline.js";
import Timeline from "./../charts/timeline.js";
import ColumnChart from "./../charts/columnChart.js";

$(async function () {
    const dashboard = new KPIDashboard();
    const kpi_id = $("#kpi")[0].innerText;
    dashboard.kpi["masterdata"] = await API.callApi("masterdata", kpi_id);
    
    // Timeline Data
    if (dashboard.kpi["masterdata"].aggregate === "avg") {
        dashboard.kpi["data"] = await API.getTimeData(kpi_id);
    } else {
        dashboard.kpi["data"] = await API.getCumulativeTimeData(kpi_id);
    }

    dashboard.renderTimeline("timeline", dashboard.kpi);

    // Column Chart
    const hasPartner = await API.callApi("hasPartner", kpi_id);
    if (hasPartner["val"] > 0) {
        dashboard.kpi["columnData"] = await API.callApi("partner", kpi_id, {aggregate: dashboard.kpi["masterdata"].aggregate});
        console.log(dashboard.kpi["columnData"]);
        
        dashboard.renderColumn("columnChart", {kpi: kpi_id, data: dashboard.kpi["columnData"], masterdata: dashboard.kpi["masterdata"]});
    } else {
        $("#columnChart").addClass("d-none");
    }
    

    // Update page title and KPI
    $("h4.title")[0].innerText = dashboard.kpi["masterdata"].name;
    $("#timeline .chart-label")[0].innerText = "";
    $("#columnChart .chart-label")[0].innerText = "By Customers:";
    const popover_text = "This page provides a detailed overview of the KPI '" + dashboard.kpi["masterdata"].name + "', including its sub-components";
    $("#help").data("bs.popover").config.content = popover_text;

    // Render the sub-components
    const children = dashboard.kpi["masterdata"]["children"];
    if (children.length == 0) {
        $("#components").addClass("d-none");
    } else {
        dashboard.renderComponents(children);
    }

});

class KPIDashboard {

    charts = [];
    kpi = {};

    constructor() {
        this.configureEventListener();
    }

    configureEventListener() {

        const self = this;

        // Resize handler
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

    async renderComponents(children:any[]) {
        for (let i = 0; i < children.length; i++) {
            const id = children[i];
            const data = {};
            data["masterdata"] = await API.callApi("masterdata", id);
            if (data["masterdata"].aggregate === "sum") {
                data["barData"] = await API.getBarData(id);
                data["sparkData"] = await API.getCumulativeTimeData(id);
            } else {
                data["barData"] = await API.getLatestBarData(id);
                data["sparkData"] = await API.getTimeData(id);
            }
            const filter = {period: "YTD", scenario: "AC"};
            this.renderBar("kpibar_" + (i + 1), {kpi: id, data: data["barData"], masterdata: data["masterdata"], filter: filter});
            this.renderSpark("sparkline_" + (i + 1), {kpi: id, data: data["sparkData"], masterdata: data["masterdata"], filter: filter});
        }
    }

    renderBar(canvasID:string, chartData) {
        const chart = new KPIBar(canvasID);
        chart.drawChart(chartData);
        this.charts.push(chart);
    }

    renderSpark(canvasID:string, chartData) {
        const chart = new Sparkline(canvasID);
        chart.drawChart(chartData);
        this.charts.push(chart);
    }

    renderTimeline(canvasID:string, chartData) {
        const chart = new Timeline(canvasID);
        chart.drawChart(chartData);
        this.charts.push(chart);
    }

    renderColumn(canvasID:string, chartData) {
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