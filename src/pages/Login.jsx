import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "../components/ui";
import { useAuth } from "../hooks/useAuth";
import { getUserByEmail } from "../lib/db";
import { Dumbbell, ShieldCheck, User } from "lucide-react";

const demoAccounts = [
  { email: "admin@personaldesucesso.app", role: "admin", label: "Administrador da plataforma", icon: ShieldCheck },
  { email: "bruno@email.com", role: "personal", label: "Personal trainer (Bruno)", icon: Dumbbell },
  { email: "ana@email.com", role: "aluno", label: "Aluna (Ana Beatriz)", icon: User },
];

export default function Login() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (loginEmail) => {
    const targetEmail = loginEmail || email;
    const user = getUserByEmail(targetEmail);
    if (!user) {
      setError("E-mail não encontrado. Use uma das contas de demonstração abaixo.");
      return;
    }
    login(user.id);
    if (user.role === "admin") navigate("/admin");
    else if (user.role === "personal") navigate("/personal");
    else navigate("/aluno");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F3F3EE] px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <Logo size={48} />
          <p className="font-display font-black text-2xl text-ink mt-3">Personal de Sucesso</p>
          <p className="text-sm text-stone">Entre na sua conta</p>
        </div>

        <div className="bg-white rounded-2xl border border-black/6 p-5 mb-5">
          <label className="text-xs font-bold text-stone mb-1.5 block">E-mail</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="seu@email.com"
            className="w-full border-2 border-black/10 rounded-xl px-4 py-3 text-sm mb-3 outline-none focus:border-forest"
          />
          {error && <p className="text-xs text-coral mb-3">{error}</p>}
          <button onClick={() => handleLogin()} className="w-full bg-ink text-white rounded-xl py-3.5 font-bold text-sm hover:opacity-90">
            Entrar
          </button>
        </div>

        <p className="text-[11px] font-bold uppercase tracking-wide text-stone mb-2.5 text-center">Contas de demonstração</p>
        <div className="space-y-2">
          {demoAccounts.map((acc) => (
            <button
              key={acc.email}
              onClick={() => handleLogin(acc.email)}
              className="w-full bg-white rounded-xl border border-black/6 p-3.5 flex items-center gap-3 text-left hover:border-forest/40 transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-[#E3F0E6] flex items-center justify-center flex-shrink-0">
                <acc.icon size={16} className="text-forest" />
              </div>
              <div>
                <p className="text-sm font-bold text-ink">{acc.label}</p>
                <p className="text-[11px] text-stone">{acc.email}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
