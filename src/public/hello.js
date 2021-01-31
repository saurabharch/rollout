"use strict";
try {
    var peSw = {};
    peSw.config = {
        version: "2.2.0",
        api: {
            default: "https://sw.pushengage.com/p/v1",
            analytics: "https://noti-analytics.pushengage.com/p/v1",
            log: "https://notify.pushengage.com/v1/logs"
        },
        siteId: "2",
        siteImage: "https://assetscdn.pushengage.com/site_images/f918a1521699808.png",
        siteUrl: "https://www.pushengage.com",
        siteName: "PushEngage",
        siteIsEu: "1",
        projectId: "360714148844",
        publicKey: "BPwe3v3QZOBIHqS2KrinGujpCGPtnjC6-Kr2cD2K6xTRK--PQQA8xSfM3PNX4_ujgqGCqU_X7d7yO0hTgQdhOWU",
        welcomeNoti: {
            "notification_title": "Welcome to PushEngage",
            "notification_message": "Schedule a Demo With Us To Learn How to Use PushEngage Best",
            "notification_url": "https:\/\/www.pushengage.com\/schedule_demo",
            "welcome_enabled": false
        },
        defaultNoti: {
            "default_notification_title": "PushEngage",
            "default_notification_message": "Click to see updates",
            "default_notification_url": "https:\/\/www.pushengage.com"
        },
        amp: {
            state: {
                subscription: 'amp-web-push-subscription-state',
                subscribe: 'amp-web-push-subscribe',
                unsubscribe: 'amp-web-push-unsubscribe'
            }
        },
        shopifyCustomSw: {
            type: "none",
            url: ""
        },
        privacySettings: {
            "geoLocationEnabled": true
        },
    };
    if (peSw.config.shopifyCustomSw.type == "merge" && peSw.config.shopifyCustomSw.url != "") {
        importScripts("")
    }
    peSw.browser = function() {
        var e, t, i = navigator.userAgent, n = i.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        return -1 != (t = -1 == i.indexOf("Edge") ? i.indexOf("EdgA") : i.indexOf("Edge")) ? (e = i.substring(t, t + 7).split("/"),
        {
            name: "Edge",
            version: e[1] || ""
        }) : -1 != (t = i.indexOf("Edg")) ? (e = i.substring(t, t + 6).split("/"),
        {
            name: "Edge",
            version: e[1] || ""
        }) : /trident/i.test(n[1]) ? (e = /\brv[ :]+(\d+)/g.exec(i) || [],
        {
            name: "IE",
            version: e[1] || ""
        }) : -1 != (t = i.indexOf("UCBrowser")) ? (e = i.substring(t, t + 12).split("/"),
        {
            name: "Ucbrowser",
            version: e[1] || ""
        }) : -1 != (t = i.indexOf("OPR")) ? (e = i.substring(t, t + 6).split("/"),
        {
            name: "Opera",
            version: e[1] || ""
        }) : -1 != (t = i.indexOf("YaBrowser")) ? (e = i.substring(t, t + 12).split("/"),
        {
            name: "Yandex",
            version: e[1] || ""
        }) : (n = n[2] ? [n[1], n[2]] : [navigator.appName, navigator.appVersion, "-?"],
        null != (e = i.match(/version\/(\d+)/i)) && n.splice(1, 1, e[1]),
        {
            name: n[0],
            version: n[1]
        })
    }
    ,
    peSw.deviceType = function() {
        var e = "desktop";
        return e = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? "mobile" : e
    }
    ,
    peSw.publicKeyForBrowser = function(e) {
        for (var t = (e + "=".repeat((4 - e.length % 4) % 4)).replace(/\-/g, "+").replace(/_/g, "/"), i = atob(t), n = new Uint8Array(i.length), o = 0; o < i.length; ++o)
            n[o] = i.charCodeAt(o);
        return n
    }
    ,
    peSw.getTimezone = function() {
        var e = "+00:00";
        try {
            var t = Date().match(/([\+-][0-9]+)/)[0].split("");
            e = t[0] + t[1] + t[2] + ":" + t[3] + t[4]
        } catch (e) {}
        return e
    }
    ,
    peSw.getDeviceID = function(e) {
        return e.indexOf("token=") > -1 ? e.slice(e.search("token=") + 6) : e.split("/")[e.split("/").length - 1]
    }
    ,
    peSw.verifyFcmGcmEndpoint = function(e) {
        return -1 == e.indexOf("android.googleapis.com/gcm") && -1 == e.indexOf("updates.push.services.mozilla.com/wpush/v1")
    }
    ,
    peSw.welcomeNoti = function() {
        var e = {
            body: peSw.config.welcomeNoti.notification_message,
            tag: "welcome_notification" + peSw.config.siteId,
            icon: peSw.config.siteImage,
            data: peSw.config.welcomeNoti.notification_url
        };
        return peSw.showNotification(peSw.config.welcomeNoti.notification_title, e)
    }
    ,
    peSw.defaultNoti = function() {
        var e = {
            body: peSw.config.defaultNoti.default_notification_message,
            icon: peSw.config.siteImage,
            tag: "welcome_notification" + peSw.config.siteId,
            data: peSw.config.defaultNoti.default_notification_url,
            requireInteraction: !1
        };
        return peSw.showNotification(peSw.config.defaultNoti.default_notification_title, e)
    }
    ,
    peSw.click = function(e, t) {
        var i = e.notification.tag;
        return !i || -1 != i.indexOf("welcome_notification") || e.waitUntil(self.registration.pushManager.getSubscription().then(function(n) {
            var o = n.endpoint ? peSw.getDeviceID(n.endpoint) : ""
              , a = peSw.config.api.analytics + "/notification/click?swv=" + peSw.config.version + "&bv=" + peSw.browser().version + "&device=" + o + "&tag=" + i + "&action=" + t + "&tz=" + peSw.getTimezone();
            return fetch(a).then(function(e) {
                if (e) {
                    if (e.status >= 500)
                        throw new TypeError("Failed to record click. status:" + e.status);
                    if (e.status >= 400)
                        throw new Error("Invalid click params. status:" + e.status);
                    console.log("response from click")
                }
            }).catch(function(o) {
                peSw.logError({
                    name: o.name + ": Click count",
                    message: o.message,
                    endpoint: n.endpoint,
                    tag: i,
                    action: t,
                    data: {
                        notification: e.notification
                    },
                    stacktrace: o.stack.toString()
                })
            })
        }))
    }
    ,
    peSw.openUrl = function(e) {
        return clients.matchAll({
            type: "window"
        }).then(function(t) {
            for (var i = 0; i < t.length; i++) {
                var n = t[i];
                if (n.url === e && "focus"in n)
                    return n.focus()
            }
            if (clients.openWindow)
                return clients.openWindow(e)
        })
    }
    ,
    peSw.onMessageReceivedSubscriptionState = function() {
        var e = null;
        self.registration.pushManager.getSubscription().then(function(t) {
            return e = t,
            t ? self.registration.pushManager.permissionState(t.options) : null
        }).then(function(t) {
            if (null == t)
                peSw.broadcastReply(peSw.config.amp.state.subscription, !1);
            else {
                var i = !!e && "granted" === t;
                peSw.broadcastReply(peSw.config.amp.state.subscription, i)
            }
        })
    }
    ,
    peSw.onMessageReceivedSubscribe = function() {
        self.registration.pushManager.subscribe({
            userVisibleOnly: !0,
            applicationServerKey: peSw.publicKeyForBrowser(peSw.config.publicKey)
        }).then(function(e) {
            try {
                var t = JSON.parse(JSON.stringify(e));
                t.project_id = peSw.config.projectId,
                t.vapid_public_key = peSw.config.publicKey
            } catch (e) {
                return void peSw.logError({
                    name: "subscriptionParsingFailed",
                    message: e.message,
                    data: i,
                    stacktrace: e.stack.toString()
                })
            }
            peSw.broadcastReply(peSw.config.amp.state.subscribe, null);
            var i = {
                site_id: Number(peSw.config.siteId),
                browser_info: {
                    device_type: peSw.browser().name,
                    browser_version: peSw.browser().name,
                    user_agent: navigator.userAgent,
                    language: navigator.language,
                    host: location.host,
                    device: peSw.deviceType(),
                    pe_ref_url: location.origin
                },
                subscription: t,
                subscription_url: location.href || location.origin,
                geo_info: {
                    geobytestimezone: peSw.getTimezone()
                },
                token_refresh: !1,
                optin_type: 4
            }
              , n = peSw.config.privacySettings.geoLocationEnabled ? 1 : 0
              , o = peSw.config.api.default + "/subscriber/add?geo_fetch=" + n + "&is_eu=" + peSw.config.siteIsEu
              , a = {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(i)
            };
            fetch(o, a).then(function(e) {
                if (e.status >= 500)
                    throw new Error("Failed to record subscription");
                if (e.status >= 400)
                    throw new Error("Invalid subscription data");
                console.log("new subscription added"),
                peSw.config.welcomeNoti && 1 == peSw.config.welcomeNoti.welcome_enabled && peSw.welcomeNoti()
            }).catch(function(e) {
                peSw.logError({
                    name: "recordSubscriptionFailed",
                    message: e.message,
                    data: i,
                    stacktrace: e.stack.toString()
                })
            })
        })
    }
    ,
    peSw.onMessageReceivedUnsubscribe = function() {
        self.registration.pushManager.getSubscription().then(function(e) {
            return !e || e.unsubscribe()
        }).then(function(e) {
            peSw.broadcastReply(peSw.config.amp.state.unsubscribe, null)
        }).catch(function(e) {
            peSw.broadcastReply(peSw.config.amp.state.unsubscribe, null)
        })
    }
    ,
    peSw.broadcastReply = function(e, t) {
        self.clients.matchAll().then(function(i) {
            for (var n = 0; n < i.length; n++)
                i[n].postMessage({
                    command: e,
                    payload: t
                })
        })
    }
    ,
    peSw.log = function(e) {
        return Promise.all[(peSw.defaultNoti(),
        peSw.logError(e))]
    }
    ,
    peSw.logError = function(e) {
        var t = e;
        t.site_id = peSw.config.siteId,
        t.swv = peSw.config.version,
        t.bw = peSw.browser(),
        t.app = "service-worker",
        console.log(t);
        var i = {
            method: "POST",
            mode: "no-cors",
            body: JSON.stringify(t),
            headers: {
                "Content-Type": "application/json"
            }
        };
        return fetch(peSw.config.api.log, i).catch(function() {})
    }
    ,
    peSw.showNotification = function(e, t, i) {
        if (t.tag && t.tag.indexOf("welcome_notification") >= 0)
            return self.registration.showNotification(e, t);
        t.actions && Array.isArray(t.actions) && t.actions.forEach(function(e) {
            null == e.icon && delete e.icon
        }),
        t.viewUrl && fetch(peSw.config.api.analytics + "/notification/view/refer?tag=" + t.tag).then(function(e) {
            if (e.status >= 500)
                throw new Error("Failed to record impression");
            if (e.status >= 400)
                throw new Error("Invalid impression params");
            console.log("response from view url refer")
        }).catch(function(e) {
            peSw.logError({
                name: e.name + ": Impression url",
                message: e.message,
                endpoint: i.endpoint,
                data: t,
                stacktrace: e.stack.toString()
            })
        });
        var n = i && i.endpoint || ""
          , o = peSw.config.api.analytics + "/notification/view?device=" + peSw.getDeviceID(n) + "&swv=" + peSw.config.version + "&bv=" + peSw.browser().version + "&tag=" + t.tag + "&tz=" + peSw.getTimezone();
        return fetch(o).then(function(i) {
            if (i.status >= 500)
                throw new TypeError("Failed to record view. status:" + i.status);
            if (i.status >= 400)
                throw new Error("Invalid view params. status:" + i.status);
            return console.log("response from view"),
            self.registration.showNotification(e, t)
        }).catch(function(n) {
            return peSw.logError({
                name: n.name + ": View count",
                message: n.message,
                endpoint: i.endpoint,
                data: t,
                stacktrace: n.stack.toString()
            }),
            self.registration.showNotification(e, t)
        })
    }
    ,
    self.addEventListener("activate", function(e) {
        console.log("service worker activate"),
        e.waitUntil(self.clients.claim())
    }),
    self.addEventListener("install", function(e) {
        e.waitUntil(self.skipWaiting())
    }),
    self.addEventListener("message", function(e) {
        if (e.data && e.data.command)
            switch (e.data.command) {
            case peSw.config.amp.state.subscription:
                peSw.onMessageReceivedSubscriptionState();
                break;
            case peSw.config.amp.state.subscribe:
                peSw.onMessageReceivedSubscribe();
                break;
            case peSw.config.amp.state.unsubscribe:
                peSw.onMessageReceivedUnsubscribe()
            }
    }),
    self.addEventListener("push", function(e) {
        e.waitUntil(self.registration.pushManager.getSubscription().then(function(t) {
            if (!t || !t.endpoint)
                return peSw.log({
                    name: "Service Worker",
                    message: "Getting error in subscription data",
                    data: {
                        subscription: t
                    }
                });
            if (e.data)
                try {
                    if ("object" == typeof e.data.json()) {
                        var i = e.data.json();
                        if (i[0] && void 0 !== i[0].title && i[0].options && i[0].options.tag)
                            return peSw.showNotification(i[0].title, i[0].options, t)
                    }
                    return peSw.defaultNoti()
                } catch (i) {
                    return peSw.log({
                        name: i.name,
                        message: i.message,
                        data: {
                            subscription: t,
                            eventData: e.data.text()
                        },
                        stacktrace: i.stack.toString()
                    })
                }
            var n = peSw.config.api.default + "/notification?swv=" + peSw.config.version + "&bv=" + peSw.browser().version + "&device=" + peSw.getDeviceID(t.endpoint);
            return fetch(n).then(function(e) {
                return e.json().then(function(e) {
                    return e && Array.isArray(e) && e.length && void 0 !== e[0].title && e[0].options ? peSw.showNotification(e[0].title, e[0].options, t) : peSw.log({
                        name: "invalidNotificationData",
                        message: "Bad payloadless notifications",
                        endPoint: t.endpoint,
                        data: e
                    })
                })
            }).catch(function(e) {
                return peSw.log({
                    name: e.name,
                    message: "Failed to display payloadless notification. " + e.message,
                    data: {
                        subscription: t
                    }
                })
            })
        }))
    }),
    self.addEventListener("notificationclick", function(e) {
        var t = "action3"
          , i = []
          , n = e.notification.tag
          , o = e.notification.data
          , a = {};
        if (e.notification.close(),
        e.action)
            try {
                a = JSON.parse(e.action)
            } catch (t) {
                peSw.logError({
                    name: "actionParsingFailed",
                    message: t.message,
                    data: {
                        action: e.action,
                        tag: n
                    },
                    stacktrace: t.stack.toString()
                })
            }
        "action1" == a.action ? (t = "action1",
        o = a.action_url || o) : "action2" == a.action && (t = "action2",
        o = a.action_url || o),
        o = o || "/",
        i.push(peSw.click(e, t)),
        i.push(peSw.openUrl(o)),
        e.waitUntil(Promise.all(i))
    }),
    self.addEventListener("pushsubscriptionchange", function(e) {
        e.waitUntil(self.registration.pushManager.getSubscription().then(function(t) {
            if (e.oldSubscription && e.newSubscription && "granted" == Notification.permission) {
                try {
                    var i = JSON.parse(JSON.stringify(e.oldSubscription))
                      , n = JSON.parse(JSON.stringify(e.newSubscription))
                } catch (e) {
                    return peSw.logError({
                        name: "subscriptionChangeParsingFailed",
                        message: e.message,
                        data: o,
                        stacktrace: e.stack.toString()
                    })
                }
                var o = {
                    oldSubscription: i,
                    newSubscription: {
                        subscription: n,
                        browser_info: {
                            device_type: peSw.browser().name,
                            browser_version: peSw.browser().version
                        },
                        site_id: peSw.config.siteId,
                        token_refresh: !0
                    }
                };
                o.endpoint = t ? t.endpoint : null,
                o.newSubscription.subscription.project_id = peSw.config.projectId,
                peSw.verifyFcmGcmEndpoint(o.newSubscription.subscription.endpoint) && (o.newSubscription.subscription.vapid_public_key = peSw.config.publicKey);
                var a = peSw.config.api.default + "/subscriber/change?swv=" + peSw.config.version + "&subscription=" + JSON.stringify(o);
                return fetch(a).then(function(e) {
                    if (e.status >= 500)
                        throw new Error("Failed to record subscription change. status:" + e.status);
                    if (e.status >= 400)
                        throw new Error("Invalid subscription change payload. status: " + e.status);
                    console.log("response from subscription change")
                }).catch(function(e) {
                    return peSw.logError({
                        name: "subscriptionChangeRecordFailed",
                        message: e.message,
                        data: o,
                        stacktrace: e.stack.toString()
                    })
                })
            }
        }).catch(function(e) {
            console.log(e)
        }))
    })
} catch (e) {
    console.log(e)
}
