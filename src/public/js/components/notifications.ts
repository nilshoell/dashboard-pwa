import * as Helper from "./helperFunctions.js";

/**
 * Requests permission from the user to send notifications
 */
function setupNotifications() {
    Notification.requestPermission(function (status) {
        console.log("Notification permission status:", status);
    });
}

/**
 * Sends a test message
 */
function displayNotification(kpi_id:string) {

    const kpi_data = Helper.callApi("test", "test", {foo: "bar"});

    if (Notification.permission == "granted") {
        navigator.serviceWorker.getRegistration().then(function (reg) {
            const options = {
                body: "KPI went out of bounds",
                icon: "public/images/favicon.png",
                vibrate: [100, 50, 100],
                data: {
                    dateOfArrival: Date.now(),
                    primaryKey: 1,
                    kpi: kpi_id,
                    kpi_data: kpi_data
                },
                actions: [{
                        action: "open",
                        title: "Check out the KPI",
                        icon: "public/images/check.png"
                    },
                    {
                        action: "close",
                        title: "Close notification",
                        icon: "public/images/cross.png"
                    },
                ]
            };
            reg.showNotification("KPI Warning", options);
        });
    }
}


export {
    setupNotifications,
    displayNotification
};