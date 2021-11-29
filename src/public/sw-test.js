"user strict";
let notificationUrl = "";
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
  console.log(notificationData);
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
  let _data = event.data ? JSON.parse(event.data.text()) : {};
  console.log("Push received: ", event.data);
  console.log(JSON.parse(event.data.text()));
  notificationUrl = _data.url;
  
  const promiseChain = isClientFocused().then(clientIsFocused => {
    if (clientIsFocused) {
      console.log("Don't need to show a notification.");
      return;
    }

    // Client isn't focused, we need to show a notification.
    return self.registration.showNotification(_data.title, {
        body: _data.message,
        image: _data.image,
        badge: _data.badge,
        ttl: _data.ttl,
        url: _data.url,
        tag: _data.tag,
        icon: _data.icon,
        timestamp: _data.timestamp,
        vibrate: _data.vibrate,
        lang: _data.lang,
      });
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
        image: _data.image,
        badge: _data.badge,
        ttl: _data.ttl,
        url: _data.url,
        tag: _data.tag,
        icon: _data.icon,
        timestamp: _data.timestamp,
        vibrate: _data.vibrate,
        lang: _data.lang,
      });
    }
  });

  event.waitUntil(promiseChain);
  /**** END sendPageMessage ****/
}
self.addEventListener("activate", event => {
  // console.log("service worker activate");
  event.waitUntil(self.clients.claim());
});
self.addEventListener("install", function(event) {
  event.waitUntil(self.skipWaiting());
  // event.registerForeignFetch({
  //   scopes: ['/'], // or self.registration.scope to handle everything
  //   origins: ['*'] // or ['https://example.com'] to limit the remote origins
  // });
});
self.addEventListener('foreignfetch', event => {
  event.respondWith(
    fetch(event.request) // Try to make a network request
      .catch(() => new Response('34')) // Offline? Your random number is 34!
      .then(response => {
        return {
          response,
          origin: event.origin // Make this a CORS response
        };
      })
  );
});
self.addEventListener("push", function(event) {
  examplepage = event.data.text().url;
  console.log(event.data.text());
  if (event.data) {
    demoMustShowNotificationCheck(event);
    switch (event.data.text()) {
      case "must-show-notification":
        demoMustShowNotificationCheck(event);
        break;
      case "send-message-to-page":
        demoSendMessageToPage(event);
        break;
      default:
        demoSendMessageToPage(event);
        console.warn("Unsure of how to handle push event: ", event.data);
        break;
    }
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
