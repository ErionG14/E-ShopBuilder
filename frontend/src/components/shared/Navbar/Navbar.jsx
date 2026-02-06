import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import apiClient from "../../../services/apiClient";
import "./Navbar.css";

const Navbar = () => {
  const { user, setUser } = useContext(AuthContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await apiClient.post("/identity/Auth/logout");
      setUser(null);
      setIsDropdownOpen(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow-md sticky top-0 z-50">
      <div className="flex items-center">
        <Link to="/" className="text-green-500 text-2xl font-bold">
          E-ShopBuilder
        </Link>
        <div className="ml-6 space-x-4 hidden md:flex">
          <button className="text-gray-700 hover:text-gray-900">
            Customization
          </button>
          <button className="text-gray-700 hover:text-gray-900">Hosting</button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {!user ? (
          <div className="flex items-center bg-gray-100 p-1 rounded-full border border-gray-200 shadow-sm">
            <Link
              to="/login"
              className="px-5 py-2 text-sm font-semibold text-gray-700 hover:text-black transition-colors rounded-full"
            >
              Log in
            </Link>
            <Link
              to="/signup"
              className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-blue-700 transition-all shadow-md active:scale-95"
            >
              Sign up
            </Link>
          </div>
        ) : (
          <div className="relative">
            {" "}
            {/* Dropdown Container */}
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 focus:outline-none hover:bg-gray-100 p-2 rounded-full transition"
            >
              {/* Profile Circle */}
              <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden border-2 border-white shadow-sm bg-blue-600 text-white font-bold">
                {user.image ? (
                  <img
                    src={user.image}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  user.username?.charAt(0).toUpperCase()
                )}
              </div>
              <span className="text-gray-700 font-medium hidden sm:block">
                {user.username}
              </span>
              <svg
                className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg py-1 z-50">
                <div className="px-4 py-2 text-xs text-gray-500 border-b">
                  Manage Account
                </div>

                {user.role === "Admin" && (
                  <Link
                    to="/admin-dashboard"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Admin Panel
                  </Link>
                )}
                {user.role === "Owner" && (
                  <Link
                    to="/owner-dashboard"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    My Store
                  </Link>
                )}

                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  My Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-semibold"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
