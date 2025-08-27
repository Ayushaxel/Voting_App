const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { jwtMiddleware, generateToken } = require("../jwt");
const Candidate = require("../models/candidate");

const checkAdminRole = async (userId) => {
  try {
    const user = await User.findById(userId);
    return user.role === "admin";
  } catch (err) {
    console.error(err);
    return false;
  }
};
//get admin profile
router.get("/profile", jwtMiddleware, async (req, res) => {
    const userId = req.user.id;
    try{
        const isAdmin = await checkAdminRole(userId);
        if(!isAdmin){
            return res.status(403).json({message: 'Access denied'});
        }
        const admin = await User.findById(userId);
        if(!admin){
            return res.status(404).json({message: 'Admin not found'});
        }
        res.status(200).json(admin);
    }catch(err){
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
    }
});
//post route to add a candidate
router.post("/", jwtMiddleware, async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id))) {
      return res.status(403).json({ message: "user has not admin role" });
    }
    const data = req.body;
    const newCandidate = new Candidate(data);
    const response = await newCandidate.save();
    res.status(201).json({ response });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

//update candidate details

router.put("/:candidateId", jwtMiddleware, async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id))) {
      return res.status(403).json({ message: "user has not admin role" });
    }
    const candidateId = req.params.candidateId;
    const updatedData = req.body;

    const response = await Candidate.findByIdAndUpdate(
      candidateId,
      updatedData,
      { new: true, runValidators: true }
    );
    if (!response) {
      return res.status(404).json({ message: "Candidate not found" });
    }
    res
      .status(200)
      .json({ message: "Candidate updated successfully", data: response });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

//delete candidate

router.delete("/:candidateId", jwtMiddleware, async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id))) {
      return res.status(403).json({ message: "user has not admin role" });
    }
    const candidateId = req.params.candidateId;
    const response = await Candidate.findByIdAndDelete(candidateId);
    if (!response) {
      return res.status(404).json({ message: "Candidate not found" });
    }
    res.status(200).json({ message: "Candidate deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
