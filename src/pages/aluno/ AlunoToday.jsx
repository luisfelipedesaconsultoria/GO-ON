import React from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { getAssignedWorkout } from "../../lib/db";
import { ProgressRing } from "../../components/ui";
import { CheckCircle2, Play, Circle, Award } from "lucide-react";
import BlockedScreen from "./BlockedScreen";

export default function AlunoToday() {
  const { student, isBlocked, brandColor } = useOutletContext();
  const navigate = useNavigate();

  if (isBlocked) return <BlockedScreen student={student} brandColor={brandColor} />;

  const workout = getAssignedWorkout(student.id);
  if (!workout) {
    return (
      <div className="px-5 pt-10 text-center">
        <p className="text-white/60 text-sm">Nenhum treino atribuído ainda. Fale com seu personal!</p>
      </div>
    );
  }

  const exercises = workout.todayWorkout.exercises;
  const doneCount = exercises.filter((e) => e.done).length;
  const pct = Math.round((doneCount / exercises.length) * 100);

  return (
    <div className="px-5 pt-4">
      <p className="text-white/50 text-sm">Olá, {student.name.split(" ")[0]} 👋</p>
      <p className="text-white font-black text-2xl leading-tight mb-5">{workout.blockName} · Semana {workout.weekNumber}/{workout.totalWeeks}</p>

      <div className="flex justify-between rounded-2xl p-3.5 mb-5" style={{ background: "rgba(255,255,255,0.06)" }}>
        {workout.weekPlan.map((d, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5">
            <span className="text-[10px] font-bold text-white/40">{d.day}</span>
            {d.done && <CheckCircle2 size={16} className="text-lime" />}
            {d.today && <div className="w-4 h-4 rounded-full bg-lime" />}
            {!d.done && !d.today && <Circle size={16} className="text-white/15" />}
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
            <ProgressRing pct={pct} size={56} stroke={6} />
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
              style={{ background: ex.current ? "white" : "rgba(255,255,255,0.12)" }}
            >
              {ex.done ? (
                <CheckCircle2 size={18} className="text-white flex-shrink-0" />
              ) : ex.current ? (
                <Play size={18} style={{ color: brandColor }} fill={brandColor} className="flex-shrink-0" />
              ) : (
                <Circle size={18} className="text-white/30 flex-shrink-0" />
              )}
              <div className="flex-1">
                <p className="text-sm font-bold" style={{ color: ex.current ? "#0D0F0E" : "white" }}>{ex.name}</p>
                <p className="text-xs font-mono" style={{ color: ex.current ? "#8A8F8B" : "rgba(255,255,255,0.55)" }}>
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

      <div className="rounded-2xl p-4 flex gap-3" style={{ background: "rgba(255,255,255,0.06)" }}>
        <div className="p-2 rounded-lg flex-shrink-0 h-fit" style={{ background: "rgba(200,245,98,0.18)" }}>
          <Award size={16} className="text-lime" />
        </div>
        <div>
          <p className="text-white font-bold text-sm">Progressão sugerida</p>
          <p className="text-xs text-white/55 mt-0.5 leading-relaxed">
            Sua adesão está em {student.adherence}%. Continue assim para receber aumento de carga na próxima fase.
          </p>
        </div>
      </div>
    </div>
  );
}
