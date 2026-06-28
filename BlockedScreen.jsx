import React from "react";
import { Lock, Flame, TrendingUp, ArrowRight } from "lucide-react";

export default function BlockedScreen({ student, brandColor }) {
  return (
    <div className="px-5 pt-4">
      <div className="rounded-3xl p-6 text-center" style={{ background: "rgba(255,255,255,0.06)" }}>
        <div className="w-14 h-14 rounded-full bg-coral/20 flex items-center justify-center mx-auto mb-4">
          <Lock size={24} className="text-coral" />
        </div>
        <p className="text-white font-black text-lg mb-1">Seu acesso a novos treinos está pausado</p>
        <p className="text-sm text-white/55 mb-5">
          Sua assinatura está pendente. Seu histórico continua disponível abaixo.
        </p>

        <div className="rounded-2xl p-4 mb-5" style={{ background: "rgba(200,245,98,0.12)" }}>
          <div className="flex items-center gap-2 justify-center mb-1">
            <Flame size={16} className="text-lime" />
            <p className="text-white font-bold text-sm">Sua sequência de {student.currentStreak} dias está esperando por você</p>
          </div>
          <p className="text-xs text-white/55">Não deixe esse progresso parar agora</p>
        </div>

        <button className="w-full rounded-xl py-3.5 font-bold text-sm text-white flex items-center justify-center gap-2" style={{ background: brandColor }}>
          Renovar agora <ArrowRight size={15} />
        </button>
      </div>

      <p className="text-xs font-bold uppercase tracking-wide text-white/40 mt-6 mb-3">Seu progresso até aqui</p>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.06)" }}>
          <TrendingUp size={14} className="text-lime mb-1.5" />
          <p className="text-white font-black text-xl">{student.adherence}%</p>
          <p className="text-[11px] text-white/45">adesão histórica</p>
        </div>
        <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.06)" }}>
          <Flame size={14} className="text-lime mb-1.5" />
          <p className="text-white font-black text-xl">{student.currentStreak}</p>
          <p className="text-[11px] text-white/45">dias de sequência</p>
        </div>
      </div>
    </div>
  );
}
