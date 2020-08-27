const express = require("express");
const router = express.Router();
const os = require("os");
const v8 = require("v8");
// const fs = require("fs");
//Server Status Api
router.get("/server", (req, res, next) => {
  var stats = {
    "Load Average": os.loadavg().join(" "),
    "CPU Count": os.cpus().length,
    "Free Memory": os.freemem(),
    "Current Malloced Memory": v8.getHeapStatistics().malloced_memory,
    "Peak Malloced Memory": v8.getHeapStatistics().peak_malloced_memory,
    "Allocated Heap Used (%)": Math.round(
      v8.getHeapStatistics().used_heap_size /
        v8.getHeapStatistics().total_heap_size *
        100
    ),
    "Available Heap Allocated (%)": Math.round(
      v8.getHeapStatistics().total_heap_size /
        v8.getHeapStatistics().heap_size_limit *
        100
    ),
    Uptime: os.uptime() + " Seconds"
  };
  res.json({
    status: "ok",
    message: stats
  });
});

module.exports = router;
