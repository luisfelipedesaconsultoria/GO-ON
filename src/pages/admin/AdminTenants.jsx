import React from "react";
import { getAllTenants } from "../../lib/db";
import { Card, Badge } from "../../components/ui";
import { Building2, ExternalLink, MoreVertical } from "lucide-react";

export default function AdminTenants() {
  const tenants = getAllTenants();

  return (
    <div className="p-4 md:p-8 max-w-6xl">
      <p className="font-display font-black text-2xl text-ink mb-1">Personals</p>
      <p className="text-sm text-stone mb-7">Todas as contas brancas (white-label) cadastradas na plataforma</p>

      <Card className="overflow-x-auto">
        <div className="min-w-[640px]">
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 border-b border-black/6 text-[11px] font-bold uppercase text-stone">
            <span>Personal</span>
            <span>Alunos</span>
            <span>Plano</span>
            <span>Desde</span>
            <span></span>
          </div>
          {tenants.map((t) => (
            <div key={t.id} className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-5 py-4 border-b border-black/6 last:border-0 items-center">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center font-black text-white text-xs flex-shrink-0" style={{ background: t.brandColor }}>
                  {t.appName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-sm text-ink">{t.appName}</p>
                  <p className="text-xs text-stone">{t.ownerName}</p>
                </div>
              </div>
              <span className="text-sm font-bold text-ink">{t.activeStudents}</span>
              <div>
                {t.plan === "trial" ? <Badge color="#A6701F" bg="#FCEFD9">Trial</Badge> : <Badge>Ativo</Badge>}
              </div>
              <span className="text-xs text-stone">{new Date(t.createdAt).toLocaleDateString("pt-BR")}</span>
              <button className="text-stone hover:text-ink">
                <MoreVertical size={16} />
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}