import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { updateTenant } from "../../lib/db";
import { Card, ForestButton, Logo } from "../../components/ui";
import { Upload, CheckCircle2 } from "lucide-react";

const colors = ["#0B5A28", "#1A3FA0", "#A0224A", "#5C3D99", "#B8650F"];

export default function PersonalSettings() {
  const { tenant } = useAuth();
  const [appName, setAppName] = useState(tenant.appName);
  const [brandColor, setBrandColor] = useState(tenant.brandColor);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateTenant(tenant.id, { appName, brandColor });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    window.location.reload();
  };

  return (
    <div className="p-4 md:p-8 max-w-2xl">
      <p className="font-display font-black text-2xl text-ink mb-1">
        Configurações
      </p>
      <p className="text-sm text-stone mb-7">
        Personalize a marca do seu aplicativo
      </p>

      <Card className="p-5 mb-5">
        <label className="text-xs font-bold text-stone block mb-1.5">
          Nome do app
        </label>
        <input
          value={appName}
          onChange={(e) => setAppName(e.target.value)}
          className="w-full border-2 border-black/10 rounded-xl px-4 py-3 text-sm mb-4 outline-none focus:border-forest"
        />

        <label className="text-xs font-bold text-stone block mb-1.5">
          Logo
        </label>
        <button className="w-full rounded-xl border-2 border-dashed border-black/15 py-6 flex flex-col items-center gap-2 mb-4">
          <Upload size={18} className="text-stone" />
          <span className="text-xs font-bold text-stone">
            Enviar imagem (PNG, 512x512)
          </span>
        </button>

        <label className="text-xs font-bold text-stone block mb-1.5">
          Cor da marca
        </label>
        <div className="grid grid-cols-5 gap-2.5 mb-4">
          {colors.map((c) => (
            <button
              key={c}
              onClick={() => setBrandColor(c)}
              className="aspect-square rounded-full border-4"
              style={{
                background: c,
                borderColor: brandColor === c ? "#0D0F0E" : "transparent",
              }}
            />
          ))}
        </div>

        <p className="text-[11px] text-stone mb-3 leading-relaxed">
          É assim que seus alunos vão ver o app — com sua marca, não a "Personal
          de Sucesso".
        </p>
        <div className="rounded-2xl p-5 bg-white border-2 border-black/8">
          <div className="flex items-center gap-2 mb-4">
            <Logo size={22} color={brandColor} />
            <span className="text-ink font-black text-sm">{appName}</span>
          </div>
          <div className="rounded-2xl p-4" style={{ background: brandColor }}>
            <p className="text-white text-xs font-bold uppercase tracking-wide opacity-70">
              Treino de hoje
            </p>
            <p className="text-white font-black text-lg">Costas + Bíceps</p>
          </div>
        </div>
      </Card>

      <ForestButton onClick={handleSave} icon={CheckCircle2} className="w-full">
        {saved ? "Salvo!" : "Salvar alterações"}
      </ForestButton>
    </div>
  );
}
