import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Crea un cliente QueryClient para pruebas
export const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0,
      staleTime: 0,
      refetchOnWindowFocus: false,
    },
  },
  logger: {
    log: console.log,
    warn: console.warn,
    error: () => {}, // Silenciar errores en pruebas
  },
});

// Wrapper para componentes que utilizan React Query
export const createWrapper = () => {
  const testQueryClient = createTestQueryClient();
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={testQueryClient}>
      {children}
    </QueryClientProvider>
  );
};