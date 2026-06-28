import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getVideoReviewQueue, resolveVideoReview } from "../../lib/db";
import { ForestButton, OutlineButton, EmptyState } from "../../components/ui";
import { Play, Sparkles, Video, CheckCircle2 } from "lucide-react";

export default function PersonalVideoReview() {
  const { tenant } = useAuth();
  const [queue, setQueue] = useState(() => getVideoReviewQueue(tenant.id));
  const [comments, setComments] = useState({});

  const pending = queue.filter((v) => v.status === "pending");

  const handleResolve = (id, decision) => {
    resolveVideoReview(id, decision, comments[id] || "");
    setQueue(getVideoReviewQueue(tenant.id));
  };

  return (
    <div className="p-8 max-w-3xl">
      <p className="font-display font-black text-2xl text-ink mb-1">Análise de vídeo</p>
      <p className="text-sm text-stone mb-7">{pending.length} vídeos aguardando revisão</p>

      {pending.length === 0 ? (
        <EmptyState icon={Video} title="Nenhum vídeo pendente" description="Quando um aluno gravar a execução de um exercício, ele aparece aqui para sua revisão." />
      ) : (
        <div className="space-y-4">
          {pending.map((v) => (
            <div key={v.id} className="bg-white rounded-2xl border border-black/8 overflow-hidden">
              <div className="aspect-video bg-charcoal flex items-center justify-center relative">
                <div className="w-12 h-12 rounded-full bg-lime/90 flex items-center justify-center">
                  <Play size={18} fill="#0D0F0E" className="text-ink" />
                </div>
                <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 text-white">
                  {v.studentName} · {v.exerciseName}
                </span>
              </div>

              <div className="p-4">
                <div className="rounded-xl p-3 mb-3 flex gap-2.5" style={{ background: "rgba(200,245,98,0.15)" }}>
                  <Sparkles size={14} className="text-forest flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-ink mb-1">Análise automática da IA</p>
                    <p className="text-xs text-stone leading-relaxed">{v.aiAnalysis}</p>
                  </div>
                </div>

                <textarea
                  value={comments[v.id] || ""}
                  onChange={(e) => setComments((c) => ({ ...c, [v.id]: e.target.value }))}
                  placeholder="Adicionar observação para o aluno (opcional)..."
                  rows={2}
                  className="w-full border-2 border-black/10 rounded-xl px-3 py-2.5 text-sm mb-3 outline-none focus:border-forest resize-none"
                />

                <div className="flex gap-2">
                  <OutlineButton onClick={() => handleResolve(v.id, "needs_retry")} className="flex-1">Pedir novo vídeo</OutlineButton>
                  <ForestButton onClick={() => handleResolve(v.id, "approved")} icon={CheckCircle2} className="flex-1">Aprovar técnica</ForestButton>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
