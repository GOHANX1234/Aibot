import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Sparkles } from "lucide-react";
import ModelSelector from "./ModelSelector";
import { AI_MODELS } from "@shared/schema";

type ChatInputProps = {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  selectedModel: string;
  onSelectModel: (model: string) => void;
}

export default function ChatInput({ 
  onSendMessage, 
  isLoading, 
  selectedModel, 
  onSelectModel 
}: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 flex justify-center w-full">
          <ModelSelector 
            selectedModel={selectedModel} 
            onSelect={onSelectModel}
          />
        </div>
        <div className="relative aura-glow">
          <form 
            onSubmit={handleSubmit} 
            className="flex items-center gap-2 bg-black/30 backdrop-blur-md rounded-xl p-3 border border-primary/20"
          >
            <div className="absolute -left-1 -right-1 -top-1 -bottom-1 bg-black/10 blur-md rounded-xl z-[-1]"></div>
            <Input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask AuraAi anything..."
              className="flex-1 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/60 text-white/90 shadow-none h-10"
              disabled={isLoading}
              autoComplete="off"
            />
            <Button 
              type="submit" 
              size="icon"
              disabled={isLoading || !message.trim()}
              className="rounded-xl bg-primary/90 hover:bg-primary text-background hover:text-background transition-colors h-10 w-10 shadow-lg shadow-primary/20"
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
