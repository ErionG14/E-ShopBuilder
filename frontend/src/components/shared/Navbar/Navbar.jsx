import React from "react";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow-md">
      {" "}
      <div className="flex items-center">
        {" "}
        <div className="text-green-500 text-2xl font-bold">
          E-ShopBuilder
        </div>{" "}
        <div className="ml-6 space-x-4">
          {" "}
          <button className="text-gray-700 hover:text-gray-900">
            Lorem
          </button>{" "}
          <button className="text-gray-700 hover:text-gray-900">
            Customization
          </button>{" "}
          <button className="text-gray-700 hover:text-gray-900">Hosting</button>{" "}
          <button className="text-gray-700 hover:text-gray-900">
            About Us
          </button>{" "}
          <button className="text-gray-700 hover:text-gray-900">
            Resources
          </button>{" "}
        </div>{" "}
      </div>{" "}
      <div className="flex items-center space-x-4">
        {" "}
        <button className="bg-black text-white px-4 py-2 rounded-md">
          {" "}
          Log in{" "}
          <span className="bg-blue-500 text-white px-2 py-1 rounded-md">
            Sign up
          </span>{" "}
        </button>{" "}
        <button className="border border-gray-300 px-4 py-2 rounded-md">
          {" "}
          ✨ My E-Shop{" "}
        </button>{" "}
      </div>{" "}
    </nav>
  );
};

export default Navbar;
