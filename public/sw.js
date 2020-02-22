"user strict";
let notificationUrl = "";

self.addEventListener("push", function(event) {
  console.log("Push received: ", event.data);
  let _data = event.data ? JSON.parse(event.data.text()) : {};
  console.log(JSON.parse(event.data.text()));
  notificationUrl = _data.url;
  event.waitUntil(
    self.registration.showNotification(_data.title, {
      body: _data.message,
      icon: _data.icon,
      tag: _data.tag
    })
  );
});

self.addEventListener("notificationclick", function(event) {
  event.notification.close();

  event.waitUntil(
    clients
      .matchAll({
        type: "window"
      })
      .then(function(clientList) {
        if (clients.openWindow) {
          return clients.openWindow(notificationUrl);
        }
      })
  );
});

const notificationCloseAnalytics = () => {
  return Promise.resolve();
};

/**** START notificationCloseEvent ****/
self.addEventListener("notificationclose", function(event) {
  const dismissedNotification = event.notification;

  const promiseChain = notificationCloseAnalytics(dismissedNotification);
  event.waitUntil(promiseChain);
});
/**** END notificationCloseEvent ****/

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
