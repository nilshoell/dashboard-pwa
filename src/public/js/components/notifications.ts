function setupNotifications() {
    Notification.requestPermission(function (status) {
        console.log("Notification permission status:", status);
    });
}

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