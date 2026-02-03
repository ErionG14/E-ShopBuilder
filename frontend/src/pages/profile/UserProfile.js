import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  HiUserCircle,
  HiMail,
  HiBadgeCheck,
  HiLockClosed,
} from "react-icons/hi";

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUnauthorized, setIsUnauthorized] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:5174/api/identity/Auth/me", {
          withCredentials: true,
        });
        setUser(response.data);
        setIsUnauthorized(false);
      } catch (error) {
        console.error("Profile fetch failed:", error);
        if (error.response && error.response.status === 401) {
          setIsUnauthorized(true);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

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
            <span className="text-blue-600 font-semibold">E-ShopBuilder</span>{" "}
            account to view your profile details.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="group w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-100 active:scale-95"
          >
            <span>Sign In to Continue</span>
            <svg
              className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
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

  if (!user)
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">
          Unable to load profile data. Please try again later.
        </p>
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 animate-in fade-in duration-500">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Profile Header Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 h-32"></div>

        <div className="px-8 pb-8">
          <div className="relative -top-12 flex items-end gap-4">
            <div className="bg-white p-2 rounded-2xl shadow-md">
              <HiUserCircle className="text-8xl text-gray-200" />
            </div>
            <div className="pb-2">
              <h2 className="text-3xl font-bold text-gray-900">
                {user.username || "User"}
              </h2>
              <p className="text-blue-600 font-medium flex items-center gap-1">
                <HiBadgeCheck className="text-lg" /> {user.role || "Member"}
              </p>
            </div>
          </div>

          <div className="space-y-6 mt-4">
            <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100 transition-colors hover:bg-gray-100/50">
              <div className="bg-white p-3 rounded-xl shadow-sm text-blue-600">
                <HiMail className="text-2xl" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Email Address
                </p>
                <p className="text-gray-700 font-semibold text-lg">
                  {user.email || "Not Provided"}
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100">
              <button className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-black transition-all shadow-lg active:scale-[0.98]">
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
