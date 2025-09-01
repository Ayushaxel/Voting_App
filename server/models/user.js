const mongoose = require('mongoose');
const bcrpyt= require('bcrypt');


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    age:{
        type:Number,
        required:true
    },
    email:{
        type:String,
    },
    mobile:{
        type:String,
    },
    address:{
        type:String,
        required:true
    },
    aadharCardNumber:{
        type:Number,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['voter','admin'],
        default:'voter'
    },
    isVoted:{
        type:Boolean,
        default:false
    },
    resetOtp:{
        type:String
    },
    resetOtpExpiry:{
        type:Date
    },
    isVerifiedOtp:{
        type:Boolean,
        default:false
    }
})

userSchema.pre("save", async function(next){
    try{
        if(!this.isModified('password')) return next();
        const salt = await bcrpyt.genSalt(10);
      this.password = await bcrpyt.hash(this.password, salt);
        next();
    }catch(err){
        next(err);
    }

});
//  Compare entered password with hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
  try {
    return await bcrpyt.compare(enteredPassword, this.password);
  } catch (err) {
    throw new Error("Error comparing passwords");
  }
}

const User = mongoose.model('User',userSchema);
module.exports = User;