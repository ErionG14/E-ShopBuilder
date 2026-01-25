import React, { createContext, useState, useEffect } from "react";
import apiClient from "../services/apiClient";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkUserStatus = async () => {
    try {
      // This calls the /api/Auth/me endpoint we discussed
      const response = await apiClient.get("/identity/Auth/me");
      setUser(response.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUserStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, checkUserStatus, loading }}>
      {children}
    </AuthContext.Provider>
  );
};