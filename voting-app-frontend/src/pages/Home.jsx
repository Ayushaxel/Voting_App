import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Home = () => {
  const { token } = useContext(AuthContext);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 md:px-8 pt-24 sm:pt-28">
      {/* Heading */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-blue-600 text-center">
        Online Voting System
      </h1>

      {/* Subheading */}
      <p className="mt-4 text-gray-700 text-base sm:text-lg md:text-xl text-center max-w-2xl">
        Welcome! Participate in the election by exploring candidates and casting your valuable vote.
      </p>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full sm:w-auto justify-center">
        {/* Always show View Candidates */}
        <Link
          to="/candidates"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-lg text-center text-base sm:text-lg transition-all duration-300"
        >
          View Candidates
        </Link>

        {/* Show Login & Signup only if NOT logged in */}
        {!token && (
          <>
            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg text-center text-base sm:text-lg transition-all duration-300"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow-lg text-center text-base sm:text-lg transition-all duration-300"
            >
              Signup
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
