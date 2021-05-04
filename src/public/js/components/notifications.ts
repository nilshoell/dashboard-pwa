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
function displayNotification() {
    if (Notification.permission == "granted") {
        navigator.serviceWorker.getRegistration().then(function (reg) {
            const options = {
                body: "KPI went out of bounds",
                icon: "public/images/favicon.png",
                vibrate: [100, 50, 100],
                data: {
                    dateOfArrival: Date.now(),
                    primaryKey: 1,
                    kpi: "test"
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

/**
 * Handles interactions with the notification
 * @param e Click Event
 */
function handleClick(e) {
    const notification = e.notification;
    const primaryKey = notification.data.primaryKey;
    const kpi_id = notification.data.kpi;
    const action = e.action;

    console.log("Notification click on '" + primaryKey + "' detected; action", action);
  
    if (action === "close") {
      notification.close();
    } else {
      window.location.href = "/kpi/" + kpi_id;
      notification.close();
    }
  }

export {
    setupNotifications,
    displayNotification,
    handleClick
};