importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/3.4.1/workbox-sw.js"
);
const precacheCacheName = workbox.core.cacheNames.precache;
const runtimeCacheName = workbox.core.cacheNames.runtime;

const myPlugin = {
  cacheWillUpdate: async ({ request, response }) => {
    // Return `response`, a different Response object or null
    return response;
  },
  cacheDidUpdate: async ({ cacheName, request, oldResponse, newResponse }) => {
    // No return expected
    // Note: `newResponse.bodyUsed` is `true` when this is called,
    // meaning the body has already been read. If you need access to
    // the body of the fresh response, use a technique like:
    // const freshResponse = await caches.match(request, {cacheName});
  },
  cachedResponseWillBeUsed: async ({
    cacheName,
    request,
    matchOptions,
    cachedResponse
  }) => {
    // Return `cachedResponse`, a different Response object or null
    return cachedResponse;
  },
  requestWillFetch: async ({ request }) => {
    // Return `request` or a different Request
    return request;
  },
  fetchDidFail: async ({ originalRequest, request, error }) => {
    // No return expected.
    // NOTE: `originalRequest` is the browser's request, `request` is the
    // request after being passed through plugins with
    // `requestWillFetch` callbacks, and `error` is the exception that caused
    // the underlying `fetch()` to fail.
  }
};
workbox.core.setCacheNameDetails({
  prefix: "PushGeek",
  suffix: "v1",
  precache: "Pushgeek-precache-name",
  runtime: "Pushgeek-runtime-name",
  cacheId: "PushGeek",
  clientsClaim: "true",
  directoryIndex: "/"
});
workbox.routing.registerRoute(
  "https://pushgeek.com/*",
  workbox.strategies.networkFirst({
    networkTimeoutSeconds: 3,
    cacheName: "segment",
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 100,
        maxAgeSeconds: 5 * 60 * 60 // 5 minutes
      })
    ]
  })
);

workbox.routing.registerRoute(
  /\.(?:png|gif|jpg|jpeg|svg)$/,
  workbox.strategies.cacheFirst({
    cacheName: "images",
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 100,
        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 Days
      })
    ]
  })
);
workbox.routing.registerRoute(
  new RegExp("https://pushgeek.com"),
  workbox.strategies.cacheFirst()
);
workbox.routing.registerRoute(
  /\.(?:js|css|json)$/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: "static-resources"
  })
);

// Call addToCache whenever you'd like. E.g. to add to cache after a page load:

workbox.routing.registerRoute(
  /.*(?:googleapis)\.com.*$/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: "googleapis"
  })
);

workbox.routing.registerRoute(
  /.*(?:gstatic)\.com.*$/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: "gstatic"
  })
);

workbox.routing.registerRoute(
  new RegExp("https://fonts.(?:googleapis|gstatic).com/(.*)"),
  workbox.strategies.cacheFirst({
    cacheName: "google-fonts",
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 30,
        maxAgeSeconds: 30 * 24 * 60 * 60
      }),
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      })
    ]
  })
);

workbox.routing.registerRoute(
  new RegExp("https://cdn.ckeditor.com/(.*)"),
  workbox.strategies.cacheFirst({
    cacheName: "ckeditor",
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 100,
        maxAgeSeconds: 30 * 24 * 60 * 60
      }),
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      })
    ]
  })
);

workbox.routing.registerRoute(
  new RegExp("https://cdnjs.cloudflare.com/(.*)"),
  workbox.strategies.cacheFirst({
    cacheName: "supportive-library",
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 100,
        maxAgeSeconds: 30 * 24 * 60 * 60
      }),
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      })
    ]
  })
);
workbox.routing.registerRoute(
  new RegExp("https://use.fontawesome.com/(.*)"),
  workbox.strategies.cacheFirst({
    cacheName: "supportive-library",
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 150,
        maxAgeSeconds: 30 * 24 * 60 * 60
      }),
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      })
    ]
  })
);
workbox.routing.registerRoute(
  new RegExp("https://s3-us-west-2.amazonaws.com/(.*)"),
  workbox.strategies.cacheFirst({
    cacheName: "supportive-fonts",

    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 150,
        maxAgeSeconds: 30 * 24 * 60 * 60
      }),
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      })
    ]
  })
);
workbox.routing.registerRoute(
  new RegExp("https://use.typekit.net/(.*)"),
  workbox.strategies.cacheFirst({
    cacheName: "browser-supportive",

    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 150,
        maxAgeSeconds: 30 * 24 * 60 * 60
      }),
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      })
    ]
  })
);

let isSubscribed = false;
let swRegistration = null;
let applicationKey =
  "BLgFTwjElUH_Iz72TKDvmlsc-EcwziNP2X28BmN-znOXJhv35QybtfcN1HTh_eUlNffp12HkuruYpqtKNedN54s";

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
let examplepage = "";
function openWindow(event) {
  /**** START notificationOpenWindow ****/
  const examplePage = "";
  const promiseChain = clients.openWindow(examplePage);
  event.waitUntil(promiseChain);
  /**** END notificationOpenWindow ****/
}

function focusWindow(event) {
  /**** START notificationFocusWindow ****/
  /**** START urlToOpen ****/
  const urlToOpen = new URL(examplepage, self.location.origin).href;
  /**** END urlToOpen ****/

  /**** START clientsMatchAll ****/
  const promiseChain = clients
    .matchAll({
      type: "window",
      includeUncontrolled: true
    })
    /**** END clientsMatchAll ****/
    /**** START searchClients ****/
    .then(windowClients => {
      let matchingClient = null;

      for (let i = 0; i < windowClients.length; i++) {
        const windowClient = windowClients[i];
        if (windowClient.url === urlToOpen) {
          matchingClient = windowClient;
          break;
        }
      }

      if (matchingClient) {
        return matchingClient.focus();
      } else {
        return clients.openWindow(urlToOpen);
      }
    });
  /**** END searchClients ****/

  event.waitUntil(promiseChain);
  /**** END notificationFocusWindow ****/
}

function dataNotification(event) {
  /**** START printNotificationData ****/
  const notificationData = event.notification.data;
  console.log("");
  console.log("The data notification had the following parameters:");
  Object.keys(notificationData).forEach(key => {
    console.log(`  ${key}: ${notificationData[key]}`);
  });
  console.log("");
  /**** END printNotificationData ****/
}

/**** START isClientFocused ****/
function isClientFocused() {
  return clients
    .matchAll({
      type: "window",
      includeUncontrolled: true
    })
    .then(windowClients => {
      let clientIsFocused = false;

      for (let i = 0; i < windowClients.length; i++) {
        const windowClient = windowClients[i];
        if (windowClient.focused) {
          clientIsFocused = true;
          break;
        }
      }

      return clientIsFocused;
    });
}
/**** END isClientFocused ****/

function demoMustShowNotificationCheck(event) {
  /**** START showNotificationRequired ****/
  const promiseChain = isClientFocused().then(clientIsFocused => {
    if (clientIsFocused) {
      console.log("Don't need to show a notification.");
      return;
    }

    // Client isn't focused, we need to show a notification.
    return self.registration.showNotification("Had to show a notification.");
  });

  event.waitUntil(promiseChain);
  /**** END showNotificationRequired ****/
}

function demoSendMessageToPage(event) {
  /**** START sendPageMessage ****/
  let _data = event.data ? JSON.parse(event.data.text()) : {};
  const promiseChain = isClientFocused().then(clientIsFocused => {
    if (clientIsFocused) {
      windowClients.forEach(windowClient => {
        windowClient.postMessage({
          message: "Received a push message.",
          time: new Date().toString()
        });
      });
    } else {
      return self.registration.showNotification(_data.title, {
        body: _data.message,
        icon: _data.icon,
        tag: _data.tag
      });
    }
  });

  event.waitUntil(promiseChain);
  /**** END sendPageMessage ****/
}

self.addEventListener("push", function(event) {
  examplepage = event.data.text().url;
  console.log(event.data.text());
  if (event.data) {
    // demoMustShowNotificationCheck(event);
    // switch (event.data.text()) {
    //   case "must-show-notification":
    //     demoMustShowNotificationCheck(event);
    //     break;
    //   case "send-message-to-page":
    demoSendMessageToPage(event);
    //     break;
    //   default:
    //     console.warn("Unsure of how to handle push event: ", event.data);
    //     break;
    // }
  }
});

/**** START notificationActionClickEvent ****/

/**** START notificationClickEvent ****/
self.addEventListener("notificationclick", function(event) {
  event.notification.close();

  switch (event.notification.tag) {
    case "open-window":
      openWindow(event);
      break;
    case "focus-window":
      focusWindow(event);
      break;
    case "data-notification":
      dataNotification(event);
      break;
    default:
      // NOOP
      break;
  }
});
/**** END notificationClickEvent ****/

const notificationCloseAnalytics = () => {
  return Promise.resolve();
};

/**** START notificationCloseEvent ****/
self.addEventListener("notificationclose", function(event) {
  const dismissedNotification = event.notification;

  const promiseChain = notificationCloseAnalytics();
  event.waitUntil(promiseChain);
});
/**** END notificationCloseEvent ****/

self.addEventListener("message", function(event) {
  console.log("Received message from page.", event.data);
  switch (event.data) {
    case "must-show-notification-demo":
      self.dispatchEvent(
        new PushEvent("push", {
          data: "must-show-notification"
        })
      );
      break;
    case "send-message-to-page-demo":
      self.dispatchEvent(
        new PushEvent("push", {
          data: "send-message-to-page"
        })
      );
      break;
    default:
      console.warn("Unknown message received in service-worker.js");
      break;
  }
});

self.addEventListener("notificationclick", function(event) {
  if (!event.action) {
    // Was a normal notification click
    console.log("Notification Click.");
    return;
  }

  switch (event.action) {
    case "No-Poll":
      console.log("User Say No ❤️️'s.");
      break;
    case "Yes-Poll":
      console.log("User Say Yes ❤️️'s .");
      break;

    default:
      console.log(`Unknown action clicked: '${event.action}'`);
      break;
  }
});
/**** END notificationActionClickEvent ****/

function saveSubscription(subscription) {
  let xmlHttp = new XMLHttpRequest();
  xmlHttp.open("POST", "/subscribe");
  xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState != 4) return;
    if (xmlHttp.status != 200 && xmlHttp.status != 304) {
      console.log("HTTP error " + xmlHttp.status, null);
    } else {
      console.log("User subscribed to server");
    }
  };

  xmlHttp.send(JSON.stringify(subscription));
}

workbox.precaching.precacheAndRoute([]);
