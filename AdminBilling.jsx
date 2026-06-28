import React from "react";
import { getAllTenants } from "../../lib/db";
import { Card } from "../../components/ui";
import { TrendingUp, DollarSign } from "lucide-react";

export default function AdminBilling() {
  const tenants = getAllTenants();
  const active = tenants.filter((t) => t.plan === "active");
  const mrr = active.reduce((acc, t) => acc + t.subscriptionPrice, 0);

  return (
    <div className="p-8 max-w-6xl">
      <p className="font-display font-black text-2xl text-ink mb-1">Faturamento</p>
      <p className="text-sm text-stone mb-7">Receita recorrente gerada pelas assinaturas dos personals</p>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card className="p-5">
          <DollarSign size={18} className="text-forest mb-2" />
          <p className="text-3xl font-black text-ink">R$ {mrr.toLocaleString("pt-BR")}</p>
          <p className="text-xs text-stone font-medium">MRR (receita mensal recorrente)</p>
        </Card>
        <Card className="p-5">
          <TrendingUp size={18} className="text-forest mb-2" />
          <p className="text-3xl font-black text-ink">{active.length}</p>
          <p className="text-xs text-stone font-medium">assinaturas ativas</p>
        </Card>
        <Card className="p-5">
          <DollarSign size={18} className="text-stone mb-2" />
          <p className="text-3xl font-black text-ink">R$ {tenants[0]?.subscriptionPrice || 97}</p>
          <p className="text-xs text-stone font-medium">ticket médio mensal</p>
        </Card>
      </div>

      <p className="font-black text-sm text-ink mb-3">Histórico de cobranças</p>
      <Card className="overflow-hidden">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-5 py-3 border-b border-black/6 text-[11px] font-bold uppercase text-stone">
          <span>Personal</span><span>Valor</span><span>Status</span><span>Data</span>
        </div>
        {active.length === 0 ? (
          <div className="p-8 text-center text-sm text-stone">Nenhuma assinatura ativa ainda — todos os personals estão em trial.</div>
        ) : (
          active.map((t) => (
            <div key={t.id} className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-5 py-4 border-b border-black/6 last:border-0 items-center">
              <span className="font-bold text-sm text-ink">{t.appName}</span>
              <span className="text-sm text-ink">R$ {t.subscriptionPrice}</span>
              <span className="text-xs font-bold text-forest">Pago</span>
              <span className="text-xs text-stone">01/06/2026</span>
            </div>
          ))
        )}
      </Card>
    </div>
  );
}
