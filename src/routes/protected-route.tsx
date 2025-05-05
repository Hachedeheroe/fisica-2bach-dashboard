import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

export function ProtectedRoute() {
  // Blueprint: Componente que protege rutas que requieren autenticación
  // Usa Clerk para verificar si el usuario está autenticado
  
  const { isSignedIn, isLoaded } = useAuth();

  // Esperar a que se cargue el estado de autenticación
  if (!isLoaded) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // Redirigir a login si no está autenticado
  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  // Renderizar la ruta protegida
  return <Outlet />;
}