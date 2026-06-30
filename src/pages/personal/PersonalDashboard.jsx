import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getStudents, getVideoReviewQueue } from "../../lib/db";
import { Card, Badge, Avatar } from "../../components/ui";
import {
  Users,
  TrendingUp,
  AlertCircle,
  Video,
  ChevronRight,
  Clock,
  Sparkles,
} from "lucide-react";

const statusMeta = {
  "on-track": { label: "Em dia", color: "#0B5A28", bg: "#E3F0E6" },
  attention: { label: "Atenção", color: "#FF6B4A", bg: "#FFE9E2" },
  achievement: { label: "Conquista", color: "#5C7A1F", bg: "#EEF7D6" },
};

export default function PersonalDashboard() {
  const { tenant } = useAuth();
  const navigate = useNavigate();
  const students = getStudents(tenant.id);
  const pendingVideos = getVideoReviewQueue(tenant.id).filter(
    (v) => v.status === "pending"
  );
  const avgAdherence = Math.round(
    students.reduce((acc, s) => acc + s.adherence, 0) / students.length
  );
  const needsAttention = students.filter((s) => s.alert);

  return (
    <div className="p-4 md:p-8 max-w-6xl">
      <p className="font-display font-black text-2xl text-ink mb-1">
        Olá, {tenant.ownerName.split(" ")[0]} 👋
      </p>
      <p className="text-sm text-stone mb-7">
        Aqui está o resumo da sua operação hoje
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
        <Card className="p-5">
          <Users size={18} className="text-forest mb-2" />
          <p className="text-3xl font-black text-ink">{students.length}</p>
          <p className="text-xs text-stone font-medium">alunos ativos</p>
        </Card>
        <Card className="p-5">
          <TrendingUp size={18} className="text-forest mb-2" />
          <p className="text-3xl font-black text-ink">{avgAdherence}%</p>
          <p className="text-xs text-stone font-medium">adesão média</p>
        </Card>
        <Card className="p-5">
          <AlertCircle size={18} className="text-coral mb-2" />
          <p className="text-3xl font-black text-ink">
            {needsAttention.length}
          </p>
          <p className="text-xs text-stone font-medium">precisam de atenção</p>
        </Card>
        <Card className="p-5">
          <Video size={18} className="text-amber mb-2" />
          <p className="text-3xl font-black text-ink">{pendingVideos.length}</p>
          <p className="text-xs text-stone font-medium">vídeos para revisar</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <p className="font-black text-sm text-ink">
              Precisam da sua atenção
            </p>
            <button
              onClick={() => navigate("/personal/alunos")}
              className="text-xs font-bold text-forest flex items-center gap-1"
            >
              Ver todos <ChevronRight size={12} />
            </button>
          </div>
          <Card className="overflow-hidden">
            {needsAttention.length === 0 ? (
              <div className="p-6 text-center text-sm text-stone">
                Nenhum aluno com alerta no momento. Tudo em dia!
              </div>
            ) : (
              needsAttention.map((s, i) => {
                const meta = statusMeta[s.status];
                return (
                  <button
                    key={s.id}
                    onClick={() => navigate(`/personal/alunos/${s.id}`)}
                    className={`w-full flex items-center gap-3 p-4 text-left hover:bg-black/[0.02] ${
                      i > 0 ? "border-t border-black/6" : ""
                    }`}
                  >
                    <Avatar
                      initials={s.initials}
                      size={36}
                      color={tenant.brandColor}
                    />
                    <div className="flex-1">
                      <p className="font-bold text-sm text-ink">{s.name}</p>
                      <p className="text-xs text-stone">{s.alert}</p>
                    </div>
                    <Badge color={meta.color} bg={meta.bg}>
                      {meta.label}
                    </Badge>
                  </button>
                );
              })
            )}
          </Card>
        </div>

        <div>
          <p className="font-black text-sm text-ink mb-3">
            Fila de análise de vídeo
          </p>
          <Card className="p-4">
            {pendingVideos.length === 0 ? (
              <p className="text-sm text-stone text-center py-4">
                Nenhum vídeo pendente
              </p>
            ) : (
              <div className="space-y-3">
                {pendingVideos.map((v) => (
                  <div key={v.id} className="flex items-start gap-2.5">
                    <Video
                      size={14}
                      className="text-amber flex-shrink-0 mt-0.5"
                    />
                    <div>
                      <p className="text-xs font-bold text-ink">
                        {v.studentName}
                      </p>
                      <p className="text-[11px] text-stone">{v.exerciseName}</p>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => navigate("/personal/videos")}
                  className="w-full bg-ink text-white rounded-lg py-2.5 text-xs font-bold mt-2"
                >
                  Revisar agora
                </button>
              </div>
            )}
          </Card>

          <div
            className="mt-4 rounded-2xl p-4 flex gap-3"
            style={{ background: "#E3F0E6" }}
          >
            <Sparkles size={16} className="text-forest flex-shrink-0 mt-0.5" />
            <p className="text-xs leading-relaxed text-ink">
              Letícia Costa bateu recorde pessoal em supino e está com 100% de
              adesão — bom momento para sugerir progressão de carga.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
