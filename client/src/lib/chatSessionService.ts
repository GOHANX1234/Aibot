import { Message } from "@shared/schema";

// Types for chat sessions
export type ChatSession = {
  id: string;
  title: string;
  timestamp: number;
  messages: ChatMessage[];
  model: string;
};

export type ChatMessage = {
  content: string;
  isUser: boolean;
};

// Generate a unique ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Get a default title from the first message or a timestamp
const getDefaultTitle = (message: string) => {
  // Take first 20 chars of first message or generate generic title
  if (message && message.length > 0) {
    return message.length > 20 ? message.substring(0, 20) + '...' : message;
  }
  
  return `Chat ${new Date().toLocaleString()}`;
};

// Save sessions to local storage
const saveSessions = (sessions: ChatSession[]) => {
  try {
    localStorage.setItem('auraai-sessions', JSON.stringify(sessions));
  } catch (error) {
    console.error('Failed to save sessions:', error);
  }
};

// Load sessions from local storage
const loadSessions = (): ChatSession[] => {
  try {
    const sessions = localStorage.getItem('auraai-sessions');
    return sessions ? JSON.parse(sessions) : [];
  } catch (error) {
    console.error('Failed to load sessions:', error);
    return [];
  }
};

// Get all chat sessions
export const getChatSessions = (): ChatSession[] => {
  return loadSessions();
};

// Get a specific chat session
export const getChatSession = (id: string): ChatSession | undefined => {
  const sessions = loadSessions();
  return sessions.find(session => session.id === id);
};

// Create a new chat session
export const createChatSession = (model: string): ChatSession => {
  const sessions = loadSessions();
  const newSession: ChatSession = {
    id: generateId(),
    title: `New Chat`,
    timestamp: Date.now(),
    messages: [],
    model
  };
  
  saveSessions([newSession, ...sessions]);
  return newSession;
};

// Update a chat session
export const updateChatSession = (id: string, updates: Partial<ChatSession>): ChatSession | undefined => {
  const sessions = loadSessions();
  const index = sessions.findIndex(session => session.id === id);
  
  if (index !== -1) {
    // Update the session
    const updatedSession = { ...sessions[index], ...updates };
    sessions[index] = updatedSession;
    
    // Update title if it's the first message
    if (updates.messages && 
        updates.messages.length === 1 && 
        sessions[index].messages.length === 0) {
      const firstUserMessage = updates.messages[0];
      if (firstUserMessage && firstUserMessage.isUser) {
        updatedSession.title = getDefaultTitle(firstUserMessage.content);
      }
    }
    
    saveSessions(sessions);
    return updatedSession;
  }
  
  return undefined;
};

// Add a message to a chat session
export const addMessageToChatSession = (id: string, message: ChatMessage): ChatSession | undefined => {
  const sessions = loadSessions();
  const index = sessions.findIndex(session => session.id === id);
  
  if (index !== -1) {
    // Create a copy of messages and add the new message
    const messages = [...sessions[index].messages, message];
    
    // Update the session
    const updatedSession = { 
      ...sessions[index], 
      messages,
      timestamp: Date.now()
    };
    
    // Update title if it's the first user message
    if (messages.length === 1 && message.isUser) {
      updatedSession.title = getDefaultTitle(message.content);
    }
    
    sessions[index] = updatedSession;
    saveSessions(sessions);
    
    return updatedSession;
  }
  
  return undefined;
};

// Delete a chat session
export const deleteChatSession = (id: string): boolean => {
  const sessions = loadSessions();
  const filteredSessions = sessions.filter(session => session.id !== id);
  
  if (filteredSessions.length !== sessions.length) {
    saveSessions(filteredSessions);
    return true;
  }
  
  return false;
};

// Export a default function to create a new session if none exists
export const getOrCreateActiveSession = (model: string): ChatSession => {
  const sessions = loadSessions();
  
  if (sessions.length === 0) {
    return createChatSession(model);
  }
  
  // Return the most recent session
  return sessions[0];
};