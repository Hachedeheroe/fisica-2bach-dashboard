import { useMutation } from '@tanstack/react-query';
import { anthropicService } from '@/services/anthropic-service';
import { useChatStore } from '@/store/use-chat-store';
import { Message } from '@/types/chat.types';
import { useCallback } from 'react';

export function useChat() {
  // Blueprint: Hook para interactuar con el chat AI (Anthropic Claude)
  // Maneja envío de mensajes y actualización del estado global
  
  const { 
    addMessage, 
    getCurrentConversation,
  } = useChatStore();

  const sendMessageMutation = useMutation({
    mutationFn: async ({ 
      content, 
      conversationId 
    }: { 
      content: string; 
      conversationId: string 
    }): Promise<Message> => {
      // Obtener conversación actual para contexto
      const conversation = getCurrentConversation();
      
      // Agregar mensaje del usuario al estado
      const userMessage: Message = {
        id: crypto.randomUUID(),
        content,
        role: 'user',
        timestamp: new Date().toISOString(),
      };
      
      addMessage(conversationId, userMessage);
      
      // Enviar solicitud a la API de Anthropic
      return anthropicService.sendMessage({
        content,
        conversationId,
        topic: conversation?.topic,
      });
    },
    onSuccess: (assistantMessage, { conversationId }) => {
      // Agregar respuesta del asistente al estado
      addMessage(conversationId, assistantMessage);
    },
  });

  // Función para enviar un mensaje
  const sendMessage = useCallback(
    async (content: string, conversationId?: string): Promise<Message> => {
      if (!conversationId) {
        throw new Error('Se requiere ID de conversación');
      }
      
      const result = await sendMessageMutation.mutateAsync({
        content,
        conversationId,
      });
      
      return result;
    },
    [sendMessageMutation]
  );

  return {
    sendMessage,
    isLoading: sendMessageMutation.isPending,
    isError: sendMessageMutation.isError,
    error: sendMessageMutation.error,
  };
}