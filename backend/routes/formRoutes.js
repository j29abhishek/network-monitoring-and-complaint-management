/**
 * Network Monitoring System
 * Developed by Abhishek Jaiswal (Intern)
 * National Informatics Centre (NIC)
 */

const express = require("express");
const Complaints = require("../db/Complaint");
const IpAdresses = require("../db/UserIpCollection");
const nodemailer = require("nodemailer");
const Notification = require("../db/Notifications");

const router = express.Router();

// submit user IP Address from  different departments
router.post("/ip-users", async (req, resp) => {
  try {
    // req.body should not be as req.body()-as it is already a function.
    let iplist = new IpAdresses(req.body);
    let result = await iplist.save();
    result = result.toObject();
    resp.send(result);
  } catch (error) {
    resp.status(500).send({ message: "Error while saving data", error });
  }
});


// Router to fetch one user IP by ID (for edit form prefill)
router.get("/ip-users/:id", async (req, res) => {
  try {
    const user = await IpAdresses.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

//Router to Edit/Update the form
router.put("/ip-users/:id", async (req, res) => {
  try {
    const updatedUser = await IpAdresses.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ); //return updated document

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Failed to update user" });
  }
});

// router to delete user records form DATABASE
router.delete("/ip-users/:id", async (req, res) => {
  try {
    const deletedUser = await IpAdresses.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
});
//Router to list ip address from useripdatabase

router.get("/get-ipAddress", async (req, resp) => {
  try {
    const ipData = await IpAdresses.find();
    resp.json(ipData);
  } catch (error) {
    resp.status(500).json({ message: "Error fetching data" });
  }
});

// Submit Complaints
router.post("/complaints", async (req, res) => {
  try {
    const complaints = new Complaints(req.body);
    const complaintData = await complaints.save();

    //creating notification of complaint and send it to notification database
    const notification = new Notification({
      type: "complaint",
      message: `New Complaint submitted by ${req.body.userName}`,
      relatedId: complaintData._id,
      forRole: "admin", // ensure that nofication will be for admin panel only.
    });
    await notification.save();

    res.json({
      message: "Complaint submitted successfully!",
      complaint: complaintData,
    });
  } catch (err) {
    res.status(500).json({ message: "Error submitting complaint", error: err });
  }
});

// fetch resolved complaints
router.get("/getResolvedComplaints", async (req, res) => {
  try {
    const resolvedComplaints = await Complaints.find({ status: "Resolved" });
    res.json(resolvedComplaints);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching resolved complaints", error });
  }
});

// Fetch pending complaints
router.get("/getPendingComplaints", async (req, res) => {
  try {
    const pendingComplaints = await Complaints.find({ status: "Pending" });
    res.json(pendingComplaints);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching pending complaints", error });
  }
});

//Update to resolved status

// ✅ Update status to resolved and create a notification for user
router.put("/updateComplaintStatus/:id", async (req, res) => {
  const complaintId = req.params.id;
  const { status } = req.body;

  try {
    const updatedComplaint = await Complaints.findByIdAndUpdate(
      complaintId,
      { status },
      { new: true }
    );

    if (!updatedComplaint) {
      return res.status(404).json({ error: "Complaint not found" });
    }

    // ✅ Create notification for user only when status is Resolved
    if (status === "Resolved") {
      const notification = new Notification({
        type: "complaint",
        message: `Hi ${updatedComplaint.userName}, your complaint regarding '${updatedComplaint.selectedIssue}' has been resolved. Kindly check your email.`,
        relatedId: updatedComplaint._id,
        forRole: "user",
      });

      await notification.save();
    }

    res.json(updatedComplaint);
  } catch (error) {
    res.status(500).json({ error: "Error updating status" });
  }
});

//send mail through nodemailer

router.post("/send-mail", (req, res) => {
  const complaints = new Complaints(req.body);
  let sub = complaints.selectedIssue;
  let userMail = complaints.gmail;
  let username = complaints.userName;
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "abhishek29m01@gmail.com",
      pass: "ccqx nlma ozhb nbue",
    },
  });

  let mailOptions = {
    from: '"No-Reply CMS" <abhishek29m01@gmail.com>',
    to: userMail,
    subject: sub,
    text: `Hi ${username}, \n\nWe are pleased to inform you that your issue regarding ${sub} has been successfully resolved.\n\nBest regard,\nSupport Team,\nNetwork Division, NIC`,
    html: `Hi <b>${username}</b>, <br><br>We are pleased to inform you that your issue regarding <b>${sub}</b> has been successfully resolved.<br><br>Best regard,<br>Support Team,<br>Network Division, NIC`,
  };

  console.log(userMail + " " + sub + " " + username + " " + mailOptions.text);
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
  });
});

module.exports = router;
