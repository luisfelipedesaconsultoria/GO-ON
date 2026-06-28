import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";

import Login from "./pages/Login";

import AdminLayout from "./pages/admin/AdminLayout";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminTenants from "./pages/admin/AdminTenants";
import AdminBilling from "./pages/admin/AdminBilling";
import AdminLibrary from "./pages/admin/AdminLibrary";
import AdminSettings from "./pages/admin/AdminSettings";

import PersonalLayout from "./pages/personal/PersonalLayout";
import PersonalDashboard from "./pages/personal/PersonalDashboard";
import PersonalStudents from "./pages/personal/PersonalStudents";
import PersonalStudentNew from "./pages/personal/PersonalStudentNew";
import PersonalStudentDetail from "./pages/personal/PersonalStudentDetail";
import PersonalGeneratePlan from "./pages/personal/PersonalGeneratePlan";
import PersonalWorkoutLibrary from "./pages/personal/PersonalWorkoutLibrary";
import PersonalVideoReview from "./pages/personal/PersonalVideoReview";
import PersonalChat from "./pages/personal/PersonalChat";
import PersonalFinancial from "./pages/personal/PersonalFinancial";
import PersonalSettings from "./pages/personal/PersonalSettings";

import AlunoLayout from "./pages/aluno/AlunoLayout";
import AlunoToday from "./pages/aluno/AlunoToday";
import AlunoExerciseDetail from "./pages/aluno/AlunoExerciseDetail";
import AlunoWorkoutFeedback from "./pages/aluno/AlunoWorkoutFeedback";
import AlunoRunning from "./pages/aluno/AlunoRunning";
import AlunoProgress from "./pages/aluno/AlunoProgress";
import AlunoAssessments from "./pages/aluno/AlunoAssessments";
import AlunoChat from "./pages/aluno/AlunoChat";

function RequireRole({ role, children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  if (user.role !== role) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route path="/admin" element={<RequireRole role="admin"><AdminLayout /></RequireRole>}>
        <Route index element={<AdminOverview />} />
        <Route path="tenants" element={<AdminTenants />} />
        <Route path="billing" element={<AdminBilling />} />
        <Route path="library" element={<AdminLibrary />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      <Route path="/personal" element={<RequireRole role="personal"><PersonalLayout /></RequireRole>}>
        <Route index element={<PersonalDashboard />} />
        <Route path="alunos" element={<PersonalStudents />} />
        <Route path="alunos/novo" element={<PersonalStudentNew />} />
        <Route path="alunos/:studentId" element={<PersonalStudentDetail />} />
        <Route path="alunos/:studentId/gerar-plano" element={<PersonalGeneratePlan />} />
        <Route path="treinos" element={<PersonalWorkoutLibrary />} />
        <Route path="videos" element={<PersonalVideoReview />} />
        <Route path="chat" element={<PersonalChat />} />
        <Route path="financeiro" element={<PersonalFinancial />} />
        <Route path="configuracoes" element={<PersonalSettings />} />
      </Route>

      <Route path="/aluno" element={<RequireRole role="aluno"><AlunoLayout /></RequireRole>}>
        <Route index element={<AlunoToday />} />
        <Route path="exercicio/:exerciseId" element={<AlunoExerciseDetail />} />
        <Route path="feedback-treino" element={<AlunoWorkoutFeedback />} />
        <Route path="corrida" element={<AlunoRunning />} />
        <Route path="progresso" element={<AlunoProgress />} />
        <Route path="avaliacoes" element={<AlunoAssessments />} />
        <Route path="chat" element={<AlunoChat />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
