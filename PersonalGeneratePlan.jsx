import React, { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getStudent, createPeriodizationProposal, approvePeriodization } from "../../lib/db";
import { ForestButton, OutlineButton, Badge } from "../../components/ui";
import { ChevronLeft, Sparkles, CheckCircle2, Zap, FileText } from "lucide-react";

// ---- Motor de geração simulado ----
// Em produção isso vira uma chamada à API do Claude com os dados da anamnese.
// Aqui simulamos a lógica de decisão para já validar o fluxo de ponta a ponta.
function generatePeriodization(student) {
  const isRun = student.modality === "run" || student.modality === "both";
  const isMusc = student.modality === "musc" || student.modality === "both";
  const reasoning = [];

  if (student.assessments?.oneRM) {
    reasoning.push("1RM já registrado → ponto de partida de carga calibrado, sem necessidade de semana de teste.");
  } else {
    reasoning.push("Sem 1RM registrado → primeira semana inclui teste de carga conservador antes de definir progressão.");
  }

  const highIntensity = student.anamnesis?.intensityTolerance === "boa" || student.anamnesis?.intensityTolerance === "alta";
  if (highIntensity) {
    reasoning.push("Boa tolerância à alta intensidade → bloco intermediário incluirá métodos como drop sets ou cluster sets.");
  } else {
    reasoning.push("Tolerância moderada/baixa → progressão de intensidade mais gradual, sem métodos de alta intensidade no início.");
  }

  const hasInjury = student.anamnesis?.injuries && student.anamnesis.injuries !== "Nenhuma relatada";
  if (hasInjury) {
    reasoning.push(`Histórico de lesão (${student.anamnesis.injuries}) → exercícios de maior impacto na região afetada serão evitados ou substituídos por variações unilaterais/controladas.`);
  }

  let blocks;
  if (isMusc && !isRun) {
    blocks = [
      { name: "Adaptação", weeks: "1-2", focus: "Volume moderado, foco em técnica", hit: false },
      { name: "Hipertrofia", weeks: "3-6", focus: "Volume alto, 70-75% 1RM", hit: false },
      { name: "Intensificação", weeks: "7-9", focus: highIntensity ? "Drop sets e cluster sets no final do bloco" : "Aumento gradual de carga, sem métodos avançados", hit: highIntensity },
      { name: "Deload", weeks: "10", focus: "Volume -40%, recuperação total", hit: false },
    ];
  } else if (isRun && !isMusc) {
    blocks = [
      { name: "Base", weeks: "1-3", focus: "Volume aeróbico, Z2 dominante", hit: false },
      { name: "Build", weeks: "4-7", focus: "Introdução de limiar e tempo runs", hit: false },
      { name: "Pico", weeks: "8-9", focus: "Intervalados específicos da prova", hit: true },
      { name: "Polimento", weeks: "10", focus: "Redução de volume, manter intensidade", hit: false },
    ];
  } else {
    blocks = [
      { name: "Adaptação combinada", weeks: "1-2", focus: "Base aeróbica leve + técnica de força", hit: false },
      { name: "Desenvolvimento", weeks: "3-6", focus: "Musculação em volume + corrida em build", hit: false },
      { name: "Intensificação", weeks: "7-9", focus: "Picos de intensidade alternados entre modalidades", hit: true },
      { name: "Deload", weeks: "10", focus: "Redução geral de carga em ambas modalidades", hit: false },
    ];
  }

  return { blocks, reasoning, duration: 10 };
}

export default function PersonalGeneratePlan() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const student = getStudent(studentId);
  const [approved, setApproved] = useState(false);
  const plan = useMemo(() => (student ? generatePeriodization(student) : null), [student]);

  if (!student || !plan) return <div className="p-8">Aluno não encontrado.</div>;

  const handleApprove = () => {
    const proposal = createPeriodizationProposal(studentId, plan.blocks, plan.reasoning);
    approvePeriodization(proposal.id);
    setApproved(true);
    setTimeout(() => navigate(`/personal/alunos/${studentId}`), 1200);
  };

  return (
    <div className="p-8 max-w-2xl">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-stone mb-4">
        <ChevronLeft size={16} /> Voltar
      </button>

      <div className="flex items-center gap-2 mb-1">
        <Sparkles size={18} className="text-forest" />
        <p className="font-display font-black text-xl text-ink">Periodização gerada · {student.name}</p>
      </div>
      <p className="text-sm text-stone mb-5">Baseada na anamnese, avaliação física e objetivo cadastrado</p>

      <div className="rounded-xl p-4 mb-5" style={{ background: "#E3F0E6", border: "2px solid #0B5A28" }}>
        <p className="text-[11px] font-bold uppercase mb-2 text-forest">O que a IA considerou</p>
        <div className="space-y-1.5">
          {plan.reasoning.map((r, i) => (
            <div key={i} className="flex gap-2 text-xs leading-relaxed text-ink">
              <CheckCircle2 size={13} className="text-forest flex-shrink-0 mt-0.5" /> {r}
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs font-black uppercase tracking-wide text-forest mb-3">Blocos do ciclo · {plan.duration} semanas</p>
      <div className="space-y-2 mb-6">
        {plan.blocks.map((b, i) => (
          <div key={i} className="rounded-xl p-3.5 border-2 bg-white" style={{ borderColor: b.hit ? "#E8A23D" : "#E5E5E0" }}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-baseline gap-2">
                <p className="font-bold text-sm text-ink">{b.name}</p>
                <p className="text-[10px] font-mono text-stone">SEM {b.weeks}</p>
              </div>
              {b.hit && <Badge color="#A6701F" bg="#FCEFD9"><Zap size={10} /> Alta intensidade</Badge>}
            </div>
            <p className="text-xs text-stone">{b.focus}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border-2 border-black/8 p-4 mb-6 flex items-start gap-2.5">
        <FileText size={14} className="text-forest flex-shrink-0 mt-0.5" />
        <p className="text-xs text-stone leading-relaxed">
          Cada exercício do plano será gerado com vídeo demonstrativo, explicação técnica automática, séries, repetições e RIR — editáveis pelo aluno durante a execução.
        </p>
      </div>

      <div className="flex gap-3">
        <OutlineButton onClick={() => navigate(-1)} className="flex-1">Editar manualmente</OutlineButton>
        <ForestButton onClick={handleApprove} icon={CheckCircle2} className="flex-1" disabled={approved}>
          {approved ? "Aprovado!" : "Aprovar plano"}
        </ForestButton>
      </div>
    </div>
  );
}
