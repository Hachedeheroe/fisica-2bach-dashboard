import { useState, useRef, useEffect, forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, SendIcon } from "lucide-react";

interface PromptInputProps {
  onSubmit: (content: string) => void;
  loading?: boolean;
  placeholder?: string;
}

export const PromptInput = forwardRef<HTMLTextAreaElement, PromptInputProps>(
  ({ onSubmit, loading = false, placeholder = "Escribe tu pregunta..." }, ref) => {
    const [content, setContent] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    
    // Manejar referencia externa
    useEffect(() => {
      if (textareaRef.current && ref) {
        if (typeof ref === "function") {
          ref(textareaRef.current);
        } else {
          ref.current = textareaRef.current;
        }
      }
    }, [ref]);
    
    // Auto-ajustar altura del textarea
    useEffect(() => {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.style.height = "0";
        const scrollHeight = textarea.scrollHeight;
        textarea.style.height = `${scrollHeight}px`;
      }
    }, [content]);
    
    // Manejar envío del formulario
    const handleSubmit = (e?: React.FormEvent) => {
      if (e) {
        e.preventDefault();
      }
      
      if (content.trim() && !loading) {
        onSubmit(content);
        setContent("");
        
        // Resetear altura del textarea
        if (textareaRef.current) {
          textareaRef.current.style.height = "auto";
        }
      }
    };
    
    // Manejar teclas (Enter para enviar, Shift+Enter para nueva línea)
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    };
    
    return (
      <form onSubmit={handleSubmit} className="flex items-end gap-2" data-testid="prompt-input">
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={loading}
            className="min-h-[52px] w-full resize-none rounded-md border border-input bg-background px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            rows={1}
          />
        </div>
        
        <Button type="submit" size="icon" disabled={!content.trim() || loading}>
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <SendIcon className="h-5 w-5" />
          )}
        </Button>
      </form>
    );
  }
);

PromptInput.displayName = "PromptInput";
