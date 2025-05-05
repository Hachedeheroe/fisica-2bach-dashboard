import { ApiResponse, PaginatedResponse } from '@/types/api.types';
import { Exam, ExamDetail, ExamFilters } from '@/types/exam.types';
import { api } from './api';

export const examsService = {
  getExams: async (filters?: ExamFilters): Promise<ApiResponse<PaginatedResponse<Exam>>> => {
    // Construir query params
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params.append(key, value);
        }
      });
    }
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return api.get<ApiResponse<PaginatedResponse<Exam>>>(`/exams${query}`);
  },
  
  getExamById: async (id: string): Promise<ApiResponse<ExamDetail>> => {
    return api.get<ApiResponse<ExamDetail>>(`/exams/${id}`);
  },
  
  getExamsByTopic: async (topic: string): Promise<ApiResponse<Exam[]>> => {
    return api.get<ApiResponse<Exam[]>>(`/exams/topic/${topic}`);
  },
  
  getRecentExams: async (limit = 5): Promise<ApiResponse<Exam[]>> => {
    return api.get<ApiResponse<Exam[]>>(`/exams/recent?limit=${limit}`);
  },
};