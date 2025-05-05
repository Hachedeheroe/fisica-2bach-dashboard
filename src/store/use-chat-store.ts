import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Conversation, Message } from '@/types/chat.types';
import { generateId } from '@/lib/utils';

interface ChatState {
  conversations: Conversation[];
  currentConversationId: string | null;
  
  // Acciones para conversaciones
  createConversation: (title?: string, topic?: string) => string;
  deleteConversation: (id: string) => void;
  setCurrentConversation: (id: string | null) => void;
  renameConversation: (id: string, title: string) => void;
  
  // Acciones para mensajes
  addMessage: (conversationId: string, message: Omit<Message, 'id'>) => void;
  clearMessages: (conversationId: string) => void;
  
  // Getters
  getCurrentConversation: () => Conversation | null;
  getConversation: (id: string) => Conversation | undefined;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      currentConversationId: null,
      
      createConversation: (title, topic) => {
        const id = generateId();
        const now = new Date().toISOString();
        
        const newConversation: Conversation = {
          id,
          title: title || 'Nueva conversación',
          messages: [],
          createdAt: now,
          updatedAt: now,
          topic,
        };
        
        set((state) => ({
          conversations: [newConversation, ...state.conversations],
          currentConversationId: id,
        }));
        
        return id;
      },
      
      deleteConversation: (id) => {
        set((state) => ({
          conversations: state.conversations.filter((conv) => conv.id !== id),
          currentConversationId: 
            state.currentConversationId === id
              ? (state.conversations.length > 1 
                  ? state.conversations.find((c) => c.id !== id)?.id || null
                  : null)
              : state.currentConversationId,
        }));
      },
      
      setCurrentConversation: (id) => {
        set({ currentConversationId: id });
      },
      
      renameConversation: (id, title) => {
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === id
              ? { ...conv, title, updatedAt: new Date().toISOString() }
              : conv
          ),
        }));
      },
      
      addMessage: (conversationId, message) => {
        const messageWithId: Message = {
          ...message,
          id: generateId(),
        };
        
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === conversationId
              ? {
                  ...conv,
                  messages: [...conv.messages, messageWithId],
                  updatedAt: new Date().toISOString(),
                }
              : conv
          ),
        }));
      },
      
      clearMessages: (conversationId) => {
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === conversationId
              ? {
                  ...conv,
                  messages: [],
                  updatedAt: new Date().toISOString(),
                }
              : conv
          ),
        }));
      },
      
      getCurrentConversation: () => {
        const { conversations, currentConversationId } = get();
        if (!currentConversationId) return null;
        
        return conversations.find((conv) => conv.id === currentConversationId) || null;
      },
      
      getConversation: (id) => {
        const { conversations } = get();
        return conversations.find((conv) => conv.id === id);
      },
    }),
    {
      name: 'chat-store',
      partialize: (state) => ({
        conversations: state.conversations,
        currentConversationId: state.currentConversationId,
      }),
    }
  )
);