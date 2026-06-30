import React from "react";
import { useOutletContext } from "react-router-dom";
import { getWorkoutFeedbackHistory } from "../../lib/db";
import { Trophy, BarChart3, ArrowUp } from "lucide-react";
import BlockedScreen from "./BlockedScreen";

const progressHistory = [62, 65, 64, 68, 70, 72, 75, 74, 78, 80];

export default function AlunoProgress() {
  const { student, isBlocked, brandColor, colors } = useOutletContext();
  if (isBlocked) return <BlockedScreen student={student} brandColor={brandColor} colors={colors} />;

  const max = Math.max(...progressHistory);
  const min = Math.min(...progressHistory);
  const feedbackHistory = getWorkoutFeedbackHistory(student.id);

  return (
    <div className="px-5 pt-4 page-enter">
      <p className="text-ink font-black text-xl mb-5">Progresso</p>

      <div className="rounded-2xl p-4 mb-4 border" style={{ background: colors.soft, borderColor: colors.border }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-stone">Carga total · Puxada Alta</p>
            <p className="text-ink font-black text-2xl">65 <span className="text-sm font-medium text-stone">kg</span></p>
          </div>
          <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full" style={{ background: colors.highlight, color: brandColor }}>
            <ArrowUp size={11} /> 18%
          </span>
        </div>
        <div className="flex items-end gap-1.5 h-20">
          {progressHistory.map((v, i) => {
            const h = ((v - min) / (max - min)) * 100;
            return <div key={i} className="flex-1 rounded-t-sm" style={{ height: `${Math.max(h, 12)}%`, background: i === progressHistory.length - 1 ? brandColor : colors.border }} />;
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-2xl p-4 border" style={{ background: colors.highlight, borderColor: colors.border }}>
          <Trophy size={14} style={{ color: brandColor }} className="mb-1.5" />
          <p className="text-ink font-black text-xl">3</p>
          <p className="text-[11px] text-stone">recordes este mês</p>
        </div>
        <div className="rounded-2xl p-4 border" style={{ background: colors.highlight, borderColor: colors.border }}>
          <BarChart3 size={14} style={{ color: brandColor }} className="mb-1.5" />
          <p className="text-ink font-black text-xl">{student.adherence}%</p>
          <p className="text-[11px] text-stone">adesão no mês</p>
        </div>
      </div>

      <p className="text-xs font-bold uppercase tracking-wide text-stone mb-2.5">Últimos treinos</p>
      <div className="space-y-2">
        {feedbackHistory.length === 0 ? (
          <div className="rounded-xl p-5 text-center border" style={{ background: colors.soft, borderColor: colors.border }}>
            <BarChart3 size={22} className="text-stone mx-auto mb-2" />
            <p className="text-sm font-bold text-ink mb-1">Ainda sem histórico</p>
            <p className="text-xs text-stone">Complete seu primeiro treino para começar a ver seu progresso aqui.</p>
          </div>
        ) : (
          feedbackHistory.map((f) => (
            <div key={f.id} className="rounded-xl p-3.5 flex items-center justify-between border" style={{ background: colors.soft, borderColor: colors.border }}>
              <p className="text-sm text-ink">{new Date(f.date).toLocaleDateString("pt-BR")}</p>
              <p className="text-sm font-mono text-stone">Nota {f.rating}/5 · Energia {f.energy}/5</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}