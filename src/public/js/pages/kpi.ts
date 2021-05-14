import * as API from "./../components/api.js";
import * as Helper from "./../components/helperFunctions.js";

import { BasePage, KPI } from "./basePage.js";

/**
 * Executes on document ready
 * Loads data and renders dashboards
 */
$(async function () {
    const dashboard = new KPIDashboard();

    const kpi_id = $("#kpi")[0].innerText;
    dashboard.kpi = {id: kpi_id};
    dashboard.kpi.masterdata = await API.callApi("masterdata", kpi_id);
    
    // Timeline Data
    if (dashboard.kpi.masterdata.aggregate === "avg") {
        const data = await API.getTimeData(kpi_id);
        dashboard.kpi.data = await Helper.movingAvg(data, 14);
    } else {
        dashboard.kpi.data = await API.getCumulativeTimeData(kpi_id);
    }

    dashboard.renderTimeLine("timeline", dashboard.kpi);

    // Column Chart
    const hasPartner = await API.callApi("hasPartner", kpi_id);
    if (hasPartner["val"] > 0) {
        const partnerKPI:KPI = {id: kpi_id, masterdata: dashboard.kpi.masterdata};
        partnerKPI.data = await API.callApi("partner", kpi_id, {aggregate: dashboard.kpi.masterdata.aggregate});
        dashboard.renderColumnChart("columnChart", partnerKPI);
    } else {
        $("#columnChart").addClass("d-none");
    }

    // Update page title and KPI
    $("h4.title")[0].innerText = dashboard.kpi.masterdata.name;
    $("#formula")[0].innerText = await API.convertFormula(dashboard.kpi.masterdata.formula);
    $("#timeline .chart-label").addClass("d-none");
    $("#columnChart .chart-label")[0].innerText = "By Customers:";
    const popover_text = "This page provides a detailed overview of the KPI '" + dashboard.kpi.masterdata.name + "', including its sub-components";
    $("#help").data("bs.popover").config.content = popover_text;

    // Render the sub-components
    const children = dashboard.kpi.masterdata["children"];
    if (children.length == 0) {
        $("#components").addClass("d-none");
    } else {
        // dashboard.kpis = children.map(d => {return {id: d};});
        // dashboard.getMasterData();
        dashboard.renderComponents(children);
    }

});

class KPIDashboard extends BasePage {

    kpi:KPI;

    async renderComponents(children:any[]) {
        for (let i = 0; i < children.length; i++) {
            const id = children[i];
            const data:KPI = {id: id, filter: {period: "YTD", scenario: "AC"}};
            data.masterdata = await API.callApi("masterdata", id);

            if (data.masterdata.aggregate === "sum") {
                data.barData = await API.getBarData(id);
                data.sparkData = await API.getCumulativeTimeData(id);
            } else {
                data.barData = await API.getLatestBarData(id, {aggregate: data.masterdata.aggregate});
                data.sparkData = await API.getTimeData(id);
            }

            this.renderKPIBar("kpibar_" + (i + 1), data);
            this.renderSparkline("sparkline_" + (i + 1), data);
        }
    }
}