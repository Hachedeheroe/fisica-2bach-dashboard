import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useMetrics } from '@/hooks/use-metrics';
import { metricsService } from '@/services/metrics-service';
import { createWrapper } from '../utils/test-utils';

// Mock del servicio de métricas
vi.mock('@/services/metrics-service', () => ({
  metricsService: {
    getDashboardMetrics: vi.fn(),
    getTopicProgress: vi.fn(),
    getErrorAnalysis: vi.fn(),
    getWeeklyActivity: vi.fn(),
  },
}));

describe('useMetrics', () => {
  const mockMetricsData = {
    data: {
      overallScore: 7.5,
      examCount: 10,
      topicsCount: 8,
      topicsMastered: 5,
      progressByTopic: [],
      scoreByExamType: [],
      recentExams: [],
      errorsByType: [],
      weeklyActivity: [],
    },
    message: 'Métricas obtenidas correctamente',
    status: 200,
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('devuelve los datos correctamente cuando la consulta es exitosa', async () => {
    // Mock de la respuesta exitosa
    (metricsService.getDashboardMetrics as any).mockResolvedValue(mockMetricsData);
    
    const { result } = renderHook(() => useMetrics(), {
      wrapper: createWrapper(),
    });
    
    // Inicialmente debe estar en estado de carga
    expect(result.current.isLoading).toBe(true);
    
    // Esperar a que la consulta termine
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    
    // Verificar que los datos se devolvieron correctamente
    expect(result.current.metrics).toEqual(mockMetricsData.data);
    expect(result.current.isError).toBe(false);
  });

  it('maneja correctamente los errores', async () => {
    // Mock de error en la consulta
    const errorMessage = 'Error al obtener métricas';
    (metricsService.getDashboardMetrics as any).mockRejectedValue(new Error(errorMessage));
    
    const { result } = renderHook(() => useMetrics(), {
      wrapper: createWrapper(),
    });
    
    // Esperar a que la consulta termine con error
    await waitFor(() => expect(result.current.isError).toBe(true));
    
    // Verificar que el error se manejó correctamente
    expect(result.current.error).toBeDefined();
    expect(result.current.metrics).toBeUndefined();
  });

  it('permite revalidar los datos con refetch', async () => {
    // Mock inicial
    (metricsService.getDashboardMetrics as any).mockResolvedValue(mockMetricsData);
    
    const { result } = renderHook(() => useMetrics(), {
      wrapper: createWrapper(),
    });
    
    // Esperar a que la consulta inicial termine
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    
    // Preparar el mock para la revalidación
    const updatedData = { 
      ...mockMetricsData,
      data: { ...mockMetricsData.data, overallScore: 8.0 }
    };
    (metricsService.getDashboardMetrics as any).mockResolvedValue(updatedData);
    
    // Revalidar
    result.current.refetch();
    
    // Verificar que los datos se actualizaron
    await waitFor(() => expect(result.current.metrics.overallScore).toBe(8.0));
  });
});