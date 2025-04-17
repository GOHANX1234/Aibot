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

export async function registerRoutes(app: Express): Promise<Server> {
  // Endpoint to send a message to the selected AI model
  app.post("/api/send-message", async (req, res) => {
    try {
      // Validate request body
      const validatedData = sendMessageSchema.parse(req.body);
      const { message, model } = validatedData;

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
        // Different APIs might have different response formats
        let aiResponse = '';
        
        // Check for common response fields across different APIs
        if (data.text) {
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
          // If no common field is found, use the entire response
          aiResponse = JSON.stringify(data);
        }

        // Store the user's message
        await storage.saveMessage({
          content: message,
          isUserMessage: true,
          model,
          timestamp: Date.now()
        });

        // Store the AI's response
        await storage.saveMessage({
          content: aiResponse,
          isUserMessage: false,
          model,
          timestamp: Date.now()
        });

        // Send the response back to the client
        return res.json({
          response: aiResponse,
          model
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
