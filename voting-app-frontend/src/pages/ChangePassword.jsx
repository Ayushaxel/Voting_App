import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const {token,APIURL} = useContext(AuthContext);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
    const navigate = useNavigate();

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${APIURL}/user/profile/password`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
     const data = await res.json();
        
      if (!res.ok) {
        throw new Error(data.message || "Failed to update password");
      } 
       setMessage(data.message || "Password updated successfully ✅");
      setNewPassword("");
      setCurrentPassword("");
        setTimeout(() => navigate("/profile"), 1500)
   
    } catch (err) {
        console.log(err);
      setError("server error ,please try again later  ayush");
    }
  };
  return (
    <div className="max-w-lg mx-auto mt-24 bg-white shadow-md rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-5 text-center">
        🔑 Change Password
      </h1>
      <form action="" onSubmit={handlePasswordUpdate} className="space-y-4">
        <div>
          <label className="block font-medium">Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="border rounded-lg w-full p-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="border rounded-lg w-full p-2"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
        >
          Update Password
        </button>
      </form>
      {message && <p className="mt-4 text-green-600 text-center">{message}</p>}
      {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
    </div>
   
  );
};

export default ChangePassword;
