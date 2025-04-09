"use client";

import { createContext, useState, useContext, useEffect } from "react";
import { loginUser } from "../api/auth";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user; // true if user exists

  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          setUser({ id: localStorage.getItem("userId") });
        } catch (error) {
          console.error("Auth check error:", error);
          logout();
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    checkAuth();
  }, [token]);

  const login = async (email, password) => {
    try {
      const data = await loginUser(email, password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      setToken(data.token);
      setUser({ id: data.userId });
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated, // ✅ Pass it here
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
