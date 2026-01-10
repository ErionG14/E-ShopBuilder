import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../services/apiClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing token and validate
        const token = localStorage.getItem('token');
        if (token) {
            // Mock validation or API call
            // apiClient.get('/auth/me').then(res => setUser(res.data)).catch(() => localStorage.removeItem('token'));
            // For now, assuming token implies user, but we need real logic
        }
        setLoading(false);
    }, []);

    const login = async (credentials) => {
        // const response = await apiClient.post('/auth/login', credentials);
        // localStorage.setItem('token', response.data.token);
        // setUser(response.data.user);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
