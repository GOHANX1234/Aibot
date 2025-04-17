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
  } = useChat(AI_MODELS.X3);
  
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

  // Handle delete session with confirmation and UI update
  const handleDeleteSession = (sessionId: string) => {
    deleteSession(sessionId);
    // Refresh UI state immediately after deletion
    const allSessions = getAllSessions();
    if (allSessions.length === 0) {
      createNewChat();
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
        onDeleteSession={handleDeleteSession}
      />
      
      {/* Header */}
      <header className="mobile-header py-3 px-4 flex items-center">
        <div className="ml-8 flex items-center space-x-3">
          <div className="relative group">
            <div className="absolute inset-0 rounded-full blur-md bg-primary/30 group-hover:bg-primary/40 transition-colors"></div>
            <div className="relative flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-800 border border-primary/30">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-primary to-purple-300">
            AuraAi
          </h1>
          <span className="ml-4 text-sm text-primary/70">Developed by @Gohan52</span>
        </div>
      </header>

      {/* Main Chat Area */}
      <ScrollArea className="flex-1 pb-32 px-4 w-full relative z-10">
        <div className="max-w-2xl mx-auto pt-4 pb-20 space-y-4">
          {/* Welcome Message */}
          {messages.length === 0 && (
            <div className="flex flex-col gap-6 items-center justify-center my-12 text-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-full blur-xl bg-primary/20 animate-pulse"></div>
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-800 flex items-center justify-center relative z-10 shadow-lg shadow-primary/20">
                  <Sparkles className="h-12 w-12 text-white opacity-90" />
                </div>
              </div>
              
              <div>
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-primary to-purple-300">
                  Welcome to AuraAi
                </h2>
                <p className="text-muted-foreground/80 max-w-md mt-2 text-sm">
                  How can I assist you today?
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 w-full max-w-xl">
                <button 
                  onClick={() => handleSendMessage("What can you help me with?")}
                  className="p-3 text-sm border border-primary/20 rounded-lg bg-black/40 hover:bg-primary/10 hover:border-primary/50 text-left transition-all group flex items-center"
                >
                  <span className="bg-primary/20 rounded-full p-1.5 mr-2 group-hover:bg-primary/30 transition-colors">
                    <Sparkles className="h-4 w-4 text-primary/90" />
                  </span>
                  "What can you help me with?"
                </button>
                <button 
                  onClick={() => handleSendMessage("Write me a short story")}
                  className="p-3 text-sm border border-primary/20 rounded-lg bg-black/40 hover:bg-primary/10 hover:border-primary/50 text-left transition-all group flex items-center"
                >
                  <span className="bg-primary/20 rounded-full p-1.5 mr-2 group-hover:bg-primary/30 transition-colors">
                    <Sparkles className="h-4 w-4 text-primary/90" />
                  </span>
                  "Write me a short story"
                </button>
                <button 
                  onClick={() => handleSendMessage("Show me a JavaScript code example for fetching API data")}
                  className="p-3 text-sm border border-primary/20 rounded-lg bg-black/40 hover:bg-primary/10 hover:border-primary/50 text-left transition-all group flex items-center"
                >
                  <span className="bg-primary/20 rounded-full p-1.5 mr-2 group-hover:bg-primary/30 transition-colors">
                    <Sparkles className="h-4 w-4 text-primary/90" />
                  </span>
                  "Show me a JavaScript code example for fetching API data"
                </button>
                <button 
                  onClick={() => handleSendMessage("What's the difference between X1, X2, and X3 models?")}
                  className="p-3 text-sm border border-primary/20 rounded-lg bg-black/40 hover:bg-primary/10 hover:border-primary/50 text-left transition-all group flex items-center"
                >
                  <span className="bg-primary/20 rounded-full p-1.5 mr-2 group-hover:bg-primary/30 transition-colors">
                    <Sparkles className="h-4 w-4 text-primary/90" />
                  </span>
                  "What's the difference between X1, X2, and X3 models?"
                </button>
              </div>
              
              <div className="mt-2 p-3 rounded-lg border border-primary/10 bg-black/20 text-xs text-primary-foreground/70">
                Try different AI models using the selector below the input box!
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
