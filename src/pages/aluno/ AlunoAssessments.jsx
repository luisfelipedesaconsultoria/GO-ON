import React from "react";
import { useOutletContext } from "react-router-dom";
import { Camera, ClipboardList, Activity, Scale, ChevronRight, Info } from "lucide-react";
import BlockedScreen from "./BlockedScreen";

const modes = [
  { id: "photo", icon: Camera, title: "Avaliação por foto", desc: "IA estima composição corporal — seu personal aprova", tag: "IA estima · personal aprova" },
  { id: "self", icon: ClipboardList, title: "Autoavaliação básica", desc: "Peso, medidas com fita, sem equipamento", tag: "Sem equipamento" },
  { id: "pro", icon: Activity, title: "Avaliação convencional", desc: "Registrada pelo seu personal", tag: "Feita pelo personal" },
  { id: "bio", icon: Scale, title: "Bioimpedância", desc: "Resultado de balança ou aparelho profissional", tag: "Alta precisão" },
];

export default function AlunoAssessments() {
  const { student, isBlocked, brandColor } = useOutletContext();
  if (isBlocked) return <BlockedScreen student={student} brandColor={brandColor} />;

  return (
    <div className="px-5 pt-4">
      <p className="text-white font-black text-xl mb-1">Avaliações</p>
      <p className="text-xs text-white/50 mb-4">
        Última: {student.assessments?.lastAssessmentAt ? new Date(student.assessments.lastAssessmentAt).toLocaleDateString("pt-BR") : "ainda não há"}
      </p>

      <div className="rounded-xl p-3.5 mb-4 flex gap-2.5" style={{ background: "rgba(200,245,98,0.1)" }}>
        <Info size={14} className="text-lime flex-shrink-0 mt-0.5" />
        <p className="text-xs text-white/70 leading-relaxed">
          Seu personal decide qual avaliação orienta seu plano quando há mais de uma no mesmo período.
        </p>
      </div>

      <div className="space-y-2.5">
        {modes.map((m) => (
          <button key={m.id} className="w-full rounded-xl p-4 flex items-start gap-3 text-left bg-white/[0.06]">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-white/10">
              <m.icon size={18} className="text-lime" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm text-white">{m.title}</p>
              <p className="text-xs text-white/50 mt-0.5">{m.desc}</p>
              <span className="text-[10px] font-bold mt-1.5 inline-block text-lime">{m.tag}</span>
            </div>
            <ChevronRight size={16} className="text-white/20 flex-shrink-0 mt-1" />
          </button>
        ))}
      </div>
    </div>
  );
}
