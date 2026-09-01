import { useCallback, useEffect, useRef, useState } from "react";
import { HeartRateMonitor, isBluetoothSupported } from "../lib/bluetoothHeartRate";
import { caloriesPerMinute, estimateMaxHR, getHRZone, kJtoKcal } from "../lib/calorieCalc";

// Gerencia a conexão com um único bracelete Bluetooth e deriva
// BPM, calorias e zona de treino em tempo real a partir dos eventos.
export function useHeartRateMonitor({ weightKg, age, gender } = {}) {
  const monitorRef = useRef(null);
  const startTimeRef = useRef(null);
  const lastSampleAtRef = useRef(null);
  const caloriesRef = useRef(0);
  const baseEnergyRef = useRef(null);
  const samplesRef = useRef([]);
  const tickRef = useRef(null);

  const [status, setStatus] = useState("idle"); // idle | connecting | connected | error
  const [deviceName, setDeviceName] = useState(null);
  const [bpm, setBpm] = useState(null);
  const [battery, setBattery] = useState(null);
  const [calories, setCalories] = useState(0);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ avg: null, max: null, min: null });

  const supported = isBluetoothSupported();
  const maxHR = estimateMaxHR(age);
  const zone = bpm ? getHRZone(bpm, maxHR) : null;

  useEffect(
    () => () => {
      monitorRef.current?.disconnect();
      clearInterval(tickRef.current);
    },
    []
  );

  const connect = useCallback(async () => {
    setStatus("connecting");
    setError(null);
    try {
      const monitor = new HeartRateMonitor();
      monitorRef.current = monitor;
      startTimeRef.current = Date.now();
      lastSampleAtRef.current = null;
      caloriesRef.current = 0;
      baseEnergyRef.current = null;
      samplesRef.current = [];

      monitor.addEventListener("heartrate", (e) => {
        const { heartRate, energyExpended } = e.detail;
        const now = Date.now();
        samplesRef.current.push(heartRate);
        setBpm(heartRate);

        if (energyExpended != null) {
          if (baseEnergyRef.current == null) baseEnergyRef.current = energyExpended;
          caloriesRef.current = kJtoKcal(Math.max(0, energyExpended - baseEnergyRef.current));
        } else if (lastSampleAtRef.current != null) {
          const deltaMin = (now - lastSampleAtRef.current) / 60000;
          caloriesRef.current += caloriesPerMinute({ bpm: heartRate, weightKg, age, gender }) * deltaMin;
        }
        lastSampleAtRef.current = now;
        setCalories(caloriesRef.current);

        const arr = samplesRef.current;
        setStats({
          avg: Math.round(arr.reduce((a, b) => a + b, 0) / arr.length),
          max: Math.max(...arr),
          min: Math.min(...arr),
        });
      });

      monitor.addEventListener("battery", (e) => setBattery(e.detail.level));
      monitor.addEventListener("disconnected", () => {
        setStatus("idle");
        setBpm(null);
        clearInterval(tickRef.current);
      });

      const info = await monitor.connect();
      setDeviceName(info.name);
      setStatus("connected");

      clearInterval(tickRef.current);
      tickRef.current = setInterval(() => {
        setElapsedSec(Math.round((Date.now() - startTimeRef.current) / 1000));
      }, 1000);
    } catch (e) {
      if (e.name === "NotFoundError") {
        // usuário cancelou o seletor de dispositivo do navegador
        setStatus("idle");
        return;
      }
      console.error(e);
      setError(e.message || "Não foi possível conectar ao dispositivo.");
      setStatus("error");
    }
  }, [weightKg, age, gender]);

  const disconnect = useCallback(() => {
    monitorRef.current?.disconnect();
    monitorRef.current = null;
    clearInterval(tickRef.current);
    setStatus("idle");
    setBpm(null);
  }, []);

  const getSummary = useCallback(
    () => ({
      deviceName,
      avgBpm: stats.avg,
      maxBpm: stats.max,
      minBpm: stats.min,
      calories: Math.round(calories),
      durationSec: elapsedSec,
    }),
    [deviceName, stats, calories, elapsedSec]
  );

  return {
    supported,
    status,
    deviceName,
    bpm,
    battery,
    calories: Math.round(calories),
    elapsedSec,
    error,
    zone,
    maxHR,
    stats,
    connect,
    disconnect,
    getSummary,
  };
}
