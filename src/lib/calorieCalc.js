// ============================================================
// CÁLCULO DE CALORIAS E ZONAS DE FREQUÊNCIA CARDÍACA
// Fórmula de Keytel et al. (2005) — padrão usado por relógios e
// monitores esportivos para estimar gasto calórico a partir do BPM
// quando o dispositivo não informa energia gasta diretamente.
// ============================================================

export function estimateMaxHR(age) {
  // Fórmula de Tanaka (mais precisa que a clássica 220-idade)
  return Math.round(208 - 0.7 * (age || 30));
}

export const HR_ZONES = [
  { zone: 1, label: "Z1 · Recuperação", min: 0, max: 60, color: "#8A8F8B" },
  { zone: 2, label: "Z2 · Leve", min: 60, max: 70, color: "#4A9B6E" },
  { zone: 3, label: "Z3 · Moderada", min: 70, max: 80, color: "#E8A23D" },
  { zone: 4, label: "Z4 · Intensa", min: 80, max: 90, color: "#FF9A4A" },
  { zone: 5, label: "Z5 · Máxima", min: 90, max: 1000, color: "#FF6B4A" },
];

export function getHRZone(bpm, maxHR) {
  const pct = (bpm / (maxHR || 190)) * 100;
  return HR_ZONES.find((z) => pct >= z.min && pct < z.max) || HR_ZONES[HR_ZONES.length - 1];
}

// kcal/min instantâneo a partir do BPM atual (usado quando o dispositivo
// não envia o campo "Energy Expended" do GATT Heart Rate Measurement)
export function caloriesPerMinute({ bpm, weightKg, age, gender }) {
  const w = weightKg || 70;
  const a = age || 30;
  const kcalPerMin =
    gender === "female"
      ? (-20.4022 + 0.4472 * bpm - 0.1263 * w + 0.074 * a) / 4.184
      : (-55.0969 + 0.6309 * bpm + 0.1988 * w + 0.2017 * a) / 4.184;
  return Math.max(0, kcalPerMin);
}

export function kJtoKcal(kj) {
  return kj * 0.239006;
}
