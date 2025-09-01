const nodemailer = require("nodemailer");
require("dotenv").config();


 const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.Email,
    pass: process.env.Email_Password,
  },
});

const sendOtpMail = async (to,otp)=>{
      const info = await transporter.sendMail({
        from:process.env.Email,
        to,
        subject:"Voting App Reset Your Password",
        html:`<p> Your OTP for  password reset is <b>${otp}</b>. It expires in 5 minutes.</p>`
     })
}
module.exports={
    transporter,
    sendOtpMail
}
