import { useState, useRef, useEffect } from "react";
import { useChatStore } from "@/store/use-chat-store";
import { useThemeStore } from "@/store/use-ui-store";
import { MessageItem } from "./message-item";
import { PromptInput } from "./prompt-input";
import { Message } from "@/types/chat.types";
import { Button } from "@/components/ui/button";
import { PHYSICS_TOPICS } from "@/lib/constants";
import { 
  Edit2, 
  MessageSquare, 
  Plus, 
  Trash2, 
  X 
} from "lucide-react";

interface ChatInterfaceProps {
  onSendMessage: (content: string, conversationId?: string) => Promise<Message>;
  loading?: boolean;
}

export function ChatInterface({ onSendMessage, loading = false }: ChatInterfaceProps) {
  const { 
    conversations, 
    currentConversationId,
    createConversation,
    deleteConversation,
    setCurrentConversation,
    renameConversation,
    getCurrentConversation,
    clearMessages
  } = useChatStore();
  
  const { sidebarOpen } = useThemeStore();
  
  const [showConversations, setShowConversations] = useState(true);
  const [editingTitle, setEditingTitle] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string | undefined>(undefined);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  // Auto-scroll al último mensaje
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [getCurrentConversation()?.messages]);
  
  // Manejar envío de nuevo mensaje
  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    let conversationId = currentConversationId;
    
    // Si no hay conversación activa, crear una nueva
    if (!conversationId) {
      conversationId = createConversation(
        `Conversación ${conversations.length + 1}`,
        selectedTopic
      );
    }
    
    try {
      await onSendMessage(content, conversationId);
      
      // Limpiar el tema seleccionado después de enviar
      setSelectedTopic(undefined);
      
      // Enfocar el input después de enviar
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
    }
  };
  
  // Crear nueva conversación
  const handleNewConversation = () => {
    createConversation();
    setSelectedTopic(undefined);
    
    // Enfocar el input después de crear
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };
  
  // Comenzar edición de título
  const startEditingTitle = (id: string, currentTitle: string) => {
    setEditingTitle(id);
    setNewTitle(currentTitle);
  };
  
  // Confirmar edición de título
  const confirmTitleEdit = (id: string) => {
    if (newTitle.trim()) {
      renameConversation(id, newTitle.trim());
    }
    setEditingTitle(null);
  };
  
  // Obtener la conversación actual
  const currentConversation = getCurrentConversation();
  
  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Panel de conversaciones */}
      {showConversations && (
        <div className="w-64 flex-shrink-0 border-r bg-card">
          <div className="flex h-14 items-center justify-between border-b px-4">
            <h2 className="font-semibold">Conversaciones</h2>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setShowConversations(false)}
              className="lg:hidden"
            >
              <X size={18} />
            </Button>
          </div>
          
          <div className="p-2">
            <Button 
              className="w-full justify-start"
              onClick={handleNewConversation}
              disabled={loading}
            >
              <Plus size={16} className="mr-2" />
              Nueva conversación
            </Button>
          </div>
          
          <div className="overflow-y-auto h-[calc(100%-5rem)]">
            {conversations.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                No hay conversaciones. 
                <br />
                Inicia una nueva conversación.
              </div>
            ) : (
              <div className="space-y-1 p-2">
                {conversations.map((conversation) => (
                  <div 
                    key={conversation.id}
                    className={`group flex items-center justify-between rounded-md px-3 py-2 text-sm ${
                      currentConversationId === conversation.id
                        ? "bg-accent"
                        : "hover:bg-muted"
                    }`}
                  >
                    {editingTitle === conversation.id ? (
                      <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        onBlur={() => confirmTitleEdit(conversation.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            confirmTitleEdit(conversation.id);
                          }
                        }}
                        className="w-full rounded-sm border px-1 py-0.5 text-sm"
                        autoFocus
                      />
                    ) : (
                      <button
                        className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-left"
                        onClick={() => setCurrentConversation(conversation.id)}
                      >
                        <MessageSquare
                          size={14}
                          className="mr-2 inline-block align-text-bottom"
                        />
                        {conversation.title}
                        {conversation.topic && (
                          <span className="ml-2 text-xs text-muted-foreground">
                            • {conversation.topic}
                          </span>
                        )}
                      </button>
                    )}
                    
                    {editingTitle !== conversation.id && (
                      <div className="flex invisible group-hover:visible">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => startEditingTitle(
                            conversation.id, 
                            conversation.title
                          )}
                        >
                          <Edit2 size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-destructive"
                          onClick={() => deleteConversation(conversation.id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Área principal del chat */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Cabecera del chat */}
        <div className="flex h-14 items-center justify-between border-b px-4">
          <div className="flex items-center">
            {!showConversations && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowConversations(true)}
                className="mr-2"
              >
                <MessageSquare size={18} />
              </Button>
            )}
            <h2 className="font-semibold">
              {currentConversation ? currentConversation.title : "Nueva conversación"}
            </h2>
            {currentConversation?.topic && (
              <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium">
                {currentConversation.topic}
              </span>
            )}
          </div>
          
          {currentConversation && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => clearMessages(currentConversation.id)}
                disabled={!currentConversation.messages.length}
              >
                <Trash2 size={14} className="mr-2" />
                Limpiar
              </Button>
            </div>
          )}
        </div>
        
        {/* Historial de mensajes */}
        <div className="flex-1 overflow-y-auto p-4">
          {currentConversation?.messages.length ? (
            <div className="space-y-4">
              {currentConversation.messages.map((message) => (
                <MessageItem
                  key={message.id}
                  message={message}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center">
              <div className="rounded-full bg-primary/10 p-3">
                <MessageSquare size={24} className="text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">
                Asistente de Física
              </h3>
              <p className="mt-2 max-w-sm text-center text-sm text-muted-foreground">
                Pregúntame cualquier duda sobre física de 2º de Bachillerato. 
                Puedo explicar conceptos, ayudarte a resolver problemas y prepararte para exámenes.
              </p>
              
              {/* Selector de tema */}
              <div className="mt-6">
                <label className="mb-2 block text-center text-sm font-medium">
                  Selecciona un tema (opcional)
                </label>
                <select
                  className="w-64 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={selectedTopic || ""}
                  onChange={(e) => setSelectedTopic(e.target.value || undefined)}
                >
                  <option value="">Cualquier tema</option>
                  {PHYSICS_TOPICS.map((topic) => (
                    <option key={topic} value={topic}>
                      {topic}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Sugerencias */}
              <div className="mt-6 grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                {[
                  "Explícame el movimiento armónico simple",
                  "¿Cómo se calcula la fuerza centrípeta?",
                  "¿Qué es el efecto fotoeléctrico?",
                  "Resuelve este problema de campo eléctrico...",
                  "¿Qué fórmulas necesito memorizar para la EVAU?",
                  "Dame ejemplos de ejercicios sobre ondas",
                ].map((suggestion, i) => (
                  <button
                    key={i}
                    className="rounded-md border p-2 text-left text-sm hover:bg-accent"
                    onClick={() => {
                      handleSendMessage(suggestion);
                    }}
                    disabled={loading}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Input de mensaje */}
        <div className="border-t p-3">
          <PromptInput 
            onSubmit={handleSendMessage} 
            loading={loading} 
            ref={inputRef}
          />
        </div>
      </div>
    </div>
  );
}