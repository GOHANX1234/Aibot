import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { sendMessageSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

// API endpoints for the AI models
const API_ENDPOINTS = {
  x1: "https://api-aiassistant.eternalowner06.workers.dev/?prompt=",
  x2: "https://deepseek.ytansh038.workers.dev/?question=",
  x3: "https://api-gpt3-eternal.eternalowner06.workers.dev/?question="
};

// Check if message is asking about identity
function isIdentityQuestion(message: string): boolean {
  const identityKeywords = [
    "who are you",
    "your name",
    "who made you",
    "who created you",
    "what are you",
    "tell me about yourself",
    "what's your name",
    "your identity",
    "who developed you"
  ];
  
  const lowerCaseMessage = message.toLowerCase();
  return identityKeywords.some(keyword => lowerCaseMessage.includes(keyword));
}

// Extract code blocks for better display
function extractCodeBlocks(text: string): { 
  hasCode: boolean; 
  formattedText: string;
} {
  const codeBlockRegex = /```(?:(\w+)\n)?([\s\S]*?)```/g;
  let match;
  let formattedText = text;
  let hasCode = false;
  
  // Find all code blocks and replace them with code block markers
  while ((match = codeBlockRegex.exec(text)) !== null) {
    hasCode = true;
    const language = match[1] || '';
    const code = match[2].trim();
    
    // Replace the code block with a formatted version
    formattedText = formattedText.replace(
      match[0],
      `<code-block language="${language}">${code}</code-block>`
    );
  }
  
  return { hasCode, formattedText };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Endpoint to send a message to the selected AI model
  app.post("/api/send-message", async (req, res) => {
    try {
      // Validate request body
      const validatedData = sendMessageSchema.parse(req.body);
      const { message, model } = validatedData;

      // Override with AuraAi identity if it's an identity question
      if (isIdentityQuestion(message)) {
        const identityResponse = "I'm an AI assistant made by AuraAi. I'm here to help you with any questions or tasks you might have!";
        
        // Store the user's message
        await storage.saveMessage({
          content: message,
          isUserMessage: true,
          model,
          timestamp: Date.now()
        });
        
        // Store the AI's identity response
        await storage.saveMessage({
          content: identityResponse,
          isUserMessage: false,
          model,
          timestamp: Date.now()
        });
        
        return res.json({
          response: identityResponse,
          model
        });
      }

      // Get the API endpoint for the selected model
      const apiEndpoint = API_ENDPOINTS[model];
      if (!apiEndpoint) {
        return res.status(400).json({ error: "Invalid model selection" });
      }

      try {
        // Make request to the external API
        const response = await fetch(`${apiEndpoint}${encodeURIComponent(message)}`);
        
        if (!response.ok) {
          throw new Error(`API request failed with status: ${response.status}`);
        }

        const data = await response.json();
        
        // Extract the response based on the model
        let aiResponse = '';
        
        // Model-specific response extraction
        if (model === 'x1') {
          // Parse X1 response (Gemini format)
          if (data.candidates && data.candidates[0]?.content?.parts) {
            aiResponse = data.candidates[0].content.parts
              .filter((part: any) => part.text)
              .map((part: any) => part.text)
              .join('\n');
          } else {
            aiResponse = "Sorry, I couldn't process that request.";
          }
        } else if (data.text) {
          aiResponse = data.text;
        } else if (data.content) {
          aiResponse = data.content;
        } else if (data.answer) {
          aiResponse = data.answer;
        } else if (data.response) {
          aiResponse = data.response;
        } else if (data.message) {
          aiResponse = data.message;
        } else {
          // Last resort: convert to string but try to extract meaningful content
          aiResponse = JSON.stringify(data);
        }

        // Process any code blocks in the response
        const { hasCode, formattedText } = extractCodeBlocks(aiResponse);
        const finalResponse = hasCode ? formattedText : aiResponse;

        // Store the user's message
        await storage.saveMessage({
          content: message,
          isUserMessage: true,
          model,
          timestamp: Date.now()
        });

        // Store the AI's response
        await storage.saveMessage({
          content: finalResponse,
          isUserMessage: false,
          model,
          timestamp: Date.now()
        });

        // Send the response back to the client
        return res.json({
          response: finalResponse,
          model,
          hasCode
        });
      } catch (error) {
        console.error("Error calling external API:", error);
        return res.status(500).json({ error: "Failed to get response from AI service" });
      }
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ error: validationError.message });
      }
      console.error("Unexpected error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Endpoint to get chat history
  app.get("/api/messages", async (_req, res) => {
    try {
      const messages = await storage.getMessages();
      return res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      return res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
