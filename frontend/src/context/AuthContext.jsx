import { createContext, useContext, useEffect, useState } from "react";
import api from "@/lib/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("user");
      return cached ? JSON.parse(cached) : null;
    }
    return null;
  });
  const [loading, setLoading] = useState(() => {
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("user");
      return !cached;
    }
    return true;
  });

  useEffect(() => {
    const path = typeof window !== "undefined" ? window.location.pathname : "";
    if (path === "/login" || path === "/register") {
      setLoading(false);
      return;
    }
    let mounted = true;
    api
      .get("/auth/profile")
      .then((r) => {
        if (mounted) {
          setUser(r.data);
          localStorage.setItem("user", JSON.stringify(r.data));
        }
      })
      .catch((err) => {
        if (mounted) {
          setUser(null);
          localStorage.removeItem("user");
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    setUser(data.user);
    localStorage.setItem("user", JSON.stringify(data.user));
    return data.user;
  };

  const register = async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    setUser(data.user);
    localStorage.setItem("user", JSON.stringify(data.user));
    return data.user;
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout request failed:", err);
    }
    setUser(null);
    localStorage.removeItem("user");
  };

  const can = (...roles) => user && roles.includes(user.role);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, can }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
