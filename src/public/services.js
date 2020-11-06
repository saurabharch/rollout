"use strict";
try {
  var pgSw = {};
  pgSw.config = {
    version: "2.2.0",
    api: {
      default: "http://localhost:5500/",
      analytics: "https://noti-analytics.pushengage.com/p/v1",
      log: "https://notify.pushengage.com/v1/logs"
    },
    siteId: "2",
    siteImage:
      "https://assetscdn.pushengage.com/site_images/f918a1521699808.png",
    siteUrl: "https://www.pushengage.com",
    siteName: "PushGeek",
    siteIsEu: "1",
    projectId: "360714148844",
    publicKey:
      "BLgFTwjElUH_Iz72TKDvmlsc-EcwziNP2X28BmN-znOXJhv35QybtfcN1HTh_eUlNffp12HkuruYpqtKNedN54s",
    welcomeNoti: {
      notification_title: "Welcome to PushGeek",
      notification_message:
        "Schedule a Demo With Us To Learn How to Use PushGeek Best",
      notification_url: "https://www.pushengage.com/schedule_demo",
      welcome_enabled: true
    },
    defaultNoti: {
      default_notification_title: "PushGeek",
      default_notification_message: "Click to see updates",
      default_notification_url: "https://www.pushengage.com"
    },
    amp: {
      state: {
        subscription: "amp-web-push-subscription-state",
        subscribe: "amp-web-push-subscribe",
        unsubscribe: "amp-web-push-unsubscribe"
      }
    },
    shopifyCustomSw: { type: "none", url: "" },
    privacySettings: { geoLocationEnabled: true }
  };
  if (
    pgSw.config.shopifyCustomSw.type == "merge" &&
    pgSw.config.shopifyCustomSw.url != ""
  ) {
    importScripts("");
  }
  (pgSw.browser = function() {
    var e,
      t,
      i = navigator.userAgent,
      n =
        i.match(
          /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i
        ) || [];
    return -1 !=
    (t = -1 == i.indexOf("Edge") ? i.indexOf("EdgA") : i.indexOf("Edge"))
      ? (
          (e = i.substring(t, t + 7).split("/")),
          { name: "Edge", version: e[1] || "" }
        )
      : -1 != (t = i.indexOf("Edg"))
        ? (
            (e = i.substring(t, t + 6).split("/")),
            { name: "Edge", version: e[1] || "" }
          )
        : /trident/i.test(n[1])
          ? (
              (e = /\brv[ :]+(\d+)/g.exec(i) || []),
              { name: "IE", version: e[1] || "" }
            )
          : -1 != (t = i.indexOf("UCBrowser"))
            ? (
                (e = i.substring(t, t + 12).split("/")),
                { name: "Ucbrowser", version: e[1] || "" }
              )
            : -1 != (t = i.indexOf("OPR"))
              ? (
                  (e = i.substring(t, t + 6).split("/")),
                  { name: "Opera", version: e[1] || "" }
                )
              : -1 != (t = i.indexOf("YaBrowser"))
                ? (
                    (e = i.substring(t, t + 12).split("/")),
                    { name: "Yandex", version: e[1] || "" }
                  )
                : (
                    (n = n[2]
                      ? [n[1], n[2]]
                      : [navigator.appName, navigator.appVersion, "-?"]),
                    null != (e = i.match(/version\/(\d+)/i)) &&
                      n.splice(1, 1, e[1]),
                    { name: n[0], version: n[1] }
                  );
  }), (pgSw.deviceType = function() {
    var e = "desktop";
    return (e = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
      ? "mobile"
      : e);
  }), (pgSw.publicKeyForBrowser = function(e) {
    for (
      var t = (e + "=".repeat((4 - e.length % 4) % 4))
          .replace(/\-/g, "+")
          .replace(/_/g, "/"),
        i = atob(t),
        n = new Uint8Array(i.length),
        o = 0;
      o < i.length;
      ++o
    )
      n[o] = i.charCodeAt(o);
    return n;
  }), (pgSw.getTimezone = function() {
    var e = "+00:00";
    try {
      var t = Date().match(/([\+-][0-9]+)/)[0].split("");
      e = t[0] + t[1] + t[2] + ":" + t[3] + t[4];
    } catch (e) {}
    return e;
  }), (pgSw.getDeviceID = function(e) {
    return e.indexOf("token=") > -1
      ? e.slice(e.search("token=") + 6)
      : e.split("/")[e.split("/").length - 1];
  }), (pgSw.verifyFcmGcmEndpoint = function(e) {
    return (
      -1 == e.indexOf("android.googleapis.com/gcm") &&
      -1 == e.indexOf("updates.push.services.mozilla.com/wpush/v1")
    );
  }), (pgSw.welcomeNoti = function() {
    var e = {
      body: pgSw.config.welcomeNoti.notification_message,
      tag: "welcome_notification" + pgSw.config.siteId,
      icon: pgSw.config.siteImage,
      data: pgSw.config.welcomeNoti.notification_url
    };
    return pgSw.showNotification(pgSw.config.welcomeNoti.notification_title, e);
  }), (pgSw.defaultNoti = function() {
    var e = {
      body: pgSw.config.defaultNoti.default_notification_message,
      icon: pgSw.config.siteImage,
      tag: "welcome_notification" + pgSw.config.siteId,
      data: pgSw.config.defaultNoti.default_notification_url,
      requireInteraction: !1
    };
    return pgSw.showNotification(
      pgSw.config.defaultNoti.default_notification_title,
      e
    );
  }), (pgSw.click = function(e, t) {
    var i = e.notification.tag;
    return (
      !i ||
      -1 != i.indexOf("welcome_notification") ||
      e.waitUntil(
        self.registration.pushManager.getSubscription().then(function(n) {
          var o = n.endpoint ? pgSw.getDeviceID(n.endpoint) : "",
            a =
              pgSw.config.api.analytics +
              "/notification/click?swv=" +
              pgSw.config.version +
              "&bv=" +
              pgSw.browser().version +
              "&device=" +
              o +
              "&tag=" +
              i +
              "&action=" +
              t +
              "&tz=" +
              pgSw.getTimezone();
          return fetch(a)
            .then(function(e) {
              if (e) {
                if (e.status >= 500)
                  throw new TypeError(
                    "Failed to record click. status:" + e.status
                  );
                if (e.status >= 400)
                  throw new Error("Invalid click params. status:" + e.status);
                console.log("response from click");
              }
            })
            .catch(function(o) {
              pgSw.logError({
                name: o.name + ": Click count",
                message: o.message,
                endpoint: n.endpoint,
                tag: i,
                action: t,
                data: { notification: e.notification },
                stacktrace: o.stack.toString()
              });
            });
        })
      )
    );
  }), (pgSw.openUrl = function(e) {
    return clients.matchAll({ type: "window" }).then(function(t) {
      for (var i = 0; i < t.length; i++) {
        var n = t[i];
        if (n.url === e && "focus" in n) return n.focus();
      }
      if (clients.openWindow) return clients.openWindow(e);
    });
  }), (pgSw.onMessageReceivedSubscriptionState = function() {
    var e = null;
    self.registration.pushManager
      .getSubscription()
      .then(function(t) {
        return (e = t), t ? self.registration.pushManager.permissionState(t.options) : null;
      })
      .then(function(t) {
        if (null == t)
          pgSw.broadcastReply(pgSw.config.amp.state.subscription, !1);
        else {
          var i = !!e && "granted" === t;
          pgSw.broadcastReply(pgSw.config.amp.state.subscription, i);
        }
      });
  }), (pgSw.onMessageReceivedSubscribe = function() {
    self.registration.pushManager
      .subscribe({
        userVisibleOnly: !0,
        applicationServerKey: pgSw.publicKeyForBrowser(pgSw.config.publicKey)
      })
      .then(function(e) {
        try {
          var t = JSON.parse(JSON.stringify(e));
          (t.project_id =
            pgSw.config.projectId), (t.vapid_public_key = pgSw.config.publicKey);
        } catch (e) {
          return void pgSw.logError({
            name: "subscriptionParsingFailed",
            message: e.message,
            data: i,
            stacktrace: e.stack.toString()
          });
        }
        pgSw.broadcastReply(pgSw.config.amp.state.subscribe, null);
        var i = {
            site_id: Number(pgSw.config.siteId),
            browser_info: {
              device_type: pgSw.browser().name,
              browser_version: pgSw.browser().name,
              user_agent: navigator.userAgent,
              language: navigator.language,
              host: location.host,
              device: pgSw.deviceType(),
              pe_ref_url: location.origin
            },
            subscription: t,
            subscription_url: location.href || location.origin,
            geo_info: { geobytestimezone: pgSw.getTimezone() },
            token_refresh: !1,
            optin_type: 4
          },
          n = pgSw.config.privacySettings.geoLocationEnabled ? 1 : 0,
          o =
            pgSw.config.api.default +
            "/subscriber/add?geo_fetch=" +
            n +
            "&is_eu=" +
            pgSw.config.siteIsEu,
          a = {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json"
            },
            body: JSON.stringify(i)
          };
        console.log(i);
        fetch(o, a)
          .then(function(e) {
            if (e.status >= 500)
              throw new Error("Failed to record subscription");
            if (e.status >= 400) throw new Error("Invalid subscription data");
            console.log(
              "new subscription added"
            ), pgSw.config.welcomeNoti && 1 == pgSw.config.welcomeNoti.welcome_enabled && pgSw.welcomeNoti();
          })
          .catch(function(e) {
            pgSw.logError({
              name: "recordSubscriptionFailed",
              message: e.message,
              data: i,
              stacktrace: e.stack.toString()
            });
          });
      });
  }), (pgSw.onMessageReceivedUnsubscribe = function() {
    self.registration.pushManager
      .getSubscription()
      .then(function(e) {
        return !e || e.unsubscribe();
      })
      .then(function(e) {
        pgSw.broadcastReply(pgSw.config.amp.state.unsubscribe, null);
      })
      .catch(function(e) {
        pgSw.broadcastReply(pgSw.config.amp.state.unsubscribe, null);
      });
  }), (pgSw.broadcastReply = function(e, t) {
    self.clients.matchAll().then(function(i) {
      for (var n = 0; n < i.length; n++)
        i[n].postMessage({ command: e, payload: t });
    });
  }), (pgSw.log = function(e) {
    return Promise.all[(pgSw.defaultNoti(), pgSw.logError(e))];
  }), (pgSw.logError = function(e) {
    var t = e;
    (t.site_id = pgSw.config.siteId), (t.swv =
      pgSw.config.version), (t.bw = pgSw.browser()), (t.app =
      "service-worker"), console.log(t);
    var i = {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify(t),
      headers: { "Content-Type": "application/json" }
    };
    return fetch(pgSw.config.api.log, i).catch(function() {});
  }), (pgSw.showNotification = function(e, t, i) {
    if (t.tag && t.tag.indexOf("welcome_notification") >= 0)
      return self.registration.showNotification(e, t);
    t.actions &&
      Array.isArray(t.actions) &&
      t.actions.forEach(function(e) {
        null == e.icon && delete e.icon;
      }), t.viewUrl &&
      fetch(pgSw.config.api.analytics + "/notification/view/refer?tag=" + t.tag)
        .then(function(e) {
          if (e.status >= 500) throw new Error("Failed to record impression");
          if (e.status >= 400) throw new Error("Invalid impression params");
          console.log("response from view url refer");
        })
        .catch(function(e) {
          pgSw.logError({
            name: e.name + ": Impression url",
            message: e.message,
            endpoint: i.endpoint,
            data: t,
            stacktrace: e.stack.toString()
          });
        });
    var n = (i && i.endpoint) || "",
      o =
        pgSw.config.api.analytics +
        "/notification/view?device=" +
        pgSw.getDeviceID(n) +
        "&swv=" +
        pgSw.config.version +
        "&bv=" +
        pgSw.browser().version +
        "&tag=" +
        t.tag +
        "&tz=" +
        pgSw.getTimezone();
    return fetch(o)
      .then(function(i) {
        if (i.status >= 500)
          throw new TypeError("Failed to record view. status:" + i.status);
        if (i.status >= 400)
          throw new Error("Invalid view params. status:" + i.status);
        return console.log(
          "response from view"
        ), self.registration.showNotification(e, t);
      })
      .catch(function(n) {
        return pgSw.logError({
          name: n.name + ": View count",
          message: n.message,
          endpoint: i.endpoint,
          data: t,
          stacktrace: n.stack.toString()
        }), self.registration.showNotification(e, t);
      });
  }), self.addEventListener("activate", function(e) {
    console.log("service worker activate"), e.waitUntil(self.clients.claim());
  }), self.addEventListener("install", function(e) {
    e.waitUntil(self.skipWaiting());
  }), self.addEventListener("message", function(e) {
    if (e.data && e.data.command)
      switch (e.data.command) {
        case pgSw.config.amp.state.subscription:
          pgSw.onMessageReceivedSubscriptionState();
          break;
        case pgSw.config.amp.state.subscribe:
          pgSw.onMessageReceivedSubscribe();
          break;
        case pgSw.config.amp.state.unsubscribe:
          pgSw.onMessageReceivedUnsubscribe();
      }
  }), self.addEventListener("push", function(e) {
    e.waitUntil(
      self.registration.pushManager.getSubscription().then(function(t) {
        if (!t || !t.endpoint)
          return pgSw.log({
            name: "Service Worker",
            message: "Getting error in subscription data",
            data: { subscription: t }
          });
        if (e.data)
          try {
            if ("object" == typeof e.data.json()) {
              var i = e.data.json();
              if (
                i[0] &&
                void 0 !== i[0].title &&
                i[0].options &&
                i[0].options.tag
              )
                return pgSw.showNotification(i[0].title, i[0].options, t);
            }
            return pgSw.defaultNoti();
          } catch (i) {
            return pgSw.log({
              name: i.name,
              message: i.message,
              data: { subscription: t, eventData: e.data.text() },
              stacktrace: i.stack.toString()
            });
          }
        var n =
          pgSw.config.api.default +
          "/notification?swv=" +
          pgSw.config.version +
          "&bv=" +
          pgSw.browser().version +
          "&device=" +
          pgSw.getDeviceID(t.endpoint);
        return fetch(n)
          .then(function(e) {
            return e.json().then(function(e) {
              return e &&
              Array.isArray(e) &&
              e.length &&
              void 0 !== e[0].title &&
              e[0].options
                ? pgSw.showNotification(e[0].title, e[0].options, t)
                : pgSw.log({
                    name: "invalidNotificationData",
                    message: "Bad payloadless notifications",
                    endPoint: t.endpoint,
                    data: e
                  });
            });
          })
          .catch(function(e) {
            return pgSw.log({
              name: e.name,
              message:
                "Failed to display payloadless notification. " + e.message,
              data: { subscription: t }
            });
          });
      })
    );
  }), self.addEventListener("notificationclick", function(e) {
    var t = "action3",
      i = [],
      n = e.notification.tag,
      o = e.notification.data,
      a = {};
    if ((e.notification.close(), e.action))
      try {
        a = JSON.parse(e.action);
      } catch (t) {
        pgSw.logError({
          name: "actionParsingFailed",
          message: t.message,
          data: { action: e.action, tag: n },
          stacktrace: t.stack.toString()
        });
      }
    "action1" == a.action
      ? ((t = "action1"), (o = a.action_url || o))
      : "action2" == a.action &&
        (
          (t = "action2"),
          (o = a.action_url || o)
        ), (o = o || "/"), i.push(pgSw.click(e, t)), i.push(pgSw.openUrl(o)), e.waitUntil(Promise.all(i));
  }), self.addEventListener("pushsubscriptionchange", function(e) {
    e.waitUntil(
      self.registration.pushManager
        .getSubscription()
        .then(function(t) {
          if (
            e.oldSubscription &&
            e.newSubscription &&
            "granted" == Notification.permission
          ) {
            try {
              var i = JSON.parse(JSON.stringify(e.oldSubscription)),
                n = JSON.parse(JSON.stringify(e.newSubscription));
            } catch (e) {
              return pgSw.logError({
                name: "subscriptionChangeParsingFailed",
                message: e.message,
                data: o,
                stacktrace: e.stack.toString()
              });
            }
            var o = {
              oldSubscription: i,
              newSubscription: {
                subscription: n,
                browser_info: {
                  device_type: pgSw.browser().name,
                  browser_version: pgSw.browser().version
                },
                site_id: pgSw.config.siteId,
                token_refresh: !0
              }
            };
            (o.endpoint = t
              ? t.endpoint
              : null), (o.newSubscription.subscription.project_id =
              pgSw.config.projectId), pgSw.verifyFcmGcmEndpoint(
              o.newSubscription.subscription.endpoint
            ) &&
              (o.newSubscription.subscription.vapid_public_key =
                pgSw.config.publicKey);
            var a =
              pgSw.config.api.default +
              "/subscriber/change?swv=" +
              pgSw.config.version +
              "&subscription=" +
              JSON.stringify(o);
            return fetch(a)
              .then(function(e) {
                if (e.status >= 500)
                  throw new Error(
                    "Failed to record subscription change. status:" + e.status
                  );
                if (e.status >= 400)
                  throw new Error(
                    "Invalid subscription change payload. status: " + e.status
                  );
                console.log("response from subscription change");
              })
              .catch(function(e) {
                return pgSw.logError({
                  name: "subscriptionChangeRecordFailed",
                  message: e.message,
                  data: o,
                  stacktrace: e.stack.toString()
                });
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
