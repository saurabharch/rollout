try {
  var pg = {
    initSw: function(maincallback) {
      if (
        "serviceWorker" in navigator &&
        _pgE.bWSupport &&
        _pgE.sT == "http"
      ) {
        _pgD.widget.resetClosedCookie();
        if (_pgD.merchantSettings.sm("workerStatus")) {
          var options = {};
          var scope = false;
          if (_pgD.merchantSettings.sm("scope")) {
            options.scope = "/";
            scope = true;
          }
          navigator.serviceWorker
            .register(_pgD.merchantSettings.sm("worker"), options)
            .then(function(registration) {
              if (scope) {
                return pg.pushSub(maincallback);
              }
              setTimeout(function() {
                pg.pushSub(maincallback);
              }, 3000);
            })
            .catch(function(e) {
              throw e;
            });
        } else {
          pg.pushSub(maincallback);
        }
      }
    },
    overlay: {
      addHtml: function() {
        var overlayId = _pgD.getId("PG-chicklet-inst-modal");
        if (!overlayId && _pgE.dT == "desktop") {
          if (_pgSd.overlay.status) {
            var body = document.getElementsByTagName("BODY")[0];
            body.insertAdjacentHTML("beforeend", _pgSd.overlay.style);
            body.insertAdjacentHTML("beforeend", _pgSd.overlay.html);
            var overlayClose = _pgD.getId("pushgeek-overlay-close");
            var overlayImageId = _pgD.getId("pg-overlay-reminder-image");
            var overlayReminderImage = "/img/overlay-reminder-chrome.png";
            var overlayArrowImage = _pgD.getId(
              "pg-overlay-backdrop-arrow-image"
            );
            if (_pgE.bW.name === "Firefox") {
              overlayReminderImage = "/img/overlay-reminder-firefox.png";
            }
            if (_pgD.getInputUrl("intermediate") && overlayArrowImage) {
              overlayArrowImage.style.width = "350px";
              overlayArrowImage.style.margin = "0px";
            }
            if (overlayImageId) {
              overlayImageId.src = overlayReminderImage;
            }
            if (_pgE.bW.name == "Edge" && _pgE.bW.version < "79") {
              var oNT = _pgD.getId("pg-pc-notice-text");
              if (overlayArrowImage) {
                overlayArrowImage.style.top = "unset";
                overlayArrowImage.style.bottom = "135px";
                overlayArrowImage.style.transform = "rotate(180deg)";
              }
              if (_pgD.getInputUrl("intermediate") && overlayArrowImage) {
                overlayArrowImage.style.left = "unset";
              }
              if (oNT) {
                oNT.style.bottom = "unset";
                oNT.style.top = "0px";
              }
            }
            if (overlayClose) {
              overlayClose.addEventListener("click", function() {
                pg.overlay.hideHtml();
              });
            }
          } else if (_pgSd.site.powBy != 1) {
            var body = document.getElementsByTagName("BODY")[0];
            body.insertAdjacentHTML("beforeend", _pgSd.overlay.powBycss);
            body.insertAdjacentHTML("beforeend", _pgSd.overlay.powByHtml);
            if (_pgD.getInputUrl("intermediate")) {
              var id = _pgD.getId("pg-overlay-powby");
              if (id)
                id.href =
                  "https://www.pushgeek.com?utm_source=" +
                  _pgSd.site.allowedDomain[0] +
                  "&utm_medium=referral&utm_campaign=push_window";
            }
          }
        }
      },
      hideHtml: function() {
        _pgD.rvHtml(_pgD.getId("pg-overlay-powby"));
        _pgD.rvHtml(_pgD.getId("pg-overlay-backdrop"));
        _pgD.rvHtml(_pgD.getId("pg-overlay-backdrop-style"));
      }
    },
    apiValid: function() {
      var valid = true;
      if (
        !_pgE.checkApiValid ||
        typeof _pgD !== "object" ||
        typeof _pgSd !== "object" ||
        typeof _pgE !== "object" ||
        (_pgE.sT == "http" && _pgE.bW.name != "Safari") ||
        (_pgD.deviceToken.cookie() &&
          Notification.permission == "granted" &&
          _pgD.cookie.get("PushSubscriberStatus") != "UNSUBSCRIBED")
      )
        valid = false;
      if (_pgE.refToken) valid = true;
      return valid;
    },
    vapidNotSupportBw: function() {
      return (_pgE.bW.name == "Chrome" && _pgE.bW.version < 52) ||
      (_pgE.bW.name == "Firefox" && _pgE.bW.version < 46)
        ? true
        : false;
    },
    isGcm: function(endpoint) {
      gcm =
        endpoint.indexOf("android.googleapis.com/gcm") > -1 ||
        endpoint.indexOf("updates.push.services.mozilla.com/wpush/v1") > -1;
      return gcm;
    },
    bwUnsubscribe: function(callback) {
      if ("serviceWorker" in navigator) {
        _pgD.bwUnsubscribeAPI(function(res) {
          pg.subscribe(callback);
        });
      }
    },
    pushSub: function(maincallback) {
      var subApi;
      if (_pgD.merchantSettings.sm("scope")) {
        subApi = navigator.serviceWorker.ready;
      } else {
        subApi = navigator.serviceWorker.register(
          _pgD.merchantSettings.sm("worker")
        );
      }
      subApi.then(function(reg) {
        var subOptions = { userVisibleOnly: true };
        if (!pg.vapidNotSupportBw()) {
          subOptions.applicationServerKey = _pgD.publicKey(
            _pgSd.site.vapidPubKey
          );
        }
        reg.pushManager
          .subscribe(subOptions)
          .then(function(sub) {
            try {
              var pe_sub = JSON.parse(JSON.stringify(sub));
            } catch (e) {
              return;
            }
            _pgD.getDeviceTokenFromEndPoint(pe_sub.endpoint, "init");
            pe_sub["project_id"] = _pgSd.gcm.projectId;
            if (!pg.vapidNotSupportBw() && !pg.isGcm(pe_sub.endpoint)) {
              pe_sub["vapid_public_key"] = _pgSd.site.vapidPubKey;
            }
            pg.permissionGranted(pe_sub, maincallback);
          })
          .catch(function(e) {
            if (e.message.indexOf("unsubscribe then resubscribe") != -1)
              pg.bwUnsubscribe(maincallback);
            else pg.permissionDefault(maincallback);
          });
      });
    },
    subscribe: function(maincallback) {
      if (!pg.apiValid()) {
        if (_pgD.getInputUrl("intermediate") || null) {
          pg.sendDataToBrowser();
        }
        return;
      }
      _pgD.pvtBw(function(pvtBw) {
        if (!pvtBw) {
          if (!_pgD.userPerDenied())
            switch (_pgE.bW.name) {
              case "Safari":
                if ("safari" in window && "pushNotification" in window.safari) {
                  var perD = window.safari.pushNotification.permission(
                    _pgSd.safari.pushId
                  );
                  if (
                    perD.permission === "default" ||
                    perD.permission === "granted"
                  ) {
                    _pgD.widget.resetClosedCookie();
                    pg.safariPermission(perD, function(perD) {
                      if (perD.permission === "denied") {
                        pg.permissionDenied(maincallback);
                      } else if (perD.permission === "granted") {
                        pg.overlay.hideHtml();
                        _pgD.deviceToken.value = perD.deviceToken;
                        pg.permissionGranted(
                          {
                            endpoint: _pgD.deviceToken.value,
                            project_id: _pgSd.safari.pushId
                          },
                          maincallback
                        );
                      }
                    });
                  }
                }
                break;
              default:
                if (Notification.permission == "default") {
                  pg.overlay.addHtml();
                }
                if (pg.vapidNotSupportBw()) {
                  var link = document.createElement("link");
                  link.rel = "manifest";
                  link.href = _pgD.merchantSettings.sm("manifest");
                  document.getElementsByTagName("head")[0].appendChild(link);
                }
                if (pg.optinSubscriptionReminder.status()) {
                  pg.optinSubscriptionReminder.reminder();
                }
                Notification.requestPermission()
                  .then(function(status) {
                    pg.optinSubscriptionReminder.clearReminder();
                    switch (status) {
                      case "default":
                        pg.permissionDefault(maincallback);
                        break;
                      case "denied":
                        pg.permissionDenied(maincallback);
                        break;
                      case "granted":
                        pg.overlay.hideHtml();
                        pg.initSw(maincallback);
                    }
                  })
                  .catch(function(e) {
                    pg.optinSubscriptionReminder.clearReminder();
                  });
                break;
            }
          else {
            _pgD.widget.addBoxHtml(maincallback);
          }
        }
      });
    },
    safariPermission: function(permissionData, callback) {
      window.safari.pushNotification.requestPermission(
        _pgSd.api.safariApi,
        _pgSd.safari.pushId,
        { app_id: _pgSd.site.sK },
        callback
      );
    },
    permissionDenied: function(maincallback) {
      if (_pgE.sT == "http" && _pgE.swSupport == 1)
        _pgD.widget.addHtml(maincallback);
      pg.overlay.hideHtml();
      if (_pgD.subOptinType() == 4) {
        _pgD.optinAnalytics({ block_1: true, optin_1: true });
      } else {
        _pgD.optinAnalytics({
          allow_1: true,
          optin_1: true,
          block_2: true,
          optin_2: true
        });
      }
      _pgD.cookie.set([
        [
          "PushSubscriberStatus",
          "DENIED",
          _pgD.cookie.optinHide,
          "/",
          "cookie"
        ],
        ["pgclosed", true, _pgE.cookie.optinHide, "/", "cookie"],
        ["PushOptinReminder", JSON.stringify({}), false, "/", "local"]
      ]);
      if (typeof maincallback === "function")
        maincallback({
          statuscode: 2,
          status: "DENIED",
          message: "User denied push notification"
        });
      if (_pgD.getInputUrl("intermediate")) {
        pg.sendDataToBrowser();
      }
    },
    permissionDefault: function(maincallback) {
      pg.overlay.hideHtml();
      if (_pgD.subOptinType() == 4) {
        _pgD.optinAnalytics({ close_1: true, optin_1: true });
      } else {
        _pgD.optinAnalytics({
          allow_1: true,
          optin_1: true,
          close_2: true,
          optin_2: true
        });
      }
      if (
        _pgE.cookie.optinHide != 0 &&
        !pg.isFirefoxPermissionDefaultQuiterUI()
      )
        _pgD.cookie.set([
          [
            "PushSubscriberStatus",
            "CLOSED",
            _pgE.cookie.optinHide,
            "/",
            "cookie"
          ],
          ["pgclosed", true, _pgE.cookie.optinHide, "/", "cookie"],
          ["PushOptinReminder", JSON.stringify({}), false, "/", "local"]
        ]);
      if (typeof maincallback === "function")
        maincallback({
          statuscode: 3,
          status: "CLOSED",
          message: "User closed subscription Opt-in"
        });
      if (
        _pgD.getInputUrl("intermediate") &&
        !pg.isFirefoxPermissionDefaultQuiterUI()
      ) {
        pg.sendDataToBrowser();
      }
      if (_pgE.sT == "https" && _pgE.swSupport == 1)
        _pgD.widget.addHtml(maincallback);
      if (pg.isFirefoxPermissionDefaultQuiterUI()) {
        try {
          _pgD.widget.addBoxHtml(maincallback);
          widgetBtnBox = _pgD.getId("PG-button-box");
          widgetDeny = _pgD.getId("PG-cancel-btn");
          widgetAllow = _pgD.getId("PG-retry-btn");
          widgetMessage = _pgD.getId("PG-chicklet-inst-modal-body-message");
          widgetBtnBox.style.padding = "20px";
          widgetAllow.innerHTML = "Allow";
          widgetDeny.innerHTML = "Deny";
          widgetMessage.innerHTML =
            '<p style="font-size:18px;line-height:24px;text-align:center">Please confirm you would like to get notifications.</p>';
        } catch (error) {
          console.log(error);
        }
      }
    },
    permissionGranted: function(subscription, maincallback) {
      if (_pgD.getInputUrl("recover_subscriber_from_iframe"))
        _pgE.refToken = true;
      _pgD.insertFile("js", "pushgeek-geo", false, function(res) {
        var ip = false;
        var geoInfo;
        if (typeof pgGeoInfo == "undefined") geoInfo = _pgD.modifyGeo();
        
        else {
          geoInfo = _pgD.modifyGeo(pgGeoInfo);
          ip = geoInfo.geobytesipaddress;
        }
        var availScreen = screen.availWidth + "*" + screen.availHeight;
        // let cordinate = fetch('http://demo.localhost:5500/api/geo/pushgeek-geo.js');
        // var kalkhatta = cordinate.json()
        var data = {
          relApiPath: "/api/subscribe",
          reqData: {
            site_id: _pgSd.site.sSi,
            browser_info: {
              device_type: _pgE.bW.name,
              browser_version: _pgE.bW.version,
              user_agent: navigator.userAgent,
              language: navigator.language,
              total_scr_width_height: screen.width + "*" + screen.height,
              available_scr_width_height: availScreen,
              colour_resolution: screen.pixelDepth,
              host: location.host,
              device: _pgE.dT,
              pe_ref_url: _pgE.subUrl
            },
            subscription: subscription,
            subscription_url: _pgE.subUrl,
            geo_info: geoInfo,
            token_refresh: _pgE.refToken
          }
        };
        if (_pgSd.subA && !_pgE.refToken) {
          data.reqData.optin_type = _pgD.subOptinType();
          if (_pgE.widgetClick)
            data.reqData.widget_optin_type = _pgD.widget.optinType;
        }
        if (
          _pgSd.welcomeNoti &&
          (_pgSd.welcomeNoti.welcome_enabled == "true" ||
            _pgSd.welcomeNoti.welcome_enabled == true) &&
          !_pgE.refToken
        ) {
          pg.welcomeNoti(function(res) {});
        }
        _pgD.sendRequestToServer(data, function(res) {
          var resData = JSON.parse(res);
          var resObj = { statuscode: 0, message: "Something went wrong" };
          if (
            resData.data &&
            resData.data.hasOwnProperty("subscriber_hash") &&
            resData.data.subscriber_hash.length == 64
          ) {
            if (!_pgE.refToken && _pgD.subOptinType() != 4) {
              _pgD.optinAnalytics({ allow_2: true, optin_2: true });
            }
            var currentTime = new Date().getTime();
            var subCookieData = JSON.stringify({
              bv: _pgE.bW.version,
              ip: { v: ip, d: currentTime },
              l: navigator.language,
              s: availScreen,
              tz: data.reqData.geo_info.geobytestimezone
            });
            _pgD.resetStorage();
            _pgD.cookie.set([
              ["pgclosed", true, _pgD.cookie.global, "/", "cookie"],
              ["PushSubscriberID", _pgD.deviceToken.value, false, "/", "local"],
              [
                "PushSubscriberHash",
                resData.data.subscriber_hash,
                false,
                "/",
                "local"
              ],
              [
                "PushSubscriberStatus",
                "SUBSCRIBED",
                _pgD.cookie.global,
                "/",
                "cookie"
              ],
              ["PushPersonalNotificationStatus", true, false, "/", "local"],
              ["PgSubData", subCookieData, false, "/", "local"],
              ["PushOptinReminder", JSON.stringify({}), false, "/", "local"]
            ]);
            _pgD.cookie.remove([["PushSubscribeWidgetAnalytics", "local"]]);
            if (
              _pgE.sT == "http" &&
              _pgE.swSupport == 1 &&
              typeof _pg != "undefined"
            )
              _pg.subMangWidget.addHtml(maincallback);
            switch (resData.error_code) {
              case 0:
                resObj.statuscode = 1;
                resObj.status = "SUBSCRIBED";
                resObj.message = "User subscribed sucessfully";
                resObj.subscriber_hash = resData.data.subscriber_hash;
                resObj.data = { geoInfo: pg.formatGeoInfo() };
            }
            if (_pgE.subSegment) {
              var segmentArr = _pgE.subSegment.split(",");
              var segData = {
                relApiPath: "/subscribe/segments/add",
                reqData: {
                  segment: segmentArr,
                  device_token_hash: _pgD.cookie.get("PushSubscriberHash")
                }
              };
              _pgD.sendRequestToServer(segData, function(res) {
                if (typeof maincallback == "function") maincallback(resObj);
                if (_pgD.getInputUrl("intermediate")) {
                  pg.sendDataToBrowser();
                }
              });
            } else {
              if (typeof maincallback == "function") maincallback(resObj);
              if (_pgD.getInputUrl("intermediate")) {
                pg.sendDataToBrowser();
              }
            }
          } else if (_pgD.getInputUrl("intermediate") && window.opener) window.close();
        });
      });
    },
    welcomeNoti: function(callback) {
      var options = {
        body: _pgSd.welcomeNoti.notification_message,
        tag: "welcome_notification" + _pgSd.site.sSi,
        icon: _pgSd.site.sI,
        data: _pgSd.welcomeNoti.notification_url
      };
      if (_pgE.bW.name == "Safari" && Notification.permission === "granted") {
        var welcomeNoti = new Notification(
          _pgSd.welcomeNoti.notification_title,
          options
        );
        welcomeNoti.onclick = function(event) {
          event.preventDefault();
          window.open(_pgSd.welcomeNoti.notification_url, "_blank");
          welcomeNoti.close();
        };
        return typeof callback == "function" ? callback(true) : true;
      } else {
        var subApi;
        if (_pgD.merchantSettings.sm("scope")) {
          subApi = navigator.serviceWorker.ready;
        } else {
          subApi = navigator.serviceWorker.register(
            _pgD.merchantSettings.sm("worker")
          );
        }
        subApi.then(function(registration) {
          if (Notification.permission == "granted")
            registration
              .showNotification(_pgSd.welcomeNoti.notification_title, options)
              .then(function() {
                return typeof callback == "function" ? callback(true) : true;
              });
        });
      }
    },
    sendDataToBrowser: function() {
      var state = _pgD.cookie.get("PushSubscriberStatus");
      if (!state) {
        switch (Notification.permission) {
          case "granted":
            state = "SUBSCRIBED";
            break;
          case "denied":
            state = "DENIED";
            break;
          default:
            state = "CLOSED";
        }
      }
      var data = {
        PushSubscriberID: _pgD.cookie.get("PushSubscriberID"),
        PushSubscriberHash: _pgD.cookie.get("PushSubscriberHash"),
        state: state,
        source: "subscribe",
        postOrigin: "opener",
        geoInfoData: { geoInfo: pg.formatGeoInfo() },
        subCookieData: _pgD.cookie.get("PgSubData")
      };
      if (window.opener) {
        window.opener.postMessage(JSON.stringify(data), _pgE.subUrl);
        window.close();
      } else if (_pgD.getInputUrl("recover_subscriber")) {
        data.postOrigin = "iframe";
        parent.postMessage(JSON.stringify(data), "*");
      } else if (_pgD.getInputUrl("refer")) window.location = _pgE.subUrl;
      else if (_pgD.getInputUrl("recover_subscriber_from_iframe")) {
        data.postOrigin = "iframe";
        data.subscriberOrigin = "recoverSubscriber";
        parent.postMessage(JSON.stringify(data), "*");
      }
    },
    formatGeoInfo: function() {
      return {
        country:
          typeof pgGeoInfo != "undefined" &&
          typeof pgGeoInfo.geobytescountry != "undefined"
            ? pgGeoInfo.geobytescountry
            : "",
        state:
          typeof pgGeoInfo != "undefined" &&
          typeof pgGeoInfo.geobytesregion != "undefined"
            ? pgGeoInfo.geobytesregion
            : "",
        city:
          typeof pgGeoInfo != "undefined" &&
          typeof pgGeoInfo.geobytescity != "undefined"
            ? pgGeoInfo.geobytescity
            : ""
      };
    },
    isFirefoxPermissionDefaultQuiterUI: function() {
      var browser = _pgE.bW;
      if (
        Notification.permission == "default" &&
        _pgE.dT == "desktop" &&
        browser.name == "Firefox" &&
        browser.version > 71
      ) {
        return true;
      } else {
        return false;
      }
    },
    optinSubscriptionReminder: {
      clearReminderId: false,
      getStorageData: function() {
        var reminderInfo = { count: 0, time: 0 };
        try {
          reminderInfo = _pgD.cookie.get("PushOptinReminder");
          reminderInfo = reminderInfo ? JSON.parse(reminderInfo) : {};
          reminderInfo.count = Number(reminderInfo.count) || 0;
          reminderInfo.time = Number(reminderInfo.time) || 0;
        } catch (e) {
          console.log(e.message);
        }
        return reminderInfo;
      },
      setInfoToStorage: function() {
        try {
          var reminderInfo = pg.optinSubscriptionReminder.getStorageData();
          var reminderCount = 1 + reminderInfo.count;
          var currentTime = new Date().getTime();
          _pgD.cookie.set([
            [
              "PushOptinReminder",
              JSON.stringify({ count: reminderCount, time: currentTime }),
              false,
              "/",
              "local"
            ]
          ]);
        } catch (e) {
          console.log(e.message);
        }
      },
      getDelay: function() {
        var optinSubscriptionReminder = _pgSd.optinSubscriptionReminder;
        var delay = optinSubscriptionReminder.show_after_initial_delay;
        try {
          var reminderInfo = pg.optinSubscriptionReminder.getStorageData();
          if (reminderInfo.time) {
            var diffDelay =
              (new Date().getTime() - new Date(reminderInfo.time)) / 1000;
            delay = optinSubscriptionReminder.show_again_after - diffDelay;
            delay = delay > 0 ? delay : 0;
          }
        } catch (e) {
          console.log(e.message);
        }
        return delay;
      },
      status: function() {
        var status = false;
        var reminderId = _pgD.getId("pushgeek-optin-reminder");
        var optinSubscriptionReminder = _pgSd.optinSubscriptionReminder;
        var storageData = pg.optinSubscriptionReminder.getStorageData();
        if (
          !reminderId &&
          optinSubscriptionReminder &&
          optinSubscriptionReminder.enabled &&
          (!optinSubscriptionReminder.max_prompt ||
            storageData.count < optinSubscriptionReminder.max_prompt) &&
          _pgE.dT === "desktop" &&
          !_pgSd.overlay.status &&
          _pgD.isQuiterUi()
        ) {
          status = true;
        }
        return status;
      },
      reminder: function() {
        var optinSubscriptionReminder = _pgSd.optinSubscriptionReminder;
        var cssPlacement;
        switch (optinSubscriptionReminder.placement) {
          case "center":
            cssPlacement = "right:0px;left:0px;margin:0 auto;top:135px;";
            break;
          case "left":
            cssPlacement = "left:100px;top:135px;";
            break;
          case "bottom_right":
            cssPlacement = "bottom:0;right:100px;";
            break;
          case "bottom_left":
            cssPlacement = "bottom:0;left:100px;";
            break;
          default:
            cssPlacement = "right:100px;top:135px;";
        }
        var imageUrl =
          "http://localhost:5500/img/reminder-chrome.png";
        if (_pgE.bW.name === "Firefox") {
          imageUrl =
            "http://localhost:5500/img/reminder-firefox.png";
        }
        try {
          var cssContent =
            '<style id="pushgeek-optin-reminder-style">#pushgeek-optin-reminder{' +
            cssPlacement +
            "position:fixed;width:260px;box-shadow:0 2px 2px 0 rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.12),0 1px 5px 0 rgba(0,0,0,.2);background:" +
            optinSubscriptionReminder.background +
            ";color:" +
            optinSubscriptionReminder.color +
            ";border-radius:5px}#pushgeek-optin-reminder img,#pushgeek-optin-reminder p{margin:0;padding:0}#pushgeek-optin-reminder p{margin:8px 10px;line-height:22px;max-height:350px;overflow:hidden;text-overflow:ellipsis;}#pushgeek-optin-reminder img{width: 100%;border-radius: 5px 5px 0 0;}#pushgeek-optin-reminder-close{max-width:200px;max-height:30px;float:right;padding:0 7px;min-width:60px;text-align:center;border-radius:2px;cursor:pointer;font-size:15px;overflow:hidden;text-overflow:ellipsis;line-height:30px;box-shadow:0 1px 3px 0 rgba(0,0,0,.2),0 1px 1px 0 rgba(0,0,0,.14),0 2px 1px -1px rgba(0,0,0,.12);background:" +
            optinSubscriptionReminder.button_background +
            ";color:" +
            optinSubscriptionReminder.button_color +
            ";margin:0 8px 12px 0}</style>";
          var htmlContent =
            "<div id='pushgeek-optin-reminder'><img src='" +
            imageUrl +
            "'/><p>" +
            optinSubscriptionReminder.description +
            "</p><div id='pushgeek-optin-reminder-close'>" +
            optinSubscriptionReminder.button +
            "</div></div>";
          var delay = pg.optinSubscriptionReminder.getDelay();
          pg.optinSubscriptionReminder.clearReminderId = setTimeout(function() {
            var body = document.getElementsByTagName("BODY")[0];
            body.insertAdjacentHTML("beforeend", cssContent);
            body.insertAdjacentHTML("beforeend", htmlContent);
            var closeReminder = _pgD.getId("pushgeek-optin-reminder-close");
            if (closeReminder) {
              closeReminder.addEventListener("click", function() {
                pg.optinSubscriptionReminder.clearReminder();
              });
            }
            pg.optinSubscriptionReminder.setInfoToStorage();
          }, delay * 1000);
        } catch (error) {
          console.log(error.message);
        }
      },
      clearReminder: function() {
        var timeoutID = pg.optinSubscriptionReminder.clearReminderId;
        if (timeoutID) {
          clearTimeout(pg.optinSubscriptionReminder.clearReminderId);
        }
        _pgD.rvHtml(_pgD.getId("pushgeek-optin-reminder"));
        _pgD.rvHtml(_pgD.getId("pushgeek-optin-reminder-style"));
      }
    }
  };
} catch (e) {
  console.log(e);
}
