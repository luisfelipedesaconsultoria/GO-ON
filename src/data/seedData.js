// ============================================================
// SEED DATA — simula o estado inicial do banco de dados
// Estrutura pensada para mapear 1:1 com futuras tabelas do Supabase
// ============================================================

export const seedData = {
  // ---------------- TENANTS (personals que assinam a plataforma) ----------------
  tenants: [
    {
      id: "tenant_1",
      ownerName: "Bruno Castelo",
      appName: "Personal de Sucesso",
      brandColor: "#0B5A28",
      logoUrl: null,
      plan: "trial", // trial | active | canceled
      trialEndsAt: "2026-07-12T00:00:00Z",
      subscriptionPrice: 97,
      createdAt: "2026-06-28T00:00:00Z",
      activeStudents: 24,
    },
  ],

  // ---------------- USERS (login unificado: admin / personal / aluno) ----------------
  users: [
    { id: "user_admin", role: "admin", name: "Administrador", email: "admin@personaldesucesso.app" },
    { id: "user_personal_1", role: "personal", tenantId: "tenant_1", name: "Bruno Castelo", email: "bruno@email.com" },
    { id: "user_aluno_1", role: "aluno", tenantId: "tenant_1", studentId: "student_1", name: "Ana Beatriz", email: "ana@email.com" },
    { id: "user_aluno_2", role: "aluno", tenantId: "tenant_1", studentId: "student_2", name: "Rafael Mendes", email: "rafael@email.com" },
  ],

  // ---------------- STUDENTS ----------------
  students: [
    {
      id: "student_1",
      tenantId: "tenant_1",
      name: "Ana Beatriz",
      initials: "AB",
      email: "ana@email.com",
      phone: "(85) 99100-1234",
      age: 27,
      modality: "musc", // musc | run | both
      level: "intermediario",
      status: "on-track", // on-track | attention | achievement
      adherence: 92,
      subscriptionStatus: "active", // active | overdue | blocked
      currentStreak: 12,
      muscPhase: "Hipertrofia · Semana 6/12",
      runningPhase: "Base · Semana 3/8",
      phase: "Hipertrofia · Semana 6/12",
      lastSessionAt: "2026-06-28T07:00:00Z",
      alert: null,
      joinedAt: "2026-04-01T00:00:00Z",
      anamnesis: {
        injuries: "Nenhuma relatada",
        healthConditions: "Nenhuma",
        trainingHistory: "2 anos de musculação",
        surgeries: "Nenhuma",
        availability: "5x/semana · academia completa",
        intensityTolerance: "Boa — já fez treinos de alta intensidade sem problemas",
      },
      assessments: {
        oneRM: { supino: 62, agachamento: 78, terra: 95 },
        bodyFat: 22.8,
        weight: 64.2,
        lastAssessmentAt: "2026-06-16T00:00:00Z",
      },
    },
    {
      id: "student_2",
      tenantId: "tenant_1",
      name: "Rafael Mendes",
      initials: "RM",
      email: "rafael@email.com",
      phone: "(85) 99100-5678",
      age: 34,
      modality: "run",
      level: "intermediario",
      status: "attention",
      adherence: 68,
      subscriptionStatus: "active",
      currentStreak: 0,
      muscPhase: null,
      runningPhase: "Build · Semana 4/10",
      phase: "Build · Semana 4/10",
      lastSessionAt: "2026-06-25T06:00:00Z",
      alert: "Faltou 2 treinos esta semana — considerar ajuste de volume",
      joinedAt: "2026-05-01T00:00:00Z",
      anamnesis: {
        injuries: "Nenhuma relatada",
        healthConditions: "Nenhuma",
        trainingHistory: "8 meses de corrida",
        surgeries: "Nenhuma",
        availability: "4x/semana · rua + esteira",
        intensityTolerance: "Moderada",
      },
      assessments: {
        oneRM: null,
        bodyFat: null,
        weight: 81.5,
        lastAssessmentAt: "2026-05-20T00:00:00Z",
        runningPace: { threshold: "5:05/km", maxHR: 187 },
      },
    },
    {
      id: "student_3",
      tenantId: "tenant_1",
      name: "Letícia Costa",
      initials: "LC",
      email: "leticia@email.com",
      phone: "(85) 99100-9012",
      age: 24,
      modality: "both",
      level: "avancado",
      status: "achievement",
      adherence: 100,
      subscriptionStatus: "overdue",
      currentStreak: 28,
      muscPhase: "Força · Semana 3/8",
      runningPhase: "Pico · Semana 2/3",
      phase: "Força · Semana 3/8",
      lastSessionAt: "2026-06-27T18:30:00Z",
      alert: "Bateu recorde pessoal em supino — sugerir progressão",
      joinedAt: "2026-02-15T00:00:00Z",
      anamnesis: {
        injuries: "Tendinite leve no joelho direito (2023) — tratada, sem dor atual",
        healthConditions: "Nenhuma",
        trainingHistory: "4 anos de musculação, 2 anos de corrida",
        surgeries: "Nenhuma",
        availability: "6x/semana · academia completa + rua",
        intensityTolerance: "Alta — atleta amador",
      },
      assessments: {
        oneRM: { supino: 48, agachamento: 90, terra: 105 },
        bodyFat: 19.4,
        weight: 58.0,
        lastAssessmentAt: "2026-06-20T00:00:00Z",
      },
    },
    {
      id: "student_4",
      tenantId: "tenant_1",
      name: "Thiago Gomes",
      initials: "TG",
      email: "thiago@email.com",
      phone: "(85) 99100-3456",
      age: 31,
      modality: "run",
      level: "iniciante",
      status: "on-track",
      adherence: 85,
      subscriptionStatus: "active",
      currentStreak: 5,
      muscPhase: null,
      runningPhase: "Base · Semana 2/6",
      phase: "Base · Semana 2/6",
      lastSessionAt: "2026-06-28T06:15:00Z",
      alert: null,
      joinedAt: "2026-06-01T00:00:00Z",
      anamnesis: {
        injuries: "Nenhuma relatada",
        healthConditions: "Hipertensão controlada com medicação",
        trainingHistory: "Iniciante — começou há 1 mês",
        surgeries: "Nenhuma",
        availability: "3x/semana · rua",
        intensityTolerance: "Baixa — iniciante",
      },
      assessments: {
        oneRM: null,
        bodyFat: 28.1,
        weight: 92.0,
        lastAssessmentAt: "2026-06-05T00:00:00Z",
        runningPace: { threshold: "6:40/km", maxHR: 178 },
      },
    },
  ],

  // ---------------- WORKOUT LIBRARY (templates reutilizáveis) ----------------
  workoutTemplates: [
    {
      id: "tpl_1", tenantId: "tenant_1", modality: "musc", name: "Push A · Peito/Tríceps/Ombro",
      level: "intermediario", uses: 14, isShared: false,
      exercises: [
        { name: "Supino reto barra", sets: 4, reps: "8-10", rir: 2 },
        { name: "Desenvolvimento halteres", sets: 3, reps: "10-12", rir: 2 },
        { name: "Crucifixo unilateral", sets: 3, reps: "12-15", rir: 1 },
        { name: "Tríceps corda", sets: 3, reps: "12-15", rir: 0 },
      ],
    },
    {
      id: "tpl_2", tenantId: "tenant_1", modality: "musc", name: "Pull A · Costas/Bíceps",
      level: "intermediario", uses: 11, isShared: false,
      exercises: [
        { name: "Remada curvada", sets: 4, reps: "8-10", rir: 2 },
        { name: "Puxada alta", sets: 4, reps: "10", rir: 2 },
        { name: "Rosca direta", sets: 3, reps: "12", rir: 1 },
        { name: "Rosca martelo", sets: 3, reps: "14", rir: 0 },
      ],
    },
    {
      id: "tpl_3", tenantId: "tenant_1", modality: "musc", name: "Full Body Iniciante",
      level: "iniciante", uses: 22, isShared: true,
      exercises: [
        { name: "Leg press", sets: 3, reps: "12", rir: 3 },
        { name: "Supino máquina", sets: 3, reps: "12", rir: 3 },
        { name: "Puxada frontal", sets: 3, reps: "12", rir: 3 },
        { name: "Abdominal", sets: 3, reps: "15", rir: 2 },
      ],
    },
    {
      id: "tpl_4", tenantId: "tenant_1", modality: "run", name: "Base aeróbica · Semana 1-4",
      level: "todos", uses: 9, isShared: true,
      exercises: [
        { name: "Rodagem leve Z2", sets: 1, reps: "8km", rir: null },
      ],
    },
    {
      id: "tpl_5", tenantId: "tenant_1", modality: "run", name: "Intervalado 6x800m",
      level: "intermediario", uses: 17, isShared: true,
      exercises: [
        { name: "Aquecimento Z1-Z2", sets: 1, reps: "10min", rir: null },
        { name: "Intervalado 800m", sets: 6, reps: "800m @ Z4", rir: null },
        { name: "Volta à calma", sets: 1, reps: "10min", rir: null },
      ],
    },
  ],

  // ---------------- EXERCISE BANK ----------------
  exerciseBank: [
    {
      id: "ex_1", name: "Rosca Direta", category: "musc", muscleGroup: "Bíceps",
      videoUrl: null,
      explanation: "Mantenha os cotovelos fixos junto ao tronco durante todo o movimento. Suba contraindo o bíceps por 1 segundo no topo e desça controlando por 2-3 segundos.",
      isShared: true,
    },
    {
      id: "ex_2", name: "Supino Reto Barra", category: "musc", muscleGroup: "Peito",
      videoUrl: null,
      explanation: "Escápulas retraídas e levemente depressas durante todo o movimento. Barra desce até tocar levemente o peito, na linha dos mamilos.",
      isShared: true,
    },
    {
      id: "ex_3", name: "Remada Curvada", category: "musc", muscleGroup: "Costas",
      videoUrl: null,
      explanation: "Tronco inclinado a 45°, core contraído. Puxe a barra em direção ao abdômen, levando os cotovelos para trás.",
      isShared: true,
    },
  ],

  // ---------------- ASSIGNED WORKOUTS (plano ativo de cada aluno) ----------------
  assignedWorkouts: {
    student_1: {
      blockName: "Hipertrofia",
      weekNumber: 6,
      totalWeeks: 12,
      weekPlan: [
        { day: "SEG", title: "Peito + Tríceps", done: true },
        { day: "TER", title: "Cardio leve", done: true },
        { day: "QUA", title: "Costas + Bíceps", done: false, today: true },
        { day: "QUI", title: "Descanso", done: false },
        { day: "SEX", title: "Pernas", done: false },
        { day: "SAB", title: "Ombros + Core", done: false },
        { day: "DOM", title: "Descanso", done: false },
      ],
      todayWorkout: {
        title: "Costas + Bíceps",
        exercises: [
          { id: "we_1", name: "Remada Curvada", sets: [{ load: 75, reps: 10, rir: 2, done: true }, { load: 75, reps: 10, rir: 1, done: true }, { load: 75, reps: 9, rir: 1, done: true }, { load: 75, reps: 8, rir: 0, done: true }], explanation: "Tronco inclinado a 45°, core contraído. Puxe a barra em direção ao abdômen, levando os cotovelos para trás.", done: true },
          { id: "we_2", name: "Puxada Alta", sets: [{ load: 65, reps: 10, rir: 2, done: true }, { load: 65, reps: 10, rir: 1, done: true }, { load: 65, reps: 9, rir: 1, done: true }, { load: 65, reps: 8, rir: 0, done: true }], explanation: "Pegada um pouco mais larga que os ombros. Puxe levando os cotovelos para baixo e para trás, sem balançar o tronco.", done: true },
          { id: "we_3", name: "Rosca Direta", sets: [{ load: 20, reps: 12, rir: 2, done: false }, { load: 20, reps: 12, rir: 1, done: false }, { load: 20, reps: 10, rir: 0, done: false }], explanation: "Mantenha os cotovelos fixos junto ao tronco durante todo o movimento. Suba contraindo o bíceps por 1 segundo no topo e desça controlando por 2-3 segundos.", done: false, current: true },
          { id: "we_4", name: "Remada Unilateral", sets: [{ load: 28, reps: 12, rir: 2, done: false }, { load: 28, reps: 12, rir: 1, done: false }, { load: 28, reps: 10, rir: 1, done: false }], explanation: "Apoie um joelho e uma mão no banco. Puxe o halter levando o cotovelo para cima, mantendo o tronco estável.", done: false },
          { id: "we_5", name: "Rosca Martelo", sets: [{ load: 16, reps: 14, rir: 2, done: false }, { load: 16, reps: 14, rir: 1, done: false }, { load: 16, reps: 12, rir: 0, done: false }], explanation: "Pegada neutra (palmas voltadas uma para a outra). Suba sem girar o punho, focando no braquial.", done: false },
        ],
      },
    },
  },

  // ---------------- PERIODIZATION PROPOSALS (geradas por IA, pendentes de aprovação) ----------------
  periodizationProposals: [],

  // ---------------- VIDEO REVIEW QUEUE ----------------
  videoReviewQueue: [
    {
      id: "vr_1", studentId: "student_1", studentName: "Ana Beatriz", exerciseName: "Rosca Direta",
      submittedAt: "2026-06-28T07:40:00Z", status: "pending",
      aiAnalysis: "Cotovelo direito se desloca para frente na última repetição da série 3, indicando possível compensação por fadiga. Amplitude de movimento está adequada nas demais.",
    },
  ],

  // ---------------- CHAT MESSAGES ----------------
  chatThreads: {
    student_1: [
      { id: "m1", from: "student", text: "Posso fazer a rosca direta com pegada mais aberta?", at: "2026-06-27T19:00:00Z", aiHandled: true, aiResponse: "Sim! Pegada mais aberta enfatiza um pouco mais a porção curta do bíceps. Mantenha os cotovelos fixos do mesmo jeito." },
      { id: "m2", from: "student", text: "Senti uma dor estranha no ombro durante o supino hoje", at: "2026-06-28T07:15:00Z", aiHandled: false, escalated: true, urgency: "high" },
    ],
  },

  // ---------------- WORKOUT FEEDBACK HISTORY ----------------
  workoutFeedback: [
    { id: "wf_1", studentId: "student_1", date: "2026-06-26", rating: 5, energy: 4, pain: false, notes: null },
    { id: "wf_2", studentId: "student_1", date: "2026-06-24", rating: 4, energy: 3, pain: false, notes: null },
  ],

  // ---------------- FINANCIAL ----------------
  financial: {
    tenant_1: {
      monthlyRevenue: 23840,
      monthlyGrowth: 18,
      monthlySubscriptions: 18800,
      monthlyConsulting: 5040,
      fixedCosts: 2100,
      netProfit: 21740,
      recentEntries: [
        { id: "f1", type: "income", label: "Mensalidade — Ana Beatriz", amount: 400, date: "2026-06-28" },
        { id: "f2", type: "income", label: "Consultoria online — Letícia", amount: 420, date: "2026-06-27" },
        { id: "f3", type: "expense", label: "Aluguel da sala", amount: -900, date: "2026-06-01" },
      ],
    },
  },
};