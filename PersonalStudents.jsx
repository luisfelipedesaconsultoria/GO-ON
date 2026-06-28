import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getStudents } from "../../lib/db";
import { Card, Badge, Avatar } from "../../components/ui";
import { Search, Plus, Dumbbell, Activity, Zap, ChevronRight, AlertCircle } from "lucide-react";

const statusMeta = {
  "on-track": { label: "Em dia", color: "#0B5A28", bg: "#E3F0E6" },
  attention: { label: "Atenção", color: "#FF6B4A", bg: "#FFE9E2" },
  achievement: { label: "Conquista", color: "#5C7A1F", bg: "#EEF7D6" },
};
const modalityIcon = { musc: Dumbbell, run: Activity, both: Zap };

export default function PersonalStudents() {
  const { tenant } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const students = getStudents(tenant.id).filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-1">
        <p className="font-display font-black text-2xl text-ink">Seus alunos</p>
        <button onClick={() => navigate("/personal/alunos/novo")} className="flex items-center gap-2 bg-forest text-white rounded-xl px-4 py-2.5 text-sm font-bold">
          <Plus size={15} /> Novo aluno
        </button>
      </div>
      <p className="text-sm text-stone mb-6">{students.length} alunos cadastrados</p>

      <div className="bg-white rounded-xl border border-black/8 px-4 py-3 flex items-center gap-2.5 mb-5">
        <Search size={16} className="text-black/30" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar aluno..."
          className="flex-1 outline-none text-sm bg-transparent"
        />
      </div>

      <Card className="overflow-hidden">
        {students.map((s, i) => {
          const Icon = modalityIcon[s.modality];
          const meta = statusMeta[s.status];
          return (
            <button
              key={s.id}
              onClick={() => navigate(`/personal/alunos/${s.id}`)}
              className={`w-full flex items-center gap-4 p-4 text-left hover:bg-black/[0.02] ${i > 0 ? "border-t border-black/6" : ""}`}
            >
              <Avatar initials={s.initials} color={tenant.brandColor} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-sm text-ink truncate">{s.name}</p>
                  <Icon size={12} className="text-stone flex-shrink-0" />
                </div>
                <p className="text-xs text-stone truncate">{s.phase}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold text-ink">{s.adherence}%</p>
                <p className="text-[10px] text-stone">adesão</p>
              </div>
              <div className="w-24 flex-shrink-0">
                {s.subscriptionStatus === "overdue" && <Badge color="#FF6B4A" bg="#FFE9E2">Inadimplente</Badge>}
                {s.subscriptionStatus === "active" && <Badge color={meta.color} bg={meta.bg}>{meta.label}</Badge>}
              </div>
              {s.alert && <AlertCircle size={15} className="text-coral flex-shrink-0" />}
              <ChevronRight size={16} className="text-black/20 flex-shrink-0" />
            </button>
          );
        })}
      </Card>
    </div>
  );
}
