import { useQuery } from '@tanstack/react-query';
import { examsService } from '@/services/exams-service';
import { Exam, ExamDetail, ExamFilters } from '@/types/exam.types';
import { PaginatedResponse } from '@/types/api.types';

export function useExams(filters?: ExamFilters) {
  // Blueprint: Hook para obtener lista de exámenes con filtros
  // Maneja paginación y filtrado usando TanStack Query
  
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['exams', 'list', filters],
    queryFn: async () => {
      const response = await examsService.getExams(filters);
      return response.data;
    },
  });

  return {
    examsList: data as PaginatedResponse<Exam>,
    isLoading,
    isError,
    error,
    refetch,
  };
}

export function useExamDetail(id: string) {
  return useQuery({
    queryKey: ['exams', 'detail', id],
    queryFn: async () => {
      const response = await examsService.getExamById(id);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useExamsByTopic(topic: string) {
  return useQuery({
    queryKey: ['exams', 'topic', topic],
    queryFn: async () => {
      const response = await examsService.getExamsByTopic(topic);
      return response.data;
    },
    enabled: !!topic,
  });
}

export function useRecentExams(limit = 5) {
  return useQuery({
    queryKey: ['exams', 'recent', limit],
    queryFn: async () => {
      const response = await examsService.getRecentExams(limit);
      return response.data;
    },
  });
}