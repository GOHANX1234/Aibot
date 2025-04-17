import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { SendMessageResponse } from "@shared/schema";

type Message = {
  content: string;
  isUser: boolean;
};

export function useChat(model: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  
  const mutation = useMutation({
    mutationFn: async (message: string): Promise<SendMessageResponse> => {
      const response = await apiRequest("POST", "/api/send-message", {
        message,
        model
      });
      return response.json();
    },
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        { content: data.response, isUser: false }
      ]);
    }
  });

  const sendMessage = (content: string) => {
    // Add user message immediately to UI
    setMessages((prev) => [...prev, { content, isUser: true }]);
    
    // Send to API
    mutation.mutate(content);
  };

  return {
    messages,
    isLoading: mutation.isPending,
    sendMessage,
    error: mutation.error
  };
}
