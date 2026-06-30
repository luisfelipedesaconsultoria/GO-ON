import React, { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { submitWorkoutFeedback } from "../../lib/db";
import { Trophy, Star, Sparkles } from "lucide-react";

export default function AlunoWorkoutFeedback() {
  const { student, brandColor, colors } = useOutletContext();
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
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: colors.highlight }}>
          <Trophy size={28} style={{ color: brandColor }} />
        </div>
        <p className="text-ink font-black text-xl">Treino concluído!</p>
        <p className="text-sm text-stone">Bom trabalho hoje</p>
      </div>

      <p className="text-xs font-bold uppercase tracking-wide text-stone mb-2.5">Como você avalia o treino de hoje?</p>
      <div className="flex justify-center gap-2 mb-6">
        {[1, 2, 3, 4, 5].map((s) => (
          <button key={s} onClick={() => setRating(s)}>
            <Star size={28} fill={s <= rating ? brandColor : "none"} style={{ color: s <= rating ? brandColor : "#D5D5CE" }} />
          </button>
        ))}
      </div>

      <p className="text-xs font-bold uppercase tracking-wide text-stone mb-2.5">Nível de energia</p>
      <div className="flex items-center gap-3 mb-6">
        <span className="text-[11px] text-stone">Esgotado</span>
        <div className="flex-1 flex gap-1.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <button key={s} onClick={() => setEnergy(s)} className="flex-1 h-2.5 rounded-full" style={{ background: s <= energy ? brandColor : "#E5E5E0" }} />
          ))}
        </div>
        <span className="text-[11px] text-stone">Cheio de pique</span>
      </div>

      <p className="text-xs font-bold uppercase tracking-wide text-stone mb-2.5">Sentiu alguma dor ou desconforto?</p>
      <div className="flex gap-2 mb-6">
        <button onClick={() => setPain(false)} className="flex-1 rounded-xl py-3 text-sm font-bold border" style={{ background: !pain ? colors.highlight : colors.soft, color: !pain ? brandColor : "#0D0F0E", borderColor: !pain ? brandColor : "transparent" }}>
          Não
        </button>
        <button onClick={() => setPain(true)} className="flex-1 rounded-xl py-3 text-sm font-bold border" style={{ background: pain ? "#FFE9E2" : colors.soft, color: pain ? "#FF6B4A" : "#0D0F0E", borderColor: pain ? "#FF6B4A" : "transparent" }}>
          Sim, relatar
        </button>
      </div>

      <div className="rounded-xl p-3.5 mb-6 flex gap-2.5" style={{ background: colors.highlight }}>
        <Sparkles size={14} style={{ color: brandColor }} className="flex-shrink-0 mt-0.5" />
        <p className="text-xs text-stone leading-relaxed">
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