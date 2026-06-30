import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getWorkoutTemplates, duplicateWorkoutTemplate, assignTemplateToStudents, getStudents } from "../../lib/db";
import { Card, ForestButton, OutlineButton, Spinner } from "../../components/ui";
import { Library, Copy, Send, FolderPlus, CheckCircle2, Circle, X } from "lucide-react";

export default function PersonalWorkoutLibrary() {
  const { tenant } = useAuth();
  const [modality, setModality] = useState("musc");
  const [templates, setTemplates] = useState(() => getWorkoutTemplates(tenant.id, "musc"));
  const [sendModal, setSendModal] = useState(null);
  const [toast, setToast] = useState("");
  const [duplicatingId, setDuplicatingId] = useState(null);

  const switchModality = (m) => {
    setModality(m);
    setTemplates(getWorkoutTemplates(tenant.id, m));
  };

  const handleDuplicate = (id) => {
    setDuplicatingId(id);
    setTimeout(() => {
      duplicateWorkoutTemplate(id);
      setTemplates(getWorkoutTemplates(tenant.id, modality));
      setDuplicatingId(null);
      setToast("Treino duplicado com sucesso");
      setTimeout(() => setToast(""), 2000);
    }, 500);
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl relative page-enter">
      <div className="flex items-center justify-between mb-1">
        <p className="font-display font-black text-2xl text-ink">Banco de treinos</p>
        <button className="flex items-center gap-2 border-2 border-forest text-forest rounded-xl px-4 py-2.5 text-sm font-bold">
          <FolderPlus size={15} /> Salvar treino como modelo
        </button>
      </div>
      <p className="text-sm text-stone mb-6">Modelos reutilizáveis — sem dados de um aluno específico</p>

      <div className="flex gap-1.5 mb-5 p-1 rounded-full bg-black/[0.05] w-fit">
        {[{ id: "musc", l: "Musculação" }, { id: "run", l: "Corrida" }].map((t) => (
          <button
            key={t.id}
            onClick={() => switchModality(t.id)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${modality === t.id ? "bg-ink text-white" : "text-stone"}`}
          >
            {t.l}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((t) => (
          <Card key={t.id} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="font-bold text-sm text-ink">{t.name}</p>
              {t.isShared && <span className="text-[10px] font-bold text-forest">Base compartilhada</span>}
            </div>
            <p className="text-[11px] text-stone mb-3 capitalize">{t.level} · usado {t.uses}x</p>
            <div className="space-y-1 mb-3">
              {t.exercises.slice(0, 3).map((ex, i) => (
                <p key={i} className="text-xs text-stone">• {ex.name} — {ex.sets}x{ex.reps}</p>
              ))}
              {t.exercises.length > 3 && <p className="text-xs text-stone">+ {t.exercises.length - 3} exercícios</p>}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleDuplicate(t.id)}
                disabled={duplicatingId === t.id}
                className="flex-1 rounded-lg py-2 text-xs font-bold flex items-center justify-center gap-1.5 bg-black/[0.05] text-ink transition-opacity disabled:opacity-60"
              >
                {duplicatingId === t.id ? <Spinner size={12} /> : <Copy size={12} />}
                {duplicatingId === t.id ? "Duplicando..." : "Duplicar"}
              </button>
              <button onClick={() => setSendModal(t)} className="flex-1 rounded-lg py-2 text-xs font-bold flex items-center justify-center gap-1.5 bg-forest text-white">
                <Send size={12} /> Enviar
              </button>
            </div>
          </Card>
        ))}
      </div>

      {sendModal && <SendModal template={sendModal} tenantId={tenant.id} onClose={() => setSendModal(null)} onSent={() => { setToast("Treino enviado com sucesso"); setTimeout(() => setToast(""), 2000); }} />}

      {toast && (
        <div className="fixed bottom-6 right-6 bg-ink text-white rounded-xl px-5 py-3 text-sm font-bold flex items-center gap-2 shadow-xl animate-fade-in">
          <CheckCircle2 size={16} className="text-lime" /> {toast}
        </div>
      )}
    </div>
  );
}

function SendModal({ template, tenantId, onClose, onSent }) {
  const students = getStudents(tenantId);
  const [picked, setPicked] = useState([]);
  const [sending, setSending] = useState(false);
  const toggle = (id) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const handleSend = () => {
    setSending(true);
    setTimeout(() => {
      assignTemplateToStudents(template.id, picked);
      setSending(false);
      onSent();
      onClose();
    }, 600);
  };

  const missingData = students.filter((s) => picked.includes(s.id) && !s.assessments?.oneRM && template.modality === "musc");

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-md w-full p-5 animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-1">
          <p className="font-black text-base text-ink">Enviar "{template.name}"</p>
          <button onClick={onClose}><X size={18} className="text-stone" /></button>
        </div>
        <p className="text-xs text-stone mb-4">As cargas serão recalculadas pela IA conforme o nível e 1RM de cada aluno</p>

        {missingData.length > 0 && (
          <div className="rounded-xl p-3 mb-4 flex gap-2.5" style={{ background: "#FCEFD9" }}>
            <p className="text-xs leading-relaxed" style={{ color: "#A6701F" }}>
              {missingData.map((s) => s.name).join(", ")} sem 1RM registrado — a IA usará carga conservadora marcada como estimativa inicial.
            </p>
          </div>
        )}

        <div className="space-y-2 mb-5 max-h-64 overflow-y-auto">
          {students.map((s) => (
            <button key={s.id} onClick={() => toggle(s.id)} className="w-full bg-white rounded-xl border-2 p-3 flex items-center gap-3 transition-colors" style={{ borderColor: picked.includes(s.id) ? "#0B5A28" : "#E5E5E0" }}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center font-black text-xs text-white flex-shrink-0 bg-forest">{s.initials}</div>
              <p className="flex-1 text-left text-sm font-bold text-ink">{s.name}</p>
              {picked.includes(s.id) ? <CheckCircle2 size={18} className="text-forest check-pop" /> : <Circle size={18} className="text-black/15" />}
            </button>
          ))}
        </div>

        <ForestButton onClick={handleSend} icon={sending ? undefined : Send} className="w-full" disabled={picked.length === 0 || sending}>
          {sending ? <span className="flex items-center gap-2"><Spinner size={15} color="white" /> Enviando...</span> : `Enviar para ${picked.length} aluno${picked.length !== 1 ? "s" : ""}`}
        </ForestButton>
      </div>
    </div>
  );
}