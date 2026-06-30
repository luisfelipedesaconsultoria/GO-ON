import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { getChatThread, sendChatMessage } from "../../lib/db";
import { Send, Sparkles, AlertTriangle, MessageSquare } from "lucide-react";
import BlockedScreen from "./BlockedScreen";

export default function AlunoChat() {
  const { student, isBlocked, brandColor, colors } = useOutletContext();
  const [thread, setThread] = useState(() => getChatThread(student.id));
  const [text, setText] = useState("");

  if (isBlocked) return <BlockedScreen student={student} brandColor={brandColor} colors={colors} />;

  const handleSend = () => {
    if (!text.trim()) return;
    sendChatMessage(student.id, text, "student");
    setThread(getChatThread(student.id));
    setText("");
  };

  return (
    <div className="px-5 pt-4 flex flex-col page-enter" style={{ minHeight: "calc(100vh - 160px)" }}>
      <p className="text-ink font-black text-xl mb-1">Chat</p>
      <p className="text-xs text-stone mb-4">Dúvidas técnicas são respondidas pela IA. Dor ou lesão vai direto para seu personal.</p>

      <div className="flex-1 space-y-3 mb-4 overflow-y-auto">
        {thread.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <MessageSquare size={24} className="text-stone mb-2" />
            <p className="text-sm text-stone">Tire uma dúvida sobre seu treino</p>
          </div>
        ) : (
          thread.map((m) => (
            <div key={m.id}>
              <div className={`max-w-[85%] ${m.from === "student" ? "ml-auto" : ""}`}>
                <div
                  className="rounded-2xl px-4 py-3 text-sm"
                  style={{ background: m.from === "student" ? brandColor : colors.soft, color: m.from === "student" ? "white" : "#0D0F0E" }}
                >
                  {m.text}
                </div>
                {m.aiHandled && m.aiResponse && (
                  <div className="mt-1.5 flex gap-2 items-start">
                    <Sparkles size={12} style={{ color: brandColor }} className="flex-shrink-0 mt-1" />
                    <p className="text-xs text-stone rounded-xl px-3 py-2" style={{ background: colors.highlight }}>{m.aiResponse}</p>
                  </div>
                )}
                {m.escalated && (
                  <div className="mt-1.5 flex gap-2 items-start">
                    <AlertTriangle size={12} className="text-coral flex-shrink-0 mt-1" />
                    <p className="text-xs text-coral">Encaminhado direto para seu personal — ele vai te responder em breve.</p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex gap-2 pb-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Escreva sua dúvida..."
          className="flex-1 rounded-xl px-4 py-3 text-sm text-ink outline-none placeholder:text-stone border"
          style={{ background: colors.soft, borderColor: colors.border }}
        />
        <button onClick={handleSend} className="rounded-xl px-4 flex items-center justify-center" style={{ background: brandColor }}>
          <Send size={16} className="text-white" />
        </button>
      </div>
    </div>
  );
}