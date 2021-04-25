import Router from "express";
import sqlite from "sqlite3";

const router = Router();

const db = new sqlite.Database("./dist/db/dashboard.db", (err:Error) => {
    if (err) {
        console.error("Error opening database " + err.message);
    }
});

const defaultReturn = {
    success: false,
    errMsg: ""
};

/**
 * Endpoint to test whether the API is available
 * @param id The ID of the KPI to return
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


const getDaily = (params) => {
    return params;
};

/**
 * Object containing all valid functions and their identifiers
 */
const functions = {
    test: testFunction,
    byDay: getDaily
};

/**
 * API Router
 */
router.get("/api/kpi/:function/:id/:filter", function(req, res) {
    const params = req.params;
    params["filter"] = JSON.parse(decodeURIComponent(params["filter"]));
    if (params.function in functions) {
        res.json(functions[params.function](params));
    }
});

export default router;