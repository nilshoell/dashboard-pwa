function fill(title:string, body:Record<string, any>[]) {
    const modalBody = $("#kpiModal .modal-body")[0];
    const modalTitle = $("#kpiModalLabel")[0];

    modalTitle.innerText = title;
    let bodyContent = "";

    body.forEach(entry => {
        bodyContent += "<b>" + entry.name + ":</b> " + entry.val + "</br>";
    });

    modalBody.innerHTML = bodyContent;
}

function reset() {
    const modalBody = $("#kpiModal .modal-body")[0];
    const modalTitle = $("#kpiModalLabel")[0];
    modalBody.innerHTML = "";
    modalTitle.innerText = "";
}

function display() {
    $("#kpiModal").modal();
}

export { fill, reset, display };