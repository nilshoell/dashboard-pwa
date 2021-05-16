import * as API from "./../components/api.js";
import { BasePage, KPI } from "./basePage.js";

/**
 * Executes on document ready
 * Loads data and renders dashboards
 */
$(async function () {
    const page = new PartnerOverview();
    const partner_id = $("#partner")[0].innerText;

    page.products.masterdata = await API.callApi("partnerData", partner_id);
    page.months.masterdata = await API.callApi("masterdata", page.months.id);

    // Update page title
    const name = page.products.masterdata.name;
    $("h4.title")[0].innerText = name;
    if (name.length > 24) {
        $("h4.title").addClass("h6");
    }
    if (name.length > 20) {
        $("h4.title").addClass("h5");
    }

    page.months.filter = {partner: partner_id, period: "Y", aggregate: "sum"};
    page.months.data = await API.callApi("monthly", "74351e8d7097", page.months.filter);
    page.renderBarChart("barChart", page.months);
    
    // Get product info
    page.products.filter = {partner: partner_id, period: "YTD", aggregate: "sum"};
    page.products.data = await API.callApi("products", "74351e8d7097", page.products.filter);
    page.renderColumnChart("columnChart", page.products);
    $("#columnChart .chart-label")[0].innerText = "Products";

});

class PartnerOverview extends BasePage {
    months:KPI = {id: "74351e8d7097"};
    products:KPI = {id: "74351e8d7097"};

    constructor() {
        super();
        this.kpis = [
            {id: "74351e8d7097"},
            {id: "4b9ad3f2ec7c"}
        ];
    }

}