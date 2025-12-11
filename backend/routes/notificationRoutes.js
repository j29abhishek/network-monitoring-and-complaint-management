const express = require("express");
const Notification = require("../db/Notifications");
const router = express.Router();

// GET notifications by role
router.get("/get-notifications", async (req, res) => {
  const { forRole } = req.query;
  try {
    const notifications = await Notification.find({ forRole }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});

// Get unread count by role
router.get("/unread-notification-count", async (req, res) => {
  const { forRole } = req.query;
  try {
    const count = await Notification.countDocuments({ isRead: false, forRole });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Mark one as read
router.patch("/mark-read/:id", async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Could not mark as read" });
  }
});

// Mark all as read by role
router.patch("/mark-all-read", async (req, res) => {
  const { forRole } = req.query;
  try {
    await Notification.updateMany({ isRead: false, forRole }, { isRead: true });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Could not mark all as read" });
  }
});

module.exports = router;
