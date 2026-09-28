import { createContext, useContext, useMemo, useState } from "react";
import * as authService from "../api/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  async function login(credentials) {
    const { data } = await authService.login(credentials);
    const loggedInUser = {
      id: data.id,
      username: data.username,
      email: data.email,
      roles: data.roles,
    };
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(loggedInUser));
    setToken(data.token);
    setUser(loggedInUser);
    return loggedInUser;
  }

  async function register(details) {
    const { data } = await authService.register(details);
    return data;
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: !!token,
      login,
      register,
      logout,
    }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
