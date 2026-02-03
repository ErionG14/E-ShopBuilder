import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  HiUserCircle,
  HiMail,
  HiBadgeCheck,
  HiCamera,
  HiLockClosed,
} from "react-icons/hi";

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5174/api/identity/Auth/me",
          { withCredentials: true },
        );
        setUser(response.data);
        setIsUnauthorized(false);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setIsUnauthorized(true);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "EShopBuilder_uploads");

    try {
      // 1. Cloudinary Upload
      const cloudRes = await axios.post(
        "https://api.cloudinary.com/v1_1/digigigcr/image/upload",
        formData,
      );
      const imageUrl = cloudRes.data.secure_url;

      // 2. Explicitly map the DTO to avoid 400 Bad Request
      // Ensure required fields like Email and Username are passed from the current user state
      await axios.put(
        "http://localhost:5174/api/identity/UpdateMyProfile",
        {
          email: user.email,
          username: user.username,
          name: user.name || "",
          surname: user.surname || "",
          address: user.address || "",
          birthdate: user.birthdate || null, // Ensure date is null or valid string, not empty string
          gender: user.gender || "",
          phoneNumber: user.phoneNumber || "",
          image: imageUrl,
        },
        { withCredentials: true },
      );

      setUser((prev) => ({ ...prev, image: imageUrl }));
      alert("Profile picture updated!");
    } catch (err) {
      // Log the actual validation errors from the backend to the console
      console.error("Update failed:", err.response?.data);
      alert("Failed to update photo. Check console for validation details.");
    } finally {
      setIsUploading(false);
    }
  };

  if (isUnauthorized && !loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[70vh] text-center px-4 transition-all duration-700 animate-in fade-in slide-in-from-bottom-4">
        <div className="bg-white p-10 rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 max-w-sm w-full hover:shadow-2xl transition-all">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-50 p-5 rounded-full ring-8 ring-blue-50/50">
              <HiLockClosed className="text-5xl text-blue-600 animate-pulse" />
            </div>
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-3 tracking-tight">
            Access Restricted
          </h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Please log in to your{" "}
            <span className="text-blue-600 font-semibold">VoltX</span> account
            to view your profile.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="group w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg active:scale-95"
          >
            Sign In to Continue
          </button>
        </div>
      </div>
    );
  }

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 animate-in fade-in duration-500">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 h-32"></div>
        <div className="px-8 pb-8">
          <div className="relative -top-12 flex items-end gap-4">
            <div className="relative group">
              <div className="bg-white p-2 rounded-2xl shadow-md overflow-hidden w-32 h-32 flex items-center justify-center">
                {user?.image ? (
                  <img
                    src={user.image}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <HiUserCircle className="text-8xl text-gray-200" />
                )}
              </div>
              <label className="absolute bottom-2 right-2 bg-blue-600 p-2 rounded-lg text-white cursor-pointer shadow-lg hover:bg-blue-700 transition-all active:scale-90">
                {isUploading ? (
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <HiCamera className="text-xl" />
                )}
                <input
                  type="file"
                  className="hidden"
                  onChange={handlePhotoChange}
                  disabled={isUploading}
                  accept="image/*"
                />
              </label>
            </div>
            <div className="pb-2">
              <h2 className="text-3xl font-bold text-gray-900">
                {user?.username || "User"}
              </h2>
              <p className="text-blue-600 font-medium flex items-center gap-1">
                <HiBadgeCheck className="text-lg" /> {user?.role || "Member"}
              </p>
            </div>
          </div>
          <div className="space-y-6 mt-4">
            <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="bg-white p-3 rounded-xl shadow-sm text-blue-600">
                <HiMail className="text-2xl" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Email Address
                </p>
                <p className="text-gray-700 font-semibold text-lg">
                  {user?.email || "Not Provided"}
                </p>
              </div>
            </div>
            <div className="pt-6 border-t border-gray-100">
              <button
                onClick={() => navigate("/edit-profile")}
                className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-black transition-all shadow-lg active:scale-[0.98]"
              >
                Edit Profile Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;