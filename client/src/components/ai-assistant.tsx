import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/queryClient";

interface Message {
  id: string;
  content: string;
  isAi: boolean;
  timestamp: Date;
}

interface AiAssistantProps {
  open: boolean;
  onClose: () => void;
}

export function AiAssistant({ open, onClose }: AiAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I'm your MIL Assistant. I can help you with content creation, fact-checking techniques, and educational strategies. How can I assist you today?",
      isAi: true,
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest('POST', '/api/ai/chat', { message });
      return response.json();
    },
    onSuccess: (data) => {
      const aiMessage: Message = {
        id: Date.now().toString(),
        content: data.response,
        isAi: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
    },
    onError: () => {
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "I'm experiencing some technical difficulties. Please try again later.",
        isAi: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isAi: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Send to AI
    chatMutation.mutate(inputValue);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card glass-card rounded-2xl w-80 max-h-96 shadow-glow flex flex-col p-0">
        {/* Header */}
        <DialogHeader className="p-4 border-b border-border flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <i className="fas fa-robot text-white text-sm"></i>
            </div>
            <DialogTitle className="font-semibold text-foreground">MIL Assistant</DialogTitle>
          </div>
        </DialogHeader>

        {/* Messages */}
        <div className="flex-1 p-4 space-y-3 overflow-y-auto min-h-48 max-h-64">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`${message.isAi ? 'bg-primary/20' : 'bg-accent/20'} p-3 rounded-lg ${
                !message.isAi ? 'ml-8' : 'mr-8'
              }`}
              data-testid={`message-${message.isAi ? 'ai' : 'user'}-${message.id}`}
            >
              <p className="text-sm text-foreground">{message.content}</p>
            </div>
          ))}
          
          {chatMutation.isPending && (
            <div className="bg-primary/20 p-3 rounded-lg mr-8">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border flex-shrink-0">
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <Input
              type="text"
              placeholder="Ask me anything about media literacy..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 bg-input border-border text-sm text-foreground"
              disabled={chatMutation.isPending}
              data-testid="input-ai-message"
            />
            <Button
              type="submit"
              disabled={chatMutation.isPending || !inputValue.trim()}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              size="icon"
              data-testid="button-send-message"
            >
              <i className="fas fa-paper-plane"></i>
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
