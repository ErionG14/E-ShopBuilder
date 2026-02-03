import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  HiArrowLeft,
  HiSave,
  HiUser,
  HiPhone,
  HiLocationMarker,
  HiCake,
} from "react-icons/hi";

const EditProfileForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // State matches your UserUpdateByUserDTO exactly
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    name: "",
    surname: "",
    address: "",
    birthdate: "",
    gender: "",
    phoneNumber: "",
    image: "",
  });

  useEffect(() => {
    const fetchCurrentData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5174/api/identity/Auth/me",
          {
            withCredentials: true,
          },
        );
        setFormData(response.data);
      } catch (error) {
        console.error("Failed to load user data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCurrentData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put(
        "http://localhost:5174/api/identity/UpdateMyProfile",
        formData,
        { withCredentials: true },
      );
      alert("Profile updated successfully!");
      navigate("/profile");
    } catch (error) {
      console.error("Update failed", error);
      alert(error.response?.data?.Message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <button
        onClick={() => navigate("/profile")}
        className="flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-6 transition-colors"
      >
        <HiArrowLeft /> Back to Profile
      </button>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-8">
          Edit Profile Details
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-bold text-gray-400 uppercase mb-2">
                First Name
              </label>
              <div className="relative">
                <HiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                <input
                  type="text"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Surname */}
            <div>
              <label className="block text-sm font-bold text-gray-400 uppercase mb-2">
                Surname
              </label>
              <input
                type="text"
                name="surname"
                value={formData.surname || ""}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-bold text-gray-400 uppercase mb-2">
              Phone Number
            </label>
            <div className="relative">
              <HiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber || ""}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-bold text-gray-400 uppercase mb-2">
              Home Address
            </label>
            <div className="relative">
              <HiLocationMarker className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
              <input
                type="text"
                name="address"
                value={formData.address || ""}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Birthdate and Gender Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-400 uppercase mb-2">
                Birthdate
              </label>
              <div className="relative">
                <HiCake className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                <input
                  type="date"
                  name="birthdate"
                  value={
                    formData.birthdate ? formData.birthdate.split("T")[0] : ""
                  }
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-400 uppercase mb-2">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender || ""}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-100 active:scale-95 disabled:opacity-50"
          >
            {saving ? (
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <HiSave className="text-xl" />
            )}
            {saving ? "Saving Changes..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfileForm;