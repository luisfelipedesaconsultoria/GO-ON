import React, { createContext, useContext, useState, useEffect } from "react";
import { getUserByEmail, getTenantById } from "../lib/db";

const AuthContext = createContext(null);
const SESSION_KEY = "personal_sucesso_session";

export function AuthProvider({ children }) {
  const [userEmail, setUserEmail] = useState(
    () => localStorage.getItem(SESSION_KEY) || null
  );
  const [user, setUser] = useState(null);
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      setLoading(true);
      if (!userEmail) {
        setUser(null);
        setTenant(null);
        setLoading(false);
        return;
      }
      try {
        const u = await getUserByEmail(userEmail);
        setUser(u);
        if (u?.tenantId) {
          const t = await getTenantById(u.tenantId);
          setTenant(t);
        } else {
          setTenant(null);
        }
      } catch (e) {
        console.error("Erro ao carregar usuário:", e);
        setUser(null);
        setTenant(null);
      }
      setLoading(false);
    }
    loadUser();
  }, [userEmail]);

  const login = (email) => {
    localStorage.setItem(SESSION_KEY, email);
    setUserEmail(email);
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setUserEmail(null);
  };

  return (
    <AuthContext.Provider value={{ user, tenant, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
