// require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../db/Users");
const Notification = require("../db/Notifications");
const sendEmail = require("../utils/mailer");
const router = express.Router();
const IPUserCollection = require("../db/UserIpCollection");
const verifyToken = require("../middleware/verifyToken");
const checkRole = require("../middleware/checkRole");
// Register User
router.post("/signup", async (req, res) => {
  try {
    const { name, number, password, role, email } = req.body;
    // Check if mobile number already exists
    const existingUser = await User.findOne({ number });
    if (existingUser) {
      return res.status(400).json({ message: "Mobile Number already exists!" });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user after hashed password
    const user = new User({
      name,
      email,
      number,
      password: hashedPassword,
      role: role || "user", // Default role if not provided
      status: "pending",
    });

    await user.save();

    //create a notification when user request for registration.

    const notification = new Notification({
      type: "user-request",
      message: `New user registration request recieved from ${name}`,
      isRead: false,
    });

    await notification.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// Login User
router.post("/login", async (req, res) => {
  try {
    const { number, password } = req.body;

    if (!number || !password) {
      return res
        .status(400)
        .json({ message: "Please provide both number and password" });
    }

    // Find user by mobile number
    const user = await User.findOne({ number });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "12h" }
    );

    res.json({ token, userType: user.role, userStatus: user.status });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

//reset link mail route
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    // Always send the same message to prevent email enumeration
    if (!user) {
      return res
        .status(200)
        .json({ message: "Reset link sent if email exists." });
    }

    // Generate a short-lived token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "10m",
    });

    const resetLink = `http://localhost:5173/reset-password/${token}`;

    await sendEmail({
      to: email,
      subject: "Reset Your Password",
      html: `
        <p>We received a request to reset your password. If you didn't make this request, please ignore this email.</p>
        <br><br>
        <p>Click the link below to reset your password:</p><br>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link will expire in 10 minutes.</p>
        <br>Thanks,<br>Network Division NIC, Chhattisgarh.
      `,
    });

    return res.status(200).json({ message: "Reset link sent to your email." });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
});

//Reset password route
router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(decoded.userId, { password: hashedPassword });
    res.json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token." });
  }
});
// user registration requests (user with token)
//get details of particular user based on the User Id

router.get("/user-details", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // ✔ Correct
  //Bearer<token>
  if (!token) return res.status(401).json({ message: "Token Missing" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userInfo = await User.findById(decoded.userId).select(
      "-password -status"
    );
    res.json(userInfo);
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
});

router.get("/getUsersIpDetailsByContact/:contact", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]?.trim();
  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const ipDetails = await IPUserCollection.find({
      contact: String(user.number),
    });

    if (!ipDetails || ipDetails.length === 0) {
      return res
        .status(404)
        .json({ message: "No IP details found for this user" });
    }

    res.status(200).json(ipDetails);
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
});

// route to update user details
router.put("/updateUserDetailsById/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { name, email, number } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, number },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      message: "User details updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// user registration request
router.get(
  "/user-registration-requests",
  verifyToken,
  checkRole("admin"),
  async (req, res) => {
    try {
      const userRequest = await User.find(
        { status: "pending" },
        { password: 0 }
      );
      res.json(userRequest);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
);

router.put(
  "/approve-user/:id",
  verifyToken,
  checkRole("admin"),
  async (req, res) => {
    try {
      const userId = req.params.id;
      await User.updateOne({ _id: userId }, { $set: { status: "active" } });
      res.status(200).json({ message: "User approved" });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.get("/check-role", verifyToken, (req, res) => {
  res.json({ role: req.user.role });
});

module.exports = router; // Ensure to export router
