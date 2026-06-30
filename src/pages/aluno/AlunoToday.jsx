import React from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { getAssignedWorkout } from "../../lib/db";
import { ProgressRing } from "../../components/ui";
import { CheckCircle2, Play, Circle, Award } from "lucide-react";
import BlockedScreen from "./BlockedScreen";

export default function AlunoToday() {
  const { student, isBlocked, brandColor, colors } = useOutletContext();
  const navigate = useNavigate();

  if (isBlocked) return <BlockedScreen student={student} brandColor={brandColor} colors={colors} />;

  const workout = getAssignedWorkout(student.id);
  if (!workout) {
    return (
      <div className="px-5 pt-10 text-center">
        <p className="text-stone text-sm">Nenhum treino atribuído ainda. Fale com seu personal!</p>
      </div>
    );
  }

  const exercises = workout.todayWorkout.exercises;
  const doneCount = exercises.filter((e) => e.done).length;
  const pct = Math.round((doneCount / exercises.length) * 100);
  const muscPhase = student.muscPhase || `${workout.blockName} · Semana ${workout.weekNumber}/${workout.totalWeeks}`;

  return (
    <div className="px-5 pt-4 page-enter">
      <p className="text-stone text-sm">Olá, {student.name.split(" ")[0]} 👋</p>
      <p className="text-ink font-black text-2xl leading-tight mb-5">{muscPhase}</p>

      <div className="flex justify-between rounded-2xl p-3.5 mb-5 border" style={{ background: colors.soft, borderColor: colors.border }}>
        {workout.weekPlan.map((d, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5">
            <span className="text-[10px] font-bold text-stone">{d.day}</span>
            {d.done && <CheckCircle2 size={16} style={{ color: brandColor }} />}
            {d.today && <div className="w-4 h-4 rounded-full" style={{ background: brandColor }} />}
            {!d.done && !d.today && <Circle size={16} className="text-black/15" />}
          </div>
        ))}
      </div>

      <div className="rounded-3xl p-5 mb-5" style={{ background: brandColor }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-white/70">Treino de hoje</p>
            <p className="text-white font-black text-xl">{workout.todayWorkout.title}</p>
          </div>
          <div className="relative flex-shrink-0">
            <ProgressRing pct={pct} size={56} stroke={6} color="white" track="rgba(255,255,255,0.25)" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white font-black text-sm">{pct}%</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {exercises.map((ex) => (
            <button
              key={ex.id}
              onClick={() => navigate(`/aluno/exercicio/${ex.id}`)}
              className="w-full flex items-center gap-3 rounded-xl p-3 text-left"
              style={{ background: ex.current ? "white" : "rgba(255,255,255,0.15)" }}
            >
              {ex.done ? (
                <CheckCircle2 size={18} className="text-white flex-shrink-0" />
              ) : ex.current ? (
                <Play size={18} style={{ color: brandColor }} fill={brandColor} className="flex-shrink-0" />
              ) : (
                <Circle size={18} className="text-white/40 flex-shrink-0" />
              )}
              <div className="flex-1">
                <p className="text-sm font-bold" style={{ color: ex.current ? "#0D0F0E" : "white" }}>{ex.name}</p>
                <p className="text-xs font-mono" style={{ color: ex.current ? "#6B716C" : "rgba(255,255,255,0.7)" }}>
                  {ex.sets.length}x{ex.sets[0]?.reps} · {ex.sets[0]?.load}kg
                </p>
              </div>
            </button>
          ))}
        </div>

        {pct === 100 && (
          <button onClick={() => navigate("/aluno/feedback-treino")} className="w-full bg-white rounded-xl py-3 font-bold text-sm mt-3" style={{ color: brandColor }}>
            Concluir treino
          </button>
        )}
      </div>

      <div className="rounded-2xl p-4 flex gap-3 border" style={{ background: colors.soft, borderColor: colors.border }}>
        <div className="p-2 rounded-lg flex-shrink-0 h-fit" style={{ background: colors.highlight }}>
          <Award size={16} style={{ color: brandColor }} />
        </div>
        <div>
          <p className="text-ink font-bold text-sm">Progressão sugerida</p>
          <p className="text-xs text-stone mt-0.5 leading-relaxed">
            Sua adesão está em {student.adherence}%. Continue assim para receber aumento de carga na próxima fase.
          </p>
        </div>
      </div>
    </div>
  );
}