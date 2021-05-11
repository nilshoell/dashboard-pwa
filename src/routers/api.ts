import Router from "express";
import sqlite3 from "sqlite3";
import {open} from "sqlite";

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

    const returnObj = defaultReturn;

    returnObj["params"] = params;
    console.log("[API] Calling testfunc");

    const db = await openDB();

    const result = await db.all("SELECT * FROM kpis");
    returnObj["data"] = result;
    returnObj.success = true;

    await db.close();

    return returnObj;
};


/**
 * Returns master data like name, unit and sub-KPIs
 * @param params Request parameters
 * @returns Object
 */
const getMasterData = async (params) => {

    const returnObj = defaultReturn;
    returnObj["params"] = params;

    const db = await openDB();

    const stmt = await db.prepare("SELECT * FROM kpis WHERE id = ?;", params.id);
    const result = await stmt.get();
    await stmt.finalize();
    returnObj["data"] = result;

    await db.close();

    returnObj["data"]["children"] = await getChildren(params)["data"];

    returnObj.success = true;
    return returnObj;

};


/**
 * Returns the children (=sub-KPIs)
 * @param params Request parameters
 * @returns Object
 */
const getChildren = async (params) => {

    const returnObj = defaultReturn;
    returnObj["params"] = params;

    const db = await openDB();

    const stmt = await db.prepare("SELECT id FROM kpis WHERE parent = ?;", params.id);
    const result = await stmt.all();
    returnObj["data"] = result;
    await stmt.finalize();

    await db.close();

    returnObj.success = true;
    return returnObj;

};


/**
 * Gets data aggregated by day
 * @param params Request parameters
 * @returns KPI data as JSON
 */
const getDaily = async (params) => {
    const returnObj = defaultReturn;
    returnObj["params"] = params;

    const db = await openDB();

    params = await getPeriod(params);

    const sql = "SELECT SUM(value) FROM measures WHERE kpi = ? AND scenario = ? AND (timestamp BETWEEN ? AND ?) GROUP BY timestamp;";

    const stmt = await db.prepare(sql, params.id, params.filter.scenario, params.startDate, params.endDate);
    const result = await stmt.all();
    returnObj["data"] = result;
    await stmt.finalize();

    await db.close();

    returnObj.success = true;
    return returnObj;
};


/**
 * Gets data aggregated by day
 * @param params Request parameters
 * @returns KPI data as JSON
 */
 const getByPartner = async (params) => {
    const returnObj = defaultReturn;
    returnObj["params"] = params;

    const db = await openDB();

    params = await getPeriod(params);

    const sql = "SELECT SUM(value) FROM measures WHERE kpi = ? AND scenario = ? AND (timestamp BETWEEN ? AND ?) GROUP BY partner;";

    const stmt = await db.prepare(sql, params.id, params.filter.scenario, params.startDate, params.endDate);
    const result = await stmt.all();
    returnObj["data"] = result;
    await stmt.finalize();

    await db.close();

    returnObj.success = true;
    return returnObj;
};


/**
 * Gets data aggregated by a specified period; wrapper for getTimeFrame()
 * @param params Request parameters
 * @returns KPI data as JSON
 */
const getPeriod = async (params) => {
    const returnObj = defaultReturn;
    if (params.filter.period === undefined || params.filter.period === "") {
        returnObj["errMsg"] = "No period provided.";
        throw new Error("No period provided.");
    }

    const period = params.filter.period;
    const now = new Date();
    const today_str = now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();
    const today = new Date(today_str);
    const curYear = today.getFullYear();
    const curMonth = today.getMonth() + 1;
    const secondsInDay = 86400000;
    let startDate:string;
    let startDateObj:Date;
    let endDate:string;
    let startMonth:number;

    if (!period.endsWith("TD") && (params.filter.endDate === undefined || params.filter.endDate === "")) {
        returnObj["errMsg"] = "End date required for all non-to-date periods.";
        throw new Error("End date required for all non-to-date periods.");
    } else if (!period.endsWith("TD")) {
        endDate = params.filter.endDate;
    }

    switch (period) {
        case "W":
            startDateObj = new Date(new Date(endDate).getTime() - secondsInDay * 7);
            startDate = startDateObj.getFullYear() + "-" + (startDateObj.getMonth() + 1) + "-" + startDateObj.getDate();
            break;

        case "M":
            startDateObj = new Date(new Date(endDate).getTime() - secondsInDay * 30);
            startDate = startDateObj.getFullYear() + "-" + (startDateObj.getMonth() + 1) + "-" + startDateObj.getDate();
            break;

        case "MTD":
            endDate = today_str;
            startDate = curYear + "-" + curMonth + "-01";
            break;

        case "Q":
            startDateObj = new Date(new Date(endDate).getTime() - secondsInDay * 120);
            startDate = startDateObj.getFullYear() + "-" + (startDateObj.getMonth() + 1) + "-" + startDateObj.getDate();
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
            startDate = startDateObj.getFullYear() + "-" + (startDateObj.getMonth() + 1) + "-" + startDateObj.getDate();
            break;

        case "YTD":
            endDate = today_str;
            startDate = today.getFullYear() + "-01-01";
            break;
    
        default:
            returnObj["errMsg"] = "Invalid period '" + period + "'.";
            throw new Error("Invalid period '" + period + "'.");
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
    const returnObj = defaultReturn;
    returnObj["params"] = params;

    const db = await openDB();

    params = await getPeriod(params);

    const sql = "SELECT SUM(value) FROM measures WHERE kpi = ? AND scenario = ? AND (timestamp BETWEEN ? AND ?);";

    const stmt = await db.prepare(sql, params.id, params.filter.scenario, params.startDate, params.endDate);
    const result = await stmt.all();
    returnObj["data"] = result;
    await stmt.finalize();

    await db.close();

    returnObj.success = true;
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
    daily: getDaily,
    timeframe: getTimeframe,
    partner: getByPartner,
    children: getChildren,
    masterdata: getMasterData
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