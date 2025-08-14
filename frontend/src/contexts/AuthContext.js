// frontend/src/contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app load
  // frontend/src/contexts/AuthContext.js - Update the useEffect
  useEffect(() => {
    const checkAuth = async () => {
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        try {
          // Set default header BEFORE making the verify request
          axios.defaults.headers.common["Authorization"] =
            `Bearer ${savedToken}`;

          const response = await axios.get(
            "http://localhost:5000/api/auth/verify",
          );
          setUser(response.data.user);
          setToken(savedToken);
        } catch (error) {
          localStorage.removeItem("token");
          setToken("");
          setUser(null);
          delete axios.defaults.headers.common["Authorization"];
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        },
      );

      const { token, user } = response.data;
      console.log("Login successful, token received:", token ? "Yes" : "No");
      // Save token to localStorage
      localStorage.setItem("token", token);
      setToken(token);
      setUser(user);

      // Set default authorization header for future requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      return { success: true };
    } catch (error) {
      console.error(
        "Login error:",
        error.response?.data?.message || error.message,
      );
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name,
          email,
          password,
        },
      );

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      setToken(token);
      setUser(user);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      return { success: true };
    } catch (error) {
      console.error(
        "Registration error:",
        error.response?.data?.message || error.message,
      );
      return {
        success: false,
        error: error.response?.data?.message || "Registration failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
    delete axios.defaults.headers.common["Authorization"];
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!token && !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
