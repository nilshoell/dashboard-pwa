import * as Helper from "./helperFunctions.js";

/**
 * Returns the base URL for the KPI API
 */
 function getApiBase() {
    return window.location.origin + "/api/kpi/";
}


/**
 * Wrapper for the API
 * @param method The API method to call
 * @param kpi The KPI to refer to
 * @param filter (optional) Additional filters, if supported by the method
 * @returns Result object, with the actual values in the 'data' field
 */
async function callApi(method:string, kpi:string, filter = {}, fullResponse= false) {

    // Setup request
    const api_base = getApiBase();

    // Filter defaults
    if (!filter["period"]) {
        filter["period"] = "YTD";
    }
    if (!filter["scenario"]) {
        filter["scenario"] = "AC";
    }

    const filter_string = encodeURIComponent(JSON.stringify(filter));
    const api_url = api_base + method + "/" + kpi + "/" + filter_string;

    // Fetch the API
    const response = await fetch(api_url);
    const data = await response.json();

    // Immediately return on error
    if (!data.success) {
        console.error("API Request failed:", data.errMsg);
        return data;
    }

    // Only return everything if requested or if the response does not contain data
    if (fullResponse) {
        return data;
    } else if (!Helper.emptyObj(data.data)) {
        return data.data;
    } else {
        return data;
    }
}

async function getLatestBarData(kpi_id:string) {
    const data = [];
    data.push(await callApi("latest", kpi_id, {scenario: "PY"})["value"] ?? 0);
    data.push(await callApi("latest", kpi_id, {scenario: "BU"})["value"] ?? 0);
    data.push(await callApi("latest", kpi_id)["value"]);
    data.push(await callApi("latest", kpi_id, {scenario: "FC"})["value"] ?? 0);
    return data;
}

async function getBarData(kpi_id:string, period = "YTD") {
    const data = [];
    data.push(await callApi("timeframe", kpi_id, {scenario: "AC", period: period})["value"] ?? 0);
    data.push(await callApi("timeframe", kpi_id, {scenario: "PY", period: period})["value"] ?? 0);
    data.push(await callApi("timeframe", kpi_id, {scenario: "BU", period: period})["value"] ?? 0);
    data.push(await callApi("timeframe", kpi_id, {scenario: "FC", period: period})["value"] ?? 0);
    return data;
}

async function getTimeData(kpi_id:string, scenario = "AC", period = "YTD") {
    const data = await callApi("daily", kpi_id, {scenario: scenario, period: period});
    return data;
}

async function getCumulativeTimeData(kpi_id:string, scenario = "AC", period = "YTD") {
    let data = await callApi("daily", kpi_id, {scenario: scenario, period: period});
    data = await Helper.cumulativeSum(data, "value");
    return data;
}

export { getApiBase, callApi, getLatestBarData, getBarData, getTimeData, getCumulativeTimeData };