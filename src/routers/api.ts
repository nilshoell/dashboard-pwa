import Router from "express";

const router = Router();

/**
 * Endpoint to test whether the API is available
 * @param id The ID of the KPI to return
 * @returns Object
 */
const testFunction = (params) => {
    return {
        success: true,
        function: params.function,
        id: params.id
    }
}

/**
 * Object containing all valid functions and their identifiers
 */
const functions = {
    test: testFunction
};

/**
 * API Router
 */
router.get('/api/kpi/:function/:id', function(req, res) {
    const params = req.params;
    if (params.function in functions) {
        res.json(functions[params.function](params));
    }
});

export default router;