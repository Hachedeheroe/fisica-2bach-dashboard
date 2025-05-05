import { Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { PageWrapper } from "@/components/layout/page-wrapper";
import { ProtectedRoute } from "./protected-route";
import { ROUTES } from "@/lib/constants";

// Lazy loading de páginas
import { DashboardPage } from "@/pages/dashboard";
import { ExamsPage } from "@/pages/exams/index";
import { ExamDetailPage } from "@/pages/exams/[id]";
import { ChatPage } from "@/pages/chat";
import { SettingsPage } from "@/pages/settings";

export function Routes() {
  // Blueprint: Configuración de rutas de la aplicación
  // Usa react-router-dom con rutas protegidas por autenticación
  
  const { isSignedIn } = useAuth();

  return (
    <RouterRoutes>
      {/* Redirección inicial */}
      <Route 
        path="/" 
        element={
          isSignedIn ? (
            <Navigate to={ROUTES.DASHBOARD} replace />
          ) : (
            <Navigate to="/sign-in" replace />
          )
        } 
      />
      
      {/* Rutas de autenticación (Clerk) */}
      <Route path="/sign-in/*" element={<div>Sign In</div>} />
      <Route path="/sign-up/*" element={<div>Sign Up</div>} />
      
      {/* Rutas protegidas */}
      <Route element={<ProtectedRoute />}>
        <Route 
          path={ROUTES.DASHBOARD}
          element={
            <PageWrapper>
              <DashboardPage />
            </PageWrapper>
          } 
        />
        <Route 
          path={ROUTES.EXAMS}
          element={
            <PageWrapper>
              <ExamsPage />
            </PageWrapper>
          } 
        />
        <Route 
          path={ROUTES.EXAMS_DETAIL}
          element={
            <PageWrapper>
              <ExamDetailPage />
            </PageWrapper>
          } 
        />
        <Route 
          path={ROUTES.CHAT}
          element={
            <PageWrapper>
              <ChatPage />
            </PageWrapper>
          } 
        />
        <Route 
          path={ROUTES.SETTINGS}
          element={
            <PageWrapper>
              <SettingsPage />
            </PageWrapper>
          } 
        />
      </Route>
      
      {/* Ruta 404 */}
      <Route path="*" element={<div>Página no encontrada</div>} />
    </RouterRoutes>
  );
}