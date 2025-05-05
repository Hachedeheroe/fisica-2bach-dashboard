import { useQuery } from '@tanstack/react-query';
import { metricsService } from '@/services/metrics-service';
import { Metrics } from '@/types/metrics.types';

export function useMetrics() {
  // Blueprint: Hook para obtener métricas del dashboard
  // Utiliza TanStack Query para caché y revalidación
  
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['metrics', 'dashboard'],
    queryFn: async () => {
      const response = await metricsService.getDashboardMetrics();
      return response.data;
    },
  });

  return {
    metrics: data as Metrics,
    isLoading,
    isError,
    error,
    refetch,
  };
}

export function useTopicProgress(topic: string) {
  return useQuery({
    queryKey: ['metrics', 'topic', topic],
    queryFn: async () => {
      const response = await metricsService.getTopicProgress(topic);
      return response.data;
    },
    enabled: !!topic,
  });
}

export function useErrorAnalysis() {
  return useQuery({
    queryKey: ['metrics', 'errors'],
    queryFn: async () => {
      const response = await metricsService.getErrorAnalysis();
      return response.data;
    },
  });
}

export function useWeeklyActivity(weeks = 4) {
  return useQuery({
    queryKey: ['metrics', 'activity', weeks],
    queryFn: async () => {
      const response = await metricsService.getWeeklyActivity(weeks);
      return response.data;
    },
  });
}