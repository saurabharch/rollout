"use strict";
let isSubscribed = false;
let swRegistration = null;
let applicationKey =
  "BLgFTwjElUH_Iz72TKDvmlsc-EcwziNP2X28BmN-znOXJhv35QybtfcN1HTh_eUlNffp12HkuruYpqtKNedN54s";

try {
  var _pgSd = {
    site: {
      sI: "http://localhost:5500/images/apple-touch-icon.png",
      sK: "ee08a9929fe7ea157ecd01aea9c53c14",
      sSd: "demo",
      sSi: "3",
      powBy: "1",
      isEu: true,
      isSponsored: false,
      optinSettins: {
        desHttp: {
          allowBtnBg: "#2ecc71",
          optin_allow_btn_txt: "Allow",
          bg: "#ffffff",
          closeBtnBg: "#ffffff",
          optin_close_btn_txt: "Close",
          optin_title:
            "This website 'PushGeek' would like to send push notifications",
          placement: "pg-top-center",
          cookie_duration: 7,
          optin_category: "delay",
          optin_delay: 0,
          optin_scroll: 5,
          popup_disabled: 1,
          optin_type: 1,
          optin_name: "Safari Style Box"
        },
        desHttps: {
          cookie_duration: 7,
          optin_category: "delay",
          optin_delay: 0,
          optin_scroll: 5,
          popup_disabled: 1,
          optin_type: 4,
          optin_name: "Push Single Step Opt-in",
          bell: {
            optin_title: "Subscribe to notification",
            bg: "#1b3343",
            allowBtnBg: "#ffffff",
            placement: "pg-bottom-right"
          }
        },
        mobHttp: {
          allowBtnBg: "#2ecc71",
          optin_allow_btn_txt: "Allow",
          bg: "#ffffff",
          closeBtnBg: "#ffffff",
          optin_close_btn_txt: "Close",
          optin_title:
            "This website 'PushGeek' would like to send push notifications",
          placement: "pg-mobile-bottom",
          cookie_duration: 7,
          optin_category: "delay",
          optin_delay: 0,
          optin_scroll: 5,
          popup_disabled: 1,
          optin_type: 1,
          optin_name: "Safari Style Box"
        },
        mobHttps: {
          cookie_duration: 7,
          optin_category: "delay",
          optin_delay: 0,
          optin_scroll: 5,
          popup_disabled: 1,
          optin_type: 4,
          optin_name: "Push Single Step Opt-in"
        },
        siteType: "http"
      },
      allowedDomain: [
        // "PushGeek.com",
        // "demo.PushGeek.com",
        "localhost:5500"
      ],
      vapidPubKey:`${applicationKey}`,
      plateform: "html"
    },
    customUrl: false,
    widget: {
      boxStyle:
        '<style id="PG-chicklet-inst-modal-style">#PG-chicklet-inst-modal{position:fixed;z-index:9999999999!important;left:0;top:0;width:100%;height:100%;overflow:auto;background-color:#000;background-color:rgba(0,0,0,.4);overflow-x:hidden}#PG-chicklet-inst-modal #PG-chicklet-inst-modal-content{background-color:#fefefe;left:50%;transform:translate(-50%,-50%);top:50%;position:absolute;border-radius:3px}#PG-chicklet-inst-modal #PG-chicklet-inst-modal-content #PG-chicklet-inst-modal-body #PG-step-img{display:block;margin:0 auto;box-shadow:0 0 5px #bbb}@media(max-width:560px){#PG-chicklet-inst-modal #PG-chicklet-inst-modal-content{width:100%;left:0;top:0;transform:translate(0,0)}#PG-chicklet-inst-modal #PG-chicklet-inst-modal-content #PG-chicklet-inst-modal-body #PG-step-img{argin:auto;width:100%}}#PG-chicklet-inst-modal #PG-chicklet-inst-modal-content #PG-chicklet-inst-modal-body{padding:20px}#PG-chicklet-inst-modal #PG-chicklet-inst-modal-content #PG-chicklet-inst-modal-body #PG-button-box{float:right;padding:40px}#PG-chicklet-inst-modal #PG-chicklet-inst-modal-content #PG-chicklet-inst-modal-body #PG-button-box a#PG-cancel-btn{display: inline;cursor: pointer;color:#042048;text-decoration:none}#PG-chicklet-inst-modal #PG-chicklet-inst-modal-content #PG-chicklet-inst-modal-body #PG-button-box a#PG-retry-btn{display: inline;cursor: pointer;box-shadow:0 7px 14px rgba(50,50,93,.1),0 3px 6px rgba(0,0,0,.08);margin:0 18px;height:45px;line-height:45px;border-radius:2px;background:#449afe;color:#fff;padding:10px 16px;text-decoration:none}</style>',
      boxHtml:
        '<div id="PG-chicklet-inst-modal"><div id="PG-chicklet-inst-modal-content"><div id="PG-chicklet-inst-modal-body"><div id="PG-chicklet-inst-modal-body-message"><p style="font-size:18px;margin-bottom:40px;line-height:24px;text-align:center">You seem to have previously blocked/denied/unsubscribed push notifications. See the image below to know how to unblock/resubscribe them.</p><img id="PG-step-img" src=""></div><div id="PG-button-box"><a  id="PG-cancel-btn">Cancel</a> <a id="PG-retry-btn">Retry</a></div></div></div></div>',
      bWBoxImg: {
        url: "http://localhost:5500/img/",
        chrome: "chrome.jpg",
        firefox: "firefox.jpg",
        chromeM: "chromeM.jpg",
        firefoxM: "firefoxM.jpg",
        safari: "safari.jpg",
        edge: "edge.jpg",
        opera: "opera.jpg",
        operaM: "operaM.jpg",
        ucM: "ucM.jpg"
      }
    },
    getWidget: { status: false, style: "", html: "" },
    subA: true,
    welcomeNoti: {
      notification_title: "Welcome to PushGeek",
      notification_message:
        "Schedule a Demo With Us To Learn How to Use PushGeek Best",
      notification_url: "https://www.localhost:5500/home",
      welcome_enabled: "true"
    },
    subRule: { activeType: "delay" },
    optinMang: {
      value: [{ rule: "exact", value: "https://pushgeek-rewards-win.com/" }],
      active: "exclude"
    },
    optinSubscriptionTrigger: true,
    optinSubscriptionReminder: true,
    safari: { pushId: "web.com.pushgeek.demo", default: false },
    gcm: { projectId: "360714148844" },
    api: {
      backendApi: "http://localhost:5500",
      safariApi: "http://safari.localhost:5500",
      swv: "2.2.0",
      triggerApi: "http://localhost:5500/subscribe",
      pushJs: "http://localhost:5500/pushgeek.js",
      anyApi:
        "https://noti-analytics.pushgeek.com/p/v1/notification/view?device=dYnqvwF8hFM:APA91bEsPxWj1iQJjl_qW1EVnh3hQljLAEzaDZ8eQI9NiMyL0oe-gMfrMBZwqeY2EPco8tkR9SpvOKhFnilY672dlMqpKWNbg3YH1jDunJUW0qacivPpOWIBPL1CH9F8aq9aRDxHAOQO&swv=2.2.0&bv=87&tag=D-2-117-321-1607011361000-3de6418f4b757cd0cb019d5073e9771292a17515f8ac858bbac30caae091fa17&tz=+05:30",
      eventApi: "http://localhost:5500/log",

    },
    trigger: { status: true },
    overlay: {
      status: true,
      style:
        '<style id="pg-overlay-backdrop-style">#pg-overlay-backdrop{position:fixed;top:0;right:0;bottom:0;left:0;z-index:2147483638;background-color:rgba(0,0,0,0.8);}#pg-overlay-backdrop #pg-overlay-backdrop-arrow-image{padding:0px;position:absolute;left:0;right:0;margin:0 auto;width:550px;top:135px;transform:rotate(-7deg)}#pg-overlay-backdrop-arrow-image img{width: 100px;height: 100px;padding: 0;margin: 0;}#pg-overlay-backdrop #pg-overlay-text{left:0;right:0;position:absolute;width:260px;box-shadow:0 2px 2px 0 rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.12),0 1px 5px 0 rgba(0,0,0,.2);background:#fff;color:#000;border-radius:5px;margin:0 auto;top:185px}#pg-overlay-text img{width:100%;border-radius:5px 5px 0 0}#pg-overlay-text img,#pg-overlay-text p{margin:0;padding:0}#pg-overlay-text p{margin:8px 10px;line-height:22px;max-height:400px;overflow:hidden;text-overflow:ellipsis;padding: 0rem .6rem 0rem 1rem;}#pushgeek-overlay-close{position:absolute;right:20px;top:30px;width:55px;height:32px;cursor:pointer}#pushgeek-overlay-close:before{transform:rotate(45deg)}#pushgeek-overlay-close:before,#pushgeek-overlay-close:after{position:fixed;right:48px;content:" ";height:33px;width:3px;background-color:#ffffff}#pushgeek-overlay-close:after{transform:rotate(-45deg)}</style>',
      html:
        '<div id="pg-overlay-backdrop"><div id="pushgeek-overlay-close"></div><div id="pg-overlay-backdrop-arrow-image"><img src="http://localhost:5500/img/overlay-arrow.png"></div><div id="pg-overlay-text"><img id="pg-overlay-reminder-image" src=""><p>Click on Allow button and Subscribe to the push notifications</p></div></div>',
      powByHtml: "",
      powBycss: ""
    },
    customOptin: { status: false, optinType: false, css: "" },
    subMangWidget: {
      status: true,
      settings: {
        rule: "custom",
        customRule: "contains",
        customRuleValue: "unsubscribe",
        type: "button",
        enabled: true
      },
      html:
        '<div id="pg-button-sub-mang-widget" class="pg-pos-bl"><span id="pg-unsubscribe-btn">Unsubscribe to notifications</span><span id="pg-unsubscribe-btn-action">Are you sure?<span id="pg-unsubscribe-btn-yes">Yes</span><span id="pg-unsubscribe-btn-no">No</span></span></div>',
      css:
        "<style>#pg-button-sub-mang-widget.pg-pos-br{right:0;bottom:0}#pg-button-sub-mang-widget{position:fixed;cursor:pointer;display:block;background:#001e47;color:#ffffff;padding:0 10px;border-radius:4px 4px 0 0;font-size:15px;z-index:999999999999999;font-weight:400!important;line-height:34px!important;bottom:0;right:0}.PG-backdrop{position:fixed;top:0;left:0;z-index:1035;background-color:rgba(0,0,0,.5);display:none}#pg-button-sub-mang-widget.pg-pos-bl{bottom:0;left:0;right:unset}#pg-button-sub-mang-widget #pg-unsubscribe-btn-action span{text-decoration: underline;margin: 0 10px;}#pg-button-sub-mang-widget #pg-unsubscribe-btn-action{display:none}</style>",
      msg: {
        unsubMsg: "Unsubscribe to notifications",
        thankMsg: "You will be missing latest notifications",
        confirmMsg: "Are you sure?"
      }
    },
    privacySettings: { geoLocationEnabled: true },
    segmentsOnPageLoad: [
      {
        segment_id: 128152,
        segment_name: "Pricing",
        site_id: 2,
        segment_criteria: '{"include":{"contains":["pricing"]},"exclude":[]}',
        status: 1,
        add_segment_on_page_load: 1
      },
      {
        segment_id: 128153,
        segment_name: "Features",
        site_id: 2,
        segment_criteria: '{"include":{"contains":["features"]},"exclude":[]}',
        status: 1,
        add_segment_on_page_load: 1
      },
      {
        segment_id: 128154,
        segment_name: "Blog",
        site_id: 2,
        segment_criteria: '{"include":{"contains":["blog"]},"exclude":[]}',
        status: 1,
        add_segment_on_page_load: 1
      },
      {
        segment_id: 128514,
        segment_name: "dashboard",
        site_id: 2,
        segment_criteria: '{"include":{"contains":["dashboard"]},"exclude":[]}',
        status: 1,
        add_segment_on_page_load: 1
      },
      {
        segment_id: 128606,
        segment_name: "Webinar",
        site_id: 2,
        segment_criteria: '{"include":{"contains":["webinar"]},"exclude":[]}',
        status: 1,
        add_segment_on_page_load: 1
      },
      {
        segment_id: 135694,
        segment_name: "OneSignal",
        site_id: 2,
        segment_criteria:
          '{"include":{"contains":["onesignal-alternative"]},"exclude":[]}',
        status: 1,
        add_segment_on_page_load: 1
      },
      {
        segment_id: 135695,
        segment_name: "Competitors",
        site_id: 2,
        segment_criteria:
          '{"include":{"contains":["gamooga-alternative","pushpad-alternative","pushwoosh-alternative","pushalert-alternative","pushassist-alternative","sendpulse-alternative","moengage-alternative","foxpush-alternative","goroost-alternative","aimtell-alternative","pushassist-alternative"]},"exclude":[]}',
        status: 1,
        add_segment_on_page_load: 1
      },
      {
        segment_id: 135696,
        segment_name: "VWOEngage",
        site_id: 2,
        segment_criteria:
          '{"include":{"contains":["pushcrew-alternative ","vwo-engage"]},"exclude":[]}',
        status: 1,
        add_segment_on_page_load: 1
      },
      {
        segment_id: 135697,
        segment_name: "Izooto",
        site_id: 2,
        segment_criteria:
          '{"include":{"contains":["izooto-alternative"]},"exclude":[]}',
        status: 1,
        add_segment_on_page_load: 1
      },
      {
        segment_id: 136440,
        segment_name: "Category",
        site_id: 2,
        segment_criteria: '{"include":{"contains":["4003085"]},"exclude":[]}',
        status: 1,
        add_segment_on_page_load: 1
      },
      {
        segment_id: 136731,
        segment_name: "Popular Deals",
        site_id: 2,
        segment_criteria:
          '{"include":{"contains":["clearance-deals"]},"exclude":[]}',
        status: 1,
        add_segment_on_page_load: 1
      },
      {
        segment_id: 137048,
        segment_name: "News",
        site_id: 2,
        segment_criteria: '{"include":{"contains":["news"]}}',
        status: 1,
        add_segment_on_page_load: 1
      },
      {
        segment_id: 137057,
        segment_name: "Google Ads",
        site_id: 2,
        segment_criteria: '{"include":{"contains":["googleads"]}}',
        status: 1,
        add_segment_on_page_load: 1
      },
      {
        segment_id: 137353,
        segment_name: "Top 30",
        site_id: 2,
        segment_criteria: '{"include":{"contains":["top-30"]}}',
        status: 1,
        add_segment_on_page_load: 1
      },
      {
        segment_id: 137931,
        segment_name: "volkswagen",
        site_id: 2,
        segment_criteria: '{"include":{"contains":["volkswagen"]}}',
        status: 1,
        add_segment_on_page_load: 1
      }
    ]
  }; 

  var _pgD = {
    optinTriggerEvent: "on_load",
    parse: function(jsonString) {
      var parseData = {};
      try {
        parseData = JSON.parse(jsonString);
      } catch (e) {}
      return parseData;
    },
    stringify: function(objectData) {
      var jsonString = "{}";
      try {
        jsonString = JSON.stringify(objectData);
      } catch (e) {}
      return jsonString;
    },
    objectAssign: function() {
      var res = {};
      for (var i = 0; i < arguments.length; i++) {
        for (var x in arguments[i]) {
          res[x] = arguments[i][x];
        }
      }
      return res;
    },
    merchantSettings: {
      sm: function(parms) {
        var smPath = {
          worker: "/sw.js",
          manifest:
            "http://" + _pgSd.site.sSd + ".localhost:5500/manifest.json",
          workerStatus: true,
          scope: true
        };
        if (_pgSd.site.plateform == "shopify") {
          smPath.worker = "/sw.js";
        }
        switch (parms) {
          case "worker":
            return typeof pathvars != "undefined" &&
            typeof pathvars.worker != "undefined"
              ? pathvars.worker
              : smPath.worker;
            break;
          case "manifest":
            return typeof pathvars != "undefined" &&
            typeof pathvars.manifest != "undefined"
              ? pathvars.manifest
              : smPath.manifest;
            break;
          case "workerStatus":
            return typeof pathvars != "undefined" &&
            typeof pathvars.workerStatus != "undefined"
              ? pathvars.workerStatus
              : smPath.workerStatus;
            break;
          case "scope":
            return typeof pathvars != "undefined" &&
            typeof pathvars.scope != "undefined"
              ? pathvars.scope
              : smPath.scope;
            break;
          default:
        }
      },
      cookie: function() {
        if (
          typeof pathvars != "undefined" &&
          pathvars.hasOwnProperty("cookie") &&
          pathvars.cookie.hasOwnProperty("sites") &&
          pathvars.cookie.hasOwnProperty("fileName")
        ) {
          return pathvars.cookie;
        } else {
          return false;
        }
      },
      sites: {}
    },
    publicKey: function(base64String) {
      var padding = "=".repeat((4 - base64String.length % 4) % 4);
      var base64 = (base64String + padding)
        .replace(/\-/g, "+")
        .replace(/_/g, "/");
      var rawData = window.atob(base64);
      var outputArray = new Uint8Array(rawData.length);
      for (var i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
    },
    cookie: {
      optinHide: 7,
      global: 1460,
      get: function(cname) {
        var cookieValue = "";
        if (localStorage.getItem(cname) != null)
          cookieValue = localStorage.getItem(cname);
        if (!cookieValue) {
          var name = cname + "=";
          var ca = document.cookie.split(";");
          for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == " ") c = c.substring(1);
            if (c.indexOf(name) == 0)
              cookieValue = c.substring(name.length, c.length);
          }
        }
        return cookieValue;
      },
      set: function(data) {
        data.forEach(function(e) {
          var eT = new Date();
          eT.setDate(eT.getDate() + e[2]);
          eT = new Date(eT).toUTCString();
          if (e[4] == "local") {
            localStorage.setItem(e[0], e[1]);
          } else {
            document.cookie =
              "" +
              e[0] +
              "=" +
              e[1] +
              "; expires=" +
              eT +
              ";path=" +
              e[3] +
              ";SameSite=Lax";
            if (
              typeof navigator.cookieEnabled != "undefined" &&
              !navigator.cookieEnabled
            )
              localStorage.setItem(e[0], e[1]);
          }
        });
      },
      remove: function(data) {
        data.forEach(function(e) {
          if (e[1] == "local") {
            localStorage.removeItem(e[0]);
          }
        });
      }
    },
    funExecState: {
      widget: false,
      optinData: false,
      peSubscribe: false,
      subscribe: false,
      unsubWidget: false,
      checkSubscriptionIframe: false
    },
    resetFunExecState: function() {
      _pgD.funExecState.widget = false;
      _pgD.funExecState.optinData = false;
      _pgD.funExecState.peSubscribe = false;
      _pgD.funExecState.subscribe = false;
      _pgD.funExecState.unsubWidget = false;
      _pgD.funExecState.checkSubscriptionIframe = false;
    },
    getDataUrl: function(n) {
      //this.window.location.href = "http://localhost:5500";
      const publicUrl = window.location.href;
      var url = publicUrl;
      n = n.replace(/[\[\]]/g, "\\$&");
      var regex = new RegExp("[?&]" + n + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return "";
      return decodeURIComponent(results[2].replace(/\+/g, " "));
    },
    getInputUrl: function(n) {
      var val = _pgD.getDataUrl(n);
      return val == "true" ? true : false;
    },
    subSiteType: function() {
      var val = _pgD.getDataUrl("site_type");
      val =
        !val && location.protocol != "undefined"
          ? location.protocol.slice(0, -1)
          : val;
      return (val =
        !val && location.protocol == "undefined"
          ? _pgSd.site.optinSettins.siteType
          : val);
    },
    subOptinType: function() {
      var val = _pgD.getDataUrl("optin_type");
      val = val ? val : _pgD.optinSettings().optin_type;
      return Number(val);
    },
    subSegment: function() {
      var val = _pgD.getDataUrl("segment");
      return val ? val : false;
    },
    subUrl: function() {
      return document.referrer != "" && _pgD.getInputUrl("intermediate")
        ? document.referrer
        : "http://localhost:5500";
      // return "http://localhost:5500";
    },
    deviceToken: {
      cookie: function() {
        var cValue = _pgD.cookie.get("PushSubscriberID");
        return cValue != "false" && cValue != ""
          ? _pgD.getDeviceTokenFromEndPoint(cValue)
          : false;
      },
      value: false,
      status: function() {
        return _pgD.cookie.get("PushSubscriberStatus") == "SUBSCRIBED"
          ? true
          : false;
      }
    },
    bW: function() {
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
      uai = ua.indexOf("Edg");
      if (uai != -1) {
        tem = ua.substring(uai, uai + 6).split("/");
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
    },
    dT: function() {
      var dTCheck = "desktop";
      dTCheck = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
        ? "mobile"
        : dTCheck;
      return dTCheck;
    },
    sT: function() {
      var sT =
        location.protocol != "undefined" && location.protocol === "https:"
          ? "https"
          : "http";
      sT =
        location.protocol == "undefined"
          ? _pgSd.site.optinSettins.siteType
          : sT;
      return (sT = _pgD.bW().name == "Safari" ? "https" : sT);
    },
    insertFile: function(type, fName, src, callback) {
      var head = document.getElementsByTagName("head")[0];
      switch (type) {
        case "css":
          var src = src
            ? src
            : "http://" + _pgSd.site.sSd + ".localhost:5500/" + fName + ".css";
          var link = document.createElement("link");
          link.rel = "stylesheet";
          link.type = "text/css";
          link.href = src;
          link.media = "screen";
          head.appendChild(link);
          break;
        case "js":
          if (
            fName == "pushgeek-geo" &&
            !_pgSd.privacySettings.geoLocationEnabled
          )
            return callback(true);
          var src = src
            ? src
            : "http://" + _pgSd.site.sSd + ".localhost:5500/api/geo/" + fName + ".js";
          var script = document.createElement("script");
          script.src = src;
          script.onload = function() {
            if (typeof callback == "function") return callback(true);
          };
          head.appendChild(script);
          break;
        case "iframe":
          var src = src
            ? src
            : "http://" + _pgSd.site.sSd + ".localhost:5500/" + fName + ".html";
          document
            .getElementsByTagName("BODY")[0]
            .insertAdjacentHTML(
              "beforeend",
              '<iframe src="' +
                src +
                '" style="display:none;width:0px;height:0px;border:0px;" id="pg-' +
                fName +
                '-iframe"></iframe>'
            );
      }
    },
    bWSupport: function() {
      var bwSupport = false;
      var bW = _pgD.bW();
      bwSupport =
        (bW.name == "Chrome" && bW.version >= 49) ||
        (bW.name == "Firefox" && bW.version >= 46) ||
        (bW.name == "Safari" &&
          _pgD.dT() == "desktop" &&
          bW.version >= 7 &&
          bW.version != 10 &&
          !_pgSd.safari.default) ||
        (bW.name == "Opera" &&
          ((bW.version >= 37 && _pgD.dT() == "mobile") ||
            (bW.version >= 43 && _pgD.dT() == "desktop"))) ||
        (bW.name == "Edge" && bW.version >= 17) ||
        (bW.version >= 12 && bW.name == "Ucbrowser" && _pgD.dT() == "mobile")
          ? true
          : bwSupport;
      bwSupport =
        !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform)
          ? false
          : bwSupport;
      return bwSupport;
    },
    subOptinShow: function() {
      var subOptinShow = false;
      if (
        _pgD.cookie.get("pgclosed") === "" &&
        (_pgD.cookie.get("PushSubscriberID") === "false" ||
          _pgD.cookie.get("PushSubscriberID") === "")
      )
        subOptinShow = true;
      if (_pgD.sT() == "https" && _pgD.swSupport() == "1") {
        if (
          Notification.permission == "default" &&
          _pgD.cookie.get("PushSubscriberID") != ""
        )
          subOptinShow = true;
        else if (_pgD.cookie.get("pgclosed") === "") subOptinShow = true;
      } else {
        if (_pgD.cookie.get("pgclosed") === "") subOptinShow = true;
      }
      return subOptinShow;
    },
    optinSettings: function() {
      var browser = _pgD.bW();
      var deviceType = _pgD.dT();
      if (_pgD.dT() == "desktop") {
        var optinSettings =
          _pgD.sT() == "http"
            ? _pgSd.site.optinSettins.desHttp
            : _pgSd.site.optinSettins.desHttps;
      } else {
        var optinSettings =
          _pgD.sT() == "http"
            ? _pgSd.site.optinSettins.mobHttp
            : _pgSd.site.optinSettins.mobHttps;
      }
      if (
        (typeof dialog_box != "undefined" && dialog_box == true) ||
        optinSettings.optin_type == 5
      ) {
        optinSettings.optin_type = 4;
        optinSettings.optin_category = "delay";
        optinSettings.optin_delay = 0;
      }
      if (
        typeof optinSettings.optin_category != "undefined" &&
        optinSettings.optin_category != "" &&
        optinSettings.optin_category != null
      )
        _pgSd.subRule.activeType = optinSettings.optin_category;
      if (
        browser.name == "Safari" ||
        (deviceType == "desktop" &&
          browser.name == "Firefox" &&
          browser.version > 71)
      ) {
        if (browser.name == "Safari") {
          optinSettings.optin_sw_support = "1";
        }
        if (optinSettings.optin_type == 4) {
          _pgSd.customUrl = false;
          optinSettings.optin_sw_support = "1";
          optinSettings.optin_title = "Subscribe to notification";
          optinSettings.optin_type = 3;
          optinSettings.placement = "pg-bottom-right";
          optinSettings.bg = "#1b3343";
          optinSettings.allowBtnBg = "#ffffff";
          if (optinSettings.hasOwnProperty("bell")) {
            var bellOptions = optinSettings.bell;
            if (bellOptions.optin_title) {
              optinSettings.optin_title = bellOptions.optin_title;
            }
            if (bellOptions.placement) {
              optinSettings.placement = bellOptions.placement;
            }
            if (bellOptions.allowBtnBg) {
              optinSettings.allowBtnBg = bellOptions.allowBtnBg;
            }
            if (bellOptions.bg) {
              optinSettings.bg = bellOptions.bg;
            }
          }
        }
      }
      return optinSettings;
    },
    swSupport: function() {
      var _pgSwSupport =
        typeof _pgD.optinSettings().optin_sw_support != "undefined"
          ? _pgD.optinSettings().optin_sw_support
          : 0;
      if (_pgD.optinSettings().optin_type == 4 && _pgD.sT() == "https") {
        _pgSwSupport = 1;
      }
      return _pgSwSupport;
    },
    userPerDenied: function() {
      var perDenied =
        Notification.permission == "denied" ||
        _pgD.cookie.get("PushSubscriberStatus") == "CLOSED"
          ? true
          : false;
      perDenied =
        _pgD.sT() == "http"
          ? false
          : _pgD.swSupport() == "0" && !_pgD.getInputUrl("intermediate")
            ? false
            : perDenied;
      perDenied =
        _pgD.cookie.get("PushSubscriberStatus") == "UNSUBSCRIBED" ||
        _pgD.cookie.get("PushSubscriberStatus") == "CLOSED" ||
        _pgD.cookie.get("PushSubscriberStatus") == "DENIED"
          ? true
          : perDenied;
      return perDenied;
    },
    disabledSub: function() {
      var ds =
        typeof _pgD.optinSettings().popup_disabled == "undefined"
          ? "1"
          : _pgD.optinSettings().popup_disabled;
      return ds;
    },
    checkUserSubHttp: function() {
      return _pgD.cookie.get("pgclosed") == "true" &&
      _pgD.cookie.get("PushSubscriberID") != "" &&
      _pgD.cookie.get("PushSubscriberHash") != "" &&
      !_pgD.userPerDenied()
        ? true
        : false;
    },
    isPrivateBrowserForNewChrome: function() {
      return new Promise(function getPrivateBrowser(resolve) {
        if ("storage" in navigator && "estimate" in navigator.storage) {
          navigator.storage.estimate().then(function(bwData) {
            if (bwData.quota < 120000000) {
              resolve(true);
            } else {
              resolve(false);
            }
          });
        } else {
          resolve(false);
        }
      });
    },
    pvtBw: function(callback) {
      var bW = _pgD.bW();
      var browserName = bW.name;
      var browserVersion = bW.version;
      if (browserName === "Edge" && browserVersion >= "79") {
        browserName = "Chrome";
      }
      switch (browserName) {
        case "Chrome":
        case "Opera":
          if (browserVersion < 74) {
            var fs = window.RequestFileSystem || window.webkitRequestFileSystem;
            if (!fs) return;
            fs(
              window.TEMPORARY,
              100,
              function(fs) {
                callback(false);
              },
              function(err) {
                callback(true);
              }
            );
          } else {
            _pgD.isPrivateBrowserForNewChrome().then(function(isPrivate) {
              callback(isPrivate);
            });
          }
          break;
        case "Firefox":
          var db = indexedDB.open("test");
          db.onerror = function() {
            callback(true);
          };
          db.onsuccess = function() {
            callback(false);
          };
          break;
        case "Safari":
          var storage = window.sessionStorage;
          try {
            storage.setItem("someKeyHere", "test");
            storage.removeItem("someKeyHere");
            callback(false);
          } catch (e) {
            if (
              e.code === DOMException.QUOTA_EXCEEDED_ERR &&
              storage.length === 0
            ) {
              callback(true);
            }
          }
          break;
        case "Edge":
          try {
            localStorage.test = 2;
            callback(false);
          } catch (e) {
            callback(true);
          }
          break;
        case "Ucbrowser":
          callback(false);
          break;
        default:
          callback(true);
      }
    },
    checkApiValid: function() {
      return _pgD.bWSupport() ? true : false;
    },
    getId: function(id) {
      return document.getElementById(id);
    },
    httpRequest: function(data, callback) {
      var method = data.method ? data.method : "GET";
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && typeof callback === "function") {
          if (xhttp.responseText != "" && typeof xhttp.responseText == "string")
            return callback({
              data: xhttp.responseText,
              status: xhttp.status
            });
        }
      };
      var query = data.query || {};
      query = Object.keys(query)
        .map(function(key) {
          return key + "=" + encodeURIComponent(query[key]);
        })
        .join("&");
      var seperator = data.url.indexOf("?") === -1 ? "?" : "&";
      var url = query ? data.url + seperator + query : data.url;
      xhttp.open(method, url, true);
      if (data.requestHeader) {
        data.requestHeader.forEach(function getHeader(header) {
          xhttp.setRequestHeader(header.name, header.value);
        });
      }
      var data = data.reqData || {};
      xhttp.send(JSON.stringify(data));
    },
    sendRequestToServer: function(data, callback) {
      var method = data.method ? data.method : "POST";
      var reqData = data.reqData || {};
      if (data.isSiteId != false) reqData.site_id = Number(_pgSd.site.sSi);
      var query = data.query || {};
      query.swv = _pgSd.api.swv;
      query.bv = _pgE.bW.name;
      var url = (data.baseUrl || _pgSd.api.backendApi) + data.relApiPath;
      _pgD.httpRequest(
        {
          method: method,
          reqData: reqData,
          query: query,
          url: url,
          requestHeader: [
            {
              name: "Content-type",
              value: "application/json"
            }
          ]
        },
        function(res) {
          return callback(res.data);
        }
      );
    },
    optinAnalytics: function(data) {
      var widgetOptinType = _pgD.widget.optinType;
      if (
        !_pgSd.subA ||
        (data.optin_type == widgetOptinType &&
          _pgD.cookie.get("PushSubscribeWidgetAnalytics") == 1)
      )
        return;
      if (data.optin_type != widgetOptinType)
        data.optin_type = _pgD.subOptinType();
      data.site_id = _pgSd.site.sSi;
      var reqData = {
        Data: data,
        PartitionKey: "optin_analytics"
      };
      _pgD.httpRequest({
        method: "PUT",
        reqData: reqData,
        url: _pgSd.api.anyApi,
        requestHeader: [
          {
            name: "Content-type",
            value: "application/json"
          }
        ]
      });
      if (data.optin_type == widgetOptinType) {
        _pgD.cookie.set([
          ["PushSubscribeWidgetAnalytics", 1, "", "/", "local"]
        ]);
      }
    },
    resetStorage: function() {
      _pgD.cookie.set([
        ["PushSubscriberID", "", _pgD.cookie.global, "/", "local"],
        ["PushSubscriberStatus", "", _pgD.cookie.global, "/", "cookie"],
        ["PushSubscribeWidgetClosed", 0, false, "/", "local"],
        ["PushSegments", JSON.stringify({}), false, "/", "local"]
      ]);
    },
    hideHtml: function(e) {
      if (e) {
        e.style.visibility = "hidden";
        e.style.display = "none";
      }
    },
    showHtml: function(e) {
      if (e) {
        e.style.visibility = "visible";
        e.style.display = "block";
      }
    },
    rvHtml: function(e) {
      if (e) e.parentNode.removeChild(e);
    },
    addContent: function(content) {
      var body = document.getElementsByTagName("BODY")[0];
      if (body && content && typeof content == "object") {
        content.forEach(function(e) {
          body.insertAdjacentHTML("beforeend", e);
        });
      }
    },
    widget: {
      optinType: 127,
      getBoxImg: function() {
        if (!_pgSd.widget.bWBoxImg) return "";
        var bUrl =
          typeof _pgSd.widget.bWBoxImg.url != "undefined"
            ? _pgSd.widget.bWBoxImg.url
            : "";
        var bW = _pgD.bW();
        var browserName = bW.name;
        var browserVersion = bW.version;
        if (browserName === "Edge" && browserVersion >= "79") {
          browserName = "Chrome";
        }
        switch (browserName) {
          case "Firefox":
            return _pgE.dT == "desktop"
              ? bUrl + _pgSd.widget.bWBoxImg.firefox
              : bUrl + _pgSd.widget.bWBoxImg.firefoxM;
            break;
          case "Safari":
            return bUrl + _pgSd.widget.bWBoxImg.safari;
            break;
          case "Edge":
            return _pgE.dT == "desktop"
              ? bUrl + _pgSd.widget.bWBoxImg.edge
              : bUrl + _pgSd.widget.bWBoxImg.chromeM;
            break;
          case "Opera":
            return _pgE.dT == "desktop"
              ? bUrl + _pgSd.widget.bWBoxImg.opera
              : bUrl + _pgSd.widget.bWBoxImg.operaM;
            break;
          case "Ucbrowser":
            return _pgE.dT == "desktop"
              ? bUrl + _pgSd.widget.bWBoxImg.chrome
              : bUrl + _pgSd.widget.bWBoxImg.ucM;
            break;
          default:
            return _pgE.dT == "desktop"
              ? bUrl + _pgSd.widget.bWBoxImg.chrome
              : bUrl + _pgSd.widget.bWBoxImg.chromeM;
        }
      },
      status: function() {
        if (
          _pgSd.getWidget.status &&
          _pgD.cookie.get("PushSubscribeWidgetClosed") != "1"
        )
          return true;
        return false;
      },
      execStatus: function() {
        if (
          ((_pgD.userPerDenied() || _pgD.cookie.get("pgclosed") == "true") &&
            (_pgD.userPerDenied() || !_pgD.deviceToken.cookie())) ||
          (_pgD.cookie.get("PushSubscriberStatus") == "CLOSED" &&
            Notification.permission == "default")
        )
          return true;
        return false;
      },
      addHtml: function(callback) {
        if (_pgD.funExecState.widget) return;
        _pgD.funExecState.widget = true;
        if (!_pgD.widget.status() || !_pgD.widget.execStatus()) {
          return;
        }
        var widgetSetting = _pgSd.getWidget.data;
        var delay = widgetSetting.settings.delay;
        if (typeof delay == "string") {
          var delay = Number(delay);
        }
        setTimeout(function() {
          _pgD.addContent([_pgSd.getWidget.style, _pgSd.getWidget.html]);
          if (typeof widgetSetting.button != "undefined") {
            var widget = _pgD.getId("PG-chicklet"),
              widgetCloseBtn = _pgD.getId("pg-chicklet-close-btn"),
              widgetContent = _pgD.getId("PG-chicklet-content");
            function getWidth() {
              return widget.offsetWidth;
            }
            var pos, plac;
            if (_pgD.dT() == "mobile") {
              pos = widgetSetting.button.mobile_position;
              plac = widgetSetting.button.mobile_placement;
            } else {
              pos = widgetSetting.button.desktop_position;
              plac = widgetSetting.button.desktop_placement;
            }
            switch (pos) {
              case "left":
                switch (plac) {
                  case "top":
                    widget.classList.add("chicklet-left-top");
                    break;
                  case "bottom":
                    widget.classList.add("chicklet-left-bottom");
                    widget.style.transform =
                      "rotate(90deg) translateY(" + getWidth() + "px)";
                    break;
                  default:
                    widget.classList.add("chicklet-left-center");
                    widget.style.top = "calc(50% - " + getWidth() / 2 + "px)";
                }
                break;
              case "bottom":
                widgetCloseBtn.style.right = "0px";
                widgetCloseBtn.style.left = "unset";
                switch (plac) {
                  case "left":
                    widget.classList.add("chicklet-bottom-left");
                    break;
                  case "right":
                    widget.classList.add("chicklet-bottom-right");
                    break;
                  default:
                    widget.classList.add("chicklet-bottom-center");
                }
                break;
              default:
                switch (plac) {
                  case "top":
                    widget.classList.add("chicklet-right-top");
                    widget.style.transform =
                      "rotate(90deg) translateY(-" + getWidth() + "px)";
                    break;
                  case "bottom":
                    widget.classList.add("chicklet-right-bottom");
                    widget.style.bottom = "calc(50% - " + getWidth / 2 + "px)";
                    break;
                  default:
                    widget.classList.add("chicklet-right-center");
                    widget.style.bottom =
                      "calc(50% - " + getWidth() / 2 + "px)";
                }
            }
            if (widgetContent)
              widgetContent.addEventListener("click", function() {
                _pgD.widget.onClickWidget(widget, callback);
              });
            if (widgetCloseBtn) {
              widgetCloseBtn.addEventListener("click", function() {
                _pgD.rvHtml(widget);
                _pgD.cookie.set([
                  [
                    "PushSubscribeWidgetClosed",
                    1,
                    _pgE.cookie.optinHide,
                    "/",
                    "local"
                  ]
                ]);
              });
            }
          } else {
            var peLuncherMsg = _pgD.getId("pg-widget-bell-launcher-message");
            var widgetBell = _pgD.getId("pg-widget-bell");
            var widgetBellBody = _pgD.getId("pg-widget-bell-icon-body");
            if (widgetBell && widgetBellBody) {
              widgetBellBody.addEventListener("click", function() {
                _pgD.widget.onClickWidget(widgetBell, callback);
              });
              widgetBellBody.addEventListener("mouseover", function() {
                _pgD.showHtml(peLuncherMsg);
              });
              widgetBellBody.addEventListener("mouseout", function() {
                _pgD.hideHtml(peLuncherMsg);
              });
            }
          }
        }, delay * 1000);
      },
      onClickWidget: function(widget, callback) {
        _pgD.funExecState.widget = _pgD.funExecState.peSubscribe = false;
        _pgE.widgetClick = true;
        _pgD.optinAnalytics({
          allow_1: true,
          optin_1: true,
          optin_type: _pgD.widget.optinType
        });
        if (_pgD.cookie.get("PushSubscriberStatus") == "UNSUBSCRIBED")
          _pgE.refToken = true;
        _pg.showOptin(callback);
        _pgD.rvHtml(widget);
        _pgD.rvHtml(_pgD.getId("pg-widget-bell-style"));
        _pgD.rvHtml(_pgD.getId("PG-chicklet-style"));
      },
      addBoxHtml: function(callback) {
        function resubscribe() {
          _pgD.resetStorage();
          _pgSd.subRule.activeType == "delay";
          _pgE.optinSettings.optin_delay = 0;
          if (typeof pe == "undefined") {
            _pg.peSubscribe({}, callback);
          } else {
            pe.subscribe(callback);
          }
        }
        if (
          Notification.permission == "granted" &&
          _pgD.cookie.get("PushSubscriberStatus") == "UNSUBSCRIBED"
        ) {
          _pgE.refToken = true;
          return resubscribe();
        }
        if (
          Notification.permission == "default" &&
          _pgD.cookie.get("PushSubscriberStatus") == "CLOSED"
        ) {
          return resubscribe();
        }
        _pgD.addContent([_pgSd.widget.boxStyle, _pgSd.widget.boxHtml]);
        var imgId = _pgD.getId("PG-step-img");
        if (imgId) imgId.src = _pgD.widget.getBoxImg();
        var widget = _pgD.getId("PG-chicklet-inst-modal");
        if (widget) {
          widgetC = _pgD.getId("PG-cancel-btn");
          widgetC.addEventListener("click", function() {
            _pgD.rvHtml(widget);
            _pgD.rvHtml(_pgD.getId("PG-chicklet-inst-modal-style"));
            if (_pgE.sT == "https" && _pgE.swSupport == 1)
              _pgD.widget.addHtml(callback);
            if (_pgD.getInputUrl("intermediate")) pe.sendDataToBrowser();
          });
          widgetR = _pgD.getId("PG-retry-btn");
          widgetR.addEventListener("click", function() {
            if (
              Notification.permission == "granted" ||
              Notification.permission == "default"
            ) {
              _pgD.rvHtml(widget);
              _pgD.rvHtml(_pgD.getId("PG-chicklet-inst-modal-style"));
              if (
                Notification.permission == "default" &&
                _pgD.subOptinType() == "4"
              ) {
                _pgD.cookie.set([["PushSubscriberStatus", "", "/", "cookie"]]);
                location.reload();
              } else {
                resubscribe();
              }
            }
          });
        }
      },
      resetClosedCookie: function() {
        _pgD.cookie.set([["PushSubscribeWidgetClosed", 0, 1, "/", "local"]]);
      }
    },
    allowedDomain: function() {
      var dAllow = true;
      _pgSd.site.allowedDomain.forEach(function(e) {
        if (e.indexOf(location.hostname) != -1) dAllow = true;
      });
      return dAllow;
    },
    getDeviceTokenFromEndPoint: function(endpoint, status) {
      if (typeof endpoint == "string") {
        if (status == "init") {
          _pgD.deviceToken.value = endpoint;
        } else {
          var token =
            endpoint.indexOf("token=") > -1
              ? endpoint.slice(endpoint.search("token=") + 6)
              : endpoint.split("/")[endpoint.split("/").length - 1];
          return token;
        }
      } else {
        return false;
      }
    },
    getSubscription: function(callback) {
      if (_pgE.bW.name != "Safari") {
        navigator.serviceWorker
          .getRegistrations()
          .then(function(reg) {
            if (reg.length != 0) {
              var subApi;
              if (_pgD.merchantSettings.sm("scope")) {
                subApi = navigator.serviceWorker.ready;
              } else {
                subApi = navigator.serviceWorker.register(
                  _pgD.merchantSettings.sm("worker")
                );
              }
              subApi.then(function(reg1) {
                reg1.pushManager.getSubscription().then(function(sub) {
                  if (sub)
                    return callback({
                      worker: true,
                      sub: sub
                    });
                  return callback({
                    worker: true,
                    sub: false
                  });
                });
              });
            } else
              callback({
                worker: false,
                sub: false
              });
          })
          .catch(function(e) {
            callback({
              worker: false,
              sub: false
            });
          });
      } else {
        var sub = window.safari.pushNotification.permission(
          _pgSd.safari.pushId
        );
        if (sub.permission === "granted" && sub.deviceToken)
          return callback({
            worker: true,
            sub: sub
          });
        else
          return callback({
            worker: true,
            sub: false
          });
      }
    },
    bwUnsubscribe: function() {
      return new Promise(function(resolve, reject) {
        if (
          _pgE.bW.name == "Safari" ||
          _pgD.cookie.get("PushSubscribed") == "true"
        ) {
          return resolve({
            statuscode: 1
          });
        } else {
          if (_pgE.sT == "https") {
            if (_pgE.swSupport == 1) {
              _pgD.bwUnsubscribeAPI(resolve);
            } else {
              _pgD.insertFile("iframe", "unsubscribe", false);
              return resolve({
                statuscode: 1
              });
            }
          } else {
            return resolve({
              statuscode: 1
            });
          }
        }
      });
    },
    bwUnsubscribeAPI: function(callback) {
      _pgD.getSubscription(function(res) {
        if (res.worker && res.sub) {
          res.sub
            .unsubscribe()
            .then(function() {
              return callback({
                statuscode: 1
              });
            })
            .catch(function(e) {
              return callback({
                statuscode: 0
              });
            });
        } else
          return callback({
            statuscode: 1
          });
      });
    },
    recoverSubscriber: function(callback) {
      if (_pgE.bW.name != "Safari" && "serviceWorker" in navigator) {
        Promise.all([_pgD.bwUnsubscribe()]).then(function(res) {
          if (_pgE.sT == "https" && _pgE.swSupport == 1)
            _pg.peSubscribe(
              {
                resub: true
              },
              callback
            );
          else pe.subscribe(callback);
        });
      } else
        _pg.peSubscribe(
          {
            resub: true
          },
          callback
        );
    },
    resetCookie: function() {
      _pgD.cookie.set([
        ["pgclosed", "", 1, "/", "cookie"],
        ["PushSubscriberStatus", "", 1, "/", "cookie"],
        ["PushSubscriberID", "", false, "/", "local"],
        ["PushSubscriberHash", "", false, "/", "local"],
        ["PushPersonalNotificationStatus", "", false, "/", "local"]
      ]);
    },
    getTimezone: function() {
      try {
        var date = Date().match(/([\+-][0-9]+)/)[0].split("");
        var timezone = date[0] + date[1] + date[2] + ":" + date[3] + date[4];
      } catch (e) {
        var timezone = "+00:00";
      }
      return timezone;
    },
    getCordinate: async function(data) {

      // read our JSON
      let response = await fetch('http://demo.localhost:5500/api/geo/pushgeek-geo.js');
      data = await response.json();

      // wait 3 seconds
     // await new Promise((resolve, reject) => setTimeout(resolve, 3000));
      // console.log(data);
      return data;
    },
    modifyGeo: function(geoInfo) {
      // var cordinate = WebClient("http://demo.localhost:5500/api/geo/pushgeek-geo.json","GET");
      var cordinates = _pgD.getCordinate();
       console.log(`Cordinate Data : ${JSON.stringify(cordinates)}`)
      var timezone = _pgD.getTimezone();
      // var cordinates = _pgD.getCordinates();
      var geo = {
        geobytestimezone: timezone
      };
      console.log(`All Geo Data : ${JSON.stringify(geo)}`)
      if (typeof geoInfo === "object") {
        geo = _pgD.objectAssign(geo, geoInfo);
        if (_pgSd.site.isEu && geo.geobytesipaddress) {
          try {
            var ip = geo.geobytesipaddress;
            var ip_array = ip.split(".");
            ip_array.pop();
            geo.geobytesipaddress = ip_array.join(".");
          } catch (e) {
            delete geo.geobytesipaddress;
          }
        }
      }
      return geo;
    },
    isHttpsSite: function() {
      var isHttps = false;
      if (_pgD.sT() == "https" && _pgD.swSupport() == 1) {
        isHttps = true;
      }
      return isHttps;
    },
    removeExecHtml: function() {
      _pgD.rvHtml(_pgD.getId("pg_confirm"));
      _pgD.rvHtml(_pgD.getId("PG-chicklet"));
      _pgD.rvHtml(_pgD.getId("PG-chicklet-style"));
      _pgD.rvHtml(_pgD.getId("pg-widget-bell"));
      _pgD.rvHtml(_pgD.getId("pg-widget-bell-style"));
      _pgD.rvHtml(_pgD.getId("pg-overlay-backdrop"));
      _pgD.rvHtml(_pgD.getId("pg-overlay-backdrop-style"));
    },
    isQuiterUi: function() {
      var status = false;
      var browser = _pgD.bW();
      if (
        ((browser.name === "Chrome" || browser.name === "Edge") &&
          browser.version >= 80) ||
        (_pgD.dT() === "desktop" &&
          browser.name === "Firefox" &&
          browser.version >= 72) ||
        (browser.name === "Opera" && browser.version >= 67)
      ) {
        status = true;
      }
      return status;
    }
  };
   
  var _pgE = {
    bW: _pgD.bW(),
    dT: _pgD.dT(),
    sT: _pgD.sT(),
    bWSupport: _pgD.bWSupport(),
    optinSettings: _pgD.optinSettings(),
    swSupport: _pgD.swSupport(),
    disabledSub: _pgD.disabledSub(),
    checkApiValid: _pgD.checkApiValid(),
    subSegment: _pgD.subSegment(),
    cookie: {
      optinHide:
        typeof _pgD.optinSettings().cookie_duration != "undefined"
          ? Number(_pgD.optinSettings().cookie_duration)
          : _pgD.cookie.optinHide
    },
    subUrl: _pgD.subUrl(),
    refToken: _pgD.getInputUrl("ref_token"),
    widgetClick: _pgD.getInputUrl("widget_click")
  };
  var _pg = {
    customSiteCookie: {
      init: 0,
      set: 0,
      notSet: 0
    },
    _pgqi: {
      queue: [],
      init: function(q) {
        if (typeof q === "object" && q.length > 0) {
          q.forEach(function(e, i) {
            switch (e[0]) {
              case "init":
              case "subscribe":
              case "subscribe-on-click":
                if (e[0] == "subscribe" || e[0] == "subscribe-on-click") {
                  _pgD.optinTriggerEvent = "on_click";
                  _pgSd.subRule.activeType = "delay";
                  _pgE.optinSettings.optin_delay = 0;
                  _pgD.resetFunExecState();
                  _pgD.removeExecHtml();
                  _pgD.cookie.set([
                    ["PushSubscriberStatus", "", 0, "/", "cookie"],
                    ["pgclosed", "", 0, "/", "cookie"]
                  ]);
                  if (_pgD.userPerDenied()) {
                    return _pgD.widget.addBoxHtml(e[2]);
                  }
                }
                if (
                  _pgD.merchantSettings.cookie() &&
                  _pgD.subOptinShow() &&
                  _pgD.cookie.get("PushSubscribed") != "true"
                ) {
                  _pgD.merchantSettings.cookie().sites.forEach(function(e, i) {
                    if (e != "") {
                      _pgSd.site.allowedDomain.push(e);
                      e = e.replace(/\/$/, "");
                      _pgD.insertFile(
                        "iframe",
                        _pgD.merchantSettings
                          .cookie()
                          .fileName.replace(".", "-") + i,
                        e + "/" + _pgD.merchantSettings.cookie().fileName
                      );
                    }
                  });
                } else {
                  if (typeof q[0] === "object" && typeof q[0][0] === "object") {
                    if (q[0][0].hasOwnProperty("sites")) {
                      q[0][0].sites.forEach(function(e1) {
                        switch (e1.role) {
                          case "resubscribe":
                            _pgD.merchantSettings.sites.resubscribe = e1.url;
                            _pgSd.site.allowedDomain.push(e1.url);
                            if (
                              _pgD.subOptinShow() &&
                              _pgE.bW.name != "Safari"
                            ) {
                              _pgD.insertFile(
                                "iframe",
                                "resubscribe",
                                e1.url +
                                  "?intermediate=true&recover_subscriber_from_iframe=true"
                              );
                            } else _pg._pgqi.qInit();
                            break;
                          case "recoverSubscriberFromIframe":
                            _pgD.merchantSettings.sites.recoverSubscriberFromIframe =
                              e1.url;
                            _pgSd.site.allowedDomain.push(e1.url);
                            if (_pgE.bW.name != "Safari") {
                              if (_pg.checkSubscriptionStatus("https")) {
                                _pgD.recoverSubscriber();
                              } else {
                                var data = {
                                  state: "notSubscribed",
                                  source: "recoverSubscriberFromIframe",
                                  postOrigin: "iframe"
                                };
                                parent.postMessage(JSON.stringify(data), "*");
                              }
                            }
                        }
                      });
                    }
                  } else {
                    switch (e.length) {
                      case 2:
                        _pg.subscribe(e[1]);
                        break;
                      case 3:
                        if (typeof e[2] == "function")
                          _pg.subscribe(e[1], function(res) {
                            q[i][2](res);
                          });
                        break;
                      default:
                        _pg.subscribe();
                    }
                  }
                }
                break;
              case "add-to-segment":
                if (typeof e[1] != "undefined") {
                  _pg.addSubscriberToSegment(e[1], e[2]);
                }
                break;
              case "remove-to-segment":
                if (typeof e[1] != "undefined") {
                  _pg.removeSubscriberFromSegment(e[1], e[2]);
                }
                break;
              case "add-to-profile":
                switch (e.length) {
                  case 3:
                    if (typeof e[2] == "function")
                      _pg.addProfileId(e[1], function(res) {
                        q[i][2](res);
                      });
                    break;
                  default:
                    if (typeof e[1] != "undefined") _pg.addProfileId(e[1]);
                }
                break;
              case "add-to-dynamic-segment":
                if (e.length >= 2) {
                  var segments;
                  var cb;
                  if (typeof e[1] == "object" && e[1].length > 0) {
                    segments = e[1];
                    cb = e[2];
                  } else if (
                    e.length >= 3 &&
                    typeof e[1] == "string" &&
                    typeof e[2] === "number" &&
                    e[2] > 0
                  ) {
                    segments = [
                      {
                        name: e[1],
                        duration: e[2]
                      }
                    ];
                    cb = e[3];
                  } else {
                    cb = e[2] || e[3];
                    if (typeof cb == "function") {
                      return cb({
                        statuscode: 2,
                        mesage: _pg.msg.seg[1]
                      });
                    }
                    console.error(_pg.msg.segAdd[1]);
                    return;
                  }
                  _pg.addSubscriberToDynamicSegment(segments, cb);
                }
                break;
              case "subscriber-status":
                switch (e.length) {
                  case 2:
                    if (typeof e[1] == "function")
                      _pg.subscriberStatus(function(res) {
                        q[i][1](res);
                      });
                    break;
                }
                break;
              case "add-to-trigger":
                switch (e.length) {
                  case 2:
                    if (typeof e[1] == "object") _pg.trigger(e[1]);
                    break;
                }
                break;
              case "add-attributes":
                _pg.attributeOperationOnSubscriber(e[1], "PUT", e[2]);
                break;
              case "remove-attributes":
                _pg.attributeOperationOnSubscriber(e[1], "DELETE", e[2]);
                break;
              case "get-attributes":
                _pg.attributeOperationOnSubscriber({}, "GET", e[1]);
                break;
              case "set-attributes":
                _pg.attributeOperationOnSubscriber(e[1], "POST", e[2]);
                break;
              case "event":
                _pg.sendEvent(e[1], e[2]);
                break;
              case "add-alert":
                _pg.addAlert(e[1], e[2]);
                break;
              case "get-alerts":
                _pg.getAlerts(e[1], e[2]);
                break;
              case "remove-alerts":
                _pg.removeAlerts(e[1], e[2]);
                break;
              case "goal":
                _pg.sendGoal(e[1], e[2]);
                break;
              case "get-subscriber":
                _pg.getSubscriberData(e[1], e[2]);
                break;
              default:
            }
          });
        }
      },
      qInit: function(initName) {
        if (typeof _pg._pgqi.queue === "object" && _pg._pgqi.queue.length > 0) {
          _pg._pgqi.queue.forEach(function(e, i) {
            if (e[0] == "init") {
              _pgD.funExecState.subscribe = false;
              switch (e.length) {
                case 2:
                  _pg.subscribe(e[1]);
                  break;
                case 3:
                  var f = function(res) {
                    _pg._pgqi.queue[i][2](res);
                  };
                  if (initName == "resFun") return f;
                  _pg.subscribe(e[1], f);
                  break;
                default:
                  _pg.subscribe();
              }
            }
          });
        }
      }
    },
    msg: {
      seg: [
        "Your given segment is not valid",
        "Your given segment or days is not valid"
      ],
      segAdd: [
        "Segment added successfully",
        "Segment already added",
        "Segment not found"
      ],
      segRemove: ["Segment removed successfully", "Segment already removed"],
      profile: ["Profile added successfully", "Profile already exists"],
      error: [
        "Something went wrong",
        "Your browser does not support or, you have disabled PushGeek web push notification",
        "User not subscribed",
        "Your website url is not allowed, please configure in PushGeek correctly",
        "Subscriber is not valid for request api"
      ],
      success: [
        "User is unsubscribed successfully",
        "User is unsubscribed to automated personal notifications"
      ]
    },
    powByNot: function() {
      return _pgSd.site.powBy == "1" ? true : false;
    },
    peSubscribe: function(data, callback) {
      if (_pgD.funExecState.peSubscribe) return;
      _pgD.funExecState.peSubscribe = true;
      if (data.resub) {
        _pgE.refToken = true;
      }
      var browser = _pgE.bW;
      if (
        data.resub &&
        ((browser.name == "Firefox" && browser.version > 72) ||
          browser.name == "Safari")
      ) {
        return _pg.optinData(callback, data);
      }
      _pgD.insertFile("js", false, _pgSd.api.pushJs, function(res) {
        pe.subscribe(callback);
      });
    },
    apiNotValid: function() {
      if (!_pgD.allowedDomain())
        return {
          statuscode: 20,
          message: _pg.msg.error[3]
        };
      if (!_pgE.checkApiValid)
        return {
          statuscode: 21,
          message: _pg.msg.error[1]
        };
      if (!_pgD.deviceToken.cookie() || _pgD.userPerDenied())
        return {
          statuscode: 22,
          message: _pg.msg.error[2]
        };
      if (_pgD.deviceToken.cookie() == "true")
        return {
          statuscode: 23,
          message: _pg.msg.error[4]
        };
      return false;
    },
    apiSubNotValid: function() {
      if (!_pgD.allowedDomain())
        return {
          statuscode: 20,
          message: _pg.msg.error[3]
        };
      if (!_pgE.checkApiValid)
        return {
          statuscode: 21,
          message: _pg.msg.error[1]
        };
      return false;
    },
    referUrl: function(refer) {
      refer += "&refer=true";
      _pgD.cookie.set([
        ["PushSubscriberID", true, _pgD.cookie.global, "/", "local"]
      ]);
      window.location = refer;
    },
    showOptin: function(callback, resubscribeData) {
      var referlink =
        "http://" +
        _pgSd.site.sSd +
        ".localhost:5500?action=subscribe&optin_type=" +
        _pgE.optinSettings.optin_type +
        "&intermediate=true&ref_token=" +
        _pgE.refToken +
        "&site_type=" +
        _pgE.sT +
        "&widget_click=" +
        _pgE.widgetClick;
      referlink =
        _pgE.subSegment && typeof _pgE.subSegment == "string"
          ? referlink + "&segment=" + _pgE.subSegment
          : referlink;
      if (_pgSd.customUrl && _pgE.optinSettings.optin_type != 4) {
        referlink = _pgSd.customUrl.url;
        referlink += referlink.indexOf("?") == -1 ? "?" : "&";
        referlink +=
          "action=subscribe&optin_type=" +
          _pgE.optinSettings.optin_type +
          "&intermediate=true&site_type=" +
          _pgE.sT;
        referlink = _pgE.subSegment
          ? referlink + "&segment=" + _pgE.subSegment
          : referlink;
        if (
          _pgSd.customUrl.type == "window" &&
          typeof window.open === "function"
        ) {
          window.open(referlink, "_blank", "width=800, height=600");
          return;
        } else if (
          (_pgSd.customUrl.type == "tab" || _pgSd.customUrl.type == "same") &&
          typeof window.open === "function"
        ) {
          window.open(referlink);
          return;
        }
        _pg.referUrl(referlink);
        return;
      } else if (_pgE.sT == "https" || _pgE.bW.name == "Safari") {
        if (_pgE.swSupport == 0) {
          if (typeof window.open === "function") {
            window.open(referlink, "_blank", "width=800, height=600");
            return;
          } else {
            _pg.referUrl(referlink);
            return;
          }
        }
        if (resubscribeData && resubscribeData.resub) {
          _pgD.insertFile("js", false, _pgSd.api.pushJs, function(res) {
            pe.subscribe(callback);
          });
          return;
        }
        return _pg.peSubscribe(
          {
            resub: false
          },
          callback
        );
      }
      if (typeof window.open === "function")
        window.open(referlink, "_blank", "width=800, height=600");
      else _pg.referUrl(referlink);
    },
    optinData: function(callback, resubscribeData) {
      if (_pgD.funExecState.optinData) return;
      _pgD.funExecState.optinData = true;
      if (_pgD.optinTriggerEvent === "on_click") {
        return _pg.showOptin(callback, resubscribeData);
      }
      var optinHtml = false,
        powByCss = "";
      if (_pg.powByNot()) {
        var powByCss = "display:none";
      }
      switch (Number(_pgE.optinSettings.optin_type)) {
        case 3:
          optinHtml = [
            '<div id="pg_confirm" class="pg-optin-3 pg-' +
              _pgE.dT +
              " " +
              _pgE.optinSettings.placement +
              '" style="background:' +
              _pgE.optinSettings.bg +
              ';visibility: visible;">',
            '<div id="pg-optin-3-bell-launcher-message" style="visibility: visible; display: none;"><div id="pg-optin-3-mang-bell-launcher-message-body">',
            _pgE.optinSettings.optin_title,
            "</div></div>",
            '<div class="pg-optin-3_allowBtn pg-swing" id="pg_allow_btn"><svg style="width:40px;height:40px" viewBox="0 0 24 24" id="pg-optin-3-bell-icon"> <path fill="' +
              _pgE.optinSettings.allowBtnBg +
              '" d="M12,22A2,2 0 0,0 14,20H10A2,2 0 0,0 12,22M18,16V11C18,7.93 16.36,5.36 13.5,4.68V4A1.5,1.5 0 0,0 12,2.5A1.5,1.5 0 0,0 10.5,4V4.68C7.63,5.36 6,7.92 6,11V16L4,18V19H20V18L18,16Z" /> </svg></div>',
            "</div>"
          ].join("\n");
          break;
        case 1:
          optinHtml = [
            '<div id="pg_confirm" class="pg-optin-1 pg-' +
              _pgE.dT +
              " " +
              _pgE.optinSettings.placement +
              '" style="background:' +
              _pgE.optinSettings.bg +
              ';visibility: visible;">',
            '<div class="pg-optin-1_imgWrapper" style="margin-right:352px"><img src="' +
              _pgSd.site.sI +
              '" style="max-width:60px;max-height:60px;"></div>',
            '<div class="pg-optin-1_titleWrapper" style="font-size:15px;font-weight:500;color:#232323">' +
              _pgE.optinSettings.optin_title +
              "</div>",
            '<div id="pg-action-btn-wrapper" class="pg-optin-1_actionbuttonWrapper" style="clear:both">',
            '<div style="float:left;height:22px;line-height:22px;margin-top:10px;' +
              powByCss +
              '"><a href="https://www.localhost:5500" class="pg-optin-1_brandingWrapper" target="_blank">Powered by PushGeek</a></div>',
            '<div id="pg_allow_btn" class="pg-optin-1_allowWrapper" style="background-color:' +
              _pgE.optinSettings.allowBtnBg +
              ';color:#fff;">' +
              _pgE.optinSettings.optin_allow_btn_txt +
              "</div>",
            '<div id="pg_close_btn" class="pg-optin-1_closeWrapper" style="background-color:' +
              _pgE.optinSettings.closeBtnBg +
              ';color:#000;margin-right:10px">' +
              _pgE.optinSettings.optin_close_btn_txt +
              "</div>",
            "</div>",
            "</div>"
          ].join("\n");
          break;
        default:
          _pg.peSubscribe(
            {
              resub: false
            },
            callback
          );
      }
      if (optinHtml) {
        _pgE.optinSettings.optin_type == _pgSd.customOptin.optinType &&
        _pgSd.customOptin.css != ""
          ? _pgD.insertFile("css", false, _pgSd.customOptin.css)
          : _pgD.insertFile("css", "dialog");
        _pgD.addContent([optinHtml]);
      }
      var peConf = _pgD.getId("pg_confirm");
      var allowBtn = _pgD.getId("pg_allow_btn");
      if (allowBtn) {
        allowBtn.addEventListener("click", function() {
          if (peConf) {
            if (_pgE.optinSettings.optin_type == 8) {
              if (
                _pgD.getId("pg_seg1_btn") &&
                _pgD.getId("pg_seg1_btn").checked
              )
                _pgE.subSegment = _pgD.getId("pg_seg1_btn").value;
              if (
                _pgD.getId("pg_seg2_btn") &&
                _pgD.getId("pg_seg2_btn").checked
              )
                _pgE.subSegment = _pgD.getId("pg_seg2_btn").value;
            }
            _pgD.rvHtml(peConf);
            _pg.showOptin(callback, resubscribeData);
            _pgD.widget.resetClosedCookie();
          }
        });
      }
      var closeBtn = _pgD.getId("pg_close_btn");
      if (closeBtn) {
        closeBtn.addEventListener("click", function() {
          if (peConf) {
            _pgD.optinAnalytics({
              block_1: true,
              optin_1: true
            });
            _pgD.hideHtml(peConf);
            _pgD.cookie.set([
              ["pgclosed", true, _pgE.cookie.optinHide, "/", "cookie"]
            ]);
            _pgD.cookie.remove([
              ["PushPersonalNotificationStatus", "local"],
              ["PushSubscriberHash", "local"],
              ["PushSubscriberID", "local"]
            ]);
            _pgD.widget.resetClosedCookie();
            _pgD.widget.addHtml(callback);
          }
        });
      }
      if (_pgE.optinSettings.optin_type == "3" && peConf) {
        var peLuncherMsg = _pgD.getId("pg-optin-3-bell-launcher-message");
        var optin3Body = _pgD.getId("pg_allow_btn");
        if (optin3Body && peLuncherMsg) {
          optin3Body.addEventListener("mouseover", function() {
            _pgD.showHtml(peLuncherMsg);
          });
          optin3Body.addEventListener("mouseout", function() {
            _pgD.hideHtml(peLuncherMsg);
          });
        }
      }
    },
    subMangWidget: {
      status: function() {
        var s =
          _pgSd.subMangWidget.status &&
          (_pgD.deviceToken.cookie() &&
            _pgD.cookie.get("PushSubscriberStatus") == "SUBSCRIBED")
            ? true
            : false;
        if (s) {
          if (_pgD.isHttpsSite()) {
            if (Notification.permission == "granted") s = true;
            else s = false;
          } else {
            if (_pgD.cookie.get("pgclosed") === "") {
              s = false;
            }
          }
        }
        if (s && _pgSd.subMangWidget.settings.rule == "custom") {
          switch (_pgSd.subMangWidget.settings.customRule) {
            case "exact":
              s =
                "http://localhost:5500" ==
                _pgSd.subMangWidget.settings.customRuleValue
                  ? true
                  : false;
              break;
            case "contains":
              s =
                "http://localhost:5500".indexOf(
                  _pgSd.subMangWidget.settings.customRuleValue
                ) !== -1
                  ? true
                  : false;
              break;
            default:
              s =
                "http://localhost:5500".substring(
                  0,
                  _pgSd.subMangWidget.settings.customRuleValue.length
                ) == _pgSd.subMangWidget.settings.customRuleValue
                  ? true
                  : false;
          }
        }
        return s;
      },
      addHtml: function(callback) {
        var unsubStatus = _pgD.cookie.get("PushSubscriberStatus");
        if (_pg.subMangWidget.status()) {
          if (_pgD.funExecState.unsubWidget) return;
          _pgD.funExecState.unsubWidget = true;
          _pgD.addContent([_pgSd.subMangWidget.html, _pgSd.subMangWidget.css]);
          if (_pgSd.subMangWidget.settings.type == "bell") {
            var subMang = _pgD.getId("pg-bell-sub-mang-widget"),
              subMangBell = _pgD.getId("pg-bell-sub-mang-widget-body");
            function unsubCheck(e) {
              if (unsubStatus == "UNSUBSCRIBED") {
                _pgD.hideHtml(e);
              } else {
                _pgD.showHtml(e);
              }
            }
            if (subMangBell) {
              var unsub = _pgD.getId("pg-unsubscribe-btn"),
                dialog = _pgD.getId("pg-sub-mang-bell-dialog"),
                msg = _pgD.getId("pg-sub-mang-bell-launcher-message"),
                msgBody = _pgD.getId("pg-sub-mang-bell-launcher-message-body");
              unsubCheck(subMang);
              if (_pgSd.subMangWidget.msg.unSubPersonalNoti) {
                var personalNotiMangBtn = _pgD.getId(
                  "pg-personal-noti-mang-btn"
                );
                if (personalNotiMangBtn) {
                  personalNotiMangBtn.innerHTML =
                    _pgSd.subMangWidget.msg.unSubPersonalNotiUnsubBtnMsg;
                  var PushPersonalReqData = {
                    status: 1
                  };
                  if (
                    _pgD.cookie.get("PushPersonalNotificationStatus") == "false"
                  ) {
                    personalNotiMangBtn.innerHTML =
                      _pgSd.subMangWidget.msg.unSubPersonalNotiSubBtnMsg;
                    PushPersonalReqData.status = 0;
                  }
                  personalNotiMangBtn.addEventListener("click", function() {
                    _pg.personalNotificationManagement(
                      PushPersonalReqData,
                      function(res) {
                        if (res.statuscode == 1) {
                          if (PushPersonalReqData.status == 0) {
                            _pgD.cookie.set([
                              [
                                "PushPersonalNotificationStatus",
                                true,
                                _pgD.cookie.global,
                                "/",
                                "local"
                              ]
                            ]);
                            personalNotiMangBtn.innerHTML =
                              _pgSd.subMangWidget.msg.unSubPersonalNotiUnsubBtnMsg;
                            PushPersonalReqData.status = 1;
                          } else {
                            _pgD.cookie.set([
                              [
                                "PushPersonalNotificationStatus",
                                false,
                                _pgD.cookie.global,
                                "/",
                                "local"
                              ]
                            ]);
                            personalNotiMangBtn.innerHTML =
                              _pgSd.subMangWidget.msg.unSubPersonalNotiSubBtnMsg;
                            PushPersonalReqData.status = 0;
                          }
                        }
                      }
                    );
                  });
                }
              }
              subMangBell.addEventListener("click", function() {
                if (dialog) {
                  if (dialog.style.display == "block") _pgD.hideHtml(dialog);
                  else {
                    _pgD.showHtml(dialog);
                    _pgD.hideHtml(msg);
                  }
                }
                unsubCheck(unsub);
              });
              subMangBell.addEventListener("mouseover", function() {
                if (unsubStatus == "UNSUBSCRIBED")
                  msgBody.innerHTML = _pgSd.subMangWidget.msg.thankMsg;
                else msgBody.innerHTML = _pgSd.subMangWidget.msg.unsubMsg;
                if (dialog && dialog.style.display != "block")
                  _pgD.showHtml(msg);
              });
              subMangBell.addEventListener("mouseout", function() {
                _pgD.hideHtml(msg);
              });
              if (unsub) {
                unsub.addEventListener("click", function() {
                  _pgD.resetFunExecState();
                  _pgD.hideHtml(dialog);
                  _pg.unsubscribe(function(res) {
                    if (res.statuscode == 1) {
                      _pgD.cookie.set([
                        [
                          "PushSubscriberStatus",
                          "UNSUBSCRIBED",
                          _pgD.cookie.global,
                          "/",
                          "cookie"
                        ]
                      ]);
                      msgBody.innerHTML = _pgSd.subMangWidget.msg.thankMsg;
                      _pgD.showHtml(msg);
                      setTimeout(function() {
                        _pgD.rvHtml(subMang);
                        _pgD.funExecState.widget = false;
                        _pgD.widget.addHtml(callback);
                      }, 2000);
                    }
                  });
                });
              }
            }
          } else {
            var subMangBtn = _pgD.getId("pg-button-sub-mang-widget");
            if (subMangBtn) {
              var unsub = _pgD.getId("pg-unsubscribe-btn"),
                unsubAction = _pgD.getId("pg-unsubscribe-btn-action");
              if (unsubStatus == "UNSUBSCRIBED") {
                _pgD.hideHtml(subMangBtn);
              } else {
                _pgD.showHtml(unsub);
              }
              if (unsub) {
                unsub.addEventListener("click", function() {
                  _pgD.showHtml(unsubAction);
                  _pgD.hideHtml(unsub);
                });
              }
              var unsubYes = _pgD.getId("pg-unsubscribe-btn-yes");
              if (unsubYes) {
                unsubYes.addEventListener("click", function() {
                  _pgD.resetFunExecState();
                  _pg.unsubscribe(function(res) {
                    if (res.statuscode == 1) {
                      _pgD.cookie.set([
                        [
                          "PushSubscriberStatus",
                          "UNSUBSCRIBED",
                          _pgD.cookie.global,
                          "/",
                          "cookie"
                        ]
                      ]);
                      _pgD.hideHtml(unsubAction);
                      _pgD.showHtml(unsub);
                      unsub.innerHTML = _pgSd.subMangWidget.msg.thankMsg;
                      setTimeout(function() {
                        _pgD.rvHtml(subMangBtn);
                        _pgD.funExecState.widget = false;
                        _pgD.widget.addHtml(callback);
                      }, 2000);
                    } else {
                      _pgD.showHtml(unsub);
                      _pgD.hideHtml(unsubAction);
                    }
                  });
                });
              }
              var unsubNo = _pgD.getId("pg-unsubscribe-btn-no");
              if (unsubNo) {
                unsubNo.addEventListener("click", function() {
                  _pgD.hideHtml(unsubAction);
                  _pgD.showHtml(unsub);
                });
              }
            }
          }
        }
      }
    },
    optinMang: function() {
      function decodeURIComponentSafe(uri, mod) {
        var out = new String(),
          arr,
          i = 0,
          l,
          x;
        typeof mod === "undefined" ? (mod = 0) : 0;
        arr = uri.split(/(%(?:d0|d1)%.{2})/);
        for (l = arr.length; i < l; i++) {
          try {
            x = decodeURIComponent(arr[i]);
          } catch (e) {
            x = mod ? arr[i].replace(/%(?!\d+)/g, "%25") : arr[i];
          }
          out += x;
        }
        return out;
      }
      if (_pgSd.optinMang && _pgSd.optinMang.active) {
        try {
          var rule = _pgSd.optinMang.active,
          ruleValue = _pgSd.optinMang.value,
          s = false;
        for (var i = 0; i < Object.keys(ruleValue).length; i++) {
          var v = ruleValue[i].value,
            cv = "http://localhost:5500";
          switch (ruleValue[i].rule) {
            case "exact":
              s =
                encodeURI(cv) == v ||
                decodeURIComponentSafe(String(cv)) == v ||
                encodeURI(v) == cv ||
                decodeURIComponentSafe(String(v)) == cv ||
                cv == v
                  ? true
                  : false;
              break;
            case "contains":
              s =
                encodeURI(cv).indexOf(v) !== -1 ||
                decodeURIComponentSafe(cv).indexOf(v) !== -1 ||
                cv.indexOf(encodeURI(v)) !== -1 ||
                cv.indexOf(decodeURIComponentSafe(v)) !== -1 ||
                cv.indexOf(v) !== -1
                  ? true
                  : false;
              break;
            default:
              s =
                encodeURI(cv).substring(0, v.length) == v ||
                decodeURIComponentSafe(cv).substring(0, v.length) == v ||
                cv.substring(0, decodeURIComponentSafe(v).length) ==
                  encodeURI(v) ||
                cv.substring(0, decodeURIComponentSafe(v).length) ==
                  decodeURIComponentSafe(v) ||
                cv.substring(0, v.length) == v
                  ? true
                  : false;
          }
          if (s) break;
        }
        return (s = rule == "exclude" ? !s : s);
        } catch (error) {
          console.log(error);
        }
      }
      return true;
    },
    calScrollPer: function() {
      var b = document.body,
        dE = document.documentElement,
        sT = window.pageYOffset || dE.scrollTop || b.scrollTop,
        dH = dE.offsetHeight || b.offsetHeight,
        wH = window.innerHeight,
        sP = dH !== wH && dH > wH ? sT / (dH - wH) : 0;
      var p =
        dH == wH || wH > dH
          ? _pgE.optinSettings.optin_scroll
          : Math.round(sP * 100);
      if (
        p >= _pgE.optinSettings.optin_scroll - 3 &&
        p <= _pgE.optinSettings.optin_scroll + 3
      ) {
        if (typeof _pg._pgqi.queue === "object" && _pg._pgqi.queue.length > 0) {
          _pg._pgqi.queue.forEach(function(e, i) {
            if (e[0] == "init") {
              if (e.length == 3)
                _pg.optinData(function(res) {
                  _pg._pgqi.queue[i][2](res);
                });
              else _pg.optinData();
            }
          });
        } else {
          _pg.optinData();
        }
        window.removeEventListener("scroll", _pg.calScrollPer);
      }
    },
    scrollEvent: function(callback) {
      window.addEventListener("scroll", _pg.calScrollPer);
    },
    insertOptin: function(callback) {
      if (_pgE.disabledSub == "1" && _pg.optinMang()) {
        if (!_pgD.userPerDenied() && _pgD.subOptinShow()) {
          switch (_pgSd.subRule.activeType) {
            case "scroll":
              _pg.scrollEvent(callback);
              _pg.calScrollPer(callback);
              break;
            default:
              var Od = _pgE.optinSettings.optin_delay;
              var delay =
                typeof Od == "number"
                  ? Od
                  : typeof Od == "string" ? Number(Od) : 0;
              delay = delay * 1000;
              setTimeout(function() {
                _pg.optinData(callback);
              }, delay);
          }
        } else {
          _pgD.widget.addHtml(callback);
        }
      }
    },
    subscribed: function(callback) {
      _pg.subMangWidget.addHtml(callback);
      _pg.updateSubData();
      _pg.addSegmentOnPageLoad();
    },
    subscribe: function(segment, callback) {
      if (document.readyState != "complete") {
        setTimeout(function() {
          _pg.subscribe(segment, callback);
        }, 100);
        return;
      }
      if (_pgD.funExecState.subscribe) return;
      _pgD.funExecState.subscribe = true;
      var ApiNo = _pg.apiSubNotValid();
      if (ApiNo)
        return typeof callback === "function"
          ? callback(ApiNo)
          : console.log(ApiNo);
      _pgD.pvtBw(function(res) {
        if (!res && _pgD.cookie.get("PushSubscribed") != "true") {
          if (typeof segment == "string" || typeof segment == "object") {
            _pgE.subSegment = segment.toString();
          }
          if (_pgD.isHttpsSite()) {
            if (_pg.checkSubscriptionStatus("https")) {
              _pg.checkSubscription(
                {
                  type: "https"
                },
                callback,
                function(res) {
                  if (res.valid) {
                    _pg.subscribed(callback);
                  }
                }
              );
              return;
            } else {
              _pg.insertOptin(callback);
            }
          } else {
            if (_pg.checkSubscriptionStatus("http")) {
              _pg.checkSubscription(
                {
                  type: "http"
                },
                callback,
                function(res) {
                  if (res.valid) {
                    _pg.subscribed(callback);
                  }
                }
              );
              return;
            } else {
              _pg.insertOptin(callback);
            }
          }
        } else {
          var jsonRes = {
            statuscode: 21,
            message: _pg.msg.error[1]
          };
          return typeof callback === "function"
            ? callback(jsonRes)
            : console.log(jsonRes);
        }
      });
    },
    openDialogBox: function(segment) {
      if (!_pgE.checkApiValid) return;
      if (_pgE.sT == "http" || (_pgE.sT == "https" && _pgE.swSupport == 0)) {
        var referlink =
          "http://" +
          _pgSd.site.sSd +
          ".localhost:5500?action=subscribe&optin_type=" +
          _pgE.optinSettings.optin_type +
          "&intermediate=true&ref_token=" +
          _pgE.refToken +
          "&site_type=" +
          _pgE.sT +
          "&widget_click=" +
          _pgE.widgetClick;
        referlink =
          segment && typeof segment === "string"
            ? referlink + "&segment=" + segment
            : referlink;
        if (typeof window.open === "function")
          window.open(referlink, "_blank", "width=800, height=600");
        else window.location = referlink;
      }
    },
    addSubscriberToSegment: function(segment, callback) {
      var apiNotValid = _pg.apiNotValid();
      if (apiNotValid) {
        if (typeof callback == "function") {
          callback(apiNotValid);
        }
        return;
      }
      var data = {
        relApiPath: "/subscribe/segments/add",
        reqData: {
          segment: segment,
          device_token_hash: _pgD.cookie.get("PushSubscriberHash")
        }
      };
      _pgD.sendRequestToServer(data, function(res) {
        if (typeof callback === "function") {
          var resObj = {};
          try {
            resObj = JSON.parse(res);
            if (resObj.error_code === 0) {
              resObj.statuscode = 1;
              resObj.message = _pg.msg.segAdd[0];
            } else {
              resObj.statuscode = 2;
              resObj.message = resObj.error_message;
            }
          } catch (err) {
            resObj.statuscode = 0;
            resObj.message = _pg.msg.error[0];
          }
          callback(resObj);
        }
      });
    },
    addSubscriberToDynamicSegment: function(segments, callback) {
      var apiNotValid = _pg.apiNotValid();
      if (apiNotValid) {
        if (typeof callback == "function") {
          callback(apiNotValid);
        }
        return;
      }
      var data = {
        relApiPath: "/subscribe/dynamicSegments/add",
        reqData: {
          segments: segments,
          device_token_hash: _pgD.cookie.get("PushSubscriberHash")
        }
      };
      _pgD.sendRequestToServer(data, function(res) {
        if (typeof callback === "function") {
          var resObj = {};
          try {
            resObj = JSON.parse(res);
            if (resObj.error_code === 0) {
              resObj.statuscode = 1;
              resObj.message = _pg.msg.segAdd[0];
            } else {
              resObj.statuscode = 2;
              resObj.message = resObj.error_message;
            }
          } catch (err) {
            resObj.statuscode = 0;
            resObj.message = _pg.msg.error[0];
          }
          callback(resObj);
        }
      });
    },
    removeSubscriberFromSegment: function(segment, callback) {
      var apiNotValid = _pg.apiNotValid();
      if (apiNotValid) {
        if (typeof callback == "function") {
          callback(apiNotValid);
        }
        return;
      }
      var data = {
        relApiPath: "/subscribe/segments/remove",
        reqData: {
          segment: segment,
          device_token_hash: _pgD.cookie.get("PushSubscriberHash")
        }
      };
      _pgD.sendRequestToServer(data, function(res) {
        var resObj = {};
        try {
          resObj = JSON.parse(res);
          if (resObj.error_code === 0) {
            resObj.statuscode = 1;
            resObj.message = _pg.msg.segRemove[0];
            var storageSegments;
            if (Array.isArray(segment)) {
              storageSegments = segment;
            } else {
              storageSegments = [segment];
            }
            _pg.removeSegmentsFromStorage(storageSegments);
          } else {
            resObj.statuscode = 2;
            resObj.message = resObj.error_message;
          }
        } catch (err) {
          resObj.statuscode = 0;
          resObj.message = _pg.msg.error[0];
        }
        if (typeof callback === "function") {
          callback(resObj);
        }
      });
    },
    addProfileId: function(profileId, callback) {
      var ApiNo = _pg.apiNotValid();
      if (typeof callback == "function") {
        if (ApiNo) return callback(ApiNo);
        if (
          !profileId ||
          typeof profileId !== "string" ||
          profileId == "" ||
          typeof profileId == "undefined"
        )
          return callback({
            statuscode: 24,
            message: "Your given profile id is not valid"
          });
      } else if (ApiNo) {
        console.log(ApiNo);
        return;
      }
      var data = {
        relApiPath: "/subscribe/profile-id/add",
        reqData: {
          profile_id: profileId,
          device_token_hash: _pgD.cookie.get("PushSubscriberHash")
        }
      };
      _pgD.sendRequestToServer(data, function(res) {
        if (typeof callback == "function") {
          res = JSON.parse(res);
          var resObj = {
            statuscode: 0,
            message: _pg.msg.seg[0]
          };
          switch (res.error_code) {
            case 0:
              resObj.statuscode = 1;
              resObj.message = _pg.msg.profile[0];
              break;
            case 1001:
              resObj.statuscode = 2;
              resObj.message = _pg.msg.profile[1];
          }
          return callback(resObj);
        }
      });
    },
    attributeOperationOnSubscriber: function(
      customAttributes,
      method,
      callback
    ) {
      var apiNotValid = _pg.apiNotValid();
      if (apiNotValid) {
        if (typeof callback == "function") {
          return callback(apiNotValid);
        }
        console.log(apiNotValid);
        return;
      }
      var hash = _pgD.cookie.get("PushSubscriberHash");
      var data = {
        relApiPath: "/subscribe/" + hash + "/attributes",
        method: method,
        reqData: customAttributes,
        isSiteId: false
      };
      _pgD.sendRequestToServer(data, function(res) {
        var resObj = {};
        var res;
        try {
          res = JSON.parse(res);
          if (res.error_code === 0) {
            switch (method) {
              case "GET":
                resObj.statuscode = 1;
                resObj.message = "";
                resObj.data = res.data;
                break;
              case "PUT":
                resObj.statuscode = 1;
                resObj.message = "Attribute added successfully";
                resObj.data = res.data;
                break;
              case "POST":
                resObj.statuscode = 1;
                resObj.message = "Attribute replaced successfully";
                resObj.data = res.data;
                break;
              case "DELETE":
                resObj.statuscode = 1;
                resObj.message = "Attribute removed successfully";
                resObj.data = res.data;
                break;
            }
          } else {
            resObj.statuscode = res.error_code;
            resObj.message = res.error_message;
            resObj.data = res.data;
          }
        } catch (err) {
          resObj.statuscode = 0;
          resObj.message = _pg.msg.error[0];
        }
        if (typeof callback === "function") {
          return callback(resObj);
        }
      });
    },
  
    updateSubData: function() {
      var hash = _pgD.cookie.get("PushSubscriberHash");
      _pg.subDataChange(function(changeData) {
        if (!Object.keys(changeData.sub).length) return;
        var data = {
          relApiPath: "/subscribe/" + hash,
          method: "PUT",
          reqData: changeData.sub
        };
        _pgD.sendRequestToServer(data, function(res) {
          try {
            var resData = JSON.parse(res);
            if (resData.error_code == 0) {
              _pgD.cookie.set([
                [
                  "PgSubData",
                  JSON.stringify(changeData.cookie),
                  "",
                  "/",
                  "local"
                ]
              ]);
            }
          } catch (e) {}
        });
      });
    },
    subDataChange: function(callback) {
      var bv = _pgE.bW.version,
        l = navigator.language,
        s = screen.availWidth + "*" + screen.availHeight,
        ua = navigator.userAgent,
        cookieSubData = _pgD.cookie.get("PgSubData"),
        tz = _pgD.getTimezone(),
        currentTime = new Date().getTime();
      try {
        var parseCookieSubData = _pgD.parse(cookieSubData),
          updateCookieSubData = _pgD.objectAssign({}, parseCookieSubData),
          updateSubData = {};
        if (
          parseCookieSubData.bv != bv ||
          parseCookieSubData.l != l ||
          parseCookieSubData.s != s ||
          parseCookieSubData.tz != tz
        ) {
          updateCookieSubData = _pgD.objectAssign(updateCookieSubData, {
            bv: bv,
            l: l,
            s: s,
            tz: tz
          });
          updateSubData = _pgD.objectAssign(updateSubData, {
            browser_info: {
              language: l,
              available_scr_width_height: s,
              user_agent: ua
            },
            geo_info: {
              geobytestimezone: tz
            }
          });
        }
        if (
          _pgSd.privacySettings.geoLocationEnabled &&
          _pg.ipDateChange(parseCookieSubData.ip)
        ) {
          _pgD.insertFile("js", "pushgeek-geo", false, function(res) {
            if (typeof peGeoInfo != "undefined") {
              var geoData = _pgD.modifyGeo(peGeoInfo);
              var updateIp = geoData.geobytesipaddress;
              updateSubData.geo_info = geoData;
              updateCookieSubData.ip = {
                v: updateIp,
                d: currentTime
              };
            } 
          });
        }
      } catch (e) {
        console.log(e.message);
      }
    },
    ipDateChange: function(ip) {
      var status = true;
      try {
        if (ip) {
          var refDate = 7 * 24 * 60 * 60 * 1000,
            currentTime = new Date().getTime(),
            diffTime = currentTime - ip.d;
          status = diffTime > refDate ? true : false;
        }
      } catch (e) {}
      return status;
    },
    isSubscribed: function(callback, hash) {
      if (typeof callback == "function") {
        callback(
          !_pgD.deviceToken.cookie() ||
          _pgD.cookie.get("PushSubscriberStatus") == "UNSUBSCRIBED"
            ? false
            : hash && _pgD.cookie.get("PushSubscriberHash") != ""
              ? _pgD.cookie.get("PushSubscriberHash")
              : true
        );
      }
    },
    checkFcmEndpoint: function(pushId) {
      return pushId.indexOf("fcm.googleapis.com/fcm") > -1 ? true : false;
    },
    subscriberStatus: function(callback) {
      var ApiNo = _pg.apiSubNotValid();
      if (typeof callback == "function") {
        if (ApiNo) return callback(ApiNo);
        var resObj = {};
        switch (_pgD.cookie.get("PushSubscriberStatus")) {
          case "SUBSCRIBED":
            resObj = {
              statuscode: 1,
              status: "SUBSCRIBED",
              message: "User subscribed successfully",
              data: {
                subscriber_hash:
                  _pgD.cookie.get("PushSubscriberHash") == "false"
                    ? ""
                    : _pgD.cookie.get("PushSubscriberHash")
              }
            };
            break;
          case "DENIED":
            resObj = {
              statuscode: 2,
              status: "DENIED",
              message: "User denied push notification"
            };
            break;
          case "CLOSED":
            resObj = {
              statuscode: 3,
              status: "CLOSED",
              message: "User closed subscription Opt-in"
            };
            break;
          default:
            resObj = {
              statuscode: 22,
              message: _pg.msg.error[2]
            };
        }
        return callback(resObj);
      }
    },
    trigger: function(data) {
      var ApiNo = _pg.apiNotValid();
      if (!ApiNo && _pgSd.trigger.status && typeof data === "object") {
        data.device_token_hash = _pgD.cookie.get("PushSubscriberHash");
        data.site_id = _pgSd.site.sSi;
        var reqData = {
          Data: data,
          PartitionKey: data.device_token_hash
        };
        _pgD.httpRequest({
          method: "PUT",
          reqData: reqData,
          url: _pgSd.api.triggerApi,
          requestHeader: [
            {
              name: "Content-type",
              value: "application/json"
            }
          ]
        });
      }
    },
    sendEvent: function sendEvent(payload, cb) {
      var apiNo = _pg.apiNotValid();
      if (apiNo || !_pgSd.trigger.status) {
        if (typeof cb === "function") {
          cb(apiNo);
        }
        return;
      }
      var reqData = payload || {};
      reqData.device_token_hash = _pgD.cookie.get("PushSubscriberHash");
      var data = {
        baseUrl: _pgSd.api.eventApi,
        relApiPath: "/events",
        reqData: reqData
      };
      _pgD.sendRequestToServer(data, function(res) {
        if (typeof cb === "function") {
          res = JSON.parse(res);
          res.statuscode = 0;
          if (res.error_code === 0) {
            res.statuscode = 1;
          }
          cb(res);
        }
      });
    },
    addAlert: function addAlert(payload, cb) {
      var apiNo = _pg.apiNotValid();
      if (apiNo || !_pgSd.trigger.status) {
        if (typeof cb === "function") {
          cb(apiNo);
        }
        return;
      }
      var reqData = _pgD.objectAssign({}, payload);
      reqData.device_token_hash = _pgD.cookie.get("PushSubscriberHash");
      var data = {
        relApiPath: "/alerts",
        reqData: reqData
      };
      _pgD.sendRequestToServer(data, function(res) {
        if (typeof cb === "function") {
          res = JSON.parse(res);
          res.statuscode = 0;
          if (res.error_code === 0) {
            res.statuscode = 1;
          }
          cb(res);
        }
      });
    },
    getAlerts: function getAlerts(filter, cb) {
      var apiNo = _pg.apiNotValid();
      if (apiNo || !_pgSd.trigger.status) {
        if (typeof cb === "function") {
          cb(apiNo);
        }
        return;
      }
      var query = _pgD.objectAssign({}, filter);
      query.device_token_hash = _pgD.cookie.get("PushSubscriberHash");
      query.site_id = _pgSd.site.sSi;
      var data = {
        method: "GET",
        relApiPath: "/alerts",
        reqData: {},
        query: query
      };
      _pgD.sendRequestToServer(data, function(res) {
        if (typeof cb === "function") {
          res = JSON.parse(res);
          res.statuscode = 0;
          if (res.error_code == 0) {
            res.statuscode = 1;
          }
          cb(res);
        }
      });
    },
    removeAlerts: function removeAlerts(filter, cb) {
      var apiNo = _pg.apiNotValid();
      if (apiNo || !_pgSd.trigger.status) {
        if (typeof cb === "function") {
          cb(apiNo);
        }
        return;
      }
      var query = _pgD.objectAssign({}, filter);
      query.device_token_hash = _pgD.cookie.get("PushSubscriberHash");
      query.site_id = _pgSd.site.sSi;
      var data = {
        method: "DELETE",
        relApiPath: "/alerts",
        reqData: {},
        query: query
      };
      _pgD.sendRequestToServer(data, function(res) {
        if (typeof cb === "function") {
          res = JSON.parse(res);
          res.statuscode = 0;
          if (res.error_code == 0) {
            res.statuscode = 1;
          }
          cb(res);
        }
      });
    },
    sendGoal: function sendGoal(payload, cb) {
      var apiNo = _pg.apiNotValid();
      if (apiNo) {
        if (typeof cb === "function") {
          cb(apiNo);
        }
        return;
      }
      var reqData = _pgD.objectAssign({}, payload);
      reqData.device_token_hash = _pgD.cookie.get("PushSubscriberHash");
      var data = {
        relApiPath: "/goals",
        reqData: reqData
      };
      _pgD.sendRequestToServer(data, function(res) {
        if (typeof cb === "function") {
          res = JSON.parse(res);
          res.statuscode = 0;
          if (res.error_code == 0) {
            res.statuscode = 1;
          }
          cb(res);
        }
      });
    },
    updateSubscriber: function(status, callback) {
      var data = {
        relApiPath: "/subscribe/updatesubscriberstatus",
        reqData: {
          IsUnSubscribed: status,
          device_token_hash: _pgD.cookie.get("PushSubscriberHash")
        }
      };
      _pgD.sendRequestToServer(data, function(res) {
        res = JSON.parse(res);
        var resObj = {
          statuscode: 0
        };
        if (res.error_code == 0) {
          resObj.statuscode = 1;
        }
        return callback(resObj);
      });
    },
    insideUnsubscribe: function() {
      return new Promise(function(resolve, reject) {
        _pg.updateSubscriber(1, function(res) {
          return resolve(res);
        });
      });
    },
    unsubscribe: function(callback) {
      var ApiNo = _pg.apiNotValid();
      if (typeof callback == "function") {
        if (ApiNo) return callback(ApiNo);
      } else if (ApiNo) {
        console.log(ApiNo);
        return;
      }
      Promise.all([
        _pgD.bwUnsubscribe(),
        _pg.insideUnsubscribe()
      ]).then(function(res) {
        if (res[0].statuscode == 1 && res[1].statuscode == 1) {
          _pgD.cookie.set([
            [
              "PushSubscriberStatus",
              "UNSUBSCRIBED",
              _pgD.cookie.global,
              "/",
              "cookie"
            ]
          ]);
          if (typeof callback == "function")
            return callback({
              statuscode: 1,
              message: _pg.msg.success[0]
            });
        } else {
          if (typeof callback == "function")
            return callback({
              statuscode: 0,
              message: _pg.msg.error[0]
            });
        }
      });
    },
    personalNotificationManagement: function(data, callback) {
      var ApiNo = _pg.apiNotValid();
      if (typeof callback == "function") {
        if (ApiNo) return callback(ApiNo);
      } else if (ApiNo) {
        console.log(ApiNo);
        return;
      }
      var reqData = {
        relApiPath: "/subscribe/updatetriggerstatus",
        reqData: {
          triggerStatus: data.status == 1 ? 0 : 1,
          device_token_hash: _pgD.cookie.get("PushSubscriberHash")
        }
      };
      _pgD.sendRequestToServer(reqData, function(res) {
        res = JSON.parse(res);
        var resObj = {
          statuscode: 0,
          message: _pg.msg.seg[0]
        };
        if (res.error_code == 0) {
          resObj.statuscode = 1;
          resObj.message = _pg.msg.success[1];
        }
        return callback(resObj);
      });
    },
    resubscribeHttp: function(callback) {
      _pgD.resetCookie();
      _pgE.refToken = true;
      _pg.insertOptin(callback);
    },
    checkSubscriptionStatus: function(type) {
      if (type == "https") {
        if (Notification.permission == "granted" && !_pgD.userPerDenied())
          return true;
      } else {
        if (_pgE.bW.name == "Chrome" || _pgE.bW.name == "Opera") return true;
      }
      return false;
    },
    checkSubscription: function(data, callback, resCallback) {
      if (data.type == "https") {
        _pgD.getSubscription(function(res) {
          if (_pgE.bW.name != "Safari") {
            if (res.sub) {
              try {
                var sub = JSON.parse(JSON.stringify(res.sub));
              } catch (e) {
                _pgD.recoverSubscriber(callback);
                resCallback({
                  valid: false
                });
                return;
              }
              var pushId = _pgD.cookie.get("PushSubscriberID");
              if (
                !pushId ||
                (sub.endpoint && sub.endpoint.indexOf(pushId) == -1)
              ) {
                _pgD.recoverSubscriber(callback);
                resCallback({
                  valid: false
                });
              } else
                resCallback({
                  valid: true
                });
            } else {
              _pg.peSubscribe(
                {
                  resub: true
                },
                callback
              );
              resCallback({
                valid: false
              });
            }
          } else {
            var pushId = _pgD.cookie.get("PushSubscriberID");
            if (!pushId || res.sub.deviceToken.indexOf(pushId) == -1) {
              _pgD.recoverSubscriber(callback);
              resCallback({
                valid: false
              });
            } else
              resCallback({
                valid: true
              });
          }
        });
      } else {
        if (_pgD.checkUserSubHttp()) {
          var pushId = _pgD.cookie.get("PushSubscriberID");
          if (_pg.checkFcmEndpoint(pushId)) {
            resCallback({
              valid: true
            });
          } else {
            var hash = _pgD.cookie.get("PushSubscriberHash");
            if (hash) {
              var data = {
                relApiPath: "/subscribe/check/" + hash,
                method: "GET",
                reqData: {}
              };
              _pgD.sendRequestToServer(data, function(res) {
                try {
                  res = JSON.parse(res);
                } catch (e) {
                  return _pg.resubscribeHttp(callback);
                }
                if (res.data && res.data.gateway_endpoint) {
                  _pgD.cookie.set([
                    [
                      "PushSubscriberID",
                      res.data.gateway_endpoint,
                      _pgD.cookie.global,
                      "/",
                      "cookie"
                    ]
                  ]);
                  return resCallback({
                    valid: true
                  });
                }
                _pg.resubscribeHttp(callback);
              });
            } else {
              _pg.resubscribeHttp(callback);
            }
          }
        } else {
          _pg.insertOptin(callback);
        }
      }
    },
    getSegmentsFromStorage: function() {
      var segments = {};
      try {
        var subscribedSegment = _pgD.cookie.get("PushSegments");
        if (subscribedSegment) {
          segments = JSON.parse(subscribedSegment);
        }
      } catch (error) {
        console.log(error);
      }
      return segments;
    },
    addSegmentsInStorage: function(segments) {
      try {
        var subscribedSegment = _pg.getSegmentsFromStorage();
        var localStorageSegments = _pgD.objectAssign(
          {},
          subscribedSegment,
          segments
        );
        _pgD.cookie.set([
          [
            "PushSegments",
            JSON.stringify(localStorageSegments),
            _pgD.cookie.global,
            "/",
            "local"
          ]
        ]);
      } catch (error) {
        console.log(error);
      }
    },
    removeSegmentsFromStorage: function(segments) {
      try {
        var subscribedSegment = _pg.getSegmentsFromStorage();
        var newSegments = {};
        for (var segmentId in subscribedSegment) {
          var segmentName = subscribedSegment[segmentId];
          if (segments.indexOf(segmentName) == -1) {
            newSegments[segmentId] = segmentName;
          }
        }
        _pgD.cookie.set([
          [
            "PushSegments",
            JSON.stringify(newSegments),
            _pgD.cookie.global,
            "/",
            "local"
          ]
        ]);
      } catch (error) {
        console.log(error);
      }
    },
    addSegmentOnPageLoad: function() {
      var addedSegmentStatus = false;
      try {
        if (
          !_pgSd.segmentsOnPageLoad ||
          !Array.isArray(_pgSd.segmentsOnPageLoad) ||
          !_pgSd.segmentsOnPageLoad.length
        ) {
          return addedSegmentStatus;
        }
        function isValidCriteria(criteriaData) {
          var status = false;
          var currentUrl = "http://localhost:5500";
          if (typeof criteriaData != "object") {
            return status;
          }
          for (var ruleName in criteriaData) {
            var ruleData = criteriaData[ruleName];
            if (Array.isArray(ruleData)) {
              switch (ruleName) {
                case "exact":
                  for (var i = 0; i <= ruleData.length; i = i + 1) {
                    var currentRule = ruleData[i];
                    if (currentUrl == currentRule) {
                      status = true;
                      return status;
                    }
                  }
                  break;
                case "contains":
                  for (var i = 0; i <= ruleData.length; i = i + 1) {
                    var currentRule = ruleData[i];
                    if (currentUrl.indexOf(currentRule) !== -1) {
                      status = true;
                      return status;
                    }
                  }
                  break;
                default:
                  for (var i = 0; i <= ruleData.length; i = i + 1) {
                    var currentRule = ruleData[i];
                    if (
                      currentRule &&
                      currentUrl.substring(0, currentRule.length) == currentRule
                    ) {
                      status = true;
                      return status;
                    }
                  }
              }
            }
          }
          return status;
        }
        var segments = {};
        var segmentsData = _pgSd.segmentsOnPageLoad;
        segmentsData.forEach(function(segment) {
          if (typeof segment == "object" && segment.segment_criteria) {
            var segmentCriteria = {};
            segmentCriteria = JSON.parse(segment.segment_criteria);
            if (typeof segmentCriteria != "object") {
              return addedSegmentStatus;
            }
            var includeSegmentCriteriaData = segmentCriteria.include || {};
            var excludeSegmentCriteriaData = segmentCriteria.exclude || {};
            if (isValidCriteria(excludeSegmentCriteriaData)) {
              return addedSegmentStatus;
            }
            if (isValidCriteria(includeSegmentCriteriaData)) {
              segments[segment.segment_id] = segment.segment_name;
            }
          }
        });
        if (Object.keys(segments).length === 0) {
          return addedSegmentStatus;
        }
        var segmentNames = [];
        var subscribedSegment = _pg.getSegmentsFromStorage();
        for (var segmentId in segments) {
          if (!subscribedSegment.hasOwnProperty(segmentId)) {
            segmentNames.push(segments[segmentId]);
          }
        }
        if (segmentNames.length) {
          _pg.addSubscriberToSegment(segmentNames, function(res) {
            if (res.statuscode == 1) {
              _pg.addSegmentsInStorage(segments);
            }
          });
        }
        addedSegmentStatus = true;
      } catch (error) {
        console.log(error);
      }
      return addedSegmentStatus;
    },
    optinSubscriptionTrigger: {
      status: function() {
        var status = false;
        if (_pgSd.optinSubscriptionTrigger && _pgE.bWSupport) {
          var optinSubscriptionTrigger = _pgSd.optinSubscriptionTrigger;
          if (
            optinSubscriptionTrigger.enabled &&
            optinSubscriptionTrigger.selectors &&
            Array.isArray(optinSubscriptionTrigger.selectors) &&
            optinSubscriptionTrigger.selectors.length
          ) {
            status = true;
          }
        }
        return status;
      },
      trigger: function(target) {
        var selectors = _pgSd.optinSubscriptionTrigger.selectors;
        for (
          var i = 0, selectorCount = selectors.length;
          i < selectorCount;
          i += 1
        ) {
          try {
            var selector = selectors[i];
            var newSelector = selector.replace(/[ ]/gi, ".");
            if (
              target.closest("." + newSelector) ||
              target.closest("#" + newSelector)
            ) {
              window._pgq.push(["subscribe"]);
              break;
            }
          } catch (e) {
            console.log(e.message);
          }
        }
      }
    },
    getSubscriberData: function(queryOrCallback, callback) {
      var query;
      if (typeof queryOrCallback !== "function") {
        query = queryOrCallback;
      }
      var apiNotValid = _pg.apiNotValid();
      if (apiNotValid) {
        if (typeof callback == "function") {
          callback(apiNotValid);
        }
        return;
      }
      var queryOptions = {};
      if (query && Object.keys(query).length) {
        queryOptions = query;
        if (Array.isArray(query.fields)) {
          queryOptions.fields = query.fields.toString();
        }
      }
      var deviceTokenHash = _pgD.cookie.get("PushSubscriberHash");
      var data = {
        relApiPath: "/subscribe/" + deviceTokenHash,
        method: "GET",
        isSiteId: false,
        query: queryOptions
      };
      _pgD.sendRequestToServer(data, function(res) {
        if (
          typeof callback === "function" ||
          typeof queryOrCallback === "function"
        ) {
          var resObj = {};
          try {
            resObj = JSON.parse(res);
            if (resObj.error_code === 0) {
              resObj.statuscode = 1;
            } else {
              resObj.statuscode = 2;
              resObj.message = resObj.error_message;
            }
          } catch (err) {
            resObj.statuscode = 0;
            resObj.message = _pg.msg.error[0];
          }
          callback ? callback(resObj) : queryOrCallback(resObj);
        }
      });
    }
  };
  this.window.addEventListener(
    "message",
    function(event) {
      var validOrigin = false;
      _pgSd.site.allowedDomain.forEach(function(e) {
        if (e.indexOf(event.origin) !== -1 || event.origin.indexOf(e) != -1) {
          validOrigin = true;
          return;
        }
      });
      if (validOrigin && typeof event.data === "string" && event.data != "") {
        var data = {};
        if (event.data.indexOf("{") !== -1 && event.data.indexOf("}") !== -1) {
          try {
            data = JSON.parse(event.data);
          } catch (e) {}
        }
        if (typeof data.source != "undefined") {
          switch (data.source) {
            case "unsubscribe":
              console.log(data.message);
              break;
            case "customSiteCookie":
              _pg.customSiteCookie.init++;
              if (data.PushSubscribed == "true") _pg.customSiteCookie.set++;
              else _pg.customSiteCookie.notSet++;
              if (
                _pg.customSiteCookie.init ==
                _pgD.merchantSettings.cookie().sites.length
              ) {
                if (_pg.customSiteCookie.set > 0)
                  _pgD.cookie.set([
                    ["PushSubscribed", true, _pgD.cookie.global, "/", "local"]
                  ]);
                else _pg._pgqi.qInit();
              }
              break;
            case "recoverSubscriberFromIframe":
              if (
                data.state == "notSubscribed" &&
                !_pgD.getInputUrl("recover_subscriber_from_iframe")
              )
                _pg._pgqi.qInit();
              break;
            case "subscriptionCheck":
              _pg.checkSubscription(data);
              break;
            default:
              _pgD.widget.resetClosedCookie();
              var ce = _pgE.cookie.optinHide,
                setCookie = false;
              var resObj = {
                statuscode: 1,
                message: "User subscribed successfully"
              };
              switch (data.state) {
                case "DENIED":
                  ce = _pgD.cookie.global;
                  setCookie = true;
                  resObj.message = "User denied push notification";
                  resObj.statuscode = 2;
                  break;
                case "CLOSED":
                  ce = _pgE.cookie.optinHide;
                  setCookie = true;
                  resObj.message = "User closed subscription Optin";
                  resObj.statuscode = 3;
                  break;
                case "SUBSCRIBED":
                  ce = _pgD.cookie.global;
                  setCookie = true;
                  break;
                default:
                  return;
              }
              if (setCookie) {
                if (ce != 0) {
                  _pgD.cookie.set([
                    ["pgclosed", true, ce, "/", "cookie"],
                    ["PushSubscriberStatus", data.state, ce, "/", "cookie"]
                  ]);
                }
                if (
                  data.state == "SUBSCRIBED" &&
                  data.PushSubscriberID != "" &&
                  data.PushSubscriberHash != "" &&
                  data.PushSubscriberID &&
                  data.PushSubscriberHash
                ) {
                  if (
                    typeof data.subscriberOrigin != "undefined" &&
                    data.subscriberOrigin == "recoverSubscriber"
                  ) {
                    _pgD.cookie.set([
                      ["PushSubscribed", true, false, "/", "local"]
                    ]);
                  }
                  resObj.subscriber_hash = data.PushSubscriberHash;
                  resObj.data = data.geoInfoData;
                  _pgD.cookie.set([
                    [
                      "PushSubscriberID",
                      data.PushSubscriberID,
                      false,
                      "/",
                      "local"
                    ],
                    [
                      "PushSubscriberHash",
                      data.PushSubscriberHash,
                      false,
                      "/",
                      "local"
                    ],
                    [
                      "PushPersonalNotificationStatus",
                      true,
                      false,
                      "/",
                      "local"
                    ],
                    ["PgSubData", data.subCookieData, false, "/", "local"],
                    ["PushSubscribeWidgetClosed", 0, false, "/", "local"],
                    ["PushSegments", JSON.stringify({}), false, "/", "local"]
                  ]);
                  _pg.subMangWidget.addHtml();
                }
                if (
                  typeof _pg._pgqi.queue === "object" &&
                  _pg._pgqi.queue.length > 0
                ) {
                  _pg._pgqi.queue.forEach(function(e, i) {
                    if (e[0] == "init" && e.length == 3) {
                      resObj.status = data.state;
                      _pg._pgqi.queue[i][2](resObj);
                    }
                  });
                }
                _pgD.widget.addHtml();
              }
          }
        }
      }
    },
    false
  );
  (function _pginit() {
    if (document.readyState != "complete") {
      setTimeout(function() {
        _pginit();
      }, 100);
      return;
    }
    if (typeof window._pgq === "object" && window._pgq.length > 0) {
      _pg._pgqi.queue = window._pgq;
      _pg._pgqi.init(window._pgq);
    }
    window._pgq = {
      push: function(e) {
        _pg._pgqi.init([e]);
      }
    };
    if (_pg.optinSubscriptionTrigger.status()) {
      document.addEventListener(
        "click",
        function(event) {
          _pg.optinSubscriptionTrigger.trigger(event.target);
        },
        false
      );
    }
  })();
} catch (e) {
  console.log(e);
}

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

// // Installing service worker
// if ("serviceWorker" in navigator && "PushManager" in window) {
//   console.log("Service Worker and Push is supported");

//   window.addEventListener("load", function() {
//     var postion = WebClient("http://localhost:5500/api/ami/position.json","GET" ,""); 
//     if(postion){
//       navigator.serviceWorker
//       .register("http://localhost:5500/sw-test.js", {
//         scope: "/",
//         origin: "*"
//       })
//       .then(function(swReg) { 
//         console.log("service worker ready for registion");
        
//         swRegistration = swReg; 
//         //console.log(swReg);
//         swRegistration.pushManager
//           .getSubscription()
//           .then(function(subscription) {
//             isSubscribed = !(subscription === null);
//             console.log(`${isSubscribed}`);
//             if (isSubscribed) {
//               console.log("push notification service is already installed");
//             } else {
//               swRegistration.pushManager
//                 .subscribe({
//                   userVisibleOnly: true,
//                   applicationServerKey: urlB64ToUint8Array(applicationKey)
//                 })
//                 .then(function(subscription) {
//                   console.log(subscription);
//                   console.log(
//                     "push service notification is installed successfully"
//                   );
//                   JSON.stringify(subscription);
//                  var clientData = postion;
//                  console.log(`${clientData}`);
//                   var subscribe = [subscription,
//                   {
//                     "domain": "http://localhost:5500",
//                     "ClientData":[`${clientData}`]
//                   }];
//                   // subscribe.map(i => {
//                   //   i["domain"] = "http://localhost:5500";
                    
//                   // });
//                   console.log(subscribe);
//                   saveSubscription(subscribe);

//                   isSubscribed = true;
//                 })
//                 .catch(function(err) {
//                   console.log("Failed to subscribe user: ", err);
//                 });
//             }
//           });
//       })
//       .catch(function(error) {
//         console.error("Service Worker Error", error);
//       });
//     }
//   });
// } else {
//   console.warn("Push messaging is not supported");
// }

// Send request to database for add new subscriber
// function saveSubscription(subscribe) {
//   var  xmlHttp = window.XMLHttpRequest ? new XMLHttpRequest : new ActiveXObject("Microsoft.XMLHTTP");
//   xmlHttp.open("POST", "http://localhost:5500/subscribe");
//   xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
//   xmlHttp.onreadystatechange = function() {
//     if (xmlHttp.readyState != 4) return;
//     if (xmlHttp.status != 200 && xmlHttp.status != 304) {
//       console.log("HTTP error " + xmlHttp.status, null);
//     } else {  
//       console.log("User subscribed to server");
//     }
//   };
//  console.log(xmlHttp);
//   xmlHttp.send(JSON.stringify(subscribe));
// }

// function modifyGeo(geoInfo) {
//   var timezone = getTimezone();
//   var geo = {
//     geobytestimezone: timezone
//   };
//   if (typeof geoInfo === "object") {
//     geo = _pgD.objectAssign(geo, geoInfo);
//     if (_pgSd.site.isEu && geo.geobytesipaddress) {
//       try {
//         var ip = geo.geobytesipaddress;
//         var ip_array = ip.split(".");
//         ip_array.pop();
//         geo.geobytesipaddress = ip_array.join(".");
//       } catch (e) {
//         delete geo.geobytesipaddress;
//       }
//     }
//   }
//   return geo;
// }

// function objectAssign() {
//   var res = {};
//   for (var i = 0; i < arguments.length; i++) {
//     for (var x in arguments[i]) {
//       res[x] = arguments[i][x];
//     }
//   }
//   return res;
// }

// function getTimezone() {
//   try {
//     var date = Date().match(/([\+-][0-9]+)/)[0].split("");
//     var timezone = date[0] + date[1] + date[2] + ":" + date[3] + date[4];
//   } catch (e) {
//     var timezone = "+00:00";
//   }
//   return timezone;
// }

// function insertFile (type, fName, src, callback) {
//   var head = document.getElementsByTagName("head")[0];
//   switch (type) {
//     case "css":
//       var src = src
//         ? src
//         : "http://" + _pgSd.site.sSd + ".localhost:5500/" + fName + ".css";
//       var link = document.createElement("link");
//       link.rel = "stylesheet";
//       link.type = "text/css";
//       link.href = src;
//       link.media = "screen";
//       head.appendChild(link);
//       break;
//     case "js":
//       if (
//         fName == "position" &&
//         !_pgSd.privacySettings.geoLocationEnabled
//       )
//         return callback(true);
//       var src = src
//         ? src
//         : "http://" + _pgSd.site.sSd + ".localhost:5500/" + fName + ".js";
//       var script = document.createElement("script");
//       script.src = src;
//       script.onload = function() {
//         if (typeof callback == "function") return callback(true);
//       };
//       head.appendChild(script);
//       break;
//     case "iframe":
//       var src = src
//         ? src
//         : "http://" + _pgSd.site.sSd + ".localhost:5500/" + fName + ".html";
//       document
//         .getElementsByTagName("BODY")[0]
//         .insertAdjacentHTML(
//           "beforeend",
//           '<iframe src="' +
//             src +
//             '" style="display:none;width:0px;height:0px;border:0px;" id="pg-' +
//             fName +
//             '-iframe"></iframe>'
//         );
//   }
// }
async function WebClient(url,method, callback){
  var xhttp = window.XMLHttpRequest ? new XMLHttpRequest : new ActiveXObject("Microsoft.XMLHTTP");
  await xhttp.open(method, url,true);
  
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.onreadystatechange = function() {
    if (xhttp.status != 200 && xhttp.status != 304) {
      console.log("HTTP error " + xhttp.status, null);
    } else {  
    if (xhttp.readyState == 4 && this.status == 200) 
     var data = xhttp.responseText;
    //  console.log(data)
     return data;
    }
  };
  xhttp.send();
} 