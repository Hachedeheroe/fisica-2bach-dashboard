import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number = 500): T {
  // Blueprint: Hook para debounce de valores
  // Útil para búsquedas y filtros en tiempo real
  
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    // Configurar timer para actualizar el valor después del delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    // Limpiar timer si el valor cambia antes del delay
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);
  
  return debouncedValue;
}