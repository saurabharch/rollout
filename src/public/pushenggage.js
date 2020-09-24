"use strict";
try {
  var pgSW = {};
  pgSW.config = {
    version: "2.2.0",
    api: {
      default: "http://localhost:5500/push",
      analytics: "",
      log: "https://localhost:5500/"
    },
    siteId: "2",
    siteImage: "https://assetscdn.pushgeek.com/site_images/f918a1521699808.png",
    siteUrl: "https://www.pushgeek.com",
    siteName: "RollOut",
    projectId: "360714148844",
    publicKey:
      "BLgFTwjElUH_Iz72TKDvmlsc-EcwziNP2X28BmN-znOXJhv35QybtfcN1HTh_eUlNffp12HkuruYpqtKNedN54s",
    welcomeNoti: {
      notification_title: "Welcome to RollOut",
      notification_message: " Thanks for subscribing to push notifications",
      notification_url: "http://www.pushgeek.com",
      welcome_enabled: "true"
    },
    defaultNoti: {
      default_notification_title: "RollOut",
      default_notification_message: "Click to see updates",
      default_notification_url: "https://www.pushgeek.com"
    },
    amp: {
      state: {
        subscription: "amp-web-push-subscription-state",
        subscribe: "amp-web-push-subscribe",
        unsubscribe: "amp-web-push-unsubscribe"
      }
    }
  };
  pgSW.browser = function() {
    var ua = navigator.userAgent,
      tem,
      uai,
      M =
        ua.match(
          /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i
        ) || [];
    uai = ua.indexOf("Edge") == -1 ? ua.indexOf("EdgA") : ua.indexOf("Edge");
    if (uai != -1) {
      tem = ua.substring(uai, uai + 7).split("/");
      return {
        name: "Edge",
        version: tem[1] || ""
      };
    }
    if (/trident/i.test(M[1])) {
      tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
      return {
        name: "IE",
        version: tem[1] || ""
      };
    }
    uai = ua.indexOf("UCBrowser");
    if (uai != -1) {
      tem = ua.substring(uai, uai + 12).split("/");
      return {
        name: "Ucbrowser",
        version: tem[1] || ""
      };
    }
    uai = ua.indexOf("OPR");
    if (uai != -1) {
      tem = ua.substring(uai, uai + 6).split("/");
      return {
        name: "Opera",
        version: tem[1] || ""
      };
    }
    uai = ua.indexOf("YaBrowser");
    if (uai != -1) {
      tem = ua.substring(uai, uai + 12).split("/");
      return {
        name: "Yandex",
        version: tem[1] || ""
      };
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, "-?"];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) {
      M.splice(1, 1, tem[1]);
    }
    return {
      name: M[0],
      version: M[1]
    };
  };
  pgSW.deviceType = function() {
    var dTCheck = "desktop";
    dTCheck = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
      ? "mobile"
      : dTCheck;
    return dTCheck;
  };
  pgSW.publicKeyForBrowser = function(base64String) {
    var padding = "=".repeat((4 - base64String.length % 4) % 4);
    var base64 = (base64String + padding)
      .replace(/\-/g, "+")
      .replace(/_/g, "/");
    var rawData = atob(base64);
    var outputArray = new Uint8Array(rawData.length);
    for (var i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };
  pgSW.getDeviceID = function(endpoint) {
    var device_id = "";
    if (endpoint.indexOf("token=") > -1) {
      device_id = endpoint.slice(endpoint.search("token=") + 6);
    } else {
      device_id = endpoint.split("/")[endpoint.split("/").length - 1];
    }
    return device_id;
  };
  pgSW.verifyFcmGcmEndpoint = function(endpoint) {
    if (
      endpoint.indexOf("android.googleapis.com/gcm") != -1 ||
      endpoint.indexOf("updates.push.services.mozilla.com/wpush/v1") != -1
    ) {
      return !1;
    }
    return !0;
  };
  pgSW.welcomeNoti = function(callback) {
    var options = {
      body: pgSW.config.welcomeNoti.notification_message,
      tag: "welcome_notification" + pgSW.config.siteId,
      icon: pgSW.config.siteImage,
      data: pgSW.config.welcomeNoti.notification_url
    };
    return pgSW.showNotification(
      pgSW.config.welcomeNoti.notification_title,
      options
    );
  };
  pgSW.click = function(event, usr_action) {
    var tag = event.notification.tag;
    if (tag.indexOf("welcome_notification") == -1) {
      return event.waitUntil(
        self.registration.pushManager.getSubscription().then(function(o) {
          var device = o.endpoint ? pgSW.getDeviceID(o.endpoint) : "";
          return fetch(
            pgSW.config.api.analytics +
              "/notification/click?swv=" +
              pgSW.config.version +
              "&bv=" +
              pgSW.browser().version +
              "&device=" +
              device +
              "&tag=" +
              tag +
              "&action=" +
              usr_action
          )
            .then(function(response) {
              console.log("response from click");
            })
            .catch(function(e) {
              pgSW.logError({
                name: e.name + ": Click count",
                message: e.message,
                endpoint: o.endpoint,
                tag: tag,
                action: usr_action,
                stacktrace: e.stack.toString()
              });
            });
        })
      );
    }
    return !0;
  };
  pgSW.openUrl = function(url) {
    return clients
      .matchAll({
        type: "window"
      })
      .then(function(clientList) {
        for (var i = 0; i < clientList.length; i++) {
          var client = clientList[i];
          if (client.url === url && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      });
  };
  pgSW.onMessageReceivedSubscriptionState = function() {
    let retrievedPushSubscription = null;
    self.registration.pushManager
      .getSubscription()
      .then(pushSubscription => {
        retrievedPushSubscription = pushSubscription;
        if (!pushSubscription) {
          return null;
        } else {
          return self.registration.pushManager.permissionState(
            pushSubscription.options
          );
        }
      })
      .then(permissionStateOrNull => {
        if (permissionStateOrNull == null) {
          pgSW.broadcastReply(pgSW.config.amp.state.subscription, !1);
        } else {
          const isSubscribed =
            !!retrievedPushSubscription && permissionStateOrNull === "granted";
          pgSW.broadcastReply(pgSW.config.amp.state.subscription, isSubscribed);
        }
      });
  };
  pgSW.onMessageReceivedSubscribe = function() {
    self.registration.pushManager
      .subscribe({
        userVisibleOnly: !0,
        applicationServerKey: pgSW.publicKeyForBrowser(pgSW.config.publicKey)
      })
      .then(sub => {
        try {
          var subscription = JSON.parse(JSON.stringify(sub));
          subscription.project_id = pgSW.config.projectId;
          subscription.vapid_public_key = pgSW.config.publicKey;
        } catch (e) {
          console.log("failde to parse json");
          return;
        }
        var payload = {
          site_id: Number(pgSW.config.siteId),
          browser_info: {
            device_type: pgSW.browser().name,
            browser_version: pgSW.browser().name,
            user_agent: navigator.userAgent,
            language: navigator.language,
            host: location.host,
            device: pgSW.deviceType(),
            pe_ref_url: location.origin
          },
          subscription: subscription,
          subscription_url: location.origin,
          geo_info: {},
          token_refresh: !1,
          optin_type: 4
        };
        fetch(
          pgSW.config.api.default +
            "/subscriber/add?swv=" +
            pgSW.config.version +
            "&subscription=" +
            JSON.stringify(payload)
        )
          .then(function(response) {
            console.log("new subscription added");
            if (
              pgSW.config.welcomeNoti &&
              pgSW.config.welcomeNoti.welcome_enabled == "true"
            ) {
              pgSW.welcomeNoti(function(res) {});
            }
            pgSW.broadcastReply(pgSW.config.amp.state.subscribe, null);
          })
          .catch(function(e) {
            pgSW.broadcastReply(pgSW.config.amp.state.subscribe, null);
            console.log(e);
          });
      });
  };
  pgSW.onMessageReceivedUnsubscribe = function() {
    self.registration.pushManager
      .getSubscription()
      .then(subscription => subscription.unsubscribe())
      .then(() => {
        pgSW.broadcastReply(pgSW.config.amp.state.unsubscribe, null);
      });
  };
  pgSW.broadcastReply = function(command, payload) {
    self.clients.matchAll().then(clients => {
      for (let i = 0; i < clients.length; i++) {
        const client = clients[i];
        client.postMessage({
          command,
          payload
        });
      }
    });
  };
  pgSW.log = function(e) {
    var options = {
      body: pgSW.config.defaultNoti.default_notification_message,
      icon: pgSW.config.siteImage,
      tag: "welcome_notification" + pgSW.config.siteId,
      data: pgSW.config.defaultNoti.default_notification_url,
      requireInteraction: !1
    };
    return pgSW.logError(e, options);
  };
  pgSW.logError = function(e, notiOptions) {
    var error = e;
    var errorTitle = pgSW.config.defaultNoti.default_notification_title;
    error.site_id = pgSW.config.siteId;
    error.swv = pgSW.config.version;
    error.bw = pgSW.browser();
    error.app = "service-worker";
    console.log(error);
    return fetch(pgSW.config.api.log, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify(error),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(function(res) {
        console.log("Success:", res);
        if (notiOptions)
          return self.registration.showNotification(errorTitle, notiOptions);
      })
      .catch(function(err) {
        console.error("Error:", err);
        if (notiOptions)
          return self.registration.showNotification(errorTitle, notiOptions);
      });
  };
  pgSW.showNotification = function(t, n, o) {
    if (n.hasOwnProperty("actions")) {
      if (
        typeof n.actions[0] != "undefined" &&
        n.actions[0].hasOwnProperty("icon") &&
        n.actions[0].icon == null
      ) {
        delete n.actions[0].icon;
      }
      if (
        typeof n.actions[1] != "undefined" &&
        n.actions[1].hasOwnProperty("icon") &&
        n.actions[1].icon == null
      ) {
        delete n.actions[1].icon;
      }
    }
    if (typeof n.viewUrl != "undefined") {
      fetch(pgSW.config.api.analytics + "/notification/view/refer?tag=" + n.tag)
        .then(function(response) {
          console.log("response from view url refer");
          return;
        })
        .catch(function(e) {
          pgSW.logError({
            name: e.name + ": Impression url",
            message: e.message,
            endpoint: o.endpoint,
            data: n,
            stacktrace: e.stack.toString()
          });
        });
    }
    return fetch(
      pgSW.config.api.analytics +
        "/notification/view?device=" +
        pgSW.getDeviceID(o.endpoint) +
        "&swv=" +
        pgSW.config.version +
        "&bv=" +
        pgSW.browser().version +
        "&tag=" +
        n.tag
    )
      .then(function(response) {
        console.log("response from view ");
        return self.registration.showNotification(t, n);
      })
      .catch(function(e) {
        pgSW.logError({
          name: e.name + ": View count",
          message: e.message,
          endpoint: o.endpoint,
          data: n,
          stacktrace: e.stack.toString()
        });
        return self.registration.showNotification(t, n);
      });
  };
  self.addEventListener("activate", event => {
    console.log("service worker activate");
    event.waitUntil(self.clients.claim());
  });
  self.addEventListener("install", function(event) {
    event.waitUntil(self.skipWaiting());
  });
  self.addEventListener("message", event => {
    const { command } = event.data;
    switch (command) {
      case pgSW.config.amp.state.subscription:
        pgSW.onMessageReceivedSubscriptionState();
        break;
      case pgSW.config.amp.state.subscribe:
        pgSW.onMessageReceivedSubscribe();
        break;
      case pgSW.config.amp.state.unsubscribe:
        pgSW.onMessageReceivedUnsubscribe();
        break;
    }
  });
  self.addEventListener("push", function(event) {
    event.waitUntil(
      self.registration.pushManager.getSubscription().then(function(o) {
        if (o && typeof o.endpoint != "undefined" && o.endpoint) {
          if (event.data) {
            try {
              if (typeof event.data.json() == "object") {
                var json = event.data.json(),
                  index = 0;
                if (
                  typeof json[index].title != "undefined" &&
                  typeof json[index].options != "undefined" &&
                  typeof json[index].options.tag != "undefined" &&
                  json[index].options.tag
                ) {
                  return pgSW.showNotification(
                    json[index].title,
                    json[index].options,
                    o
                  );
                } else {
                  return pgSW.log({
                    name: "Bad Request",
                    message: "Required field is missing",
                    endPoint: o.endpoint,
                    data: json
                  });
                }
              } else {
                return pgSW.log({
                  name: "Bad Request",
                  message: "Bad notification data format",
                  endPoint: o.endpoint
                });
              }
            } catch (e) {
              return pgSW.log({
                name: e.name,
                message: e.message,
                endPoint: o.endpoint,
                stacktrace: e.stack.toString()
              });
            }
          } else {
            return fetch(
              pgSW.config.api.default +
                "/notification?swv=" +
                pgSW.config.version +
                "&bv=" +
                pgSW.browser().version +
                "&device=" +
                pgSW.getDeviceID(o.endpoint)
            ).then(function(response) {
              return response.json().then(function(jsondata) {
                var json = jsondata;
                if (
                  typeof json[0].title != "undefined" &&
                  typeof json[0].options != "undefined"
                )
                  return pgSW.showNotification(
                    json[0].title,
                    json[0].options,
                    o
                  );
                else
                  return pgSW.log({
                    name: "Bad Request",
                    message: "Required Field is missing",
                    endPoint: o.endpoint,
                    data: jsondata
                  });
              });
            });
          }
        } else {
          return pgSW.log({
            name: "Service Worker",
            message: "Getting error in subscription data"
          });
        }
      })
    );
  });
  self.addEventListener("notificationclick", function(event) {
    var usr_action = "",
      notiPromiseArr = [],
      notification_url = event.notification.data,
      action_str = "";
    event.notification.close();
    if (event.action != "" && typeof event.action != "undefined") {
      try {
        action_str = JSON.parse(event.action);
      } catch (e) {
        console.log("faild to parse: ", e);
        return;
      }
    }
    if (action_str == "") {
      usr_action = "action3";
      notification_url = event.notification.data;
    } else {
      if (action_str.action == "action1") {
        usr_action = "action1";
        notification_url = action_str.action_url;
      } else if (action_str.action == "action2") {
        usr_action = "action2";
        notification_url = action_str.action_url;
      }
    }
    notification_url = notification_url || "/";
    notiPromiseArr.push(pgSW.openUrl(notification_url));
    notiPromiseArr.push(pgSW.click(event, usr_action));
    event.waitUntil(Promise.all(notiPromiseArr));
  });
  self.addEventListener("pushsubscriptionchange", function(event) {
    event.waitUntil(
      self.registration.pushManager
        .getSubscription()
        .then(function(subscription) {
          if (
            event.oldSubscription &&
            event.newSubscription &&
            Notification.permission == "granted"
          ) {
            try {
              var oldSubscription = JSON.parse(
                JSON.stringify(event.oldSubscription)
              );
              var newSubscription = JSON.parse(
                JSON.stringify(event.newSubscription)
              );
            } catch (e) {
              console.log("faild to parse josn");
              return;
            }
            var payload = {
              oldSubscription: oldSubscription,
              newSubscription: {
                subscription: newSubscription,
                browser_info: {
                  device_type: pgSW.browser().name,
                  browser_version: pgSW.browser().version
                },
                site_id: pgSW.config.siteId,
                token_refresh: !0
              }
            };
            payload.endpoint = subscription ? subscription.endpoint : null;
            payload.newSubscription.subscription.project_id =
              pgSW.config.projectId;
            if (
              pgSW.verifyFcmGcmEndpoint(
                payload.newSubscription.subscription.endpoint
              )
            ) {
              payload.newSubscription.subscription.vapid_public_key =
                pgSW.config.publicKey;
            }
            fetch(
              pgSW.config.api.default +
                "/subscriber/change?swv=" +
                pgSW.config.version +
                "&subscription=" +
                JSON.stringify(payload)
            )
              .then(function(response) {
                console.log("response from subscription change");
              })
              .catch(function(e) {
                console.log(e);
              });
          }
        })
        .catch(function(e) {
          console.log(e);
        })
    );
  });
} catch (e) {
  console.log(e);
}
