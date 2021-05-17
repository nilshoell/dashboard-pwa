import * as Helper from "./helperFunctions.js";

/**
 * Changes the contents of the main modal
 * @param title The title of the modal
 * @param body An array of {name, val} pairs that are displayed in the body
 */
function fill(title:string, body:Record<string, any>[], filter = {}) {
    const modalBody = $("#kpiModal .modal-body")[0];
    const modalTitle = $("#kpiModalLabel")[0];

    modalTitle.innerText = title;
    let bodyContent = "";

    if (!Helper.emptyObj(filter)) {
        const scenario = filter["scenario"] ?? "AC";
        const period = filter["period"] ?? "YTD";
        let aggregate = filter["aggregate"].toUpperCase() ?? "SUM";

        if (aggregate == "AVG") {
            aggregate = "Ø " + filter["avg"];
        }

        bodyContent += "<b>Scenario: </b><span class='badge badge-light'>" + scenario + "</span><br>";
        bodyContent += "<b>Period: </b><span class='badge badge-secondary'>" + period + "</span><br>";
        bodyContent += "<b>Aggregate: </b><span class='badge badge-dark'>" + aggregate + "</span></br><hr>";
    }

    body.forEach(entry => {
        if (entry.name && entry.val) {
            bodyContent += "<b>" + entry.name + ":</b> " + entry.val + "</br>";
        }
    });

    modalBody.innerHTML = bodyContent;
}

/**
 * Resets the modal to default
 */
function reset() {
    const modalBody = $("#kpiModal .modal-body")[0];
    const modalTitle = $("#kpiModalLabel")[0];
    modalBody.innerHTML = "Modal Title";
    modalTitle.innerText = "No content provided";
}

/**
 * Initialize and show the modal
 */
function display() {
    $("#kpiModal").modal();
}

export { fill, reset, display };