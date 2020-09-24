"use strict";
const cross_origin_script_url =
  "http://localhost:5500/service-worker.js?ver=2.0.0";

const worker = new Worker(getWorkerURL(cross_origin_script_url));
worker.onmessage = evt => console.log(evt.data);
URL.revokeObjectURL(cross_origin_script_url);

// Returns a blob:// URL which points
// to a javascript file which will call
// importScripts with the given URL
function getWorkerURL(url) {
  const content = `importScripts( "${url}" );`;
  return URL.createObjectURL(new Blob([content], { type: "text/javascript" }));
}

// importScripts("http://localhost:5500/pushenggage.js");
// importScripts("http://localhost:5500/service-worker.js?ver=2.0.0");
