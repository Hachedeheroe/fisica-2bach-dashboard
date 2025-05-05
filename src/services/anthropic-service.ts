import { 
  AnthropicMessage, 
  AnthropicRequest, 
  AnthropicResponse, 
  Message,
  SendMessageRequest 
} from '@/types/chat.types';
import { ANTHROPIC_MODEL } from '@/lib/constants';

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

export const anthropicService = {
  sendMessage: async (request: SendMessageRequest): Promise<Message> => {
    // Preparar mensaje para Anthropic
    const anthropicMessages: AnthropicMessage[] = [
      { role: 'user', content: request.content }
    ];
    
    // Construir el sistema prompt con contexto específico de física
    const systemPrompt = `Eres un asistente especializado en física para estudiantes de 2º de Bachillerato.
    ${request.topic ? `Estás ayudando con el tema: ${request.topic}.` : ''}
    Proporciona explicaciones claras, ejemplos concretos y ayuda paso a paso para resolver problemas.
    Utiliza fórmulas y notación científica cuando sea apropiado.
    Cuando expliques conceptos, relaciona la teoría con aplicaciones prácticas y posibles preguntas de examen.
    Si el estudiante comete un error, corrige amablemente y explica el razonamiento correcto.`;
    
    const anthropicRequest: AnthropicRequest = {
      model: ANTHROPIC_MODEL,
      messages: anthropicMessages,
      max_tokens: 1024,
      temperature: 0.7,
      system: systemPrompt,
    };
    
    try {
      const response = await fetch(ANTHROPIC_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify(anthropicRequest),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Error en la API de Anthropic');
      }
      
      const anthropicResponse: AnthropicResponse = await response.json();
      
      // Extraer el texto de la respuesta
      const content = anthropicResponse.content
        .filter(item => item.type === 'text')
        .map(item => item.text)
        .join('');
      
      // Crear mensaje para el frontend
      const newMessage: Message = {
        id: anthropicResponse.id,
        content,
        role: 'assistant',
        timestamp: new Date().toISOString(),
      };
      
      return newMessage;
    } catch (error) {
      console.error('Error al enviar mensaje a Anthropic:', error);
      throw error;
    }
  },
};