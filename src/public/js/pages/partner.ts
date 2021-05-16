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

    // Update page title
    const name = page.products.masterdata.name;
    $("h4.title")[0].innerText = name;
    if (name.length > 24) {
        $("h4.title").addClass("h6");
    }
    if (name.length > 20) {
        $("h4.title").addClass("h5");
    }
    $("#barChart .chart-label").addClass("d-none");

    page.months.data = await API.callApi("monthly", "74351e8d7097", {partner: partner_id, period: "Y"});
    page.renderBarChart("barChart", page.months);

    // Get product info
    page.products.data = await API.callApi("products", "74351e8d7097", {partner: partner_id, period: "YTD"});
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