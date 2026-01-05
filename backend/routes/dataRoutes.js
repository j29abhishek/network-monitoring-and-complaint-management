/**
 * Network Monitoring System
 * Developed by Abhishek Jaiswal (Intern)
 * National Informatics Centre (NIC)
 */

const express = require("express");
const Data = require("../db/IpCollections");
const ComplaintsStats = require("../db/Complaint");

module.exports = (io) => {
  const app = express();

  // Emit real-time stats every 20 seconds
  setInterval(async () => {
    try {
      const stats = await Data.aggregate([
        {
          $group: {
            _id: "$currentStatus",
            count: { $sum: 1 },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$count" },
            up: {
              $sum: {
                $cond: [{ $eq: ["$_id", "up"] }, "$count", 0],
              },
            },
            down: {
              $sum: {
                $cond: [{ $eq: ["$_id", "down"] }, "$count", 0],
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            total: 1,
            up: 1,
            down: 1,
          },
        },
      ]);

      const result = stats[0] || { total: 0, up: 0, down: 0 };
      io.emit("statusUpdate", result); // Emit via Socket.IO
      console.log("Running Status Aggregation...");
    } catch (err) {
      console.error("Error fetching status stats:", err);
    }
  }, 20000); // every 20 seconds

  //   for initial fetch
  app.get("/getStats", async (req, res) => {
    try {
      const stats = await Data.aggregate([
        {
          $group: {
            _id: "$currentStatus",
            count: { $sum: 1 },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$count" },
            up: {
              $sum: {
                $cond: [{ $eq: ["$_id", "up"] }, "$count", 0],
              },
            },
            down: {
              $sum: {
                $cond: [{ $eq: ["$_id", "down"] }, "$count", 0],
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            total: 1,
            up: 1,
            down: 1,
          },
        },
      ]);

      res.json(stats[0] || { total: 0, up: 0, down: 0 });
    } catch (err) {
      console.error("GET /getStats error:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  app.get("/getComplaintStats", async (req, res) => {
    try {
      const stats = await ComplaintsStats.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$count" },
            pending: {
              $sum: {
                $cond: [{ $eq: ["$_id", "Pending"] }, "$count", 0],
              },
            },
            resolved: {
              $sum: {
                $cond: [{ $eq: ["$_id", "Resolved"] }, "$count", 0],
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            total: 1,
            resolved: 1,
            pending: 1,
          },
        },
      ]);

      res.json(stats[0] || { total: 0, pending: 0, resolved: 0 });
      // console.log(`${stats.pending} ${stats.resolved} ${stats.total}`)
    } catch (err) {
      console.error("GET /getStats error:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  return app;
};
