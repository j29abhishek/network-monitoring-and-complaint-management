const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["complaint", "user-request", "system"],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  relatedId: {
    type: String, // optional
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  forRole: {
    type: String,
    enum: ["admin", "user"],
    default: "admin",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("notifications", notificationSchema);
