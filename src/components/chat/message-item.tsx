import { Message } from "@/types/chat.types";
import { formatDateTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MessageItemProps {
  message: Message;
}

export function MessageItem({ message }: MessageItemProps) {
  const { toast } = useToast();
  
  const isUser = message.role === "user";
  
  // Función para copiar el contenido del mensaje
  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content).then(
      () => {
        toast({
          title: "Contenido copiado",
          description: "El mensaje ha sido copiado al portapapeles",
          duration: 3000,
        });
      },
      (err) => {
        console.error("No se pudo copiar el texto:", err);
        toast({
          title: "Error al copiar",
          description: "No se pudo copiar el contenido al portapapeles",
          variant: "destructive",
          duration: 3000,
        });
      }
    );
  };
  
  // Formatear el contenido del mensaje (código, fórmulas, etc.)
  const formatContent = (content: string) => {
    // División básica por líneas para preservar saltos de línea
    return content.split("\n").map((line, index) => (
      <span key={index} className="block">
        {line || <br />}
      </span>
    ));
  };
  
  return (
    <div
      className={`group relative flex ${
        isUser ? "justify-end" : "justify-start"
      }`}
      data-testid="message-item"
    >
      <div
        className={`relative max-w-3xl rounded-lg px-4 py-3 ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted"
        }`}
      >
        <div className="text-sm">{formatContent(message.content)}</div>
        
        <div className="mt-1 text-right text-xs opacity-70">
          {formatDateTime(message.timestamp)}
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-10 top-0 hidden h-8 w-8 text-muted-foreground group-hover:flex"
          onClick={copyToClipboard}
          title="Copiar mensaje"
        >
          <Copy size={14} />
        </Button>
      </div>
    </div>
  );
}