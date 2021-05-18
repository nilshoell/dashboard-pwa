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
    
    // Setup filters
    const filter = {aggregate: dashboard.kpi.masterdata.aggregate, scenario: "AC", period: "YTD"};
    if (filter.aggregate === "avg" && filter["avg"] === undefined) {
        filter["avg"] = 14;
    }
    dashboard.kpi.filter = filter;
    
    // Timeline Data
    if (dashboard.kpi.masterdata.aggregate === "avg") {
        const data = await API.getTimeData(kpi_id, dashboard.kpi.filter);
        dashboard.kpi.data = await Helper.movingAvg(data, dashboard.kpi.filter.avg);
    } else {
        dashboard.kpi.data = await API.getCumulativeTimeData(kpi_id, dashboard.kpi.filter);
    }

    await dashboard.renderTimeLine("timeline", dashboard.kpi);
    Object.assign(dashboard.kpi.filter, {style: "short"});
    const tile:KPI = {id: ""};
    Object.assign(tile, dashboard.kpi);
    await dashboard.renderChart("overview", tile, "KPITile");

    // Column Chart
    const hasPartner = await API.callApi("hasPartner", kpi_id);
    if (hasPartner["val"] > 0) {

        const partnerKPI:KPI = {
            id: kpi_id,
            masterdata: dashboard.kpi.masterdata,
            filter: {
                aggregate: dashboard.kpi.masterdata.aggregate,
                period: "YTD"
            }
        };

        partnerKPI.data = await API.callApi("partner", kpi_id, partnerKPI.filter);
        dashboard.renderColumnChart("columnChart", partnerKPI);
    } else {
        $("#columnChart").addClass("d-none");
    }

    // Update page title and KPI
    const name = dashboard.kpi.masterdata.name;
    $("h4.title")[0].innerText = name;
    if (name.length > 24) {
        $("h4.title").addClass("h6");
    }
    if (name.length > 20) {
        $("h4.title").addClass("h5");
    }

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
        dashboard.renderComponents(children);
    }
});

class KPIDashboard extends BasePage {

    kpi:KPI;

    async renderComponents(children:any[]) {
        for (let i = 0; i < children.length; i++) {
            const id = children[i];
            const component:KPI = {id: id, filter: {period: "YTD", scenario: "AC"}};

            component.masterdata = await API.callApi("masterdata", id);
            const filter = {aggregate: component.masterdata.aggregate, scenario: "AC", period: "YTD", avg: 14};
            component.filter = Object.assign(filter, component.filter);

            if (component.masterdata.aggregate === "sum") {
                component.barData = await API.getBarData(id, component.filter);
                component.sparkData = await API.getCumulativeTimeData(id, component.filter);
            } else {
                component.barData = await API.getLatestBarData(id, component.filter);
                const sparkData = await API.getTimeData(id, component.filter);
                component.sparkData = await Helper.movingAvg(sparkData, component.filter.avg);
            }

            this.renderKPIBar("kpibar_" + (i + 1), component);
            this.renderSparkline("sparkline_" + (i + 1), component);
        }
    }
}