"use strict";
try {
    var roSW = {};
    roSW.config = {
      version: "2.2.0",
      api: {
        default: "http://localhost:3000/push",
        analytics: "",
        log: "https://localhost:3000/"
      },
      siteId: "2",
      siteImage:
        "https://assetscdn.pushengage.com/site_images/f918a1521699808.png",
      siteUrl: "https://www.rollout.com",
      siteName: "RollOut",
      projectId: "360714148844",
      publicKey:
        "BLgFTwjElUH_Iz72TKDvmlsc-EcwziNP2X28BmN-znOXJhv35QybtfcN1HTh_eUlNffp12HkuruYpqtKNedN54s",
      welcomeNoti: {
        notification_title: "Welcome to RollOut",
        notification_message: " Thanks for subscribing to push notifications",
        notification_url: "http://www.pushengage.com",
        welcome_enabled: "true"
      },
      defaultNoti: {
        default_notification_title: "RollOut",
        default_notification_message: "Click to see updates",
        default_notification_url: "https://www.pushengage.com"
      },
      amp: {
        state: {
          subscription: "amp-web-push-subscription-state",
          subscribe: "amp-web-push-subscribe",
          unsubscribe: "amp-web-push-unsubscribe"
        }
      }
    };
    roSW.browser = function () {
        var ua = navigator.userAgent,
            tem, uai, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        uai = (ua.indexOf('Edge') == -1) ? ua.indexOf('EdgA') : ua.indexOf('Edge');
        if (uai != -1) {
            tem = ua.substring(uai, uai + 7).split("/");
            return {
                name: 'Edge',
                version: (tem[1] || '')
            }
        }
        if (/trident/i.test(M[1])) {
            tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
            return {
                name: 'IE',
                version: (tem[1] || '')
            }
        }
        uai = ua.indexOf('UCBrowser');
        if (uai != -1) {
            tem = ua.substring(uai, uai + 12).split("/");
            return {
                name: 'Ucbrowser',
                version: (tem[1] || '')
            }
        }
        uai = ua.indexOf('OPR');
        if (uai != -1) {
            tem = ua.substring(uai, uai + 6).split("/");
            return {
                name: 'Opera',
                version: (tem[1] || '')
            }
        }
        uai = ua.indexOf('YaBrowser');
        if (uai != -1) {
            tem = ua.substring(uai, uai + 12).split("/");
            return {
                name: 'Yandex',
                version: (tem[1] || '')
            }
        }
        M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
        if ((tem = ua.match(/version\/(\d+)/i)) != null) {
            M.splice(1, 1, tem[1])
        }
        return {
            name: M[0],
            version: M[1]
        }
    };
    roSW.deviceType = function () {
        var dTCheck = 'desktop';
        dTCheck = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) ? 'mobile' : dTCheck;
        return dTCheck
    };
    roSW.publicKeyForBrowser = function (base64String) {
        var padding = '='.repeat((4 - base64String.length % 4) % 4);
        var base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
        var rawData = atob(base64);
        var outputArray = new Uint8Array(rawData.length);
        for (var i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i)
        }
        return outputArray
    };
    roSW.getDeviceID = function (endpoint) {
        var device_id = "";
        if (endpoint.indexOf('token=') > -1) {
            device_id = endpoint.slice(endpoint.search("token=") + 6)
        } else {
            device_id = endpoint.split("/")[endpoint.split("/").length - 1]
        }
        return device_id
    };
    roSW.verifyFcmGcmEndpoint = function (endpoint) {
        if (endpoint.indexOf('android.googleapis.com/gcm') != -1 || endpoint.indexOf('updates.push.services.mozilla.com/wpush/v1') != -1) {
            return !1
        }
        return !0
    };
    roSW.welcomeNoti = function (callback) {
        var options = {
            body: roSW.config.welcomeNoti.notification_message,
            tag: 'welcome_notification' + roSW.config.siteId,
            icon: roSW.config.siteImage,
            data: roSW.config.welcomeNoti.notification_url
        };
        return roSW.showNotification(roSW.config.welcomeNoti.notification_title, options)
    };
    roSW.click = function (event, usr_action) {
        var tag = event.notification.tag;
        if (tag.indexOf('welcome_notification') == -1) {
            return event.waitUntil(self.registration.pushManager.getSubscription().then(function (o) {
                var device = (o.endpoint) ? roSW.getDeviceID(o.endpoint) : '';
                return fetch(roSW.config.api.analytics + '/notification/click?swv=' + roSW.config.version + '&bv=' + roSW.browser().version + '&device=' + device + '&tag=' + tag + '&action=' + usr_action).then(function (response) {
                    console.log("response from click")
                }).catch(function (e) {
                    roSW.logError({
                        name: e.name + ": Click count",
                        message: e.message,
                        endpoint: o.endpoint,
                        tag: tag,
                        action: usr_action,
                        stacktrace: e.stack.toString()
                    })
                })
            }))
        }
        return !0
    };
    roSW.openUrl = function (url) {
        return clients.matchAll({
            type: 'window'
        }).then(function (clientList) {
            for (var i = 0; i < clientList.length; i++) {
                var client = clientList[i];
                if (client.url === url && 'focus' in client) {
                    return client.focus()
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(url)
            }
        })
    };
    roSW.onMessageReceivedSubscriptionState = function () {
        let retrievedPushSubscription = null;
        self.registration.pushManager.getSubscription().then(pushSubscription => {
            retrievedPushSubscription = pushSubscription;
            if (!pushSubscription) {
                return null
            } else {
                return self.registration.pushManager.permissionState(pushSubscription.options)
            }
        }).then(permissionStateOrNull => {
            if (permissionStateOrNull == null) {
                roSW.broadcastReply(roSW.config.amp.state.subscription, !1)
            } else {
                const isSubscribed = !!retrievedPushSubscription && permissionStateOrNull === 'granted';
                roSW.broadcastReply(roSW.config.amp.state.subscription, isSubscribed)
            }
        })
    };
    roSW.onMessageReceivedSubscribe = function () {
        self.registration.pushManager.subscribe({
            userVisibleOnly: !0,
            applicationServerKey: roSW.publicKeyForBrowser(roSW.config.publicKey),
        }).then((sub) => {
            try {
                var subscription = JSON.parse(JSON.stringify(sub));
                subscription.project_id = roSW.config.projectId;
                subscription.vapid_public_key = roSW.config.publicKey
            } catch (e) {
                console.log('failde to parse json');
                return
            }
            var payload = {
                site_id: Number(roSW.config.siteId),
                browser_info: {
                    device_type: roSW.browser().name,
                    browser_version: roSW.browser().name,
                    user_agent: navigator.userAgent,
                    language: navigator.language,
                    host: location.host,
                    device: roSW.deviceType(),
                    pe_ref_url: location.origin
                },
                subscription: subscription,
                subscription_url: location.origin,
                geo_info: {},
                token_refresh: !1,
                optin_type: 4
            };
            fetch(roSW.config.api.default+'/subscriber/add?swv=' + roSW.config.version + '&subscription=' + JSON.stringify(payload)).then(function (response) {
                console.log("new subscription added");
                if (roSW.config.welcomeNoti && roSW.config.welcomeNoti.welcome_enabled == "true") {
                    roSW.welcomeNoti(function (res) {})
                }
                roSW.broadcastReply(roSW.config.amp.state.subscribe, null)
            }).catch(function (e) {
                roSW.broadcastReply(roSW.config.amp.state.subscribe, null);
                console.log(e)
            })
        })
    };
    roSW.onMessageReceivedUnsubscribe = function () {
        self.registration.pushManager.getSubscription().then(subscription => subscription.unsubscribe()).then(() => {
            roSW.broadcastReply(roSW.config.amp.state.unsubscribe, null)
        })
    };
    roSW.broadcastReply = function (command, payload) {
        self.clients.matchAll().then(clients => {
            for (let i = 0; i < clients.length; i++) {
                const client = clients[i];
                client.postMessage({
                    command,
                    payload,
                })
            }
        })
    };
    roSW.log = function (e) {
        var options = {
            body: roSW.config.defaultNoti.default_notification_message,
            icon: roSW.config.siteImage,
            tag: 'welcome_notification' + roSW.config.siteId,
            data: roSW.config.defaultNoti.default_notification_url,
            requireInteraction: !1
        };
        return roSW.logError(e, options)
    };
    roSW.logError = function (e, notiOptions) {
        var error = e;
        var errorTitle = roSW.config.defaultNoti.default_notification_title;
        error.site_id = roSW.config.siteId;
        error.swv = roSW.config.version;
        error.bw = roSW.browser();
        error.app = "service-worker";
        console.log(error);
        return fetch(roSW.config.api.log, {
            method: 'POST',
            mode: "no-cors",
            body: JSON.stringify(error),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function (res) {
            console.log('Success:', res);
            if (notiOptions)
                return self.registration.showNotification(errorTitle, notiOptions)
        }).catch(function (err) {
            console.error('Error:', err);
            if (notiOptions)
                return self.registration.showNotification(errorTitle, notiOptions)
        })
    };
    roSW.showNotification = function (t, n, o) {
        if (n.hasOwnProperty('actions')) {
            if (typeof n.actions[0] != "undefined" && n.actions[0].hasOwnProperty('icon') && n.actions[0].icon == null) {
                delete n.actions[0].icon
            }
            if (typeof n.actions[1] != "undefined" && n.actions[1].hasOwnProperty('icon') && n.actions[1].icon == null) {
                delete n.actions[1].icon
            }
        }
        if (typeof n.viewUrl != "undefined") {
            fetch(roSW.config.api.analytics + '/notification/view/refer?tag=' + n.tag).then(function (response) {
                console.log("response from view url refer");
                return
            }).catch(function (e) {
                roSW.logError({
                    name: e.name + ": Impression url",
                    message: e.message,
                    endpoint: o.endpoint,
                    data: n,
                    stacktrace: e.stack.toString()
                })
            })
        }
        return fetch(roSW.config.api.analytics + '/notification/view?device=' + roSW.getDeviceID(o.endpoint) + '&swv=' + roSW.config.version + '&bv=' + roSW.browser().version + '&tag=' + n.tag).then(function (response) {
            console.log("response from view ");
            return self.registration.showNotification(t, n)
        }).catch(function (e) {
            roSW.logError({
                name: e.name + ": View count",
                message: e.message,
                endpoint: o.endpoint,
                data: n,
                stacktrace: e.stack.toString()
            });
            return self.registration.showNotification(t, n)
        })
    };
    self.addEventListener('activate', event => {
        console.log('service worker activate');
        event.waitUntil(self.clients.claim())
    });
    self.addEventListener("install", function (event) {
        event.waitUntil(self.skipWaiting())
    });
    self.addEventListener('message', event => {
        const {
            command
        } = event.data;
        switch (command) {
            case roSW.config.amp.state.subscription:
                roSW.onMessageReceivedSubscriptionState();
                break;
            case roSW.config.amp.state.subscribe:
                roSW.onMessageReceivedSubscribe();
                break;
            case roSW.config.amp.state.unsubscribe:
                roSW.onMessageReceivedUnsubscribe();
                break
        }
    });
    self.addEventListener('push', function (event) {
        event.waitUntil(self.registration.pushManager.getSubscription().then(function (o) {
            if (o && typeof o.endpoint != "undefined" && o.endpoint) {
                if (event.data) {
                    try {
                        if (typeof event.data.json() == 'object') {
                            var json = event.data.json(),
                                index = 0;
                            if (typeof json[index].title != "undefined" && typeof json[index].options != "undefined" && typeof json[index].options.tag != "undefined" && json[index].options.tag) {
                                return roSW.showNotification(json[index].title, json[index].options, o)
                            } else {
                                return roSW.log({
                                    name: "Bad Request",
                                    message: "Required field is missing",
                                    endPoint: o.endpoint,
                                    data: json
                                })
                            }
                        } else {
                            return roSW.log({
                                name: "Bad Request",
                                message: "Bad notification data format",
                                endPoint: o.endpoint
                            })
                        }
                    } catch (e) {
                        return roSW.log({
                            name: e.name,
                            message: e.message,
                            endPoint: o.endpoint,
                            stacktrace: e.stack.toString()
                        })
                    }
                } else {
                    return fetch(roSW.config.api.default+'/notification?swv=' + roSW.config.version + '&bv=' + roSW.browser().version + '&device=' + roSW.getDeviceID(o.endpoint)).then(function (response) {
                        return response.json().then(function (jsondata) {
                            var json = jsondata;
                            if (typeof json[0].title != "undefined" && typeof json[0].options != "undefined")
                                return roSW.showNotification(json[0].title, json[0].options, o);
                            else return roSW.log({
                                name: "Bad Request",
                                message: "Required Field is missing",
                                endPoint: o.endpoint,
                                data: jsondata
                            })
                        })
                    })
                }
            } else {
                return roSW.log({
                    name: "Service Worker",
                    message: "Getting error in subscription data"
                })
            }
        }))
    });
    self.addEventListener('notificationclick', function (event) {
        var usr_action = '',
            notiPromiseArr = [],
            notification_url = event.notification.data,
            action_str = '';
        event.notification.close();
        if (event.action != "" && typeof (event.action) != 'undefined') {
            try {
                action_str = JSON.parse(event.action)
            } catch (e) {
                console.log('faild to parse: ', e);
                return
            }
        }
        if (action_str == '') {
            usr_action = 'action3';
            notification_url = event.notification.data
        } else {
            if (action_str.action == 'action1') {
                usr_action = 'action1';
                notification_url = action_str.action_url
            } else if (action_str.action == 'action2') {
                usr_action = 'action2';
                notification_url = action_str.action_url
            }
        }
        notification_url = notification_url || "/";
        notiPromiseArr.push(roSW.openUrl(notification_url));
        notiPromiseArr.push(roSW.click(event, usr_action));
        event.waitUntil(Promise.all(notiPromiseArr))
    });
    self.addEventListener('pushsubscriptionchange', function (event) {
        event.waitUntil(self.registration.pushManager.getSubscription().then(function (subscription) {
            if (event.oldSubscription && event.newSubscription && Notification.permission == "granted") {
                try {
                    var oldSubscription = JSON.parse(JSON.stringify(event.oldSubscription));
                    var newSubscription = JSON.parse(JSON.stringify(event.newSubscription))
                } catch (e) {
                    console.log('faild to parse josn');
                    return
                }
                var payload = {
                    oldSubscription: oldSubscription,
                    newSubscription: {
                        subscription: newSubscription,
                        browser_info: {
                            device_type: roSW.browser().name,
                            browser_version: roSW.browser().version
                        },
                        site_id: (roSW.config.siteId),
                        token_refresh: !0
                    }
                };
                payload.endpoint = (subscription) ? subscription.endpoint : null;
                payload.newSubscription.subscription.project_id = roSW.config.projectId;
                if (roSW.verifyFcmGcmEndpoint(payload.newSubscription.subscription.endpoint)) {
                    payload.newSubscription.subscription.vapid_public_key = roSW.config.publicKey
                }
                fetch(roSW.config.api.default+'/subscriber/change?swv=' + roSW.config.version + '&subscription=' + JSON.stringify(payload)).then(function (response) {
                    console.log("response from subscription change")
                }).catch(function (e) {
                    console.log(e)
                })
            }
        }).catch(function (e) {
            console.log(e)
        }))
    })
} catch (e) {
    console.log(e)
}