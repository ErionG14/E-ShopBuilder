import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import apiClient from "../../../services/apiClient";
import { HiShoppingBag} from "react-icons/hi";
import "./Navbar.css";

const Navbar = () => {
  const { user, setUser } = useContext(AuthContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await apiClient.post("/identity/Auth/logout");
      setUser(null);
      setIsDropdownOpen(false);
      setIsMobileMenuOpen(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const closeMenus = () => {
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  };

  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow-md sticky top-0 z-50 h-20">
      
      {/*Hamburger Menu*/}
      <div className="flex items-center">
        <button
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 mr-4 focus:outline-none z-50"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <div className="relative w-6 h-5">
            <span
              className={`absolute block h-0.5 w-6 bg-gray-700 transform transition duration-300 ease-in-out ${
                isMobileMenuOpen ? "rotate-45 translate-y-2" : "translate-y-0"
              }`}
            ></span>
            <span
              className={`absolute block h-0.5 w-6 bg-gray-700 transform transition duration-300 ease-in-out translate-y-2 ${
                isMobileMenuOpen ? "opacity-0" : "opacity-100"
              }`}
            ></span>
            <span
              className={`absolute block h-0.5 w-6 bg-gray-700 transform transition duration-300 ease-in-out ${
                isMobileMenuOpen ? "-rotate-45 translate-y-2" : "translate-y-4"
              }`}
            ></span>
          </div>
        </button>

        <Link
          to="/"
          onClick={closeMenus}
          className="text-blue-500 text-2xl font-bold"
        >
          E-ShopBuilder
        </Link>

        <div className="ml-8 space-x-6 hidden md:flex">
          <Link
            to="/marketplace"
            className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
          >
            Marketplace
          </Link>
          <Link
            to="/hosting"
            className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
          >
            Hosting
          </Link>
          <Link
            to="/about-us"
            className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
          >
            About Us
          </Link>
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
          <div className="flex items-center space-x-2 md:space-x-4">
            {user.role === "User" && (
              <Link
                to="/cart"
                className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-all group"
              >
                <HiShoppingBag className="text-2xl group-hover:text-blue-600" />
                <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
              </Link>
            )}

            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 focus:outline-none hover:bg-gray-100 p-1 sm:p-2 rounded-full transition"
              >
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
                  className={`w-4 h-4 transition-transform hidden sm:block ${isDropdownOpen ? "rotate-180" : ""}`}
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
                      onClick={closeMenus}
                    >
                      Admin Panel
                    </Link>
                  )}
                  {user.role === "Owner" && (
                    <Link
                      to="/owner-dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={closeMenus}
                    >
                      My Store
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={closeMenus}
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
          </div>
        )}
      </div>

      <div
        className={`fixed top-20 left-0 w-64 h-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-40 md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col p-6 space-y-6">
          <Link
            to="/marketplace"
            onClick={closeMenus}
            className="text-lg font-semibold text-gray-800 hover:text-blue-600 border-b pb-2"
          >
            Marketplace
          </Link>
          <Link
            to="/hosting"
            onClick={closeMenus}
            className="text-lg font-semibold text-gray-800 hover:text-blue-600 border-b pb-2"
          >
            Hosting
          </Link>
          <Link
            to="/about-us"
            onClick={closeMenus}
            className="text-lg font-semibold text-gray-800 hover:text-blue-600 border-b pb-2"
          >
            About Us
          </Link>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-30 md:hidden"
          onClick={closeMenus}
        ></div>
      )}
    </nav>
  );
};

export default Navbar;
