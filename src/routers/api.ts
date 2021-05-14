import Router from "express";
import sqlite3 from "sqlite3";
import {open} from "sqlite";
import { start } from "repl";

const router = Router();

/**
 * ---------------------------------------------------------------------------
 * ---------------------------------- SETUP ----------------------------------
 * ---------------------------------------------------------------------------
 */

/**
 * Calculates the cumulative sum of an array, call with arr.map(cumulativeSum(0))
 * @param array The initial array
 * @param field The filed to accumulate
 * @returns Array
 */
async function cumulativeSum(array:any[], field = "val") {
    const values = array.map(d => d[field]);
    const sums = values.map((sum => value => sum += value)(0));
    const retArr = array.map((d, i) => {
        const val = {};
        val[field] = sums[i];
        const obj = Object.assign(d, val);
        return obj;
    });
    return retArr;
}

/**
 * Returns the sum of an array of objects
 * @param array The initial array
 * @param field The filed to accumulate
 * @returns Total sum
 */
async function objSum(array:any[], field = "val") {
    const values = array.map(d => d[field]);
    const reducer = (accumulator:number, currentValue:number) => accumulator + currentValue;
    const sum = await values.reduce(reducer);
    return sum;
}

/**
 * Opens the Database
 * @returns Database Object
 */
async function openDB() {
    return open({
        filename: "./dist/db/dashboard.db",
        driver: sqlite3.Database
    });
}

// Default Return Object
const defaultReturn = {
    success: false,
    errMsg: ""
};

/**
 * Converts a Date object to an ISO date string
 * @param date A Date Object
 * @returns ISO-String
 */
function toISO(date:Date) {
    return date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2,"0") + "-" + String(date.getDate()).padStart(2,"0")
}


/**
 * ---------------------------------------------------------------------------
 * ------------------------------- API METHODS -------------------------------
 * ---------------------------------------------------------------------------
 */

/**
 * Endpoint to test whether the API is available
 * @param params Request parameters
 * @returns Object
 */
const testFunction = async (params) => {

    // Copy object by val
    const returnObj = {};
    Object.assign(returnObj, defaultReturn);

    returnObj["params"] = params;
    console.log("[API] Calling testfunc");

    const db = await openDB();

    const result = await db.all("SELECT * FROM kpis");
    returnObj["data"] = result;
    returnObj["success"] = true;

    await db.close();

    return returnObj;
};


/**
 * Returns master data like name, unit and sub-KPIs
 * @param params Request parameters
 * @returns Object
 */
const getMasterData = async (params) => {

    const returnObj = {};
    Object.assign(returnObj, defaultReturn);
    returnObj["params"] = params;

    const db = await openDB();

    const stmt = await db.prepare("SELECT * FROM kpis WHERE id = ?;", params.id);
    const result = await stmt.get();
    await stmt.finalize();

    if (result !== undefined) {
        returnObj["data"] = result;
    } else {
        returnObj["data"] = {};
    }

    await db.close();

    const children = await getChildren(params);

    returnObj["data"]["children"] = children["data"];

    returnObj["success"] = true;
    return returnObj;
};


/**
 * Returns the children (=sub-KPIs)
 * @param params Request parameters
 * @returns Object
 */
const getChildren = async (params) => {

    const returnObj = {};
    Object.assign(returnObj, defaultReturn);
    returnObj["params"] = params;

    const db = await openDB();

    const stmt = await db.prepare("SELECT id FROM kpis WHERE parent = ?;", params.id);
    const result = await stmt.all();
    await stmt.finalize();

    if (result !== undefined) {
        returnObj["data"] = result.map(d => d.id);
    } else {
        returnObj["data"] = [];
    }

    // Second request to additionally parse formula
    const stmt_2 = await db.prepare("SELECT formula FROM kpis WHERE id = ?;", params.id);
    const result_2 = await stmt_2.get();
    
    await stmt_2.finalize();

    if (result !== undefined) {
        // Parse IDs from formula and add to result
        const formula = result_2.formula;
        console.log(formula);
        
        const regex = /({.{12}})/g;
        const result = [];
        let res;
        
        do {
            res = regex.exec(formula);
            if (res) {
                result.push(res[1]);
            }
        } while (res);
    
        const initial = returnObj["data"];
        const ids = result.map(id => id.substr(1,id.length - 2));
        let total = initial.concat(ids);
        total = total.filter((item, pos) => total.indexOf(item) === pos);
        returnObj["data"] = total;
    }

    await db.close();

    returnObj["success"] = true;
    return returnObj;
};


/**
 * Gets data aggregated by day
 * @param params Request parameters
 * @returns KPI data as JSON
 */
const getDaily = async (params) => {
    const returnObj = {};
    Object.assign(returnObj, defaultReturn);
    returnObj["params"] = params;

    const db = await openDB();

    params = await getPeriod(params);

    let sql = "SELECT timestamp AS date, SUM(value) AS val FROM measures WHERE kpi = ? AND scenario = ? AND (timestamp BETWEEN ? AND ?) GROUP BY timestamp ORDER BY timestamp ASC;";
    if (params.filter.aggregate !== undefined && params.filter.aggregate === "avg") {
        sql = "SELECT timestamp AS date, AVG(value) AS val FROM measures WHERE kpi = ? AND scenario = ? AND (timestamp BETWEEN ? AND ?) GROUP BY timestamp ORDER BY timestamp ASC;";
    } 

    const stmt = await db.prepare(sql, params.id, params.filter.scenario, params.startDate, params.endDate);
    const result = await stmt.all();
    await stmt.finalize();

    if (result !== undefined) {
        returnObj["data"] = result;
    } else {
        returnObj["data"] = {};
    }

    await db.close();

    returnObj["success"] = true;
    return returnObj;
};


/**
 * Gets the latest data point
 * @param params Request parameters
 * @returns KPI data as JSON
 */
const getLatest = async (params) => {
    const returnObj = {};
    Object.assign(returnObj, defaultReturn);
    returnObj["params"] = params;

    const now =new Date();
    const today = toISO(now);

    const db = await openDB();

    params = await getPeriod(params);

    const sql = "SELECT * FROM measures WHERE kpi = ? AND scenario = ? AND timestamp < ? ORDER BY timestamp DESC LIMIT 1;";

    const stmt = await db.prepare(sql, params.id, params.filter.scenario, today);
    const result = await stmt.all();
    await stmt.finalize();

    if (result !== undefined) {
        returnObj["data"] = result;
    } else {
        returnObj["data"] = {};
    }

    await db.close();

    returnObj["success"] = true;
    return returnObj;
};


/**
 * Returns FC values
 * @param params Request parameters
 * @returns KPI data as JSON
 */
 const getForecast = async (params) => {
    const returnObj = {};
    Object.assign(returnObj, defaultReturn);
    returnObj["params"] = params;

    const now =new Date();
    const today = toISO(now);

    const db = await openDB();

    let sql = "SELECT SUM(value) AS val FROM measures WHERE kpi = ? AND scenario = ? AND timestamp > ?;";
    if (params.filter.aggregate !== undefined && params.filter.aggregate === "avg") {
        sql = "SELECT AVG(value) AS val FROM measures WHERE kpi = ? AND scenario = ? AND timestamp > ?;";
    } 

    const stmt = await db.prepare(sql, params.id, params.filter.scenario, today);
    const result = await stmt.all();
    await stmt.finalize();

    if (result !== undefined) {
        returnObj["data"] = result;
    } else {
        returnObj["data"] = {};
    }

    await db.close();

    returnObj["success"] = true;
    return returnObj;
};


/**
 * Gets data aggregated by day
 * @param params Request parameters
 * @returns KPI data as JSON
 */
 const getByPartner = async (params) => {
    const returnObj = {};
    Object.assign(returnObj, defaultReturn);
    returnObj["params"] = params;

    const db = await openDB();

    params = await getPeriod(params);

    let sql = "SELECT partner, partners.name, partners.shortname, SUM(value) AS val FROM measures INNER JOIN partners ON partners.id = measures.partner WHERE kpi = ? AND scenario = ? AND (timestamp BETWEEN ? AND ?) GROUP BY partner ORDER BY val DESC;";
    if (params.filter.aggregate !== undefined && params.filter.aggregate === "avg") {
        sql = "SELECT partner, partners.name, partners.shortname, AVG(value) AS val FROM measures INNER JOIN partners ON partners.id = measures.partner WHERE kpi = ? AND scenario = ? AND (timestamp BETWEEN ? AND ?) GROUP BY partner ORDER BY val DESC;";
    }

    const stmt = await db.prepare(sql, params.id, params.filter.scenario, params.startDate, params.endDate);
    const result = await stmt.all();
    await stmt.finalize();

    if (result !== undefined) {
        returnObj["data"] = result;
    } else {
        returnObj["data"] = {};
    }

    await db.close();

    returnObj["success"] = true;
    return returnObj;
};


/**
 * Helper function to convert period labels into time frames
 * @param params Request parameters
 * @returns KPI data as JSON
 */
const getPeriod = async (params) => {
    const returnObj = {};
    Object.assign(returnObj, defaultReturn);
    if (params.filter.period === undefined || params.filter.period === "") {
        params.filter.period = "YTD";
    }

    const period = params.filter.period;
    const now = new Date();
    const today_str = toISO(now);
    const today = new Date(today_str);
    const curYear = today.getFullYear();
    const curMonth = today.getMonth() + 1;
    const secondsInDay = 86400000;
    let startDate:string;
    let startDateObj:Date;
    let endDate:string;
    let startMonth:number;

    if (!period.endsWith("TD") && (params.filter.endDate === undefined || params.filter.endDate === "")) {
        endDate = today_str;
    } else if (!period.endsWith("TD")) {
        endDate = params.filter.endDate;
    }

    switch (period) {
        case "W":
            startDateObj = new Date(new Date(endDate).getTime() - secondsInDay * 7);
            startDate = toISO(startDateObj);
            break;

        case "M":
            startDateObj = new Date(new Date(endDate).getTime() - secondsInDay * 30);
            startDate = toISO(startDateObj);
            break;

        case "MTD":
            endDate = today_str;
            startDate = curYear + "-" + String(curMonth).padStart(2, "0") + "-01";
            break;

        case "Q":
            startDateObj = new Date(new Date(endDate).getTime() - secondsInDay * 120);
            startDate = toISO(startDateObj);
            break;

        case "QTD":
            endDate = today_str;
            switch (true) {
                case curMonth < 4:
                    startMonth = 1;
                    break;
                case curMonth < 7:
                    startMonth = 4;
                    break;
                case curMonth < 10:
                    startMonth = 6;
                    break;
                default:
                    startMonth = 9;
                    break;
            }
            startDate = curYear + "-" + startMonth + "-01";
            break;

        case "Y":
            startDateObj = new Date(new Date(endDate).getTime() - secondsInDay * 365);
            startDate = toISO(startDateObj);
            break;

        case "YTD":
            endDate = today_str;
            startDate = today.getFullYear() + "-01-01";
            break;
    
        default:
            returnObj["errMsg"] = "Invalid period '" + period + "'.";
            throw new Error("Invalid period '" + period + "'.");
    }

    // Subtract a year if scenario = PY
    if (params.filter.scenario === "PY") {
        const newStart = new Date(startDate);
        const newEnd = new Date(endDate);
        newStart.setFullYear(newStart.getFullYear() - 1);
        newEnd.setFullYear(newEnd.getFullYear() - 1);
        startDate = toISO(newStart);
        endDate = toISO(newEnd);
    }

    params["startDate"] = startDate;
    params["endDate"] = endDate;

    return params;
};



/**
 * Gets data aggregated by a specific time frame
 * @param params Request parameters
 * @returns KPI data as JSON
 */
const getTimeframe = async (params) => {
    const returnObj = {};
    Object.assign(returnObj, defaultReturn);
    returnObj["params"] = params;

    const db = await openDB();

    params = await getPeriod(params);

    let sql = "SELECT SUM(value) AS val FROM measures WHERE kpi = ? AND scenario = ? AND (timestamp BETWEEN ? AND ?);";
    if (params.filter.aggregate !== undefined && params.filter.aggregate === "avg") {
        sql = "SELECT AVG(value) AS val FROM measures WHERE kpi = ? AND scenario = ? AND (timestamp BETWEEN ? AND ?);";
    } 

    const stmt = await db.prepare(sql, params.id, params.filter.scenario, params.startDate, params.endDate);
    const result = await stmt.all();
    await stmt.finalize();

    if (result !== undefined) {
        returnObj["data"] = result;
    } else {
        returnObj["data"] = {};
    }

    await db.close();

    returnObj["success"] = true;
    return returnObj;
};


const hasPartner = async (params) => {
    const returnObj = {};
    Object.assign(returnObj, defaultReturn);
    returnObj["params"] = params;

    const db = await openDB();

    const sql = "SELECT COUNT(*) AS val FROM measures WHERE kpi = ? AND partner NOT NULL;";
    const stmt = await db.prepare(sql, params.id);
    const result = await stmt.all();
    await stmt.finalize();

    if (result !== undefined) {
        returnObj["data"] = result[0];
    } else {
        returnObj["data"] = {val: 0};
    }

    await db.close();

    returnObj["success"] = true;
    return returnObj;
};


/**
 * ---------------------------------------------------------------------------
 * --------------------------------- ROUTING ---------------------------------
 * ---------------------------------------------------------------------------
 */


/**
 * Object containing all valid methods and their identifiers
 */
const methods = {
    test: testFunction,
    masterdata: getMasterData,
    children: getChildren,
    daily: getDaily,
    timeframe: getTimeframe,
    latest: getLatest,
    forecast: getForecast,
    partner: getByPartner,
    hasPartner: hasPartner
};

/**
 * API Router
 */
router.get("/api/kpi/:method/:id/:filter", async function(req, res) {

    // Get params
    const params = req.params;

    // Decode filter to JSON string
    const filter = decodeURIComponent(params["filter"]);

    // Parse JSON
    try {
        params["filter"] = JSON.parse(filter);
        // Call method if available
        if (params.method in methods) {
            res.json(await methods[params.method](params));
        } else {
            res.json({success: false, errMsg: "API Method '" + params.method + "' not implemented"});
        }
    } catch (error) {
        console.error(error);
        res.json({success: false, errMsg: error.message});
    }
});

/**
 * Routers for not implemented routes to fail safely
 */
router.get("/api/kpi/:method/:id", function(req, res) {
    res.json({success: false, errMsg: "Missing Filter"});
});

router.get("/api/kpi/:method", function(req, res) {
    res.json({success: false, errMsg: "Missing KPI ID"});
});

router.get("/api/kpi", function(req, res) {
    res.json({success: false, errMsg: "Missing API Method"});
});

router.get("/api", function(req, res) {
    res.json({success: false, errMsg: "Not implemented"});
});

router.get("/api/*", function(req, res) {
    res.json({success: false, errMsg: "Not implemented"});
});

export default router;