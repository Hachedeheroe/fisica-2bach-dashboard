import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChatInterface } from '@/components/chat/chat-interface';

// Mock de los hooks de estado
vi.mock('@/store/use-chat-store', () => ({
  useChatStore: () => ({
    conversations: [],
    currentConversationId: null,
    createConversation: vi.fn().mockReturnValue('new-conversation-id'),
    deleteConversation: vi.fn(),
    setCurrentConversation: vi.fn(),
    renameConversation: vi.fn(),
    getCurrentConversation: vi.fn().mockReturnValue(null),
    clearMessages: vi.fn(),
    addMessage: vi.fn(),
  }),
}));

vi.mock('@/store/use-ui-store', () => ({
  useThemeStore: () => ({
    sidebarOpen: true,
    theme: 'light',
    setTheme: vi.fn(),
    toggleSidebar: vi.fn(),
    setSidebarOpen: vi.fn(),
  }),
}));

describe('ChatInterface', () => {
  const mockOnSendMessage = vi.fn().mockResolvedValue({
    id: 'response-id',
    content: 'Esta es la respuesta del asistente',
    role: 'assistant',
    timestamp: new Date().toISOString(),
  });

  it('renderiza correctamente el estado inicial', () => {
    render(<ChatInterface onSendMessage={mockOnSendMessage} />);
    
    expect(screen.getByText('Asistente de Física')).toBeInTheDocument();
    expect(screen.getByText(/Pregúntame cualquier duda sobre física/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Escribe tu pregunta...')).toBeInTheDocument();
  });

  it('muestra las sugerencias de preguntas', () => {
    render(<ChatInterface onSendMessage={mockOnSendMessage} />);
    
    const suggestions = [
      'Explícame el movimiento armónico simple',
      '¿Cómo se calcula la fuerza centrípeta?',
      '¿Qué es el efecto fotoeléctrico?',
    ];
    
    suggestions.forEach(suggestion => {
      expect(screen.getByText(suggestion)).toBeInTheDocument();
    });
  });

  it('permite seleccionar un tema', () => {
    render(<ChatInterface onSendMessage={mockOnSendMessage} />);
    
    const topicSelect = screen.getByLabelText('Selecciona un tema (opcional)');
    fireEvent.change(topicSelect, { target: { value: 'Cinemática' } });
    
    expect(topicSelect).toHaveValue('Cinemática');
  });

  it('desactiva el input durante la carga', () => {
    render(<ChatInterface onSendMessage={mockOnSendMessage} loading={true} />);
    
    const input = screen.getByPlaceholderText('Escribe tu pregunta...');
    expect(input).toBeDisabled();
    
    const sendButton = screen.getByRole('button', { name: /enviar/i });
    expect(sendButton).toBeDisabled();
  });

  it('envía el mensaje cuando se hace clic en una sugerencia', async () => {
    render(<ChatInterface onSendMessage={mockOnSendMessage} />);
    
    const suggestion = screen.getByText('¿Cómo se calcula la fuerza centrípeta?');
    fireEvent.click(suggestion);
    
    expect(mockOnSendMessage).toHaveBeenCalledWith(
      '¿Cómo se calcula la fuerza centrípeta?',
      'new-conversation-id'
    );
  });
});