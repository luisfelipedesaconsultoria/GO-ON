import React, { createContext, useContext, useState, useEffect } from "react";
import { getUserById, getTenant } from "../lib/db";

const AuthContext = createContext(null);

const SESSION_KEY = "personal_sucesso_session";

export function AuthProvider({ children }) {
  const [userId, setUserId] = useState(() => localStorage.getItem(SESSION_KEY) || null);

  useEffect(() => {
    if (userId) localStorage.setItem(SESSION_KEY, userId);
    else localStorage.removeItem(SESSION_KEY);
  }, [userId]);

  const user = userId ? getUserById(userId) : null;
  const tenant = user?.tenantId ? getTenant(user.tenantId) : null;

  const login = (id) => setUserId(id);
  const logout = () => setUserId(null);

  return (
    <AuthContext.Provider value={{ user, tenant, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
