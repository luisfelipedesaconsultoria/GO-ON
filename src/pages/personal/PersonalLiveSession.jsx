import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getStudents } from "../../lib/db";
import { Avatar, Card, ForestButton, OutlineButton, EmptyState } from "../../components/ui";
import { generateRoomCode, joinHRRoom, leaveHRRoom } from "../../lib/liveHRSession";
import { getHRZone, estimateMaxHR } from "../../lib/calorieCalc";
import { Radio, Copy, Check, HeartPulse, Users } from "lucide-react";

function ParticipantCard({ presenceInfo, live, student }) {
  const age = student?.age;
  const zone = live?.bpm ? getHRZone(live.bpm, estimateMaxHR(age)) : null;
  const isStale = live && Date.now() - live.at > 15000;

  return (
    <Card className="p-4 relative overflow-hidden">
      {zone && !isStale && (
        <div className="absolute top-0 left-0 right-0 h-1" style={{ background: zone.color }} />
      )}
      <div className="flex items-center gap-3 mb-3">
        <Avatar initials={presenceInfo.initials || "?"} size={36} color={student ? undefined : "#8A8F8B"} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-ink truncate">{presenceInfo.name}</p>
          <p className="text-[10px] text-stone">{isStale || !live ? "aguardando dados..." : zone?.label}</p>
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-black font-mono text-ink">{isStale || !live ? "--" : live.bpm}</span>
          <span className="text-[10px] text-stone font-bold">bpm</span>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-ink">{isStale || !live ? "--" : `${live.calories} kcal`}</p>
          <p className="text-[10px] text-stone">
            {isStale || !live ? "" : `${Math.floor(live.elapsedSec / 60)}min`}
          </p>
        </div>
      </div>
    </Card>
  );
}

export default function PersonalLiveSession() {
  const { user, tenant } = useAuth();
  const [students, setStudents] = useState([]);
  const [room, setRoom] = useState(null); // { code }
  const [presence, setPresence] = useState({}); // { participantId: {name, initials} }
  const [live, setLive] = useState({}); // { participantId: {bpm, calories, zone, elapsedSec, at} }
  const [copied, setCopied] = useState(false);
  const channelRef = useRef(null);

  useEffect(() => {
    if (!tenant) return;
    getStudents(tenant.id).then(setStudents);
  }, [tenant]);

  useEffect(() => () => leaveHRRoom(channelRef.current), []);

  const studentsById = Object.fromEntries(students.map((s) => [s.id, s]));

  const startRoom = () => {
    const code = generateRoomCode();
    const channel = joinHRRoom({
      tenantId: tenant.id,
      code,
      participant: { id: `trainer-${user.id}`, name: user.name, initials: "PT" },
      onSync: (state) => {
        const next = {};
        Object.values(state).forEach((entries) => {
          entries.forEach((p) => {
            if (p.id.startsWith("trainer-")) return;
            next[p.id] = { name: p.name, initials: p.initials };
          });
        });
        setPresence(next);
      },
      onHRUpdate: (payload) => {
        setLive((prev) => ({ ...prev, [payload.participantId]: payload }));
      },
    });
    channelRef.current = channel;
    setRoom({ code });
  };

  const endRoom = () => {
    leaveHRRoom(channelRef.current);
    channelRef.current = null;
    setRoom(null);
    setPresence({});
    setLive({});
  };

  const copyCode = () => {
    navigator.clipboard?.writeText(room.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const participants = Object.entries(presence);

  return (
    <div className="p-4 md:p-8 max-w-4xl">
      <div className="flex items-center gap-2 mb-1">
        <HeartPulse size={20} className="text-forest" />
        <p className="font-display font-black text-xl text-ink">Monitor de frequência cardíaca ao vivo</p>
      </div>
      <p className="text-sm text-stone mb-6">
        Acompanhe em tempo real o BPM e as calorias dos alunos conectados — na aula presencial ou com quem treina pela
        consultoria online, desde que tenham um bracelete Bluetooth (ex: COOSPO) conectado no próprio celular.
      </p>

      {!room ? (
        <Card className="p-6 text-center max-w-md">
          <Radio size={28} className="text-forest mx-auto mb-3" />
          <p className="font-bold text-ink mb-1">Nenhuma sessão ativa</p>
          <p className="text-xs text-stone mb-4">
            Crie uma sala e compartilhe o código com os alunos. Cada um conecta o próprio bracelete pelo app dele.
          </p>
          <ForestButton onClick={startRoom} icon={Radio} className="w-full">
            Iniciar sessão ao vivo
          </ForestButton>
        </Card>
      ) : (
        <>
          <Card className="p-4 mb-6 flex flex-wrap items-center gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase text-stone">Código da sala</p>
              <p className="text-2xl font-black font-mono text-ink tracking-wider">{room.code}</p>
            </div>
            <button
              onClick={copyCode}
              className="flex items-center gap-1.5 text-xs font-bold text-stone border border-black/15 rounded-lg px-3 py-2"
            >
              {copied ? <Check size={13} /> : <Copy size={13} />} {copied ? "Copiado" : "Copiar código"}
            </button>
            <div className="flex items-center gap-1.5 text-xs text-stone">
              <Users size={14} /> {participants.length} conectado{participants.length !== 1 ? "s" : ""}
            </div>
            <OutlineButton onClick={endRoom} className="ml-auto py-2 px-4">
              Encerrar sessão
            </OutlineButton>
          </Card>

          {participants.length === 0 ? (
            <EmptyState
              icon={Users}
              title="Aguardando alunos entrarem"
              description={`Peça para os alunos abrirem o app, irem em "Frequência cardíaca" e digitarem o código ${room.code}.`}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {participants.map(([id, presenceInfo]) => (
                <ParticipantCard key={id} presenceInfo={presenceInfo} live={live[id]} student={studentsById[id]} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
