import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ExamList } from '@/components/exams/exam-list';
import { BrowserRouter } from 'react-router-dom';

// Mock de react-router-dom para los componentes Link
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
      <a href={to}>{children}</a>
    ),
  };
});

describe('ExamList', () => {
  const mockExams = [
    {
      id: '1',
      title: 'Primer Parcial de Cinemática',
      date: '2025-04-10',
      type: 'PARCIAL_1',
      subject: 'Física',
      topics: ['Cinemática'],
      totalQuestions: 10,
      maxScore: 10,
      studentScore: 8.5,
      status: 'CALIFICADO',
    },
    {
      id: '2',
      title: 'Segundo Parcial de Dinámica',
      date: '2025-05-01',
      type: 'PARCIAL_2',
      subject: 'Física',
      topics: ['Dinámica'],
      totalQuestions: 12,
      maxScore: 12,
      studentScore: 10,
      status: 'CALIFICADO',
    },
  ];

  const renderWithRouter = (ui: React.ReactNode) => {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
  };

  it('muestra placeholders cuando está cargando', () => {
    renderWithRouter(<ExamList exams={[]} loading={true} />);
    expect(screen.getAllByTestId('loading-placeholder')).toHaveLength(5);
  });

  it('muestra mensaje cuando no hay exámenes', () => {
    renderWithRouter(<ExamList exams={[]} loading={false} />);
    expect(screen.getByText('No se encontraron exámenes.')).toBeInTheDocument();
  });

  it('muestra correctamente la lista de exámenes', () => {
    renderWithRouter(<ExamList exams={mockExams} loading={false} />);
    
    expect(screen.getByText('Primer Parcial de Cinemática')).toBeInTheDocument();
    expect(screen.getByText('Segundo Parcial de Dinámica')).toBeInTheDocument();
    expect(screen.getAllByText('Calificado')).toHaveLength(2);
  });

  it('filtra exámenes cuando se busca texto', () => {
    renderWithRouter(<ExamList exams={mockExams} loading={false} />);
    
    const searchInput = screen.getByPlaceholderText('Buscar exámenes...');
    fireEvent.change(searchInput, { target: { value: 'Dinámica' } });
    
    expect(screen.queryByText('Primer Parcial de Cinemática')).not.toBeInTheDocument();
    expect(screen.getByText('Segundo Parcial de Dinámica')).toBeInTheDocument();
  });

  it('llama a onFilterChange cuando se cambian los filtros', () => {
    const mockOnFilterChange = vi.fn();
    renderWithRouter(
      <ExamList exams={mockExams} loading={false} onFilterChange={mockOnFilterChange} />
    );
    
    // Abrir panel de filtros
    fireEvent.click(screen.getByText('Filtros'));
    
    // Seleccionar un tipo de examen
    const typeSelect = screen.getByLabelText('Tipo de examen');
    fireEvent.change(typeSelect, { target: { value: 'PARCIAL_1' } });
    
    // Aplicar filtros
    fireEvent.click(screen.getByText('Aplicar'));
    
    expect(mockOnFilterChange).toHaveBeenCalledWith({ type: 'PARCIAL_1' });
  });
});