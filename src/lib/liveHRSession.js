// ============================================================
// SALA AO VIVO DE FREQUÊNCIA CARDÍACA — modo turma/equipe
// Cada aluno conecta seu próprio bracelete no celular/computador
// dele e transmite o BPM via Supabase Realtime (broadcast + presence).
// Não precisa de tabela no banco: a sala existe só enquanto há gente
// conectada, funciona tanto para aula presencial quanto para
// atendimento online em grupo.
// ============================================================

import { supabase } from "./supabase";

export function generateRoomCode() {
  return Math.random().toString(36).slice(2, 6).toUpperCase();
}

function roomChannelName(tenantId, code) {
  return `hr-room-${tenantId}-${code}`;
}

// participant: { id, name, initials }
export function joinHRRoom({ tenantId, code, participant, onSync, onHRUpdate, onSubscribed }) {
  const channel = supabase.channel(roomChannelName(tenantId, code), {
    config: { presence: { key: participant.id } },
  });

  channel.on("presence", { event: "sync" }, () => {
    onSync?.(channel.presenceState());
  });

  channel.on("broadcast", { event: "hr" }, ({ payload }) => {
    onHRUpdate?.(payload);
  });

  channel.subscribe(async (status) => {
    if (status === "SUBSCRIBED") {
      await channel.track({
        id: participant.id,
        name: participant.name,
        initials: participant.initials,
        joinedAt: Date.now(),
      });
      onSubscribed?.();
    }
  });

  return channel;
}

export function broadcastHR(channel, participantId, data) {
  if (!channel) return;
  channel.send({
    type: "broadcast",
    event: "hr",
    payload: { participantId, ...data, at: Date.now() },
  });
}

export function leaveHRRoom(channel) {
  if (!channel) return;
  channel.untrack();
  supabase.removeChannel(channel);
}
