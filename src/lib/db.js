import { seedData } from "../data/seedData";

// ============================================================
// DATABASE LAYER (simulado via localStorage)
//
// Toda função aqui tem uma assinatura pensada para ser substituída
// por uma chamada real ao Supabase no futuro, sem mudar quem a chama.
// Ex: getStudents(tenantId) hoje lê do localStorage; no futuro vira
// um `supabase.from('students').select().eq('tenant_id', tenantId)`.
// ============================================================

const STORAGE_KEY = "personal_sucesso_db_v1";

function loadDB() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error("Erro ao carregar banco local:", e);
  }
  saveDB(seedData);
  return structuredClone(seedData);
}

function saveDB(db) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch (e) {
    console.error("Erro ao salvar banco local:", e);
  }
}

export function resetDB() {
  saveDB(seedData);
  return structuredClone(seedData);
}

// ---------------- TENANTS ----------------

export function getTenant(tenantId) {
  const db = loadDB();
  return db.tenants.find((t) => t.id === tenantId) || null;
}

export function getAllTenants() {
  const db = loadDB();
  return db.tenants;
}

export function updateTenant(tenantId, patch) {
  const db = loadDB();
  db.tenants = db.tenants.map((t) => (t.id === tenantId ? { ...t, ...patch } : t));
  saveDB(db);
  return db.tenants.find((t) => t.id === tenantId);
}

// ---------------- AUTH (simulado) ----------------

export function getUserByEmail(email) {
  const db = loadDB();
  return db.users.find((u) => u.email === email) || null;
}

export function getUserById(userId) {
  const db = loadDB();
  return db.users.find((u) => u.id === userId) || null;
}

// ---------------- STUDENTS ----------------

export function getStudents(tenantId) {
  const db = loadDB();
  return db.students.filter((s) => s.tenantId === tenantId);
}

export function getStudent(studentId) {
  const db = loadDB();
  return db.students.find((s) => s.id === studentId) || null;
}

export function updateStudent(studentId, patch) {
  const db = loadDB();
  db.students = db.students.map((s) => (s.id === studentId ? { ...s, ...patch } : s));
  saveDB(db);
  return db.students.find((s) => s.id === studentId);
}

export function createStudent(tenantId, data) {
  const db = loadDB();
  const id = `student_${Date.now()}`;
  const newStudent = {
    id,
    tenantId,
    status: "on-track",
    adherence: 0,
    subscriptionStatus: "active",
    currentStreak: 0,
    alert: null,
    joinedAt: new Date().toISOString(),
    assessments: {},
    anamnesis: {},
    ...data,
  };
  db.students.push(newStudent);
  saveDB(db);
  return newStudent;
}

// ---------------- WORKOUT TEMPLATES (banco de treinos) ----------------

export function getWorkoutTemplates(tenantId, modality = null) {
  const db = loadDB();
  return db.workoutTemplates.filter(
    (t) => (t.tenantId === tenantId || t.isShared) && (!modality || t.modality === modality)
  );
}

export function createWorkoutTemplate(tenantId, data) {
  const db = loadDB();
  const id = `tpl_${Date.now()}`;
  const tpl = { id, tenantId, uses: 0, isShared: false, ...data };
  db.workoutTemplates.push(tpl);
  saveDB(db);
  return tpl;
}

export function duplicateWorkoutTemplate(templateId) {
  const db = loadDB();
  const original = db.workoutTemplates.find((t) => t.id === templateId);
  if (!original) return null;
  const copy = { ...original, id: `tpl_${Date.now()}`, name: `${original.name} (cópia)`, uses: 0, isShared: false };
  db.workoutTemplates.push(copy);
  saveDB(db);
  return copy;
}

export function assignTemplateToStudents(templateId, studentIds) {
  const db = loadDB();
  const tpl = db.workoutTemplates.find((t) => t.id === templateId);
  if (!tpl) return null;
  tpl.uses += studentIds.length;
  saveDB(db);
  return { template: tpl, assignedTo: studentIds };
}

// ---------------- ASSIGNED WORKOUTS (plano ativo do aluno) ----------------

export function getAssignedWorkout(studentId) {
  const db = loadDB();
  return db.assignedWorkouts[studentId] || null;
}

export function updateExerciseSet(studentId, exerciseId, setIndex, patch) {
  const db = loadDB();
  const workout = db.assignedWorkouts[studentId];
  if (!workout) return null;
  const exercise = workout.todayWorkout.exercises.find((e) => e.id === exerciseId);
  if (!exercise) return null;
  exercise.sets[setIndex] = { ...exercise.sets[setIndex], ...patch };
  saveDB(db);
  return exercise;
}

export function completeExercise(studentId, exerciseId) {
  const db = loadDB();
  const workout = db.assignedWorkouts[studentId];
  if (!workout) return null;
  const exercises = workout.todayWorkout.exercises;
  const idx = exercises.findIndex((e) => e.id === exerciseId);
  if (idx === -1) return null;
  exercises[idx].done = true;
  exercises[idx].current = false;
  if (exercises[idx + 1]) exercises[idx + 1].current = true;
  saveDB(db);
  return workout;
}

// ---------------- PERIODIZATION (geração + aprovação) ----------------

export function createPeriodizationProposal(studentId, blocks, reasoning) {
  const db = loadDB();
  const proposal = {
    id: `prop_${Date.now()}`,
    studentId,
    blocks,
    reasoning,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  db.periodizationProposals.push(proposal);
  saveDB(db);
  return proposal;
}

export function approvePeriodization(proposalId) {
  const db = loadDB();
  const proposal = db.periodizationProposals.find((p) => p.id === proposalId);
  if (!proposal) return null;
  proposal.status = "approved";
  saveDB(db);
  return proposal;
}

// ---------------- VIDEO REVIEW ----------------

export function getVideoReviewQueue(tenantId) {
  const db = loadDB();
  const studentIds = db.students.filter((s) => s.tenantId === tenantId).map((s) => s.id);
  return db.videoReviewQueue.filter((v) => studentIds.includes(v.studentId));
}

export function submitVideoForReview(studentId, exerciseName) {
  const db = loadDB();
  const student = db.students.find((s) => s.id === studentId);
  const entry = {
    id: `vr_${Date.now()}`,
    studentId,
    studentName: student?.name || "Aluno",
    exerciseName,
    submittedAt: new Date().toISOString(),
    status: "pending",
    aiAnalysis: "Análise sendo processada — em produção, a IA examinaria amplitude de movimento, alinhamento articular e tempo de execução.",
  };
  db.videoReviewQueue.push(entry);
  saveDB(db);
  return entry;
}

export function resolveVideoReview(reviewId, decision, comment) {
  const db = loadDB();
  const entry = db.videoReviewQueue.find((v) => v.id === reviewId);
  if (!entry) return null;
  entry.status = decision; // 'approved' | 'needs_retry'
  entry.personalComment = comment;
  saveDB(db);
  return entry;
}

// ---------------- CHAT ----------------

export function getChatThread(studentId) {
  const db = loadDB();
  return db.chatThreads[studentId] || [];
}

export function sendChatMessage(studentId, text, from = "student") {
  const db = loadDB();
  if (!db.chatThreads[studentId]) db.chatThreads[studentId] = [];

  // Classificação simples de risco — simula a triagem da IA
  const riskKeywords = ["dor", "lesão", "machuquei", "estalo", "inchaço", "travou"];
  const isRisky = riskKeywords.some((k) => text.toLowerCase().includes(k));

  const message = {
    id: `m_${Date.now()}`,
    from,
    text,
    at: new Date().toISOString(),
    aiHandled: !isRisky,
    escalated: isRisky,
    urgency: isRisky ? "high" : "low",
    aiResponse: isRisky
      ? null
      : "Entendido! Em termos de execução, o mais importante é manter o controle do movimento. Se quiser, posso detalhar a técnica desse exercício.",
  };
  db.chatThreads[studentId].push(message);
  saveDB(db);
  return message;
}

// ---------------- WORKOUT FEEDBACK ----------------

export function submitWorkoutFeedback(studentId, feedback) {
  const db = loadDB();
  const entry = {
    id: `wf_${Date.now()}`,
    studentId,
    date: new Date().toISOString().split("T")[0],
    ...feedback,
  };
  db.workoutFeedback.push(entry);
  saveDB(db);
  return entry;
}

export function getWorkoutFeedbackHistory(studentId) {
  const db = loadDB();
  return db.workoutFeedback.filter((f) => f.studentId === studentId);
}

// ---------------- FINANCIAL ----------------

export function getFinancials(tenantId) {
  const db = loadDB();
  return db.financial[tenantId] || null;
}

// ---------------- EXERCISE BANK ----------------

export function getExerciseBank(tenantId) {
  const db = loadDB();
  return db.exerciseBank.filter((e) => e.isShared || e.tenantId === tenantId);
}
