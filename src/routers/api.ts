import Router from "express";
import sqlite from "sqlite3";

const router = Router();

const db = new sqlite.Database("./dist/db/dashboard.db", (err:Error) => {
    if (err) {
        console.error("Error opening database " + err.message);
    } else {
        console.log("Connected to Database");
    }
});

const defaultReturn = {
    success: false,
    errMsg: ""
};

/**
 * Endpoint to test whether the API is available
 * @param params Request parameters
 * @returns Object
 */
const testFunction = (params) => {

    const returnObj = defaultReturn;

    returnObj["params"] = params;

    db.all("SELECT * FROM kpis;", (err, rows) => {
        if (err) {
            returnObj.errMsg = err.message;
            return returnObj;
        }
        returnObj["kpis"] = rows;
        returnObj.success = true;
    });

    return returnObj;
};


/**
 * Returns master data like name, unit and sub-KPIs
 * @param params Request parameters
 * @returns Object
 */
const getMasterData = (params) => {

    const returnObj = defaultReturn;
    returnObj["params"] = params;

    const stmt = db.prepare("SELECT * FROM kpis WHERE id = ?;", params.id);

    stmt.get((err, rows) => {
        if (err) {
            returnObj.errMsg = err.message;
            return returnObj;
        }
        returnObj["master"] = rows[0];
    });

    returnObj["children"] = getChildren(params)["children"];

    returnObj.success = true;
    return returnObj;

};


/**
 * Returns the children (=sub-KPIs)
 * @param params Request parameters
 * @returns Object
 */
const getChildren = (params) => {

    const returnObj = defaultReturn;
    returnObj["params"] = params;

    const stmt = db.prepare("SELECT id FROM kpis WHERE parent = ?;", params.id);

    stmt.get((err, rows) => {
        if (err) {
            returnObj.errMsg = err.message;
            return returnObj;
        }
        returnObj["children"] = rows;
    });

    returnObj.success = true;
    return returnObj;

};


/**
 * Gets data aggregated by day
 * @param params Request parameters
 * @returns KPI data as JSON
 */
const getDaily = (params) => {
    return params;
};


/**
 * Gets data aggregated by a specified period; wrapper for getTimeFrame()
 * @param params Request parameters
 * @returns KPI data as JSON
 */
const getPeriod = (params) => {
    const returnObj = defaultReturn;
    if (params.filter.period === undefined || params.filter.period === "") {
        returnObj["errMsg"] = "No period provided.";
        return returnObj;
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
        return returnObj;
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
            return returnObj;
    }

    params["startDate"] = startDate;
    params["endDate"] = endDate;

    return getTimeframe(params);
};



/**
 * Gets data aggregated by a specific time frame
 * @param params Request parameters
 * @returns KPI data as JSON
 */
const getTimeframe = (params) => {
    return params;
};


/**
 * Object containing all valid methods and their identifiers
 */
const methods = {
    test: testFunction,
    daily: getDaily,
    period: getPeriod,
    timeframe: getTimeframe,
    children: getChildren,
    masterdata: getMasterData
};

/**
 * API Router
 */
router.get("/api/kpi/:method/:id/:filter", function(req, res) {

    // Get params
    const params = req.params;

    // Decode filter to JSON string
    const filter = decodeURIComponent(params["filter"]);

    // Parse JSON
    try {
        params["filter"] = JSON.parse(filter);
        // Call method if available
        if (params.method in methods) {
            res.json(methods[params.method](params));
        } else {
            res.json({success: false, errMsg: "API Method '" + params.method + "' not implemented"});
        }
    } catch (error) {
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