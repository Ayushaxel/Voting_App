const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { jwtMiddleware, generateToken } = require("../jwt");
const { sendMail, sendOtpMail } = require("../mail");

router.post("/signup", async (req, res) => {
  const data = req.body;
  const newUser = new User(data);
  const response = await newUser.save();
  const payload = {
    id: response.id,
  };
  const token = generateToken(payload);
  console.log("token is" + token);
  res.status(201).json({ response, token });
});

router.post("/login", async (req, res) => {
  try {
    const { aadharCardNumber, password } = req.body;
    // Find user by Aadhar card number
    const user = await User.findOne({ aadharCardNumber });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare passwords using bcrypt
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const payload = { id: user._id };
    const token = generateToken(payload);

    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/profile", jwtMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/profile/password", jwtMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(userId);
  if (!(await user.comparePassword(currentPassword))) {
    return res.status(401).json({ message: "Current password is incorrect" });
  }
  user.password = newPassword;
  await user.save();
  console.log("Password updated successfully");
  res.status(200).json({ message: "Password updated successfully" });
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    // console.log("📩 Email received:", email);

    // 1. Check if email is provided
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // 2. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User with this email does not exist" });
    }

    // 3. Generate OTP
    const otp = Math.floor(1000 + Math.random() * 9000);
    // console.log("🔑 Generated OTP:", otp);

    // 4. Save OTP & expiry in DB
    user.resetOtp = otp;
    user.resetOtpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes
    await user.save();

    // 5. Send OTP email
    await sendOtpMail(email, otp);

    console.log("✅ OTP sent successfully");
    return res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error("❌ Forgot password error:", error);
    return res
      .status(500)
      .json({ message: "OTP sending failed", error: error.message });
  }
});

router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User with this email does not exist" });
    }

    // Check if OTP matches and is not expired
    if (String(user.resetOtp) !== String(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.resetOtpExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    // Mark OTP as verified
    user.resetOtp = undefined;
    user.resetOtpExpiry = undefined;
    user.isVerifiedOtp = true;

    await user.save();

    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({ message: "OTP verification failed" });
  }
});

router.post("/reset-password", async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "User does not exist" });
    }
    user.password = newPassword;
    user.resetOtp = undefined;
    user.resetOtpExpiry = undefined;
    user.isVerifiedOtp = false;
    await user.save();
    res.status(200).json({ message: "password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: "reset password error" });
  }
});

module.exports = router;
