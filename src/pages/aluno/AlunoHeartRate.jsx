import React, { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Users, LogOut } from "lucide-react";
import HeartRateWidget from "../../components/HeartRateWidget";
import BlockedScreen from "./BlockedScreen";
import { saveHRSession, getHRSessionHistory } from "../../lib/db";
import { joinHRRoom, leaveHRRoom, broadcastHR } from "../../lib/liveHRSession";
import { useAuth } from "../../hooks/useAuth";

export default function AlunoHeartRate() {
  const { student, isBlocked, brandColor, colors } = useOutletContext();
  const { user, tenant } = useAuth();
  const [roomCodeInput, setRoomCodeInput] = useState("");
  const [room, setRoom] = useState(null); // { code, channel }
  const [history, setHistory] = useState([]);
  const [gender, setGender] = useState(() => localStorage.getItem(`hr_gender_${student?.id}`) || "male");
  const channelRef = useRef(null);

  useEffect(() => {
    if (!student) return;
    getHRSessionHistory(student.id).then(setHistory);
  }, [student]);

  useEffect(() => () => leaveHRRoom(channelRef.current), []);

  if (isBlocked) return <BlockedScreen student={student} brandColor={brandColor} colors={colors} />;

  const weightKg = student.assessments?.weight;
  const age = student.age;

  const setGenderPersisted = (g) => {
    setGender(g);
    localStorage.setItem(`hr_gender_${student.id}`, g);
  };

  const handleJoinRoom = () => {
    const code = roomCodeInput.trim().toUpperCase();
    if (!code || !tenant) return;
    const channel = joinHRRoom({
      tenantId: tenant.id,
      code,
      participant: { id: student.id, name: student.name, initials: student.initials },
    });
    channelRef.current = channel;
    setRoom({ code });
  };

  const handleLeaveRoom = () => {
    leaveHRRoom(channelRef.current);
    channelRef.current = null;
    setRoom(null);
  };

  const handleTick = (data) => {
    if (channelRef.current) broadcastHR(channelRef.current, student.id, data);
  };

  const handleSessionEnd = async (summary) => {
    await saveHRSession(student.id, tenant?.id, { ...summary, mode: room ? "team" : "individual", roomCode: room?.code });
    getHRSessionHistory(student.id).then(setHistory);
  };

  return (
    <div className="px-5 pt-4 pb-6 page-enter">
      <p className="text-ink font-black text-xl mb-1">Frequência cardíaca</p>
      <p className="text-xs text-stone mb-5">Conecte seu bracelete Bluetooth para acompanhar BPM e calorias ao vivo.</p>

      <HeartRateWidget
        weightKg={weightKg}
        age={age}
        gender={gender}
        brandColor={brandColor}
        onTick={handleTick}
        onSessionEnd={handleSessionEnd}
      />

      <div className="flex items-center gap-2 mt-3 mb-5">
        <span className="text-[11px] font-bold text-stone">Sexo (para cálculo de calorias):</span>
        {["male", "female"].map((g) => (
          <button
            key={g}
            onClick={() => setGenderPersisted(g)}
            className="text-[11px] font-bold px-2.5 py-1 rounded-full"
            style={
              gender === g
                ? { background: colors.highlight, color: brandColor }
                : { background: "#F3F3EE", color: "#6B716C" }
            }
          >
            {g === "male" ? "Masculino" : "Feminino"}
          </button>
        ))}
      </div>

      <div className="rounded-2xl p-4 border mb-5" style={{ background: colors.soft, borderColor: colors.border }}>
        <div className="flex items-center gap-2 mb-2">
          <Users size={15} style={{ color: brandColor }} />
          <p className="text-ink font-bold text-sm">Modo turma / aula em grupo</p>
        </div>
        {room ? (
          <div className="flex items-center justify-between">
            <p className="text-xs text-stone">
              Conectado à sala <span className="font-mono font-bold text-ink">{room.code}</span> — seu personal está vendo
              sua frequência ao vivo.
            </p>
            <button onClick={handleLeaveRoom} className="text-coral flex-shrink-0 ml-2">
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              value={roomCodeInput}
              onChange={(e) => setRoomCodeInput(e.target.value)}
              placeholder="Código da sala (ex: X7K2)"
              maxLength={8}
              className="flex-1 rounded-lg px-3 py-2.5 text-sm font-mono border border-black/10 bg-white uppercase"
            />
            <button
              onClick={handleJoinRoom}
              disabled={!roomCodeInput.trim()}
              className="rounded-lg px-4 py-2.5 text-xs font-bold text-white disabled:opacity-40"
              style={{ background: brandColor }}
            >
              Entrar
            </button>
          </div>
        )}
        <p className="text-[11px] text-stone mt-2 leading-relaxed">
          Peça o código para seu personal — funciona no presencial (aula em grupo) e também com alunos da consultoria
          online treinando ao mesmo tempo.
        </p>
      </div>

      {history.length > 0 && (
        <>
          <p className="text-xs font-bold uppercase tracking-wide text-stone mb-2.5">Últimas sessões</p>
          <div className="space-y-2">
            {history.map((h) => (
              <div
                key={h.id}
                className="rounded-xl p-3.5 flex items-center justify-between border"
                style={{ background: colors.soft, borderColor: colors.border }}
              >
                <div>
                  <p className="text-ink font-bold text-sm">
                    {new Date(h.createdAt).toLocaleDateString("pt-BR")} · {h.mode === "team" ? "Turma" : "Individual"}
                  </p>
                  <p className="text-[11px] text-stone">
                    Média {h.avgBpm ?? "--"}bpm · Máx {h.maxBpm ?? "--"}bpm
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-ink font-mono text-sm">{h.calories ?? 0} kcal</p>
                  <p className="text-[11px] font-mono text-stone">
                    {Math.floor((h.durationSec || 0) / 60)}min
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
