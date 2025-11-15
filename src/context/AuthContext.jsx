"use client";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { email }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // restore session from localStorage
    const saved = typeof window !== "undefined" ? localStorage.getItem("humanizer-user") : null;
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {}
    }
  }, []);

  const saveUser = (u) => {
    setUser(u);
    if (typeof window !== "undefined") localStorage.setItem("humanizer-user", JSON.stringify(u));
  };

  const clearUser = () => {
    setUser(null);
    if (typeof window !== "undefined") localStorage.removeItem("humanizer-user");
  };

  const signup = async ({ name, email, password }) => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");
      return { ok: true, message: data.message };
    } catch (e) {
      setError(e.message);
      return { ok: false, error: e.message };
    } finally {
      setLoading(false);
    }
  };

  const login = async ({ email, password }) => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      saveUser({ email: data.email });
      return { ok: true };
    } catch (e) {
      setError(e.message);
      return { ok: false, error: e.message };
    } finally {
      setLoading(false);
    }
  };

  const requestOtp = async ({ email }) => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send OTP");
      return { ok: true, code: data.code, message: data.message };
    } catch (e) {
      setError(e.message);
      return { ok: false, error: e.message };
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async ({ email, code }) => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to verify OTP");
      saveUser({ email });
      return { ok: true, message: data.message };
    } catch (e) {
      setError(e.message);
      return { ok: false, error: e.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearUser();
  };

  const value = { user, loading, error, signup, login, requestOtp, verifyOtp, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}