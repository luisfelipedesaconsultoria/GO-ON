import { supabase } from "./supabase";

const mapTenant = (t) =>
  t
    ? {
        id: t.id,
        ownerName: t.owner_name,
        appName: t.app_name,
        brandColor: t.brand_color,
        logoUrl: t.logo_url,
        plan: t.plan,
        trialEndsAt: t.trial_ends_at,
        subscriptionPrice: t.subscription_price,
        activeStudents: t.active_students,
        createdAt: t.created_at,
      }
    : null;
const mapUser = (u) =>
  u
    ? {
        id: u.id,
        role: u.role,
        tenantId: u.tenant_id,
        studentId: u.student_id,
        name: u.name,
        email: u.email,
      }
    : null;
const mapStudent = (s) =>
  s
    ? {
        id: s.id,
        tenantId: s.tenant_id,
        name: s.name,
        initials: s.initials,
        email: s.email,
        phone: s.phone,
        age: s.age,
        modality: s.modality,
        level: s.level,
        status: s.status,
        adherence: s.adherence,
        subscriptionStatus: s.subscription_status,
        currentStreak: s.current_streak,
        muscPhase: s.musc_phase,
        runningPhase: s.running_phase,
        phase: s.phase,
        lastSessionAt: s.last_session_at,
        alert: s.alert,
        anamnesis: s.anamnesis || {},
        assessments: s.assessments || {},
        joinedAt: s.joined_at,
      }
    : null;
const mapTemplate = (t) =>
  t
    ? {
        id: t.id,
        tenantId: t.tenant_id,
        modality: t.modality,
        name: t.name,
        level: t.level,
        uses: t.uses,
        isShared: t.is_shared,
        exercises: t.exercises || [],
      }
    : null;
const mapExercise = (e) =>
  e
    ? {
        id: e.id,
        name: e.name,
        category: e.category,
        muscleGroup: e.muscle_group,
        videoUrl: e.video_url,
        explanation: e.explanation,
        isShared: e.is_shared,
      }
    : null;
const mapVideoReview = (v) =>
  v
    ? {
        id: v.id,
        studentId: v.student_id,
        studentName: v.student_name,
        exerciseName: v.exercise_name,
        submittedAt: v.submitted_at,
        status: v.status,
        aiAnalysis: v.ai_analysis,
      }
    : null;
const mapFeedback = (f) =>
  f
    ? {
        id: f.id,
        studentId: f.student_id,
        rating: f.rating,
        energy: f.energy,
        pain: f.pain,
        notes: f.notes,
        date: f.date,
      }
    : null;
const mapMessage = (m) =>
  m
    ? {
        id: m.id,
        from: m.from_role,
        text: m.text,
        aiHandled: m.ai_handled,
        aiResponse: m.ai_response,
        escalated: m.escalated,
        at: m.created_at,
      }
    : null;

export async function getUserByEmail(email) {
  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();
  return mapUser(data);
}

export async function getTenantById(id) {
  const { data } = await supabase
    .from("tenants")
    .select("*")
    .eq("id", id)
    .single();
  return mapTenant(data);
}

export async function getAllTenants() {
  const { data } = await supabase
    .from("tenants")
    .select("*")
    .order("created_at");
  return (data || []).map(mapTenant);
}

export async function updateTenant(id, updates) {
  const mapped = {};
  if (updates.appName !== undefined) mapped.app_name = updates.appName;
  if (updates.brandColor !== undefined) mapped.brand_color = updates.brandColor;
  if (updates.logoUrl !== undefined) mapped.logo_url = updates.logoUrl;
  const { data } = await supabase
    .from("tenants")
    .update(mapped)
    .eq("id", id)
    .select()
    .single();
  return mapTenant(data);
}

export async function getStudents(tenantId) {
  const { data } = await supabase
    .from("students")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("name");
  return (data || []).map(mapStudent);
}

export async function getStudent(studentId) {
  const { data } = await supabase
    .from("students")
    .select("*")
    .eq("id", studentId)
    .single();
  return mapStudent(data);
}

export async function createStudent(tenantId, studentData) {
  const { data } = await supabase
    .from("students")
    .insert({
      tenant_id: tenantId,
      name: studentData.name,
      initials: studentData.initials,
      email: studentData.email,
      phone: studentData.phone,
      age: studentData.age,
      modality: studentData.modality || "musc",
      level: studentData.level || "intermediario",
      phase: studentData.phase,
      musc_phase: studentData.muscPhase,
      running_phase: studentData.runningPhase,
      anamnesis: studentData.anamnesis || {},
      assessments: studentData.assessments || {},
    })
    .select()
    .single();
  return mapStudent(data);
}

export async function updateStudent(studentId, updates) {
  const mapped = {};
  if (updates.subscriptionStatus !== undefined)
    mapped.subscription_status = updates.subscriptionStatus;
  if (updates.status !== undefined) mapped.status = updates.status;
  if (updates.adherence !== undefined) mapped.adherence = updates.adherence;
  if (updates.currentStreak !== undefined)
    mapped.current_streak = updates.currentStreak;
  if (updates.alert !== undefined) mapped.alert = updates.alert;
  const { data } = await supabase
    .from("students")
    .update(mapped)
    .eq("id", studentId)
    .select()
    .single();
  return mapStudent(data);
}

export async function getWorkoutTemplates(tenantId, modality) {
  let query = supabase.from("workout_templates").select("*");
  if (modality) query = query.eq("modality", modality);
  if (tenantId) query = query.or(`tenant_id.eq.${tenantId},is_shared.eq.true`);
  else query = query.eq("is_shared", true);
  const { data } = await query.order("name");
  return (data || []).map(mapTemplate);
}

export async function duplicateWorkoutTemplate(templateId) {
  const { data: orig } = await supabase
    .from("workout_templates")
    .select("*")
    .eq("id", templateId)
    .single();
  if (!orig) return null;
  const { data } = await supabase
    .from("workout_templates")
    .insert({
      tenant_id: orig.tenant_id,
      modality: orig.modality,
      name: orig.name + " (cópia)",
      level: orig.level,
      exercises: orig.exercises,
      is_shared: false,
    })
    .select()
    .single();
  return mapTemplate(data);
}

export async function assignTemplateToStudents(templateId, studentIds) {
  return true;
}

export async function getExerciseBank(tenantId) {
  let query = supabase.from("exercises").select("*");
  if (tenantId) query = query.or(`tenant_id.eq.${tenantId},is_shared.eq.true`);
  else query = query.eq("is_shared", true);
  const { data } = await query.order("name");
  return (data || []).map(mapExercise);
}

export async function getAssignedWorkout(studentId) {
  const { data } = await supabase
    .from("assigned_workouts")
    .select("*")
    .eq("student_id", studentId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();
  if (!data) return null;
  return {
    blockName: data.block_name,
    weekNumber: data.week_number,
    totalWeeks: data.total_weeks,
    weekPlan: data.week_plan || [],
    todayWorkout: data.today_workout || {},
  };
}

export async function updateExerciseSet(
  studentId,
  exerciseId,
  setIndex,
  setData
) {
  const { data: workout } = await supabase
    .from("assigned_workouts")
    .select("*")
    .eq("student_id", studentId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();
  if (!workout) return;
  const todayWorkout = workout.today_workout || {};
  const exercises = todayWorkout.exercises || [];
  const exIdx = exercises.findIndex((e) => e.id === exerciseId);
  if (exIdx === -1) return;
  exercises[exIdx].sets[setIndex] = {
    ...exercises[exIdx].sets[setIndex],
    ...setData,
  };
  todayWorkout.exercises = exercises;
  await supabase
    .from("assigned_workouts")
    .update({ today_workout: todayWorkout })
    .eq("id", workout.id);
}

export async function completeExercise(studentId, exerciseId) {
  const { data: workout } = await supabase
    .from("assigned_workouts")
    .select("*")
    .eq("student_id", studentId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();
  if (!workout) return;
  const todayWorkout = workout.today_workout || {};
  const exercises = todayWorkout.exercises || [];
  const exIdx = exercises.findIndex((e) => e.id === exerciseId);
  if (exIdx === -1) return;
  exercises[exIdx].done = true;
  const nextIdx = exercises.findIndex((e, i) => i > exIdx && !e.done);
  if (nextIdx !== -1) exercises[nextIdx].current = true;
  todayWorkout.exercises = exercises;
  await supabase
    .from("assigned_workouts")
    .update({ today_workout: todayWorkout })
    .eq("id", workout.id);
}

export async function createPeriodizationProposal(
  studentId,
  blocks,
  reasoning
) {
  const { data: student } = await supabase
    .from("students")
    .select("tenant_id")
    .eq("id", studentId)
    .single();
  const { data } = await supabase
    .from("periodization_proposals")
    .insert({
      student_id: studentId,
      tenant_id: student?.tenant_id,
      blocks,
      reasoning,
      status: "pending",
    })
    .select()
    .single();
  return data;
}

export async function approvePeriodization(proposalId) {
  await supabase
    .from("periodization_proposals")
    .update({ status: "approved" })
    .eq("id", proposalId);
  return true;
}

export async function getVideoReviewQueue(tenantId) {
  const { data } = await supabase
    .from("video_review_queue")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("submitted_at", { ascending: false });
  return (data || []).map(mapVideoReview);
}

export async function submitVideoForReview(studentId, exerciseName) {
  const { data: student } = await supabase
    .from("students")
    .select("tenant_id, name")
    .eq("id", studentId)
    .single();
  await supabase.from("video_review_queue").insert({
    student_id: studentId,
    tenant_id: student?.tenant_id,
    student_name: student?.name,
    exercise_name: exerciseName,
    status: "pending",
    ai_analysis: "Análise em processamento...",
  });
}

export async function resolveVideoReview(reviewId, status = "approved") {
  await supabase
    .from("video_review_queue")
    .update({ status })
    .eq("id", reviewId);
}

export async function getChatThread(studentId) {
  const { data } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("student_id", studentId)
    .order("created_at");
  return (data || []).map(mapMessage);
}

export async function sendChatMessage(studentId, text, fromRole) {
  const { data: student } = await supabase
    .from("students")
    .select("tenant_id")
    .eq("id", studentId)
    .single();
  const painKeywords = ["dor", "doendo", "machucou", "lesão", "lesao", "torci"];
  const escalated = painKeywords.some((k) => text.toLowerCase().includes(k));
  const aiHandled = !escalated;
  const aiResponse = aiHandled
    ? "Mensagem recebida. Respondendo em breve."
    : null;
  await supabase.from("chat_messages").insert({
    student_id: studentId,
    tenant_id: student?.tenant_id,
    from_role: fromRole,
    text,
    escalated,
    ai_handled: aiHandled,
    ai_response: aiResponse,
  });
}

export async function getWorkoutFeedbackHistory(studentId) {
  const { data } = await supabase
    .from("workout_feedback")
    .select("*")
    .eq("student_id", studentId)
    .order("date", { ascending: false })
    .limit(10);
  return (data || []).map(mapFeedback);
}

export async function submitWorkoutFeedback(studentId, feedback) {
  await supabase.from("workout_feedback").insert({
    student_id: studentId,
    rating: feedback.rating,
    energy: feedback.energy,
    pain: feedback.pain,
  });
  await supabase
    .from("students")
    .update({ last_session_at: new Date() })
    .eq("id", studentId);
}

const mapHRSession = (h) =>
  h
    ? {
        id: h.id,
        studentId: h.student_id,
        mode: h.mode,
        roomCode: h.room_code,
        deviceName: h.device_name,
        avgBpm: h.avg_bpm,
        maxBpm: h.max_bpm,
        minBpm: h.min_bpm,
        calories: h.calories,
        durationSec: h.duration_sec,
        createdAt: h.created_at,
      }
    : null;

// Salva o resumo de uma sessão de monitoramento cardíaco (individual ou em turma).
// Requer a tabela `hr_sessions` (ver migração em supabase/migrations). Se ela ainda
// não existir no projeto, falha silenciosamente para não quebrar a experiência ao vivo.
export async function saveHRSession(studentId, tenantId, summary) {
  try {
    await supabase.from("hr_sessions").insert({
      student_id: studentId,
      tenant_id: tenantId,
      mode: summary.mode || "individual",
      room_code: summary.roomCode || null,
      device_name: summary.deviceName,
      avg_bpm: summary.avgBpm,
      max_bpm: summary.maxBpm,
      min_bpm: summary.minBpm,
      calories: summary.calories,
      duration_sec: summary.durationSec,
    });
  } catch (e) {
    console.warn("Não foi possível salvar a sessão de frequência cardíaca:", e.message);
  }
}

export async function getHRSessionHistory(studentId) {
  try {
    const { data, error } = await supabase
      .from("hr_sessions")
      .select("*")
      .eq("student_id", studentId)
      .order("created_at", { ascending: false })
      .limit(20);
    if (error) throw error;
    return (data || []).map(mapHRSession);
  } catch (e) {
    console.warn("Não foi possível carregar o histórico de frequência cardíaca:", e.message);
    return [];
  }
}

export async function getFinancials(tenantId) {
  const { data: entries } = await supabase
    .from("financial_entries")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("date", { ascending: false })
    .limit(10);
  const income = (entries || [])
    .filter((e) => e.type === "income")
    .reduce((acc, e) => acc + e.amount, 0);
  const expenses = (entries || [])
    .filter((e) => e.type === "expense")
    .reduce((acc, e) => acc + Math.abs(e.amount), 0);
  return {
    monthlyRevenue: income,
    monthlyGrowth: 18,
    monthlySubscriptions: Math.round(income * 0.79),
    monthlyConsulting: Math.round(income * 0.21),
    fixedCosts: expenses,
    netProfit: income - expenses,
    recentEntries: (entries || []).map((e) => ({
      id: e.id,
      type: e.type,
      label: e.label,
      amount: e.amount,
      date: e.date,
    })),
  };
}
