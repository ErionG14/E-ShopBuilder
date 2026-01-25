import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import apiClient from "../../services/apiClient";

const Signup = () => {
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    name: "",
    surname: "",
    address: "",
    birthdate: "2000-01-01", // Default starting date
    gender: "",
    phoneNumber: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    if (formData.birthdate > today) {
      return setError("Birthdate cannot be in the future");
    }

    try {
      // Sending the exact payload your Swagger expects
      await apiClient.post("/identity/User/register", formData);
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Registration failed. Check your details.",
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 py-10">
      <div className="w-full max-w-2xl p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center text-black mb-6">
          Create Your Account
        </h2>

        {error && (
          <p className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded">
            {error}
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Account Info */}
          <input
            name="username"
            placeholder="Username"
            className="p-2 border rounded"
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="p-2 border rounded"
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="p-2 border rounded"
            onChange={handleChange}
            required
          />
          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            className="p-2 border rounded"
            onChange={handleChange}
            required
          />

          <hr className="md:col-span-2 my-2" />

          {/* Personal Info */}
          <input
            name="name"
            placeholder="First Name"
            className="p-2 border rounded"
            onChange={handleChange}
            required
          />
          <input
            name="surname"
            placeholder="Last Name"
            className="p-2 border rounded"
            onChange={handleChange}
            required
          />
          <input
            name="phoneNumber"
            placeholder="Phone Number"
            className="p-2 border rounded"
            onChange={handleChange}
            required
          />
          <input
            name="birthdate"
            type="date"
            max={today}
            className="p-2 border rounded"
            onChange={handleChange}
            required
          />

          <input
            name="address"
            placeholder="Full Address"
            className="md:col-span-2 p-2 border rounded"
            onChange={handleChange}
            required
          />

          <select
            name="gender"
            className="md:col-span-2 p-2 border rounded"
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <button
            type="submit"
            className="md:col-span-2 py-3 mt-4 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 transition"
          >
            Register
          </button>
          <p className="md:col-span-2 text-center mt-4 text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-bold hover:underline transition"
            >
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
