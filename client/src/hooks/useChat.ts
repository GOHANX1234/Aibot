import { useState, useEffect } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { SendMessageResponse } from "@shared/schema";
import { 
  ChatMessage, 
  addMessageToChatSession, 
  getOrCreateActiveSession, 
  getChatSession, 
  createChatSession,
  getChatSessions,
  deleteChatSession,
  updateChatSession
} from "@/lib/chatSessionService";

export function useChat(initialModel: string) {
  const [model, setModel] = useState<string>(initialModel);
  const [activeSessionId, setActiveSessionId] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessions, setSessions] = useState<string[]>([]);
  
  // Initialize the active session
  useEffect(() => {
    const activeSession = getOrCreateActiveSession(model);
    setActiveSessionId(activeSession.id);
    setMessages(activeSession.messages);
    refreshSessions();
  }, []);
  
  // Refresh the list of available sessions
  const refreshSessions = () => {
    const allSessions = getChatSessions();
    setSessions(allSessions.map(session => session.id));
  };
  
  // Create a new chat session
  const createNewChat = () => {
    const newSession = createChatSession(model);
    setActiveSessionId(newSession.id);
    setMessages([]);
    refreshSessions();
    return newSession.id;
  };
  
  // Switch to an existing chat session
  const switchSession = (sessionId: string) => {
    const session = getChatSession(sessionId);
    if (session) {
      setActiveSessionId(sessionId);
      setMessages(session.messages);
      setModel(session.model);
    }
  };
  
  // Delete a chat session
  const deleteSession = (sessionId: string) => {
    const deleted = deleteChatSession(sessionId);
    
    if (deleted && sessionId === activeSessionId) {
      // If we deleted the active session, create a new one or switch to another
      const remainingSessions = getChatSessions();
      if (remainingSessions.length > 0) {
        switchSession(remainingSessions[0].id);
      } else {
        createNewChat();
      }
    }
    
    refreshSessions();
    return deleted;
  };
  
  // Change the model for the current session
  const changeModel = (newModel: string) => {
    setModel(newModel);
    if (activeSessionId) {
      updateChatSession(activeSessionId, { model: newModel });
    }
  };
  
  // API request mutation
  const mutation = useMutation({
    mutationFn: async (message: string): Promise<SendMessageResponse> => {
      const response = await apiRequest("POST", "/api/send-message", {
        message,
        model
      });
      return response.json();
    },
    onSuccess: (data) => {
      // Add bot response to the message list
      const botMessage: ChatMessage = { 
        content: data.response, 
        isUser: false 
      };
      
      // Update state and session
      setMessages((prev) => [...prev, botMessage]);
      
      if (activeSessionId) {
        addMessageToChatSession(activeSessionId, botMessage);
      }
    }
  });

  // Send a message
  const sendMessage = (content: string) => {
    // Create user message
    const userMessage: ChatMessage = { 
      content, 
      isUser: true 
    };
    
    // Add user message to UI
    setMessages((prev) => [...prev, userMessage]);
    
    // Save to session
    if (activeSessionId) {
      addMessageToChatSession(activeSessionId, userMessage);
    }
    
    // Send to API
    mutation.mutate(content);
  };

  return {
    messages,
    isLoading: mutation.isPending,
    sendMessage,
    error: mutation.error,
    model,
    changeModel,
    activeSessionId,
    sessions,
    createNewChat,
    switchSession,
    deleteSession,
    getAllSessions: getChatSessions
  };
}
