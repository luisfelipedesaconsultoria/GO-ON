import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Logo } from "../../components/ui";
import { useAuth } from "../../hooks/useAuth";
import { LayoutDashboard, Building2, CreditCard, Library, LogOut, Settings } from "lucide-react";

const navItems = [
  { to: "/admin", icon: LayoutDashboard, label: "Visão geral", end: true },
  { to: "/admin/tenants", icon: Building2, label: "Personals" },
  { to: "/admin/billing", icon: CreditCard, label: "Faturamento" },
  { to: "/admin/library", icon: Library, label: "Banco compartilhado" },
  { to: "/admin/settings", icon: Settings, label: "Configurações" },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F3F3EE] flex">
      <aside className="w-60 bg-ink flex-shrink-0 flex flex-col">
        <div className="p-5 flex items-center gap-2.5 border-b border-white/10">
          <Logo size={26} color="#C8F562" />
          <div>
            <p className="text-white font-black text-sm leading-none">Personal de Sucesso</p>
            <p className="text-[10px] text-white/40 leading-none mt-1">Painel administrativo</p>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-colors ${
                  isActive ? "bg-lime text-ink" : "text-white/55 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <item.icon size={16} /> {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-white/10">
          <div className="flex items-center gap-2.5 px-3 py-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-lime flex items-center justify-center text-ink font-black text-xs">
              {user?.name?.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-white/40">Administrador</p>
            </div>
          </div>
          <button
            onClick={() => { logout(); navigate("/"); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold text-white/55 hover:bg-white/5 hover:text-white"
          >
            <LogOut size={16} /> Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
