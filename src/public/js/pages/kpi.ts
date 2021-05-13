import * as API from "./../components/api.js";
import KPIBar from "./../charts/kpiBar.js";
import Sparkline from "./../charts/sparkline.js";
import Timeline from "./../charts/timeline.js";

$(async function () {
    const dashboard = new KPIDashboard();
    const kpi_id = $("#kpi")[0].innerText;
    dashboard.kpi["masterdata"] = await API.callApi("masterdata", kpi_id);
    
    if (dashboard.kpi["masterdata"].aggregate === "avg") {
        dashboard.kpi["data"] = await API.getTimeData(kpi_id);
    } else {
        dashboard.kpi["data"] = await API.getCumulativeTimeData(kpi_id);
    }
    dashboard.renderTimeline("timeline", dashboard.kpi);

    // Update page title and KPI
    $("h4.title")[0].innerText = dashboard.kpi["masterdata"].name;
    $("#timeline .chart-label")[0].innerText = "";
    const popover_text = "This page provides a detailed overview of the KPI '" + dashboard.kpi["masterdata"].name + "', including its sub-components";
    $("#help").data("bs.popover").config.content = popover_text;

    const children = dashboard.kpi["masterdata"]["children"];
    if (children.length == 0) {
        $("#components").addClass("d-none");
    }

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
        dashboard.renderBar("kpibar_" + (i + 1), {kpi: id, data: data["barData"], masterdata: data["masterdata"]});
        dashboard.renderSpark("sparkline_" + (i + 1), {kpi: id, data: data["sparkData"], masterdata: data["masterdata"]});
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

    resizeHandler() {
        this.charts.forEach((chart:KPIBar) => {
            chart.resizeChart();
        });
    }
}