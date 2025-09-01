import React from "react";
import { useContext } from "react";
import { useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import e from "cors";

const ForgotPassword = () => {
  const { APIURL } = useContext(AuthContext);
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState();
  const navigate = useNavigate();
 const handleSendOtp = async () => {
  try {
    const res = await fetch(`${APIURL}/user/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (res.ok) {
      alert(data.message || "OTP sent successfully!");
      setStep(2);
    } else {
      alert(data.message || "Failed to send OTP!");
    }
  } catch (error) {
    console.error("Error sending OTP:", error);
    alert("Something went wrong while sending OTP.");
  }
};

const handleVerifyOtp = async () => {
  try {
    const res = await fetch(`${APIURL}/user/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp }),
    });

    const data = await res.json();

    if (res.ok) {
      alert(data.message || "OTP verified successfully!");
      setStep(3);
    } else {
      alert(data.message || "Invalid or expired OTP!");
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    alert("Something went wrong while verifying OTP.");
  }
};

const handleResetPassword = async () => {
  try {
    const res = await fetch(`${APIURL}/user/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, newPassword }),
    });

    const data = await res.json();

    if (res.ok) {
      alert(data.message || "Password reset successfully!");
      navigate("/login");
    } else {
      alert(data.message || "Failed to reset password!");
    }
  } catch (error) {
    console.error("Error resetting password:", error);
    alert("Something went wrong while resetting password.");
  }
};

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        {step == 1 && (
          <>
            <div>
              <IoMdArrowRoundBack
                size={20}
                onClick={() => navigate("/login")}
              />
            </div>
            <h1 className="text-2xl font-bold mb-4 text-center">
              Forgot Password
            </h1>
            <p className="text-gray-600 mb-4">
              Enter your email to reset your password.
            </p>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
              onClick={handleSendOtp}
            >
              Send Otp
            </button>
          </>
        )}

        {step == 2 && (
          <>
            <h1 className="text-2xl font-bold mb-4 text-center">Verify OTP</h1>
            <p className="text-gray-600 mb-4 text-center">
              Enter the OTP sent to your email.
            </p>

            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            />
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
              onClick={handleVerifyOtp}
            >
              Verify OTP
            </button>
          </>
        )}
        {step == 3 && (
          <>
            <h1 className="text-2xl font-bold text-center mb-4">
              Reset Password
            </h1>
            <p className="text-gray-600 mb-4">
              Enter your password and confirm password.
            </p>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded"
              onClick={handleResetPassword}
            >
              Reset Password
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
