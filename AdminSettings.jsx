import React from "react";
import { Card } from "../../components/ui";

export default function AdminSettings() {
  return (
    <div className="p-8 max-w-2xl">
      <p className="font-display font-black text-2xl text-ink mb-1">Configurações</p>
      <p className="text-sm text-stone mb-7">Parâmetros globais da plataforma</p>

      <Card className="p-5 mb-4">
        <p className="font-bold text-sm text-ink mb-3">Trial e cobrança</p>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold text-stone block mb-1.5">Duração do trial (dias)</label>
            <input defaultValue={14} className="w-full border-2 border-black/10 rounded-xl px-4 py-2.5 text-sm" />
          </div>
          <div>
            <label className="text-xs font-bold text-stone block mb-1.5">Valor padrão da assinatura (R$/mês)</label>
            <input defaultValue={97} className="w-full border-2 border-black/10 rounded-xl px-4 py-2.5 text-sm" />
          </div>
          <div>
            <label className="text-xs font-bold text-stone block mb-1.5">Retenção de dados após trial expirado (dias)</label>
            <input defaultValue={30} className="w-full border-2 border-black/10 rounded-xl px-4 py-2.5 text-sm" />
          </div>
        </div>
      </Card>

      <button className="bg-ink text-white rounded-xl px-5 py-3 text-sm font-bold">Salvar configurações</button>
    </div>
  );
}
