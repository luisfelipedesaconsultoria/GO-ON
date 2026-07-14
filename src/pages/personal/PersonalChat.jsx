import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getStudents, getChatThread, sendChatMessage } from "../../lib/db";
import { Avatar, Spinner } from "../../components/ui";
import { Send, Sparkles, AlertTriangle, MessageSquare } from "lucide-react";

export default function PersonalChat() {
  const { tenant } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState(null);
  const [thread, setThread] = useState([]);
  const [previews, setPreviews] = useState({});
  const [text, setText] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      const s = await getStudents(tenant.id);
      if (cancelled) return;
      setStudents(s);
      setLoading(false);
      const firstId = s[0]?.id || null;
      setActiveId(firstId);
      const previewEntries = await Promise.all(
        s.map(async (st) => [st.id, await getChatThread(st.id)])
      );
      if (cancelled) return;
      setPreviews(Object.fromEntries(previewEntries));
      if (firstId) setThread(previewEntries.find(([id]) => id === firstId)?.[1] || []);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [tenant.id]);

  const selectStudent = async (id) => {
    setActiveId(id);
    const t = await getChatThread(id);
    setThread(t);
    setPreviews((p) => ({ ...p, [id]: t }));
  };

  const handleSend = async () => {
    if (!text.trim() || !activeId) return;
    await sendChatMessage(activeId, text, "personal");
    const t = await getChatThread(activeId);
    setThread(t);
    setPreviews((p) => ({ ...p, [activeId]: t }));
    setText("");
  };

  const activeStudent = students.find((s) => s.id === activeId);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size={24} />
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <div className="w-72 border-r border-black/8 bg-white overflow-y-auto">
        <div className="p-5 border-b border-black/8">
          <p className="font-display font-black text-lg text-ink">Mensagens</p>
        </div>
        {students.map((s) => {
          const t = previews[s.id] || [];
          const lastMsg = t[t.length - 1];
          const hasEscalation = t.some((m) => m.escalated);
          return (
            <button
              key={s.id}
              onClick={() => selectStudent(s.id)}
              className={`w-full flex items-center gap-3 p-4 text-left border-b border-black/6 ${activeId === s.id ? "bg-black/[0.03]" : ""}`}
            >
              <Avatar initials={s.initials} size={36} color={tenant.brandColor} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-ink truncate">{s.name}</p>
                <p className="text-xs text-stone truncate">{lastMsg?.text || "Sem mensagens"}</p>
              </div>
              {hasEscalation && <AlertTriangle size={14} className="text-coral flex-shrink-0" />}
            </button>
          );
        })}
      </div>

      <div className="flex-1 flex flex-col bg-[#F3F3EE]">
        {activeStudent && (
          <div className="bg-white border-b border-black/8 p-4 flex items-center gap-3">
            <Avatar initials={activeStudent.initials} size={36} color={tenant.brandColor} />
            <p className="font-bold text-sm text-ink">{activeStudent.name}</p>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {thread.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <MessageSquare size={28} className="text-stone mb-2" />
              <p className="text-sm text-stone">Nenhuma mensagem ainda</p>
            </div>
          ) : (
            thread.map((m) => (
              <div key={m.id}>
                <div className={`max-w-md ${m.from === "personal" ? "ml-auto" : ""}`}>
                  <div
                    className={`rounded-2xl px-4 py-3 text-sm ${m.from === "personal" ? "bg-ink text-white" : "bg-white border border-black/8 text-ink"}`}
                  >
                    {m.text}
                  </div>
                  {m.aiHandled && m.aiResponse && (
                    <div className="mt-1.5 ml-2 flex gap-2 items-start max-w-md">
                      <Sparkles size={12} className="text-forest flex-shrink-0 mt-1" />
                      <p className="text-xs text-stone bg-[#E3F0E6] rounded-xl px-3 py-2">{m.aiResponse}</p>
                    </div>
                  )}
                  {m.escalated && (
                    <div className="mt-1.5 ml-2 flex gap-2 items-start max-w-md">
                      <AlertTriangle size={12} className="text-coral flex-shrink-0 mt-1" />
                      <p className="text-xs text-coral font-bold">
                        Mensagem sobre dor/desconforto — escalada para sua revisão direta, a IA não respondeu automaticamente.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="bg-white border-t border-black/8 p-4 flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Escreva uma mensagem..."
            className="flex-1 border-2 border-black/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-forest"
          />
          <button onClick={handleSend} className="bg-forest text-white rounded-xl px-4 flex items-center justify-center">
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
