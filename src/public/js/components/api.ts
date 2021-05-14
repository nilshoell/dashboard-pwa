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

async function getLatestBarData(kpi_id:string, filters = {}) {
    const data = [];
    const requests = [{scenario: "PY"}, {scenario: "AC"}, {scenario: "BU"}, {scenario: "FC"}];
    
    for (let i = 0; i < requests.length; i++) {
        const filter = {};
        Object.assign(filter, requests[i], filters);
        const result = await callApi("latest", kpi_id, filter);
        if (result[0] !== undefined) {
            data.push(result[0]["value"] ?? 0);
        } else {
            data.push(0);
        }
    }

    return data;
}

async function getBarData(kpi_id:string, period = "YTD", filters = {}) {
    const data = [];
    const requests = [
        {scenario: "PY", period: period},
        {scenario: "AC", period: period},
        {scenario: "BU", period: period},
        {scenario: "FC", period: period}
    ];
    
    for (let i = 0; i < requests.length; i++) {
        const filter = {};
        Object.assign(filter, requests[i], filters);
        
        const result = await callApi("timeframe", kpi_id, filter);
        if (result[0] !== undefined) {
            data.push(result[0]["val"] ?? 0);
        } else {
            data.push(0);
        }
    }
    return data;
}

async function getTimeData(kpi_id:string, scenario = "AC", period = "YTD", filters = {}):Promise<any[]> {
    const filter = {};
    Object.assign(filter, {scenario: scenario, period: period}, filters);
    const data = await callApi("daily", kpi_id, filter);
    return data;
}

async function getCumulativeTimeData(kpi_id:string, scenario = "AC", period = "YTD", filters = {}) {
    const filter = {};
    Object.assign(filter, {scenario: scenario, period: period}, filters);
    let data = await callApi("daily", kpi_id, filter);
    data = await Helper.cumulativeSum(data, "val");
    return data;
}

async function getBrickData(kpi_id:string, period = "Q", filters = {}) {
    const filter = {};
    Object.assign(filter, {period: period}, filters);
    const data = await callApi("daily", kpi_id, filter);

    let firstDay:number;
    for (let i = 0; i < data.length; i++) {
        const date = new Date(data[i].date);
        if (date.getDay() === 1) {
            firstDay = i;
            break;
        }
    }

    const reducedData = data.slice(firstDay);
    const chunks = Math.ceil(reducedData.length / 7);

    const result = [];
    for (let i = 0; i < chunks; i++) {
        const chunk = reducedData.slice(i * 7, i * 7 + 7);
        const values = chunk.map(d => d.val);
        const calendarWeek = (d:string) => d3.timeFormat("%W")(new Date(d));
        result.push({week: calendarWeek(reducedData[i * 7].date), val: values});
    }

    return result;
}

/**
 * Converts KPI IDs in a formula to names
 * @param formula The original formula as present in the DB
 * @returns String
 */
async function convertFormula(formula:string) {
    const regex = /({.{12}})/g;
    const result = [];
    let res;

    do {
        res = regex.exec(formula);
        if (res) {
            result.push(res[1]);
        }
    } while (res);

    const ids = result.map(id => id.substr(1,id.length - 2));
    const kpis = [];

    for (let i = 0; i < ids.length; i++) {
        const kpi = await callApi("masterdata", ids[i]);
        kpis.push({id: ids[i], name: kpi.name});
    }

    let converted = formula;

    kpis.forEach(async (kpi) => {
        converted = converted.replace(kpi.id, kpi.name);
    });

    return converted;
}

export { getApiBase, callApi, getLatestBarData, getBarData, getTimeData, getCumulativeTimeData, getBrickData, convertFormula };