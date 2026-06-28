import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { getAssignedWorkout, updateExerciseSet, completeExercise, submitVideoForReview } from "../../lib/db";
import {
  ChevronLeft, Play, MinusCircle, PlusCircle, CheckCircle2, Video,
  ThumbsUp, ThumbsDown, Meh, AlertCircle, Sparkles
} from "lucide-react";

const feedbackOptions = [
  { id: "easy", label: "Fácil", icon: ThumbsUp },
  { id: "ok", label: "Na medida", icon: Meh },
  { id: "hard", label: "Difícil", icon: ThumbsDown },
  { id: "pain", label: "Doeu algo", icon: AlertCircle },
];

export default function AlunoExerciseDetail() {
  const { exerciseId } = useParams();
  const { student, brandColor } = useOutletContext();
  const navigate = useNavigate();

  const workout = getAssignedWorkout(student.id);
  const exercise = workout?.todayWorkout.exercises.find((e) => e.id === exerciseId);

  const [sets, setSets] = useState(exercise?.sets || []);
  const [feedback, setFeedback] = useState(null);
  const [recorded, setRecorded] = useState(false);

  if (!exercise) return <div className="px-5 pt-10 text-white">Exercício não encontrado.</div>;

  const updateSet = (i, field, delta) => {
    const newSets = sets.map((s, idx) => (idx === i ? { ...s, [field]: Math.max(0, s[field] + delta) } : s));
    setSets(newSets);
    updateExerciseSet(student.id, exerciseId, i, newSets[i]);
  };

  const setRir = (i, value) => {
    const newSets = sets.map((s, idx) => (idx === i ? { ...s, rir: value } : s));
    setSets(newSets);
    updateExerciseSet(student.id, exerciseId, i, { rir: value });
  };

  const handleRecord = () => {
    setRecorded(true);
    submitVideoForReview(student.id, exercise.name);
  };

  const handleComplete = () => {
    completeExercise(student.id, exerciseId);
    navigate("/aluno");
  };

  return (
    <div className="px-5 pt-4">
      <button onClick={() => navigate("/aluno")} className="text-xs text-white/50 mb-4 flex items-center gap-1">
        <ChevronLeft size={14} /> Voltar ao treino
      </button>

      <div className="rounded-2xl mb-4 overflow-hidden bg-charcoal">
        <div className="aspect-video flex items-center justify-center relative" style={{ background: "#151715" }}>
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "rgba(200,245,98,0.9)" }}>
            <Play size={18} fill="#0D0F0E" className="text-ink" />
          </div>
        </div>
        <div className="p-3.5">
          <p className="text-white font-black text-base mb-1.5">{exercise.name}</p>
          <p className="text-xs text-white/60 leading-relaxed">{exercise.explanation}</p>
        </div>
      </div>

      <p className="text-xs font-bold uppercase tracking-wide text-white/45 mb-2.5">
        {sets.length}x{sets[0]?.reps} · sugestão {sets[0]?.load}kg
      </p>
      <div className="space-y-2 mb-4">
        {sets.map((s, i) => (
          <div key={i} className="rounded-xl p-3" style={{ background: s.done ? "rgba(200,245,98,0.1)" : "rgba(255,255,255,0.06)" }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white/50">Série {i + 1}</span>
              {s.done && <CheckCircle2 size={15} className="text-lime" />}
            </div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex-1 flex items-center justify-between rounded-lg px-2.5 py-1.5" style={{ background: "rgba(255,255,255,0.08)" }}>
                <button onClick={() => updateSet(i, "load", -2.5)}><MinusCircle size={15} className="text-white/40" /></button>
                <span className="text-sm font-mono font-bold text-white">{s.load}kg</span>
                <button onClick={() => updateSet(i, "load", 2.5)}><PlusCircle size={15} className="text-lime" /></button>
              </div>
              <div className="flex-1 flex items-center justify-between rounded-lg px-2.5 py-1.5" style={{ background: "rgba(255,255,255,0.08)" }}>
                <button onClick={() => updateSet(i, "reps", -1)}><MinusCircle size={15} className="text-white/40" /></button>
                <span className="text-sm font-mono font-bold text-white">{s.reps} reps</span>
                <button onClick={() => updateSet(i, "reps", 1)}><PlusCircle size={15} className="text-lime" /></button>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-white/40 mr-1">RIR</span>
              {[0, 1, 2, 3, 4].map((r) => (
                <button
                  key={r}
                  onClick={() => setRir(i, r)}
                  className="w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center"
                  style={{ background: s.rir === r ? "#C8F562" : "rgba(255,255,255,0.08)", color: s.rir === r ? "#0D0F0E" : "rgba(255,255,255,0.5)" }}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleRecord}
        className="w-full rounded-xl p-3.5 mb-4 flex items-center gap-3 border-2"
        style={{ borderColor: recorded ? "#C8F562" : "rgba(255,255,255,0.15)", background: recorded ? "rgba(200,245,98,0.1)" : "transparent" }}
      >
        <Video size={18} className={recorded ? "text-lime" : "text-white/50"} />
        <div className="text-left flex-1">
          <p className="text-sm font-bold text-white">{recorded ? "Vídeo gravado" : "Gravar minha execução"}</p>
          <p className="text-[11px] text-white/45">{recorded ? "Enviado para análise do seu personal" : "Opcional · para receber análise de técnica"}</p>
        </div>
        {recorded && <CheckCircle2 size={16} className="text-lime" />}
      </button>

      <p className="text-xs font-bold uppercase tracking-wide text-white/45 mb-2.5">Como foi esse exercício?</p>
      <div className="flex gap-2 mb-5">
        {feedbackOptions.map((f) => (
          <button
            key={f.id}
            onClick={() => setFeedback(f.id)}
            className="flex-1 rounded-xl py-2.5 flex flex-col items-center gap-1"
            style={{ background: feedback === f.id ? (f.id === "pain" ? "rgba(255,107,74,0.2)" : "rgba(200,245,98,0.15)") : "rgba(255,255,255,0.06)" }}
          >
            <f.icon size={15} style={{ color: feedback === f.id ? (f.id === "pain" ? "#FF6B4A" : "#C8F562") : "rgba(255,255,255,0.4)" }} />
            <span className="text-[10px] font-bold" style={{ color: feedback === f.id ? "white" : "rgba(255,255,255,0.45)" }}>{f.label}</span>
          </button>
        ))}
      </div>

      <button onClick={handleComplete} className="w-full rounded-xl py-3.5 font-bold text-sm text-white" style={{ background: brandColor }}>
        Concluir exercício
      </button>
    </div>
  );
}
