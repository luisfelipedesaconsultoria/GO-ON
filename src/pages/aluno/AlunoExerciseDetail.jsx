import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { getAssignedWorkout, updateExerciseSet, completeExercise, submitVideoForReview } from "../../lib/db";
import { Spinner } from "../../components/ui";
import {
  ChevronLeft, Play, MinusCircle, PlusCircle, CheckCircle2, Video,
  ThumbsUp, ThumbsDown, Meh, AlertCircle
} from "lucide-react";

const feedbackOptions = [
  { id: "easy", label: "Fácil", icon: ThumbsUp },
  { id: "ok", label: "Na medida", icon: Meh },
  { id: "hard", label: "Difícil", icon: ThumbsDown },
  { id: "pain", label: "Doeu algo", icon: AlertCircle },
];

export default function AlunoExerciseDetail() {
  const { exerciseId } = useParams();
  const { student, brandColor, colors } = useOutletContext();
  const navigate = useNavigate();

  const workout = getAssignedWorkout(student.id);
  const exercise = workout?.todayWorkout.exercises.find((e) => e.id === exerciseId);

  const [sets, setSets] = useState(exercise?.sets || []);
  const [feedback, setFeedback] = useState(null);
  const [recording, setRecording] = useState(false);
  const [recorded, setRecorded] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [justDoneIdx, setJustDoneIdx] = useState(null);

  if (!exercise) return <div className="px-5 pt-10 text-ink">Exercício não encontrado.</div>;

  const updateSet = (i, field, delta) => {
    const newSets = sets.map((s, idx) => (idx === i ? { ...s, [field]: Math.max(0, s[field] + delta) } : s));
    setSets(newSets);
    updateExerciseSet(student.id, exerciseId, i, newSets[i]);
  };

  const setRir = (i, value) => {
    const newSets = sets.map((s, idx) => (idx === i ? { ...s, rir: value } : s));
    setSets(newSets);
    updateExerciseSet(student.id, exerciseId, i, { rir: value });
    if (value === 0 || value === 1) {
      setJustDoneIdx(i);
      setTimeout(() => setJustDoneIdx(null), 350);
    }
  };

  const handleRecord = () => {
    setRecording(true);
    setTimeout(() => {
      setRecording(false);
      setRecorded(true);
      submitVideoForReview(student.id, exercise.name);
    }, 700);
  };

  const handleComplete = () => {
    setCompleting(true);
    setTimeout(() => {
      completeExercise(student.id, exerciseId);
      navigate("/aluno");
    }, 500);
  };

  return (
    <div className="px-5 pt-4 page-enter">
      <button onClick={() => navigate("/aluno")} className="text-xs text-stone mb-4 flex items-center gap-1">
        <ChevronLeft size={14} /> Voltar ao treino
      </button>

      <div className="rounded-2xl mb-4 overflow-hidden border" style={{ background: colors.soft, borderColor: colors.border }}>
        <div className="aspect-video flex items-center justify-center relative bg-charcoal">
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: brandColor }}>
            <Play size={18} fill="white" className="text-white" />
          </div>
        </div>
        <div className="p-3.5">
          <p className="text-ink font-black text-base mb-1.5">{exercise.name}</p>
          <p className="text-xs text-stone leading-relaxed">{exercise.explanation}</p>
        </div>
      </div>

      <p className="text-xs font-bold uppercase tracking-wide text-stone mb-2.5">
        {sets.length}x{sets[0]?.reps} · sugestão {sets[0]?.load}kg
      </p>
      <div className="space-y-2 mb-4">
        {sets.map((s, i) => (
          <div key={i} className="rounded-xl p-3 border transition-colors duration-300" style={{ background: s.done ? colors.highlight : colors.soft, borderColor: colors.border }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-stone">Série {i + 1}</span>
              {s.done && <CheckCircle2 size={15} style={{ color: brandColor }} className={justDoneIdx === i ? "check-pop" : ""} />}
            </div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex-1 flex items-center justify-between rounded-lg px-2.5 py-1.5 bg-white border" style={{ borderColor: colors.border }}>
                <button onClick={() => updateSet(i, "load", -2.5)} className="active:scale-90 transition-transform"><MinusCircle size={15} className="text-stone" /></button>
                <span className="text-sm font-mono font-bold text-ink">{s.load}kg</span>
                <button onClick={() => updateSet(i, "load", 2.5)} className="active:scale-90 transition-transform"><PlusCircle size={15} style={{ color: brandColor }} /></button>
              </div>
              <div className="flex-1 flex items-center justify-between rounded-lg px-2.5 py-1.5 bg-white border" style={{ borderColor: colors.border }}>
                <button onClick={() => updateSet(i, "reps", -1)} className="active:scale-90 transition-transform"><MinusCircle size={15} className="text-stone" /></button>
                <span className="text-sm font-mono font-bold text-ink">{s.reps} reps</span>
                <button onClick={() => updateSet(i, "reps", 1)} className="active:scale-90 transition-transform"><PlusCircle size={15} style={{ color: brandColor }} /></button>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-stone mr-1">RIR</span>
              {[0, 1, 2, 3, 4].map((r) => (
                <button
                  key={r}
                  onClick={() => setRir(i, r)}
                  className="w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center transition-all active:scale-90"
                  style={{ background: s.rir === r ? brandColor : "white", color: s.rir === r ? "white" : "#6B716C", border: s.rir === r ? "none" : `1px solid ${colors.border}` }}
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
        disabled={recording || recorded}
        className="w-full rounded-xl p-3.5 mb-4 flex items-center gap-3 border-2 transition-colors"
        style={{ borderColor: recorded ? brandColor : colors.border, background: recorded ? colors.highlight : "white" }}
      >
        {recording ? (
          <Spinner size={18} color={brandColor} />
        ) : (
          <Video size={18} style={{ color: recorded ? brandColor : "#6B716C" }} />
        )}
        <div className="text-left flex-1">
          <p className="text-sm font-bold text-ink">
            {recording ? "Gravando..." : recorded ? "Vídeo gravado" : "Gravar minha execução"}
          </p>
          <p className="text-[11px] text-stone">{recorded ? "Enviado para análise do seu personal" : "Opcional · para receber análise de técnica"}</p>
        </div>
        {recorded && <CheckCircle2 size={16} style={{ color: brandColor }} className="check-pop" />}
      </button>

      <p className="text-xs font-bold uppercase tracking-wide text-stone mb-2.5">Como foi esse exercício?</p>
      <div className="flex gap-2 mb-5">
        {feedbackOptions.map((f) => (
          <button
            key={f.id}
            onClick={() => setFeedback(f.id)}
            className="flex-1 rounded-xl py-2.5 flex flex-col items-center gap-1 border transition-all active:scale-95"
            style={{
              background: feedback === f.id ? (f.id === "pain" ? "#FFE9E2" : colors.highlight) : colors.soft,
              borderColor: feedback === f.id ? (f.id === "pain" ? "#FF6B4A" : brandColor) : colors.border,
            }}
          >
            <f.icon size={15} style={{ color: feedback === f.id ? (f.id === "pain" ? "#FF6B4A" : brandColor) : "#6B716C" }} />
            <span className="text-[10px] font-bold" style={{ color: feedback === f.id ? "#0D0F0E" : "#6B716C" }}>{f.label}</span>
          </button>
        ))}
      </div>

      <button
        onClick={handleComplete}
        disabled={completing}
        className="w-full rounded-xl py-3.5 font-bold text-sm text-white flex items-center justify-center gap-2 transition-opacity"
        style={{ background: brandColor, opacity: completing ? 0.75 : 1 }}
      >
        {completing && <Spinner size={16} color="white" />}
        {completing ? "Salvando..." : "Concluir exercício"}
      </button>
    </div>
  );
}