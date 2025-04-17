import { useState, useEffect, useRef } from "react";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import ChatSidebar from "@/components/ChatSidebar";
import LoadingIndicator from "@/components/LoadingIndicator";
import StarsBackground from "@/components/StarsBackground";
import { useChat } from "@/hooks/useChat";
import { AI_MODELS } from "@shared/schema";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

export default function Chat() {
  const { 
    messages, 
    isLoading, 
    sendMessage, 
    error,
    model,
    changeModel,
    activeSessionId,
    createNewChat,
    switchSession,
    deleteSession,
    getAllSessions
  } = useChat(AI_MODELS.X1);
  
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
      {/* Background Elements */}
      <StarsBackground />
      
      {/* Sidebar for Chat History */}
      <ChatSidebar 
        activeSessionId={activeSessionId}
        onCreateNewChat={createNewChat}
        onSwitchSession={switchSession}
        onDeleteSession={deleteSession}
      />
      
      {/* Header */}
      <header className="mobile-header sticky top-0 z-30 p-3 flex items-center">
        <div className="ml-10 flex items-center space-x-3">
          <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-violet-800">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <h1 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-300">
            AuraAi
          </h1>
        </div>
      </header>

      {/* Main Chat Area */}
      <ScrollArea className="flex-1 pb-32 px-4 w-full relative z-10">
        <div className="max-w-2xl mx-auto pt-4 pb-20 space-y-4">
          {/* Welcome Message */}
          {messages.length === 0 && (
            <div className="flex flex-col gap-4 items-center justify-center my-12 text-center">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-indigo-600 to-violet-800 flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Welcome to AuraAi</h2>
              <p className="text-muted-foreground max-w-md">
                Your space-themed AI assistant. Ask me anything or try one of these examples:
              </p>
              <div className="grid grid-cols-1 gap-2 mt-2 w-full max-w-md">
                <button 
                  onClick={() => handleSendMessage("Tell me about black holes")}
                  className="p-2 text-sm border border-primary/20 rounded-lg bg-primary/5 hover:bg-primary/10 text-left"
                >
                  "Tell me about black holes"
                </button>
                <button 
                  onClick={() => handleSendMessage("Write a poem about the cosmos")}
                  className="p-2 text-sm border border-primary/20 rounded-lg bg-primary/5 hover:bg-primary/10 text-left"
                >
                  "Write a poem about the cosmos"
                </button>
                <button 
                  onClick={() => handleSendMessage("Create a simple Python function that calculates orbital velocity")}
                  className="p-2 text-sm border border-primary/20 rounded-lg bg-primary/5 hover:bg-primary/10 text-left"
                >
                  "Create a simple Python function that calculates orbital velocity"
                </button>
              </div>
            </div>
          )}

          {/* Chat Messages */}
          {messages.length > 0 && (
            <div className="space-y-6">
              {messages.map((msg, index) => (
                <ChatMessage 
                  key={index} 
                  content={msg.content} 
                  isUser={msg.isUser} 
                />
              ))}
            </div>
          )}

          {/* Loading Indicator */}
          {isLoading && <LoadingIndicator />}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="fixed bottom-0 left-0 right-0 p-4 pb-6 bg-gradient-to-t from-[#050714] via-[#050714] to-transparent z-20">
        <ChatInput 
          onSendMessage={handleSendMessage} 
          isLoading={isLoading} 
          selectedModel={model}
          onSelectModel={changeModel}
        />
      </div>
    </div>
  );
}
