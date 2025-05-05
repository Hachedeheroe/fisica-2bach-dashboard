import { ClerkProvider } from '@clerk/clerk-react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Routes } from '@/routes';
import { queryClient } from '@/config/tanstack-query';

// Obtener la clave de API de las variables de entorno
const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

export function App() {
  return (
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes />
          <Toaster />
        </Router>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ClerkProvider>
  );
}