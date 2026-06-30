import React from "react";
import { useOutletContext } from "react-router-dom";
import { Footprints, Target, Heart, Play, Activity } from "lucide-react";
import BlockedScreen from "./BlockedScreen";

export default function AlunoRunning() {
  const { student, isBlocked, brandColor, colors } = useOutletContext();
  if (isBlocked) return <BlockedScreen student={student} brandColor={brandColor} colors={colors} />;

  const hasRunningPlan = Boolean(student.runningPhase);

  if (!hasRunningPlan) {
    return (
      <div className="px-5 pt-4 page-enter">
        <p className="text-ink font-black text-xl mb-5">Corrida</p>
        <div className="rounded-3xl p-8 text-center border" style={{ background: colors.soft, borderColor: colors.border }}>
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: colors.highlight }}>
            <Activity size={24} style={{ color: brandColor }} />
          </div>
          <p className="text-ink font-bold text-sm mb-1">Nenhum plano de corrida ainda</p>
          <p className="text-xs text-stone leading-relaxed">Fale com seu personal para incluir treinos de corrida no seu plano.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 pt-4 page-enter">
      <div className="flex items-center justify-between mb-5">
        <p className="text-ink font-black text-xl">Corrida</p>
        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background: colors.highlight, color: brandColor }}>
          {student.runningPhase}
        </span>
      </div>

      <div className="rounded-3xl p-5 mb-5 bg-charcoal">
        <p className="text-xs font-bold uppercase tracking-wide text-white/50 mb-1">Treino de hoje</p>
        <p className="text-white font-black text-xl mb-4">Intervalado · 6x800m</p>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="rounded-xl p-3 bg-white/[0.08]">
            <Footprints size={14} className="text-lime mb-1" />
            <p className="text-white font-black text-base">6.4km</p>
            <p className="text-[10px] text-white/45">distância</p>
          </div>
          <div className="rounded-xl p-3 bg-white/[0.08]">
            <Target size={14} className="text-lime mb-1" />
            <p className="text-white font-black text-base font-mono">4:15</p>
            <p className="text-[10px] text-white/45">pace alvo /km</p>
          </div>
          <div className="rounded-xl p-3 bg-white/[0.08]">
            <Heart size={14} className="text-coral mb-1" />
            <p className="text-white font-black text-base">Z4</p>
            <p className="text-[10px] text-white/45">zona</p>
          </div>
        </div>

        <div className="space-y-1.5 mb-4">
          {["10min aquecimento Z1-Z2", "6x800m @ 4:15/km · rec. 2min trote", "10min volta à calma"].map((s, i) => (
            <div key={i} className="flex items-center gap-2.5 text-xs text-white/70">
              <div className="w-1 h-1 rounded-full flex-shrink-0 bg-lime" /> {s}
            </div>
          ))}
        </div>

        <button className="w-full rounded-xl py-3.5 font-bold text-sm flex items-center justify-center gap-2" style={{ background: brandColor, color: "white" }}>
          <Play size={15} fill="white" /> Iniciar corrida
        </button>
      </div>

      <p className="text-xs font-bold uppercase tracking-wide text-stone mb-2.5">Últimas corridas</p>
      <div className="space-y-2">
        {[
          { d: "Segunda", t: "Rodagem leve", dist: "8.0km", pace: "5:40" },
          { d: "Sexta passada", t: "Longão", dist: "12.0km", pace: "5:25" },
        ].map((r, i) => (
          <div key={i} className="rounded-xl p-3.5 flex items-center justify-between border" style={{ background: colors.soft, borderColor: colors.border }}>
            <div>
              <p className="text-ink font-bold text-sm">{r.t}</p>
              <p className="text-[11px] text-stone">{r.d}</p>
            </div>
            <div className="text-right">
              <p className="text-ink font-mono text-sm">{r.dist}</p>
              <p className="text-[11px] font-mono text-stone">{r.pace}/km</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}