"use client";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

// Safe JSON parsing helper to avoid "Unexpected end of JSON input" when body is empty or non-JSON
async function parseJsonSafe(res) {
  const ct = res.headers?.get?.("content-type") || "";
  if (ct.includes("application/json")) {
    try {
      return await res.json();
    } catch {
      return {};
    }
  }
  try {
    const t = await res.text();
    return { error: t };
  } catch {
    return {};
  }
}

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
      const data = await parseJsonSafe(res);
      if (!res.ok) throw new Error(data?.error || `Signup failed (${res.status})`);
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
      const data = await parseJsonSafe(res);
      if (!res.ok) throw new Error(data?.error || `Login failed (${res.status})`);
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
      const data = await parseJsonSafe(res);
      if (!res.ok) throw new Error(data?.error || `Failed to send OTP (${res.status})`);
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
      const data = await parseJsonSafe(res);
      if (!res.ok) throw new Error(data?.error || `Failed to verify OTP (${res.status})`);
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