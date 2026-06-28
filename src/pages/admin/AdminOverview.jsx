import React from "react";
import { getAllTenants, getStudents } from "../../lib/db";
import { Card, Badge } from "../../components/ui";
import { Building2, Users, TrendingUp, AlertTriangle, ArrowUp, DollarSign, Clock } from "lucide-react";

export default function AdminOverview() {
  const tenants = getAllTenants();
  const totalStudents = tenants.reduce((acc, t) => acc + (t.activeStudents || 0), 0);
  const trialCount = tenants.filter((t) => t.plan === "trial").length;
  const activeCount = tenants.filter((t) => t.plan === "active").length;
  const mrr = tenants.filter((t) => t.plan === "active").reduce((acc, t) => acc + t.subscriptionPrice, 0);

  return (
    <div className="p-8 max-w-6xl">
      <p className="font-display font-black text-2xl text-ink mb-1">Visão geral da plataforma</p>
      <p className="text-sm text-stone mb-7">Métricas consolidadas de todos os personals cadastrados</p>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <Card className="p-5">
          <Building2 size={18} className="text-forest mb-2" />
          <p className="text-3xl font-black text-ink">{tenants.length}</p>
          <p className="text-xs text-stone font-medium">personals cadastrados</p>
        </Card>
        <Card className="p-5">
          <Users size={18} className="text-forest mb-2" />
          <p className="text-3xl font-black text-ink">{totalStudents}</p>
          <p className="text-xs text-stone font-medium">alunos ativos na rede</p>
        </Card>
        <Card className="p-5">
          <DollarSign size={18} className="text-forest mb-2" />
          <p className="text-3xl font-black text-ink">R$ {mrr.toLocaleString("pt-BR")}</p>
          <p className="text-xs text-stone font-medium">receita recorrente mensal</p>
        </Card>
        <Card className="p-5">
          <Clock size={18} className="text-amber mb-2" />
          <p className="text-3xl font-black text-ink">{trialCount}</p>
          <p className="text-xs text-stone font-medium">em período de trial</p>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <p className="font-black text-sm text-ink mb-3">Personals recentes</p>
          <Card className="overflow-hidden">
            {tenants.map((t, i) => (
              <div key={t.id} className={`flex items-center gap-4 p-4 ${i > 0 ? "border-t border-black/6" : ""}`}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-sm" style={{ background: t.brandColor }}>
                  {t.appName.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm text-ink">{t.appName}</p>
                  <p className="text-xs text-stone">{t.ownerName} · {t.activeStudents} alunos</p>
                </div>
                {t.plan === "trial" ? (
                  <Badge color="#A6701F" bg="#FCEFD9">Trial até {new Date(t.trialEndsAt).toLocaleDateString("pt-BR")}</Badge>
                ) : (
                  <Badge>Ativo · R$ {t.subscriptionPrice}/mês</Badge>
                )}
              </div>
            ))}
          </Card>
        </div>

        <div>
          <p className="font-black text-sm text-ink mb-3">Alertas da plataforma</p>
          <Card className="p-4 flex gap-3 mb-3" dark={false}>
            <AlertTriangle size={16} className="text-coral flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-ink">1 trial expira em 14 dias</p>
              <p className="text-xs text-stone mt-0.5">Personal de Sucesso (Bruno) — sem conversão ainda registrada</p>
            </div>
          </Card>
          <Card className="p-4 flex gap-3">
            <TrendingUp size={16} className="text-forest flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-ink">Crescimento estável</p>
              <p className="text-xs text-stone mt-0.5">Nenhum cancelamento registrado este mês</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
