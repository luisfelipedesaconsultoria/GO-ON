import React, { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { submitWorkoutFeedback } from "../../lib/db";
import { Trophy, Star, Sparkles } from "lucide-react";

export default function AlunoWorkoutFeedback() {
  const { student, brandColor } = useOutletContext();
  const navigate = useNavigate();
  const [rating, setRating] = useState(4);
  const [energy, setEnergy] = useState(4);
  const [pain, setPain] = useState(false);

  const handleSubmit = () => {
    submitWorkoutFeedback(student.id, { rating, energy, pain });
    navigate("/aluno");
  };

  return (
    <div className="px-5 pt-6 flex flex-col" style={{ minHeight: "calc(100vh - 160px)" }}>
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: "rgba(200,245,98,0.15)" }}>
          <Trophy size={28} className="text-lime" />
        </div>
        <p className="text-white font-black text-xl">Treino concluído!</p>
        <p className="text-sm text-white/50">Bom trabalho hoje</p>
      </div>

      <p className="text-xs font-bold uppercase tracking-wide text-white/45 mb-2.5">Como você avalia o treino de hoje?</p>
      <div className="flex justify-center gap-2 mb-6">
        {[1, 2, 3, 4, 5].map((s) => (
          <button key={s} onClick={() => setRating(s)}>
            <Star size={28} fill={s <= rating ? "#C8F562" : "none"} className={s <= rating ? "text-lime" : "text-white/20"} />
          </button>
        ))}
      </div>

      <p className="text-xs font-bold uppercase tracking-wide text-white/45 mb-2.5">Nível de energia</p>
      <div className="flex items-center gap-3 mb-6">
        <span className="text-[11px] text-white/40">Esgotado</span>
        <div className="flex-1 flex gap-1.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <button key={s} onClick={() => setEnergy(s)} className="flex-1 h-2.5 rounded-full" style={{ background: s <= energy ? "#C8F562" : "rgba(255,255,255,0.1)" }} />
          ))}
        </div>
        <span className="text-[11px] text-white/40">Cheio de pique</span>
      </div>

      <p className="text-xs font-bold uppercase tracking-wide text-white/45 mb-2.5">Sentiu alguma dor ou desconforto?</p>
      <div className="flex gap-2 mb-6">
        <button onClick={() => setPain(false)} className="flex-1 rounded-xl py-3 text-sm font-bold" style={{ background: !pain ? "rgba(200,245,98,0.18)" : "rgba(255,255,255,0.06)", color: !pain ? "#C8F562" : "white" }}>
          Não
        </button>
        <button onClick={() => setPain(true)} className="flex-1 rounded-xl py-3 text-sm font-bold" style={{ background: pain ? "rgba(255,107,74,0.18)" : "rgba(255,255,255,0.06)", color: pain ? "#FF6B4A" : "white" }}>
          Sim, relatar
        </button>
      </div>

      <div className="rounded-xl p-3.5 mb-6 flex gap-2.5" style={{ background: "rgba(200,245,98,0.1)" }}>
        <Sparkles size={14} className="text-lime flex-shrink-0 mt-0.5" />
        <p className="text-xs text-white/70 leading-relaxed">
          Seu feedback ajuda a IA a calibrar a carga do seu próximo treino com mais precisão.
        </p>
      </div>

      <div className="flex-1" />
      <button onClick={handleSubmit} className="w-full rounded-xl py-3.5 font-bold text-sm text-white mb-4" style={{ background: brandColor }}>
        Enviar feedback
      </button>
    </div>
  );
}
