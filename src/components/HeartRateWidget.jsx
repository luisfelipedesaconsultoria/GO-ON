import React, { useEffect, useRef } from "react";
import { Bluetooth, BluetoothConnected, Flame, Timer, BatteryMedium, WifiOff } from "lucide-react";
import { useHeartRateMonitor } from "../hooks/useHeartRateMonitor";
import { formatDuration } from "../lib/format";

// Widget de conexão + leitura ao vivo de um bracelete Bluetooth.
// onTick(bpm, calories, zone, elapsedSec) dispara a cada nova leitura —
// use para retransmitir os dados numa sala de turma, por exemplo.
// onSessionEnd(summary) dispara quando o aluno desconecta, para salvar histórico.
export default function HeartRateWidget({ weightKg, age, gender, brandColor = "#0B5A28", onTick, onSessionEnd }) {
  const hr = useHeartRateMonitor({ weightKg, age, gender });
  const lastSentRef = useRef(0);

  useEffect(() => {
    if (hr.status !== "connected" || hr.bpm == null) return;
    const now = Date.now();
    if (now - lastSentRef.current < 900) return; // ~1x/seg, evita flood no canal
    lastSentRef.current = now;
    onTick?.({ bpm: hr.bpm, calories: hr.calories, zone: hr.zone, elapsedSec: hr.elapsedSec, battery: hr.battery });
  }, [hr.bpm, hr.status]);

  const handleDisconnect = () => {
    const summary = hr.getSummary();
    hr.disconnect();
    if (summary.durationSec > 0) onSessionEnd?.(summary);
  };

  if (!hr.supported) {
    return (
      <div className="rounded-2xl p-4 border border-black/8 bg-black/[0.02] flex gap-3">
        <WifiOff size={18} className="text-stone flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-ink">Bluetooth não disponível neste navegador</p>
          <p className="text-xs text-stone mt-0.5 leading-relaxed">
            Use Chrome ou Edge no computador ou Android. No iPhone, o Safari não suporta Web
            Bluetooth — use um app compatível (ex: Bluefy).
          </p>
        </div>
      </div>
    );
  }

  if (hr.status === "idle" || hr.status === "error") {
    return (
      <div className="rounded-2xl p-5 border border-black/8 text-center">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
          style={{ background: `${brandColor}1A` }}
        >
          <Bluetooth size={20} style={{ color: brandColor }} />
        </div>
        <p className="text-sm font-bold text-ink mb-1">Conectar bracelete de frequência cardíaca</p>
        <p className="text-xs text-stone mb-4">Compatível com COOSPO e qualquer monitor Bluetooth padrão.</p>
        {hr.error && <p className="text-xs text-coral font-bold mb-3">{hr.error}</p>}
        <button
          onClick={hr.connect}
          className="rounded-xl px-5 py-3 font-bold text-sm text-white inline-flex items-center gap-2"
          style={{ background: brandColor }}
        >
          <Bluetooth size={15} /> Conectar dispositivo
        </button>
      </div>
    );
  }

  if (hr.status === "connecting") {
    return (
      <div className="rounded-2xl p-5 border border-black/8 text-center">
        <p className="text-sm font-bold text-ink">Procurando dispositivos...</p>
        <p className="text-xs text-stone mt-1">Selecione seu bracelete na janela do navegador.</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl p-5 bg-charcoal">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1.5 text-white/60 text-[11px] font-bold">
          <BluetoothConnected size={13} className="text-lime" /> {hr.deviceName}
          {hr.battery != null && (
            <span className="flex items-center gap-0.5 ml-1">
              <BatteryMedium size={13} /> {hr.battery}%
            </span>
          )}
        </div>
        <button onClick={handleDisconnect} className="text-[11px] font-bold text-white/50 hover:text-white">
          Desconectar
        </button>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-white font-black text-5xl leading-none font-mono">{hr.bpm ?? "--"}</span>
          <span className="text-white/50 text-xs font-bold">bpm</span>
        </div>
        {hr.zone && (
          <span
            className="text-[10px] font-bold px-2.5 py-1 rounded-full ml-auto"
            style={{ background: `${hr.zone.color}30`, color: hr.zone.color }}
          >
            {hr.zone.label}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl p-3 bg-white/[0.08] flex items-center gap-2.5">
          <Flame size={16} className="text-coral flex-shrink-0" />
          <div>
            <p className="text-white font-black text-base leading-none">{hr.calories}</p>
            <p className="text-[10px] text-white/45 mt-0.5">kcal</p>
          </div>
        </div>
        <div className="rounded-xl p-3 bg-white/[0.08] flex items-center gap-2.5">
          <Timer size={16} className="text-lime flex-shrink-0" />
          <div>
            <p className="text-white font-black text-base leading-none font-mono">{formatDuration(hr.elapsedSec)}</p>
            <p className="text-[10px] text-white/45 mt-0.5">duração</p>
          </div>
        </div>
      </div>
    </div>
  );
}
