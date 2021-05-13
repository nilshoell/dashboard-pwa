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
        bodyContent += "<b>Period: </b>" + filter["period"] + "<b> Scenario: </b>" + filter["scenario"] + "</br><hr>";
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