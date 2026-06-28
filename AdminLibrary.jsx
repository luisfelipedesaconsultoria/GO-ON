import React from "react";
import { getExerciseBank } from "../../lib/db";
import { Card } from "../../components/ui";
import { Plus, Dumbbell } from "lucide-react";

export default function AdminLibrary() {
  const exercises = getExerciseBank(null);

  return (
    <div className="p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-1">
        <p className="font-display font-black text-2xl text-ink">Banco compartilhado</p>
        <button className="flex items-center gap-2 bg-forest text-white rounded-xl px-4 py-2.5 text-sm font-bold">
          <Plus size={15} /> Novo exercício base
        </button>
      </div>
      <p className="text-sm text-stone mb-7">
        Exercícios disponíveis para todos os personals da plataforma. Exercícios criados por um personal individual ficam isolados na conta dele e não aparecem aqui.
      </p>

      <div className="grid grid-cols-3 gap-4">
        {exercises.map((ex) => (
          <Card key={ex.id} className="p-4">
            <div className="w-10 h-10 rounded-xl bg-[#F0F0EB] flex items-center justify-center mb-3">
              <Dumbbell size={18} className="text-forest" />
            </div>
            <p className="font-bold text-sm text-ink">{ex.name}</p>
            <p className="text-xs text-stone mb-2">{ex.muscleGroup}</p>
            <p className="text-xs text-stone leading-relaxed line-clamp-3">{ex.explanation}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
