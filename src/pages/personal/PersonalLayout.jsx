import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Logo } from "../../components/ui";
import { useAuth } from "../../hooks/useAuth";
import { getVideoReviewQueue, getStudents } from "../../lib/db";
import { LayoutDashboard, Users, Library, Video, MessageSquare, DollarSign, LogOut, Settings, Menu, X } from "lucide-react";

const navItems = [
  { to: "/personal", icon: LayoutDashboard, label: "Painel", end: true },
  { to: "/personal/alunos", icon: Users, label: "Alunos" },
  { to: "/personal/treinos", icon: Library, label: "Banco de treinos" },
  { to: "/personal/videos", icon: Video, label: "Análise de vídeo" },
  { to: "/personal/chat", icon: MessageSquare, label: "Mensagens" },
  { to: "/personal/financeiro", icon: DollarSign, label: "Financeiro" },
  { to: "/personal/configuracoes", icon: Settings, label: "Configurações" },
];

export default function PersonalLayout() {
  const { user, tenant, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const pendingVideos = tenant ? getVideoReviewQueue(tenant.id).filter((v) => v.status === "pending").length : 0;
  const students = tenant ? getStudents(tenant.id) : [];
  const alertCount = students.filter((s) => s.alert).length;
  const brandColor = tenant?.brandColor || "#0B5A28";

  const SidebarContent = () => (
    <>
      <div className="p-5 flex items-center justify-between gap-2.5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <Logo size={26} color={brandColor} />
          <div>
            <p className="text-white font-black text-sm leading-none">{tenant?.appName || "Personal de Sucesso"}</p>
            <p className="text-[10px] text-white/40 leading-none mt-1">Painel do treinador</p>
          </div>
        </div>
        <button onClick={() => setMenuOpen(false)} className="md:hidden text-white/50">
          <X size={20} />
        </button>
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const showBadge = (item.to === "/personal/videos" && pendingVideos > 0) || (item.to === "/personal/alunos" && alertCount > 0);
          const badgeCount = item.to === "/personal/videos" ? pendingVideos : alertCount;
          return (
            <NavLink key={item.to} to={item.to} end={item.end} onClick={() => setMenuOpen(false)}
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-colors relative ${isActive ? "text-ink" : "text-white/55 hover:bg-white/5 hover:text-white"}`}
              style={({ isActive }) => (isActive ? { background: "#C8F562" } : {})}>
              <item.icon size={16} /> {item.label}
              {showBadge && (
                <span className="ml-auto bg-coral text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                  {badgeCount}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>
      <div className="p-3 border-t border-white/10">
        <div className="flex items-center gap-2.5 px-3 py-2 mb-1">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-black text-xs flex-shrink-0" style={{ background: brandColor }}>
            {user?.name?.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">{user?.name}</p>
            <p className="text-[10px] text-white/40">Personal trainer</p>
          </div>
        </div>
        <button onClick={() => { logout(); navigate("/"); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold text-white/55 hover:bg-white/5 hover:text-white">
          <LogOut size={16} /> Sair
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#F3F3EE]">
      <div className="md:hidden sticky top-0 z-30 bg-ink flex items-center gap-3 px-4 py-3">
        <button onClick={() => setMenuOpen(true)} className="text-white relative flex-shrink-0">
          <Menu size={22} />
          {(pendingVideos > 0 || alertCount > 0) && (
            <span className="absolute -top-1 -right-1 bg-coral w-2.5 h-2.5 rounded-full" />
          )}
        </button>
        <div className="flex items-center gap-2">
          <Logo size={22} color={brandColor} />
          <span className="text-white font-black text-sm">{tenant?.appName || "Personal de Sucesso"}</span>
        </div>
      </div>
      <div className="flex">
        <aside className="hidden md:flex w-60 bg-ink flex-shrink-0 flex-col min-h-screen sticky top-0">
          <SidebarContent />
        </aside>
        {menuOpen && (
          <div className="md:hidden fixed inset-0 z-40 flex">
            <div className="w-72 bg-ink flex flex-col h-full animate-fade-in">
              <SidebarContent />
            </div>
            <div className="flex-1 bg-black/50" onClick={() => setMenuOpen(false)} />
          </div>
        )}
        <main className="flex-1 overflow-x-hidden w-full min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
