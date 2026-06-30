import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getStudent } from "../../lib/db";
import { getBrandScale } from "../../lib/colorUtils";
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
  const appName = tenant?.appName || "Personal de Sucesso";
  const logoUrl = tenant?.logoUrl || null;
  const colors = getBrandScale(brandColor);

  const isBlocked = student?.subscriptionStatus === "overdue";

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between px-5 pt-5 pb-2">
          <div className="flex items-center gap-2">
            {logoUrl ? (
              <img src={logoUrl} alt={appName} className="w-6 h-6 rounded-md object-cover" />
            ) : (
              <Logo size={24} color={brandColor} />
            )}
            <span className="text-ink font-black text-xs">{appName}</span>
          </div>
          <button onClick={() => { logout(); navigate("/"); }}>
            <LogOut size={16} className="text-stone" />
          </button>
        </div>

        <Outlet context={{ student, isBlocked, brandColor, appName, logoUrl, colors }} />
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-black/8 px-4 py-3 flex justify-around max-w-md mx-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={() => `flex flex-col items-center gap-1`}
            style={({ isActive }) => ({ color: isActive ? brandColor : "#8A8F8B" })}
          >
            {({ isActive }) => (
              <>
                <item.icon size={20} style={{ color: isActive ? brandColor : "#8A8F8B" }} />
                <span className="text-[10px] font-bold" style={{ color: isActive ? brandColor : "#8A8F8B" }}>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
}