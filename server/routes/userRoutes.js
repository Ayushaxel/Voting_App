const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { jwtMiddleware, generateToken } = require("../jwt");

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
try{
const userId = req.user.id;
const user = await User.findById(userId);
res.status(200).json(user);
}catch(err){
    console.error(err);
    res.status(500).json({message: 'Internal server error'});
}
});

router.put("/profile/password",jwtMiddleware, async(req,res)=>{
    const userId= req.user.id;
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(userId);
    if( !await user.comparePassword(currentPassword)){
        return res.status(401).json({ message: "Current password is incorrect" });
    }
    user.password = newPassword;
    await user.save();
    console.log("Password updated successfully");
    res.status(200).json({ message: "Password updated successfully" });
});





module.exports = router;
