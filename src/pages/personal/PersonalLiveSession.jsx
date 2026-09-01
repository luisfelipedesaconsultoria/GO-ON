import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getStudents, saveHRSession } from "../../lib/db";
import { Avatar, Card, ForestButton, OutlineButton, EmptyState } from "../../components/ui";
import { useHRSlots } from "../../hooks/useHRSlots";
import { generateRoomCode, joinHRRoom, leaveHRRoom } from "../../lib/liveHRSession";
import { getHRZone, estimateMaxHR } from "../../lib/calorieCalc";
import { formatDuration } from "../../lib/format";
import {
  Bluetooth,
  Plus,
  X,
  Radio,
  Copy,
  Check,
  HeartPulse,
  Users,
  Flame,
  Timer,
  WifiOff,
} from "lucide-react";

function SlotCard({ slot, onConnect, onDisconnect, onRemove, brandColor }) {
  const isConnected = slot.status === "connected";
  const isConnecting = slot.status === "connecting";
  const hasData = slot.bpm != null;

  return (
    <Card className="p-4 relative overflow-hidden">
      {slot.zone && isConnected && (
        <div className="absolute top-0 left-0 right-0 h-1" style={{ background: slot.zone.color }} />
      )}
      <div className="flex items-center justify-between mb-3 gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <Avatar
            initials={slot.initials || slot.label.slice(0, 2).toUpperCase()}
            size={32}
            color={slot.studentId ? brandColor : "#8A8F8B"}
          />
          <div className="min-w-0">
            <p className="text-sm font-bold text-ink truncate">{slot.label}</p>
            <p className="text-[10px] text-stone">{slot.studentId ? "aluno cadastrado" : "perfil da sessão"}</p>
          </div>
        </div>
        <button onClick={() => onRemove(slot.id)} className="text-stone hover:text-coral flex-shrink-0">
          <X size={15} />
        </button>
      </div>

      {slot.status === "idle" && !hasData && (
        <button
          onClick={() => onConnect(slot.id)}
          className="w-full rounded-lg py-2.5 text-xs font-bold text-white flex items-center justify-center gap-1.5 bg-ink"
        >
          <Bluetooth size={13} /> Conectar bracelete
        </button>
      )}

      {isConnecting && <p className="text-xs text-stone text-center py-2.5">Selecione o dispositivo na janela do navegador...</p>}
      {slot.error && <p className="text-[11px] text-coral font-bold mb-1">{slot.error}</p>}

      {hasData && (
        <>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black font-mono text-ink">{slot.bpm ?? "--"}</span>
              <span className="text-[10px] text-stone font-bold">bpm</span>
            </div>
            {slot.zone && (
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: `${slot.zone.color}25`, color: slot.zone.color }}
              >
                {slot.zone.label}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between text-xs text-stone mb-2">
            <span className="flex items-center gap-1">
              <Flame size={12} /> {slot.calories} kcal
            </span>
            <span className="flex items-center gap-1 font-mono">
              <Timer size={12} /> {formatDuration(slot.elapsedSec)}
            </span>
          </div>
          {isConnected ? (
            <button
              onClick={() => onDisconnect(slot.id)}
              className="w-full text-[11px] font-bold text-stone border border-black/10 rounded-lg py-2"
            >
              Desconectar
            </button>
          ) : (
            <p className="text-[10px] text-stone text-center">desconectado — última leitura acima</p>
          )}
        </>
      )}
    </Card>
  );
}

function AddSlotForm({ students, existingStudentIds, onAdd, brandColor }) {
  const [tab, setTab] = useState(students.length ? "roster" : "temp");
  const [name, setName] = useState("");
  const [gender, setGender] = useState("male");

  const available = students.filter((s) => !existingStudentIds.includes(s.id));

  return (
    <Card className="p-4 mb-4">
      <div className="flex gap-2 mb-3 border-b border-black/8">
        {[
          { id: "roster", label: "Aluno cadastrado" },
          { id: "temp", label: "Perfil só desta sessão" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-1 pb-2 text-xs font-bold border-b-2 ${
              tab === t.id ? "border-forest text-forest" : "border-transparent text-stone"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "roster" ? (
        available.length === 0 ? (
          <p className="text-xs text-stone py-2">Todos os alunos já foram adicionados à sessão.</p>
        ) : (
          <div className="max-h-52 overflow-y-auto space-y-1">
            {available.map((s) => (
              <button
                key={s.id}
                onClick={() =>
                  onAdd({
                    label: s.name,
                    initials: s.initials,
                    studentId: s.id,
                    profile: {
                      age: s.age,
                      weightKg: s.assessments?.weight,
                      gender: localStorage.getItem(`hr_gender_${s.id}`) || "male",
                    },
                  })
                }
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-black/5 text-left"
              >
                <Avatar initials={s.initials} size={26} color={brandColor} />
                <span className="text-sm font-bold text-ink">{s.name}</span>
              </button>
            ))}
          </div>
        )
      ) : (
        <div className="space-y-2.5">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome (ex: Convidado 1)"
            className="w-full rounded-lg px-3 py-2.5 text-sm border border-black/10 outline-none focus:border-forest"
          />
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-stone">Sexo (para cálculo de calorias):</span>
            {["male", "female"].map((g) => (
              <button
                key={g}
                onClick={() => setGender(g)}
                className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                style={gender === g ? { background: "#EAEAE4", color: brandColor } : { background: "#F3F3EE", color: "#6B716C" }}
              >
                {g === "male" ? "Masculino" : "Feminino"}
              </button>
            ))}
          </div>
          <button
            disabled={!name.trim()}
            onClick={() => {
              onAdd({ label: name.trim(), studentId: null, profile: { gender } });
              setName("");
            }}
            className="w-full rounded-lg py-2.5 text-xs font-bold text-white disabled:opacity-40"
            style={{ background: brandColor }}
          >
            Adicionar perfil
          </button>
          <p className="text-[10px] text-stone leading-relaxed">
            Perfis avulsos não ficam salvos no histórico do aluno — servem só para esta sessão (ex: aula
            experimental, visitante).
          </p>
        </div>
      )}
    </Card>
  );
}

function DirectMode({ tenant, brandColor }) {
  const { supported, slots, addSlot, removeSlot, connectSlot, disconnectSlot } = useHRSlots();
  const [students, setStudents] = useState([]);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!tenant) return;
    getStudents(tenant.id).then(setStudents);
  }, [tenant]);

  const handleAdd = (data) => {
    addSlot(data);
    setAdding(false);
  };

  const handleDisconnect = async (id) => {
    const slot = slots.find((s) => s.id === id);
    const summary = disconnectSlot(id);
    if (slot?.studentId && summary && summary.durationSec > 0) {
      await saveHRSession(slot.studentId, tenant.id, { ...summary, mode: "presencial", deviceName: slot.deviceName });
    }
  };

  if (!supported) {
    return (
      <Card className="p-6 flex gap-3 max-w-lg">
        <WifiOff size={20} className="text-stone flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-ink mb-1">Bluetooth não disponível neste navegador</p>
          <p className="text-xs text-stone leading-relaxed">
            No computador ou Android, use Chrome ou Edge. No iPhone, o Safari e os demais navegadores não suportam Web
            Bluetooth — instale o app gratuito <strong>Bluefy – Web BLE Browser</strong> (App Store) e abra este mesmo
            endereço dentro dele. Assim dá para conectar os braceletes direto pela tela do seu iPhone, como no app da
            Polar.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-stone">
          {slots.length} perfil{slots.length !== 1 ? "is" : ""} nesta sessão
        </p>
        <button
          onClick={() => setAdding((v) => !v)}
          className="flex items-center gap-1.5 text-xs font-bold text-white rounded-lg px-3 py-2"
          style={{ background: brandColor }}
        >
          <Plus size={13} /> Adicionar perfil
        </button>
      </div>

      {adding && (
        <AddSlotForm
          students={students}
          existingStudentIds={slots.map((s) => s.studentId).filter(Boolean)}
          onAdd={handleAdd}
          brandColor={brandColor}
        />
      )}

      {slots.length === 0 ? (
        <EmptyState
          icon={HeartPulse}
          title="Nenhum perfil adicionado ainda"
          description='Toque em "Adicionar perfil" para escolher um aluno cadastrado ou criar um perfil só para esta aula.'
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {slots.map((slot) => (
            <SlotCard
              key={slot.id}
              slot={slot}
              onConnect={connectSlot}
              onDisconnect={handleDisconnect}
              onRemove={removeSlot}
              brandColor={brandColor}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function RemoteParticipantCard({ presenceInfo, live, student }) {
  const age = student?.age;
  const zone = live?.bpm ? getHRZone(live.bpm, estimateMaxHR(age)) : null;
  const isStale = live && Date.now() - live.at > 15000;

  return (
    <Card className="p-4 relative overflow-hidden">
      {zone && !isStale && <div className="absolute top-0 left-0 right-0 h-1" style={{ background: zone.color }} />}
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
          <p className="text-[10px] text-stone">{isStale || !live ? "" : `${Math.floor(live.elapsedSec / 60)}min`}</p>
        </div>
      </div>
    </Card>
  );
}

function RemoteMode({ user, tenant }) {
  const [students, setStudents] = useState([]);
  const [room, setRoom] = useState(null);
  const [presence, setPresence] = useState({});
  const [live, setLive] = useState({});
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

  if (!room) {
    return (
      <Card className="p-6 text-center max-w-md">
        <Radio size={28} className="text-forest mx-auto mb-3" />
        <p className="font-bold text-ink mb-1">Nenhuma sala remota ativa</p>
        <p className="text-xs text-stone mb-4">
          Use este modo para alunos da consultoria online: cada um conecta o próprio bracelete pelo app dele e entra
          com o código da sala.
        </p>
        <ForestButton onClick={startRoom} icon={Radio} className="w-full">
          Abrir sala remota
        </ForestButton>
      </Card>
    );
  }

  return (
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
          Encerrar sala
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
            <RemoteParticipantCard key={id} presenceInfo={presenceInfo} live={live[id]} student={studentsById[id]} />
          ))}
        </div>
      )}
    </>
  );
}

export default function PersonalLiveSession() {
  const { user, tenant } = useAuth();
  const [mode, setMode] = useState("direct");
  const brandColor = tenant?.brandColor || "#0B5A28";

  return (
    <div className="p-4 md:p-8 max-w-4xl">
      <div className="flex items-center gap-2 mb-1">
        <HeartPulse size={20} className="text-forest" />
        <p className="font-display font-black text-xl text-ink">Monitor de frequência cardíaca ao vivo</p>
      </div>
      <p className="text-sm text-stone mb-5">
        Acompanhe BPM e calorias em tempo real — direto na sua tela para aulas presenciais, ou em sala remota para
        quem treina pela consultoria online.
      </p>

      <div className="flex gap-2 mb-6 border-b border-black/8">
        {[
          { id: "direct", label: "Braceletes neste aparelho" },
          { id: "remote", label: "Sala remota (aluno conecta o próprio)" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setMode(t.id)}
            className={`px-3 py-2.5 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
              mode === t.id ? "border-forest text-forest" : "border-transparent text-stone"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {mode === "direct" ? <DirectMode tenant={tenant} brandColor={brandColor} /> : <RemoteMode user={user} tenant={tenant} />}
    </div>
  );
}
