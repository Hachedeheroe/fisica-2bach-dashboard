import { ApiError, ApiResponse } from '@/types/api.types';

const API_URL = import.meta.env.VITE_API_URL || 'https://api.fisica2bach.dev';

interface RequestOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

async function request<T>(
  endpoint: string,
  { method = 'GET', body, headers = {}, signal }: RequestOptions = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    signal,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    
    const data = await response.json();
    
    if (!response.ok) {
      const error: ApiError = {
        message: data.message || 'Ocurrió un error en la solicitud',
        status: response.status,
        errors: data.errors,
      };
      throw error;
    }
    
    return data as T;
  } catch (error) {
    if (error instanceof Error) {
      throw {
        message: error.message || 'Error de red',
        status: 0,
      } as ApiError;
    }
    throw error;
  }
}

// Exportamos funciones helper para facilitar las peticiones
export const api = {
  get: <T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) => 
    request<T>(endpoint, { ...options, method: 'GET' }),
  
  post: <T>(endpoint: string, data: unknown, options?: Omit<RequestOptions, 'method'>) => 
    request<T>(endpoint, { ...options, method: 'POST', body: data }),
  
  put: <T>(endpoint: string, data: unknown, options?: Omit<RequestOptions, 'method'>) => 
    request<T>(endpoint, { ...options, method: 'PUT', body: data }),
  
  patch: <T>(endpoint: string, data: unknown, options?: Omit<RequestOptions, 'method'>) => 
    request<T>(endpoint, { ...options, method: 'PATCH', body: data }),
  
  delete: <T>(endpoint: string, options?: Omit<RequestOptions, 'method'>) => 
    request<T>(endpoint, { ...options, method: 'DELETE' }),
};