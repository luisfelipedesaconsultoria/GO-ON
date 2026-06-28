import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { getFinancials } from "../../lib/db";
import { Card } from "../../components/ui";
import { TrendingUp, ArrowUp, ArrowDown } from "lucide-react";

export default function PersonalFinancial() {
  const { tenant } = useAuth();
  const fin = getFinancials(tenant.id);

  if (!fin) return <div className="p-8">Sem dados financeiros.</div>;

  return (
    <div className="p-8 max-w-4xl">
      <p className="font-display font-black text-2xl text-ink mb-1">Financeiro</p>
      <p className="text-sm text-stone mb-7">Gestão de receitas e custos da sua operação</p>

      <Card className="p-6 mb-6" style={{ background: "#0D0F0E" }} dark>
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-bold uppercase text-white/50">Receita total · junho 2026</p>
          <span className="flex items-center gap-1 text-xs font-bold text-lime"><ArrowUp size={12} /> {fin.monthlyGrowth}%</span>
        </div>
        <p className="text-3xl font-black text-white">R$ {fin.monthlyRevenue.toLocaleString("pt-BR")}</p>
      </Card>

      <div className="grid grid-cols-4 gap-4 mb-7">
        <Card className="p-4">
          <p className="text-[10px] font-bold uppercase text-stone mb-1">Mensalidades</p>
          <p className="text-lg font-black text-ink">R$ {fin.monthlySubscriptions.toLocaleString("pt-BR")}</p>
        </Card>
        <Card className="p-4">
          <p className="text-[10px] font-bold uppercase text-stone mb-1">Consultorias</p>
          <p className="text-lg font-black text-ink">R$ {fin.monthlyConsulting.toLocaleString("pt-BR")}</p>
        </Card>
        <Card className="p-4">
          <p className="text-[10px] font-bold uppercase text-stone mb-1">Custos fixos</p>
          <p className="text-lg font-black text-coral">R$ {fin.fixedCosts.toLocaleString("pt-BR")}</p>
        </Card>
        <Card className="p-4">
          <p className="text-[10px] font-bold uppercase text-stone mb-1">Lucro líquido</p>
          <p className="text-lg font-black text-forest">R$ {fin.netProfit.toLocaleString("pt-BR")}</p>
        </Card>
      </div>

      <p className="font-black text-sm text-ink mb-3">Lançamentos recentes</p>
      <Card className="overflow-hidden">
        {fin.recentEntries.map((e, i) => (
          <div key={e.id} className={`flex items-center justify-between p-4 ${i > 0 ? "border-t border-black/6" : ""}`}>
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${e.type === "income" ? "bg-[#E3F0E6]" : "bg-[#FFE9E2]"}`}>
                {e.type === "income" ? <ArrowUp size={14} className="text-forest" /> : <ArrowDown size={14} className="text-coral" />}
              </div>
              <div>
                <p className="text-sm font-bold text-ink">{e.label}</p>
                <p className="text-[11px] text-stone">{new Date(e.date).toLocaleDateString("pt-BR")}</p>
              </div>
            </div>
            <p className={`text-sm font-bold ${e.type === "income" ? "text-forest" : "text-coral"}`}>
              {e.amount > 0 ? "+" : ""}R$ {Math.abs(e.amount).toLocaleString("pt-BR")}
            </p>
          </div>
        ))}
      </Card>
    </div>
  );
}
