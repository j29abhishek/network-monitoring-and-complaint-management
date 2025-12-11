const mongoose = require("mongoose");

const ipCollectionSchema = new mongoose.Schema({
  ipAddress: { type: String, required: true, unique: true },
  organisation: { type: String, required: true },
  bandwidth: { type: String },
  provider: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },

  // New fields iteration 2, because of uptime, downtime, and status should be fetched accordingly
  currentStatus: { type: String, default: "unknown" }, // up/down
  uptime: { type: Number, default: 0 }, // in seconds
  downtime: { type: Number, default: 0 }, // in seconds
  lastUpdated: { type: Date, default: Date.now }, // last ping timestamp
});

module.exports=mongoose.model('ipcollections',ipCollectionSchema)
