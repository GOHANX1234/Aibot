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
            className="flex items-center gap-2 bg-black/20 backdrop-blur-sm rounded-xl p-2 border border-primary/20"
          >
            <Input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask AuraAi anything..."
              className="flex-1 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/70"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              size="icon"
              disabled={isLoading || !message.trim()}
              className="rounded-xl bg-primary/90 hover:bg-primary text-background hover:text-background transition-colors"
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
