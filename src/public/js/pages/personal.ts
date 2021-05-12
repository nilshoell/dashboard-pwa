import * as Helper from "../components/helperFunctions.js";
import * as API from "../components/api.js";
import * as PN from "../components/notifications.js";
import * as modal from "../components/modals.js";
import KPIBar from "./../charts/kpiBar.js";
import Sparkline from "./../charts/sparkline.js";
import BrickWall from "./../charts/brickWall.js";

$(async function () {
    // Setup Object
    const personal = new Personal();
    await personal.getMasterData();

    // Retrieve data from API
    let kpi = personal.kpis[0];
    let id = kpi.id;
    kpi["barData"] = await API.getLatestBarData(id);
    kpi["sparkData"] = await API.getTimeData(id, "AC", "Q");
    personal.renderBar(kpi.canvasID[0], {id: id, data: kpi["barData"]});
    personal.renderSpark(kpi.canvasID[1], {id: id, data: kpi["sparkData"]});

    kpi = personal.kpis[1];
    id = kpi.id;
    kpi["barData"] = await API.getBarData(id, "MTD");
    kpi["sparkData"] = await API.getCumulativeTimeData(id, "AC", "Q");
    personal.renderBar(kpi.canvasID[0], {id: id, data: kpi["barData"]});
    personal.renderSpark(kpi.canvasID[1], {id: id, data: kpi["sparkData"]});

    kpi = personal.kpis[2];
    id = kpi.id;
    kpi["barData"] = await API.getBarData(id, "MTD");
    kpi["sparkData"] = await API.getTimeData(id, "AC", "M");
    personal.renderBar(kpi.canvasID[0], {id: id, data: kpi["barData"]});
    personal.renderSpark(kpi.canvasID[1], {id: id, data: kpi["sparkData"]});
    
    kpi = personal.kpis[3];
    id = kpi.id;
    personal.kpis[3]["data"] = await API.getTimeData(id, "AC", "Q");
    personal.renderBrick(String(kpi.canvasID), {id: id, data: kpi["data"]});
});

class Personal {

    charts = [];
    kpis = [
        {name: "cr", id: "7a0c8fcbc047", canvasID: ["kpibar_cr", "sparkline_cr"]},
        {name: "bh", id: "250e42977eb7", canvasID: ["kpibar_bh", "sparkline_bh"]},
        {name: "wl", id: "a474fee353a1", canvasID: ["kpibar_wl", "sparkline_wl"]},
        {name: "tw", id: "dd751c6b67fb", canvasID: "tw"}
    ];

    constructor() {
        this.configureEventListener();
    }

    /**
     * Load master data for all KPIs
     */
    async getMasterData() {
        this.kpis.forEach(async kpi => {
            kpi["masterdata"] = await API.callApi("masterdata", kpi.id);
        });
    }

    /**
     * Renders a KPIBar chart
     * @param canvasID The HTML id of the container
     * @param chartData The data to draw
     */
    renderBar(canvasID:string, chartData:any) {
        const chart = new KPIBar(canvasID);
        chart.drawChart(chartData);
        this.charts.push(chart);
    }

    /**
     * Renders a Sparkline chart
     * @param canvasID The HTML id of the container
     * @param chartData The data to draw
     */
    renderSpark(canvasID:string, chartData:any) {
        const chart = new Sparkline(canvasID);
        chart.drawChart(chartData);
        this.charts.push(chart);
    }

    /**
     * Renders a BrickWall chart
     * @param canvasID The HTML id of the container
     * @param chartData The data to draw
     */
    renderBrick(canvasID:string, chartData:any) {
        const chart = new BrickWall(canvasID);
        chart.drawChart(chartData);
        this.charts.push(chart);
        
    }

    /**
     * Setup event listeners
     */
    configureEventListener() {
        
        $(document).on("click", "#pn-setup", (event) => {
            event.preventDefault();
            PN.setupNotifications();
        });

        $(document).on("click", "#pn-trigger", (event) => {
            event.preventDefault();
            PN.displayNotification(this.kpis[1]["masterdata"]);
        });

        $(document).on("longtouch", ".chart-canvas", (evt) => {
            const target = evt.target;
            // Retrieve master data
            // const id = $(target).data("id");
            const modalContent = [
                {name:"Short Name", val: "Gross Sales"},
                {name:"Unit", val: "$"},
                {name:"Type", val: "Aggregate"},
                {name:"Formula", val: "{4b9ad3f2ec7c} * {066642e39dac}"},
                {name:"ID", val: "74351e8d7097"}
            ];
            modal.fill("Gross Sales", modalContent);
            modal.display();
        });
    }
}