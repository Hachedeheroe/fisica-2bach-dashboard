import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MetricsGrid } from '@/components/dashboard/metrics-grid';

describe('MetricsGrid', () => {
  const mockMetrics = {
    overallScore: 7.5,
    examCount: 10,
    topicsCount: 8,
    topicsMastered: 5,
    progressByTopic: [],
    scoreByExamType: [],
    recentExams: [],
    errorsByType: [],
    weeklyActivity: [{
      week: '2025-05-01',
      examsCount: 2,
      averageScore: 8.0
    }]
  };

  it('muestra placeholders cuando está cargando', () => {
    render(<MetricsGrid metrics={mockMetrics} loading={true} />);
    expect(screen.getAllByTestId('loading-placeholder')).toHaveLength(4);
  });

  it('muestra las métricas correctamente', () => {
    render(<MetricsGrid metrics={mockMetrics} loading={false} />);
    
    expect(screen.getByText('7.50/10')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('5/8')).toBeInTheDocument();
    expect(screen.getByText('2 exámenes')).toBeInTheDocument();
  });

  it('calcula correctamente el porcentaje de temas dominados', () => {
    render(<MetricsGrid metrics={mockMetrics} loading={false} />);
    expect(screen.getByText('63% del temario')).toBeInTheDocument();
  });
});