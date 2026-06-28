import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getStudent } from "../../lib/db";
import { Logo } from "../../components/ui";
import { Dumbbell, Activity, TrendingUp, MessageSquare, LogOut, ClipboardList } from "lucide-react";

const navItems = [
  { to: "/aluno", icon: Dumbbell, label: "Treino", end: true },
  { to: "/aluno/corrida", icon: Activity, label: "Corrida" },
  { to: "/aluno/progresso", icon: TrendingUp, label: "Progresso" },
  { to: "/aluno/avaliacoes", icon: ClipboardList, label: "Avaliação" },
  { to: "/aluno/chat", icon: MessageSquare, label: "Chat" },
];

export default function AlunoLayout() {
  const { user, tenant, logout } = useAuth();
  const navigate = useNavigate();
  const student = getStudent(user.studentId);
  const brandColor = tenant?.brandColor || "#0B5A28";

  const isBlocked = student?.subscriptionStatus === "overdue";

  return (
    <div className="min-h-screen bg-ink pb-20">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between px-5 pt-5 pb-2">
          <div className="flex items-center gap-2">
            <Logo size={24} color={brandColor} />
            <span className="text-white font-black text-xs">{tenant?.appName}</span>
          </div>
          <button onClick={() => { logout(); navigate("/"); }}>
            <LogOut size={16} className="text-white/40" />
          </button>
        </div>

        <Outlet context={{ student, isBlocked, brandColor }} />
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-ink border-t border-white/10 px-4 py-3 flex justify-around max-w-md mx-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `flex flex-col items-center gap-1`}
            style={({ isActive }) => ({ color: isActive ? brandColor : "rgba(255,255,255,0.35)" })}
          >
            {({ isActive }) => (
              <>
                <item.icon size={20} style={{ color: isActive ? brandColor : "rgba(255,255,255,0.35)" }} />
                <span className="text-[10px] font-bold" style={{ color: isActive ? brandColor : "rgba(255,255,255,0.35)" }}>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
