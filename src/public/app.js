"use strict";
let isSubscribed = false;
let swRegistration = null;
let applicationKey =
  "BLgFTwjElUH_Iz72TKDvmlsc-EcwziNP2X28BmN-znOXJhv35QybtfcN1HTh_eUlNffp12HkuruYpqtKNedN54s";
// Url Encription
function urlB64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Installing service worker
if ("serviceWorker" in navigator && "PushManager" in window) {
  console.log("Service Worker and Push is supported");

  window.addEventListener("load", function() {
    navigator.serviceWorker
      .register("http://localhost:5500/sw-test.js", {
        scope: "/",
        origin: "*"
      })
      .then(function(swReg) {
        console.log("service worker ready for registion");

        swRegistration = swReg;
        //console.log(swReg);
        swRegistration.pushManager
          .getSubscription()
          .then(function(subscription) {
            isSubscribed = !(subscription === null);
            //console.log(`${isSubscribed}`);
            if (isSubscribed) {
              console.log("push notification service is already installed");
            } else {
              swRegistration.pushManager
                .subscribe({
                  userVisibleOnly: true,
                  applicationServerKey: urlB64ToUint8Array(applicationKey)
                })
                .then(function(subscription) {
                  console.log(subscription);
                  console.log(
                    "push service notification is installed successfully"
                  );
                  JSON.stringify(subscription);
                  var subscribe = [subscription];
                  subscribe.map(i => {
                    i["domain"] = "http://localhost:5500";
                  });
                  console.log(subscribe);
                  saveSubscription(subscribe);

                  isSubscribed = true;
                })
                .catch(function(err) {
                  console.log("Failed to subscribe user: ", err);
                });
            }
          });
      })
      .catch(function(error) {
        console.error("Service Worker Error", error);
      });
  });
} else {
  console.warn("Push messaging is not supported");
}

// Send request to database for add new subscriber
function saveSubscription(subscribe) {
  let xmlHttp = new XMLHttpRequest();
  xmlHttp.open("POST", "http://localhost:5500/subscribe");
  xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState != 4) return;
    if (xmlHttp.status != 200 && xmlHttp.status != 304) {
      console.log("HTTP error " + xmlHttp.status, null);
    } else {
      console.log("User subscribed to server");
    }
  };

  xmlHttp.send(JSON.stringify(subscribe));
}
