import { createClient } from "@supabase/supabase-js";

// Fallback para a URL e a chave pública (anon) do projeto Supabase —
// seguro expor no client, é exatamente para isso que essa chave existe
// (o controle de acesso real fica nas policies de RLS do banco).
// Definir VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY nas variáveis de
// ambiente do provedor de deploy sempre tem prioridade sobre este fallback.
const FALLBACK_SUPABASE_URL = "https://cplqtzfelzlzjtoxwkss.supabase.co";
const FALLBACK_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwbHF0emZlbHpsemp0b3h3a3NzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMwMDU3NDYsImV4cCI6MjA5ODU4MTc0Nn0.Pn-ay2V0u4Y4UAhXbo7mNsvS1JgmvY36pMr02a82cVI";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || FALLBACK_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_ANON_KEY;
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
