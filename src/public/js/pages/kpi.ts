import * as API from "./../components/api.js";
import KPIBar from "./../charts/kpiBar.js";
import Sparkline from "./../charts/sparkline.js";
import Timeline from "./../charts/timeline.js";

$(async function () {
    const dashboard = new KPIDashboard();
    const kpi_id = $("#kpi")[0].innerText;
    dashboard.kpi["masterdata"] = await API.callApi("masterdata", kpi_id);
    
    $("h4.title")[0].innerText = dashboard.kpi["masterdata"].name;
    dashboard.kpi["data"] = await API.getTimeData(kpi_id);
    dashboard.renderTimeline("timeline", dashboard.kpi);
    $("#timeline .chart-label")[0].innerText = "";

    const children = dashboard.kpi["masterdata"]["children"];
    for (let i = 0; i < children.length; i++) {
        const id = children[i];
        const data = {};
        data["masterdata"] = await API.callApi("masterdata", id);
        data["data"] = await API.getBarData(id);
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
        $(document).on("click", "#toggleView", () => {
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