"use strict";
const cross_origin_script_url = "http://localhost:5500/sw-test.js?ver=2.2.0"
  //"http://localhost:5500/service-worker.js?ver=2.2.0";

const worker = new Worker(getWorkerURL(cross_origin_script_url));
worker.onmessage = evt => console.log(evt.data);
URL.revokeObjectURL(cross_origin_script_url);

// // Returns a blob:// URL which points
// // to a javascript file which will call
// // importScripts with the given URL
function getWorkerURL(url) {
  const content = `importScripts( "${url}" );`;
  return URL.createObjectURL(new Blob([content], { type: "text/javascript" }));
}

// importScripts("http://localhost:5500/pushenggage.js");
// importScripts("http://localhost:5500/service-worker.js?ver=2.0.0");
// !function(e, t, n) {
//   "use strict";
//   t.HTTP = new function() {
//       this.get = function(e, t, n, r) {
//           var s = window.XMLHttpRequest ? new XMLHttpRequest : new ActiveXObject("Microsoft.XMLHTTP");
//           s.onreadystatechange = function() {
//               if (4 == this.readyState) {
//                   if (200 != this.status)
//                       return r("error", null);
//                   try {
//                       return r(null, JSON.parse(s.responseText))
//                   } catch (e) {
//                       return r(null, s.responseText)
//                   }
//               }
//           }
//           ,
//           s.open("GET", e, !0),
//           n && n.headers && (s = function(e, t) {
//               for (var n = Object.keys(t), r = 0; r < n.length; ++r) {
//                   var s = n[r];
//                   e.setRequestHeader(s, t[s])
//               }
//               return e
//           }(s, n.headers)),
//           n && n.credentials && (s.withCredentials = !0),
//           s.send(JSON.stringify(t))
//       }
//   }
// }(0, this);
// var pushgeekVersionInfo, r = "http://localhost:5500/sdk/version.json";
// HTTP.get(r, {}, {}, function(e, t) {
//   if (pushgeekVersionInfo = t,
//   !e && t && t.mainJsUrl) {
//       r = document.head;
//       (n = document.createElement("script")).type = "application/javascript",
//       n.onload = function() {
//           loadAppJs()
//       }
//       ,
//       n.src = t.mainJsUrl,
//       r.appendChild(n)
//   } else {
//       console.log("Error in getting version", e);
//       var n, r = document.head;
//       (n = document.createElement("script")).type = "application/javascript",
//       n.onload = function() {
//           loadAppJs()
//       }
//       ,
//       n.src = "http://localhost:5500/main.js",
//       r.appendChild(n)
//   }
// });
