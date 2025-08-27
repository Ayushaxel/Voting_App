import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, loading, logout, token } = useContext(AuthContext);
  console.log(user);
  const navigate = useNavigate();

  return (
    <div className="max-w-lg mx-auto mt-24 p-6 shadow-lg   border rounded-lg bg-white">
      <h1 className="text-2xl font-bold text-center mb-6">👤 Profile</h1>
      <p>
        <strong>Name:</strong> {user?.name}
      </p>
      <p>
        <strong>Aadhar Number:</strong> {user?.aadharCardNumber}
      </p>
      <p>
        <strong>Email:</strong> {user?.email}
      </p>
      <p>
        <strong>Voting Status:</strong>{" "}
        {user?.isVoted ? (
          <span className="text-green-600 font-semibold">✅ Voted</span>
        ) : (
          <span className="text-red-600 font-semibold">❌ Not Voted</span>
        )}
      </p>

       <div className="mt-6 flex justify-center space-x-3">
        <button
          onClick={() => navigate("/change-password")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
        >
          Change Password
        </button>
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
