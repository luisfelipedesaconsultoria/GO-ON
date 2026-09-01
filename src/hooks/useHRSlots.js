import { useCallback, useEffect, useRef, useState } from "react";
import { HeartRateMonitor, isBluetoothSupported } from "../lib/bluetoothHeartRate";
import { caloriesPerMinute, estimateMaxHR, getHRZone, kJtoKcal } from "../lib/calorieCalc";

// Gerencia várias conexões Bluetooth simultâneas a partir de uma única tela —
// cada "slot" é um perfil (um aluno cadastrado ou um perfil avulso, só daquela
// sessão) com seu próprio bracelete conectado diretamente neste aparelho.
// Pensado para o personal ativar vários braceletes numa aula presencial,
// como o app da Polar faz.
export function useHRSlots() {
  const [slots, setSlots] = useState([]);
  const slotsRef = useRef([]);
  const monitorsRef = useRef({}); // slotId -> { monitor, startedAt, lastSampleAt, caloriesAcc, baseEnergy, samples, tick }

  useEffect(() => {
    slotsRef.current = slots;
  }, [slots]);

  useEffect(
    () => () => {
      Object.values(monitorsRef.current).forEach((s) => {
        s.monitor.disconnect();
        clearInterval(s.tick);
      });
    },
    []
  );

  const supported = isBluetoothSupported();

  const updateSlot = useCallback((id, patch) => {
    setSlots((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }, []);

  const addSlot = useCallback((slotData) => {
    const id = `slot_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    setSlots((prev) => [
      ...prev,
      {
        id,
        label: slotData.label,
        initials: slotData.initials,
        studentId: slotData.studentId || null,
        profile: slotData.profile || {},
        status: "idle",
        bpm: null,
        calories: 0,
        elapsedSec: 0,
        battery: null,
        deviceName: null,
        zone: null,
        avg: null,
        max: null,
        min: null,
        error: null,
      },
    ]);
    return id;
  }, []);

  const removeSlot = useCallback((id) => {
    const state = monitorsRef.current[id];
    if (state) {
      state.monitor.disconnect();
      clearInterval(state.tick);
      delete monitorsRef.current[id];
    }
    setSlots((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const connectSlot = useCallback(
    async (id) => {
      const slot = slotsRef.current.find((s) => s.id === id);
      updateSlot(id, { status: "connecting", error: null });
      try {
        const monitor = new HeartRateMonitor();
        const state = { monitor, startedAt: Date.now(), lastSampleAt: null, caloriesAcc: 0, baseEnergy: null, samples: [] };
        monitorsRef.current[id] = state;

        monitor.addEventListener("heartrate", (e) => {
          const { heartRate, energyExpended } = e.detail;
          const now = Date.now();
          state.samples.push(heartRate);

          if (energyExpended != null) {
            if (state.baseEnergy == null) state.baseEnergy = energyExpended;
            state.caloriesAcc = kJtoKcal(Math.max(0, energyExpended - state.baseEnergy));
          } else if (state.lastSampleAt != null) {
            const deltaMin = (now - state.lastSampleAt) / 60000;
            state.caloriesAcc += caloriesPerMinute({ bpm: heartRate, ...slot?.profile }) * deltaMin;
          }
          state.lastSampleAt = now;

          const arr = state.samples;
          updateSlot(id, {
            bpm: heartRate,
            calories: Math.round(state.caloriesAcc),
            zone: getHRZone(heartRate, estimateMaxHR(slot?.profile?.age)),
            avg: Math.round(arr.reduce((a, b) => a + b, 0) / arr.length),
            max: Math.max(...arr),
            min: Math.min(...arr),
          });
        });

        monitor.addEventListener("battery", (e) => updateSlot(id, { battery: e.detail.level }));
        monitor.addEventListener("disconnected", () => {
          clearInterval(state.tick);
          updateSlot(id, { status: "idle" });
        });

        const info = await monitor.connect();
        updateSlot(id, { status: "connected", deviceName: info.name });

        state.tick = setInterval(() => {
          updateSlot(id, { elapsedSec: Math.round((Date.now() - state.startedAt) / 1000) });
        }, 1000);
      } catch (e) {
        if (e.name === "NotFoundError") {
          updateSlot(id, { status: "idle" });
          return;
        }
        updateSlot(id, { status: "error", error: e.message || "Não foi possível conectar ao dispositivo." });
      }
    },
    [updateSlot]
  );

  const disconnectSlot = useCallback(
    (id) => {
      const state = monitorsRef.current[id];
      if (!state) return null;
      const summary = {
        durationSec: Math.round((Date.now() - state.startedAt) / 1000),
        calories: Math.round(state.caloriesAcc),
        avgBpm: state.samples.length ? Math.round(state.samples.reduce((a, b) => a + b, 0) / state.samples.length) : null,
        maxBpm: state.samples.length ? Math.max(...state.samples) : null,
        minBpm: state.samples.length ? Math.min(...state.samples) : null,
      };
      state.monitor.disconnect();
      clearInterval(state.tick);
      updateSlot(id, { status: "idle" });
      return summary;
    },
    [updateSlot]
  );

  return { supported, slots, addSlot, removeSlot, connectSlot, disconnectSlot };
}
