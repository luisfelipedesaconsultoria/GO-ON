import React from "react";
import { Lock } from "lucide-react";

export default function BlockedScreen({ student, brandColor, colors }) {
  return (
    <div className="px-5 pt-16 flex flex-col items-center text-center page-enter">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
        style={{ background: colors?.highlight || "#F3F3EE" }}
      >
        <Lock size={26} style={{ color: brandColor }} />
      </div>
      <p className="text-ink font-black text-xl mb-1.5">Acesso bloqueado</p>
      <p className="text-sm text-stone leading-relaxed max-w-xs">
        {student?.name ? `${student.name.split(" ")[0]}, seu` : "Seu"} pagamento está pendente e o acesso ao app foi
        temporariamente suspenso. Fale com seu personal para regularizar e voltar a acompanhar seus treinos.
      </p>
    </div>
  );
}
