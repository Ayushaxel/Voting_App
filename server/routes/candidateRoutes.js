const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { jwtMiddleware, generateToken } = require("../jwt");
const Candidate = require("../models/candidate");
const { count } = require("console");

const checkAdminRole = async(userId)=>{
  try{
 const user = await User.findById(userId);
  return user .role ==='admin';
  }catch(err){
    console.error(err);
    return false;
  }
  
}

//post route to add a candidate


router.post('/vote/:candidateId', jwtMiddleware, async (req, res) => {

  const candidateId = req.params.candidateId;
   const userId = req.user.id; 
  try{
    const candidate = await Candidate.findById(candidateId)
    if(!candidate)
      return res.status(404).json({ message: "Candidate not found" });
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if(user.isVoted) {
      return res.status(400).json({ message: "User has already voted" });
    }
    if(user.role==='admin'){
      return res.status(403).json({ message: "Admins cannot vote" });
    }
    candidate.votes.push({user:userId});
    candidate.voteCount++;
    await candidate.save();

    user.isVoted= true;
    await user.save();
  
    res.status(200).json({ message: "Vote cast successfully" });
  }catch(err){
    console.error(err);
    res.status(500).json({message: 'Internal server error'});
  }

});

//live vote count 

router.get('/vote/count' , async (req,res)=>{
  try{
    const candidates = await Candidate.find().sort({voteCount:'desc'});

    //map the candidate to only return thir name and vote count
    const voteRecord = candidates.map((data)=>{
      return {
        name:data.name,
        party:data.party,
        count:data.voteCount
      }
    });
    res.status(200).json({ voteRecord });
  }catch(err){
    console.error(err);
    res.status(500).json({message: 'Internal server error'});
  }
})

//get all candidates
router.get("/", async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.status(200).json({ candidates });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
