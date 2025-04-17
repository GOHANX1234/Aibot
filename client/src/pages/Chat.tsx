import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import ModelSelector from "@/components/ModelSelector";
import LoadingIndicator from "@/components/LoadingIndicator";
import { useChat } from "@/hooks/useChat";
import { AI_MODELS } from "@shared/schema";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

export default function Chat() {
  const [selectedModel, setSelectedModel] = useState<string>(AI_MODELS.X1);
  const { 
    messages, 
    isLoading, 
    sendMessage, 
    error 
  } = useChat(selectedModel);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Show error toast
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  }, [error, toast]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (message: string) => {
    if (message.trim()) {
      sendMessage(message);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-5xl mx-auto p-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-light to-primary flex items-center justify-center text-white font-bold text-lg">
              A
            </div>
            <h1 className="text-xl font-semibold">AuraAi</h1>
          </div>
          
          <ModelSelector 
            selectedModel={selectedModel} 
            onSelect={setSelectedModel} 
          />
        </div>
      </header>

      {/* Main Chat Area */}
      <ScrollArea className="flex-1 p-4 md:p-6 max-w-5xl mx-auto w-full">
        <div className="space-y-4">
          {/* Welcome Message */}
          {messages.length === 0 && (
            <ChatMessage 
              content="Hello! I'm AuraAi, your AI assistant. How can I help you today?" 
              isUser={false} 
            />
          )}

          {/* Chat Messages */}
          {messages.map((msg, index) => (
            <ChatMessage 
              key={index} 
              content={msg.content} 
              isUser={msg.isUser} 
            />
          ))}

          {/* Loading Indicator */}
          {isLoading && <LoadingIndicator />}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Message Input */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-3 px-4">
        <div className="max-w-5xl mx-auto">
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </footer>
    </div>
  );
}
