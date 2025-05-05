import { ApiResponse } from '@/types/api.types';
import { Metrics } from '@/types/metrics.types';
import { api } from './api';

export const metricsService = {
  getDashboardMetrics: async (): Promise<ApiResponse<Metrics>> => {
    return api.get<ApiResponse<Metrics>>('/metrics/dashboard');
  },
  
  getTopicProgress: async (topic: string): Promise<ApiResponse<Metrics['progressByTopic'][0]>> => {
    return api.get<ApiResponse<Metrics['progressByTopic'][0]>>(`/metrics/topics/${topic}`);
  },
  
  getErrorAnalysis: async (): Promise<ApiResponse<Metrics['errorsByType']>> => {
    return api.get<ApiResponse<Metrics['errorsByType']>>('/metrics/errors');
  },
  
  getWeeklyActivity: async (weeks = 4): Promise<ApiResponse<Metrics['weeklyActivity']>> => {
    return api.get<ApiResponse<Metrics['weeklyActivity']>>(`/metrics/activity?weeks=${weeks}`);
  },
};