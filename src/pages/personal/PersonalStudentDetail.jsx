import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  getStudent,
  updateStudent,
  getWorkoutFeedbackHistory,
  getHRSessionHistory,
} from "../../lib/db";
import {
  Card,
  Badge,
  Avatar,
  ForestButton,
  OutlineButton,
  Spinner,
} from "../../components/ui";
import {
  ChevronLeft,
  AlertCircle,
  ChevronRight,
  Sparkles,
  Activity,
  Dumbbell,
  Zap,
  Stethoscope,
  ClipboardList,
  Lock,
  Unlock,
  HeartPulse,
} from "lucide-react";

const modalityIcon = { musc: Dumbbell, run: Activity, both: Zap };
const statusMeta = {
  "on-track": { label: "Em dia", color: "#0B5A28", bg: "#E3F0E6" },
  attention: { label: "Atenção", color: "#FF6B4A", bg: "#FFE9E2" },
  achievement: { label: "Conquista", color: "#5C7A1F", bg: "#EEF7D6" },
};

export default function PersonalStudentDetail() {
  const { studentId } = useParams();
  const { tenant } = useAuth();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("overview");
  const [feedback, setFeedback] = useState([]);
  const [hrHistory, setHrHistory] = useState([]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      const [s, f] = await Promise.all([
        getStudent(studentId),
        getWorkoutFeedbackHistory(studentId),
      ]);
      if (!cancelled) {
        setStudent(s);
        setFeedback(f);
        setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [studentId]);

  useEffect(() => {
    getHRSessionHistory(studentId).then(setHrHistory);
  }, [studentId]);

  if (loading) {
    return (
      <div className="p-4 md:p-8 max-w-3xl flex items-center justify-center min-h-[40vh]">
        <Spinner size={24} />
      </div>
    );
  }

  if (!student) return <div className="p-4 md:p-8">Aluno não encontrado.</div>;

  const Icon = modalityIcon[student.modality];
  const meta = statusMeta[student.status];

  const toggleSubscription = async () => {
    const next = student.subscriptionStatus === "active" ? "overdue" : "active";
    const updated = await updateStudent(studentId, { subscriptionStatus: next });
    setStudent(updated);
  };

  return (
    <div className="p-4 md:p-8 max-w-3xl">
      <button
        onClick={() => navigate("/personal/alunos")}
        className="flex items-center gap-1 text-sm text-stone mb-4"
      >
        <ChevronLeft size={16} /> Todos os alunos
      </button>

      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <Avatar
          initials={student.initials}
          size={56}
          color={tenant.brandColor}
        />
        <div className="flex-1 min-w-[180px]">
          <div className="flex items-center gap-2">
            <p className="font-display font-black text-xl text-ink">
              {student.name}
            </p>
            {student.subscriptionStatus === "overdue" && (
              <Badge color="#FF6B4A" bg="#FFE9E2">
                Inadimplente
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-sm text-stone mt-0.5">
            <Icon size={13} /> {student.phase}
          </div>
        </div>
        <button
          onClick={toggleSubscription}
          className="flex items-center gap-1.5 text-xs font-bold text-stone border border-black/15 rounded-lg px-3 py-2"
        >
          {student.subscriptionStatus === "active" ? (
            <>
              <Lock size={12} /> Marcar inadimplente
            </>
          ) : (
            <>
              <Unlock size={12} /> Reativar acesso
            </>
          )}
        </button>
      </div>

      {student.alert && (
        <Card
          className="p-4 flex gap-3 mb-5"
          style={{ background: "#FFE9E2", borderColor: "#FF6B4A" }}
        >
          <AlertCircle size={18} className="text-coral flex-shrink-0" />
          <div>
            <p className="text-sm font-bold text-ink">{student.alert}</p>
          </div>
        </Card>
      )}

      <div className="flex gap-2 mb-5 border-b border-black/8 overflow-x-auto">
        {[
          { id: "overview", label: "Visão geral" },
          { id: "anamnese", label: "Anamnese" },
          { id: "historico", label: "Histórico de treinos" },
          { id: "cardio", label: "Frequência cardíaca" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-3 py-2.5 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
              tab === t.id
                ? "border-forest text-forest"
                : "border-transparent text-stone"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
            <Card className="p-4">
              <p className="text-[10px] font-bold uppercase text-stone mb-1">
                Adesão
              </p>
              <p className="text-2xl font-black" style={{ color: meta.color }}>
                {student.adherence}%
              </p>
            </Card>
            <Card className="p-4">
              <p className="text-[10px] font-bold uppercase text-stone mb-1">
                Sequência
              </p>
              <p className="text-2xl font-black text-ink">
                {student.currentStreak} dias
              </p>
            </Card>
            <Card className="p-4">
              <p className="text-[10px] font-bold uppercase text-stone mb-1">
                Última sessão
              </p>
              <p className="text-sm font-bold text-ink mt-1.5">
                {new Date(student.lastSessionAt).toLocaleDateString("pt-BR")}
              </p>
            </Card>
          </div>

          <ForestButton
            onClick={() =>
              navigate(`/personal/alunos/${studentId}/gerar-plano`)
            }
            icon={Sparkles}
            className="w-full mb-5"
          >
            Gerar nova periodização
          </ForestButton>
        </>
      )}

      {tab === "anamnese" && (
        <div className="space-y-3">
          {[
            {
              l: "Lesões prévias",
              v: student.anamnesis?.injuries,
              icon: Stethoscope,
            },
            {
              l: "Condições de saúde",
              v: student.anamnesis?.healthConditions,
              icon: Stethoscope,
            },
            {
              l: "Histórico de treino",
              v: student.anamnesis?.trainingHistory,
              icon: ClipboardList,
            },
            {
              l: "Cirurgias / restrições",
              v: student.anamnesis?.surgeries,
              icon: Stethoscope,
            },
            {
              l: "Disponibilidade",
              v: student.anamnesis?.availability,
              icon: ClipboardList,
            },
            {
              l: "Tolerância à intensidade",
              v: student.anamnesis?.intensityTolerance,
              icon: Zap,
            },
          ].map((f, i) => (
            <Card key={i} className="p-4 flex gap-3">
              <f.icon size={15} className="text-forest flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] font-bold text-stone mb-0.5">{f.l}</p>
                <p className="text-sm text-ink">{f.v || "Não informado"}</p>
              </div>
            </Card>
          ))}

          {student.assessments?.oneRM && (
            <Card className="p-4">
              <p className="text-[11px] font-bold text-stone mb-2">
                1RM registrado
              </p>
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(student.assessments.oneRM).map(([k, v]) => (
                  <div key={k}>
                    <p className="text-[10px] text-stone capitalize">{k}</p>
                    <p className="text-base font-black text-ink">{v}kg</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      {tab === "historico" && (
        <Card className="overflow-hidden">
          {feedback.length === 0 ? (
            <div className="p-6 text-center text-sm text-stone">
              Nenhum treino registrado ainda.
            </div>
          ) : (
            feedback.map((f, i) => (
              <div
                key={f.id}
                className={`flex items-center gap-4 p-4 ${
                  i > 0 ? "border-t border-black/6" : ""
                }`}
              >
                <div className="text-xs text-stone w-20 flex-shrink-0">
                  {new Date(f.date).toLocaleDateString("pt-BR")}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-ink">
                    Nota: {f.rating}/5 · Energia: {f.energy}/5
                  </p>
                  {f.pain && (
                    <p className="text-xs text-coral">
                      Relatou dor/desconforto
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </Card>
      )}

      {tab === "cardio" && (
        <Card className="overflow-hidden">
          {hrHistory.length === 0 ? (
            <div className="p-6 text-center text-sm text-stone flex flex-col items-center gap-2">
              <HeartPulse size={22} className="text-stone" />
              Nenhuma sessão com bracelete Bluetooth registrada ainda.
            </div>
          ) : (
            hrHistory.map((h, i) => (
              <div
                key={h.id}
                className={`flex items-center gap-4 p-4 ${i > 0 ? "border-t border-black/6" : ""}`}
              >
                <div className="text-xs text-stone w-20 flex-shrink-0">
                  {new Date(h.createdAt).toLocaleDateString("pt-BR")}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-ink">
                    Média {h.avgBpm ?? "--"}bpm · Máx {h.maxBpm ?? "--"}bpm · {h.calories ?? 0} kcal
                  </p>
                  <p className="text-xs text-stone">
                    {h.mode === "team" ? `Turma (${h.roomCode})` : "Individual"} ·{" "}
                    {Math.floor((h.durationSec || 0) / 60)}min · {h.deviceName || "dispositivo Bluetooth"}
                  </p>
                </div>
              </div>
            ))
          )}
        </Card>
      )}
    </div>
  );
}
