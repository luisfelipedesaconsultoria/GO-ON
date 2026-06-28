import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { createStudent } from "../../lib/db";
import { OutlineButton, ForestButton } from "../../components/ui";
import { ChevronLeft, Dumbbell, Activity, Zap, Sparkles, CheckCircle2, Info } from "lucide-react";

const steps = ["Dados básicos", "Objetivo", "Anamnese"];

export default function PersonalStudentNew() {
  const { tenant } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: "", age: "", email: "", phone: "",
    modality: "both", level: "intermediario", goal: "hipertrofia",
    raceDate: "",
    injuries: "", healthConditions: "", trainingHistory: "", surgeries: "",
    availability: "", intensityTolerance: "boa",
  });

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = () => {
    const initials = form.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() || "??";
    const student = createStudent(tenant.id, {
      name: form.name,
      initials,
      email: form.email,
      phone: form.phone,
      age: Number(form.age) || null,
      modality: form.modality,
      level: form.level,
      phase: "Adaptação · Semana 1",
      anamnesis: {
        injuries: form.injuries || "Nenhuma relatada",
        healthConditions: form.healthConditions || "Nenhuma",
        trainingHistory: form.trainingHistory || "Não informado",
        surgeries: form.surgeries || "Nenhuma",
        availability: form.availability || "Não informado",
        intensityTolerance: form.intensityTolerance,
      },
    });
    navigate(`/personal/alunos/${student.id}/gerar-plano`);
  };

  return (
    <div className="p-8 max-w-2xl">
      <button onClick={() => navigate("/personal/alunos")} className="flex items-center gap-1 text-sm text-stone mb-4">
        <ChevronLeft size={16} /> Voltar
      </button>

      <div className="flex gap-1.5 mb-5">
        {steps.map((_, i) => (
          <div key={i} className="flex-1 h-1.5 rounded-full" style={{ background: i <= step ? "#0B5A28" : "#E5E5E0" }} />
        ))}
      </div>

      <p className="text-xs font-bold uppercase tracking-wide text-forest mb-1">Novo aluno · Passo {step + 1}/3</p>
      <p className="font-display font-black text-2xl text-ink mb-6">{steps[step]}</p>

      {step === 0 && (
        <div className="space-y-4 mb-6">
          <Field label="Nome completo" value={form.name} onChange={(v) => update("name", v)} placeholder="Nome do aluno" />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Idade" value={form.age} onChange={(v) => update("age", v)} placeholder="29" />
            <SelectField label="Nível" value={form.level} onChange={(v) => update("level", v)} options={[
              { value: "iniciante", label: "Iniciante" },
              { value: "intermediario", label: "Intermediário" },
              { value: "avancado", label: "Avançado" },
            ]} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="E-mail" value={form.email} onChange={(v) => update("email", v)} placeholder="email@exemplo.com" />
            <Field label="Telefone" value={form.phone} onChange={(v) => update("phone", v)} placeholder="(85) 99999-9999" />
          </div>
          <div>
            <label className="text-xs font-bold text-stone block mb-1.5">Modalidade</label>
            <div className="grid grid-cols-3 gap-2">
              {[{ v: "musc", l: "Musculação", i: Dumbbell }, { v: "run", l: "Corrida", i: Activity }, { v: "both", l: "Ambos", i: Zap }].map((m) => (
                <button
                  key={m.v}
                  onClick={() => update("modality", m.v)}
                  className="rounded-xl border-2 p-3 text-center"
                  style={{ borderColor: form.modality === m.v ? "#0B5A28" : "#E5E5E0", background: form.modality === m.v ? "#E3F0E6" : "white" }}
                >
                  <m.i size={16} className="mx-auto mb-1" style={{ color: form.modality === m.v ? "#0B5A28" : "#8A8F8B" }} />
                  <p className="text-[11px] font-bold" style={{ color: form.modality === m.v ? "#0B5A28" : "#0D0F0E" }}>{m.l}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-3 mb-6">
          {[
            { v: "hipertrofia", l: "Hipertrofia / ganho de massa", sub: "Musculação · foco em volume" },
            { v: "perda_peso", l: "Perda de peso", sub: "Misto · déficit + cardio" },
            { v: "primeira_corrida", l: "Primeira corrida de 10km", sub: "Corrida · base aeróbica" },
            { v: "performance", l: "Performance em prova específica", sub: "Corrida · periodização por data" },
          ].map((g) => (
            <button
              key={g.v}
              onClick={() => update("goal", g.v)}
              className="w-full rounded-xl border-2 p-4 flex items-center justify-between text-left"
              style={{ borderColor: form.goal === g.v ? "#0B5A28" : "#E5E5E0", background: form.goal === g.v ? "#E3F0E6" : "white" }}
            >
              <div>
                <p className="font-bold text-sm text-ink">{g.l}</p>
                <p className="text-xs text-stone mt-0.5">{g.sub}</p>
              </div>
              {form.goal === g.v && <CheckCircle2 size={18} className="text-forest flex-shrink-0" />}
            </button>
          ))}
          {form.goal === "performance" && (
            <Field label="Data da prova" value={form.raceDate} onChange={(v) => update("raceDate", v)} placeholder="dd/mm/aaaa" />
          )}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4 mb-6">
          <div className="rounded-xl p-3.5 flex gap-2.5" style={{ background: "#E3F0E6" }}>
            <Info size={14} className="text-forest flex-shrink-0 mt-0.5" />
            <p className="text-xs leading-relaxed text-ink">
              Esses dados alimentam diretamente o gerador de periodização. Quanto mais completo, mais segura é a sugestão da IA.
            </p>
          </div>
          <TextField label="Lesões prévias" value={form.injuries} onChange={(v) => update("injuries", v)} placeholder="Ex: Tendinite no joelho direito (2023)" />
          <TextField label="Condições de saúde" value={form.healthConditions} onChange={(v) => update("healthConditions", v)} placeholder="Ex: Hipertensão controlada" />
          <TextField label="Histórico de treino" value={form.trainingHistory} onChange={(v) => update("trainingHistory", v)} placeholder="Ex: 2 anos de musculação" />
          <TextField label="Cirurgias / restrições médicas" value={form.surgeries} onChange={(v) => update("surgeries", v)} placeholder="Ex: Nenhuma" />
          <TextField label="Disponibilidade e equipamento" value={form.availability} onChange={(v) => update("availability", v)} placeholder="Ex: 4x/semana, academia completa" />
          <SelectField label="Tolerância à alta intensidade" value={form.intensityTolerance} onChange={(v) => update("intensityTolerance", v)} options={[
            { value: "baixa", label: "Baixa" },
            { value: "moderada", label: "Moderada" },
            { value: "boa", label: "Boa" },
            { value: "alta", label: "Alta" },
          ]} />
        </div>
      )}

      <div className="flex gap-3">
        {step > 0 && <OutlineButton onClick={() => setStep(step - 1)} className="flex-1">Voltar</OutlineButton>}
        {step < 2 ? (
          <ForestButton onClick={() => setStep(step + 1)} className="flex-1" disabled={step === 0 && !form.name}>
            Continuar
          </ForestButton>
        ) : (
          <ForestButton onClick={handleSubmit} icon={Sparkles} className="flex-1">
            Gerar plano com IA
          </ForestButton>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="text-xs font-bold text-stone block mb-1.5">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border-2 border-black/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-forest"
      />
    </div>
  );
}

function TextField({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="text-xs font-bold text-stone block mb-1.5">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={2}
        className="w-full border-2 border-black/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-forest resize-none"
      />
    </div>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <div>
      <label className="text-xs font-bold text-stone block mb-1.5">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border-2 border-black/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-forest bg-white"
      >
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}
