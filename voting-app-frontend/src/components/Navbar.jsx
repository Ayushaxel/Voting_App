import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { HiMenu, HiX } from "react-icons/hi"; // Hamburger and Close icons

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-900 text-white fixed w-full top-0 z-10 shadow-lg ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navbar Container */}
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold text-blue-400 hover:text-blue-300 transition-colors duration-300"
          >
            Voting System
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-blue-400">
              Home
            </Link>
            <Link to="/candidates" className="hover:text-blue-400">
              Candidates
            </Link>
            <Link to="/vote-counts" className="hover:text-blue-400">
              Vote Counts
            </Link>
            {user?.role === "admin" && (
              <Link to="/admin" className="hover:text-blue-400">
                Admin
              </Link>
            )}
            {user?.role==='voter'  && (
              <Link to="/profile" className="hover:text-blue-400">
                Profile
              </Link>
            )}

            {/* Auth Buttons */}
            {!user ? (
              <>
                <Link to="/login" className="hover:text-blue-400">
                  Login
                </Link>
                <Link to="/signup" className="hover:text-blue-400">
                  Signup
                </Link>
              </>
            ) : (
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors duration-300"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="focus:outline-none"
            >
              {isOpen ? (
                <HiX className="h-6 w-6 text-white" />
              ) : (
                <HiMenu className="h-6 w-6 text-white" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-800 px-4 pb-4 space-y-3">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="block hover:text-blue-400"
          >
            Home
          </Link>
          <Link
            to="/candidates"
            onClick={() => setIsOpen(false)}
            className="block hover:text-blue-400"
          >
            Candidates
          </Link>
          <Link
            to="/vote-counts"
            onClick={() => setIsOpen(false)}
            className="block hover:text-blue-400"
          >
            Vote Counts
          </Link>
          {user?.role === "admin" && (
            <Link
              to="/admin"
              onClick={() => setIsOpen(false)}
              className="block hover:text-blue-400"
            >
              Admin
            </Link>
          )}
          {user && (
            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
              className="block hover:text-blue-400"
            >
              Profile
            </Link>
          )}

          {!user ? (
            <>
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block hover:text-blue-400"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setIsOpen(false)}
                className="block hover:text-blue-400"
              >
                Signup
              </Link>
            </>
          ) : (
            <button
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors duration-300"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
