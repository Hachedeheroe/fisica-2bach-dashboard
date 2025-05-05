import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { useAuthStore } from '@/store/use-auth-store';

export function useAuthRedirect(redirectPath: string = '/dashboard') {
  // Blueprint: Hook para redireccionar según estado de autenticación
  // Útil para redirigir a usuarios ya autenticados desde páginas de login
  
  const navigate = useNavigate();
  const { isSignedIn, isLoaded } = useAuth();
  const { setLastActive } = useAuthStore();
  
  useEffect(() => {
    // Esperar a que Clerk cargue el estado de autenticación
    if (!isLoaded) return;
    
    // Si el usuario está autenticado, actualizar tiempo y redirigir
    if (isSignedIn) {
      setLastActive(new Date().toISOString());
      navigate(redirectPath, { replace: true });
    }
  }, [isSignedIn, isLoaded, navigate, redirectPath, setLastActive]);
  
  return { isSignedIn, isLoaded };
}