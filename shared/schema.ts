import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Define the available AI models
export const AI_MODELS = {
  X1: 'x1',
  X2: 'x2',
  X3: 'x3'
} as const;

// Message schema for the chat
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  isUserMessage: boolean("is_user_message").notNull(),
  model: text("model").notNull(),
  timestamp: integer("timestamp").notNull()
});

// Schema for inserting a new message
export const insertMessageSchema = createInsertSchema(messages).pick({
  content: true,
  isUserMessage: true,
  model: true,
  timestamp: true,
});

// Type definitions for TypeScript
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

// API endpoint schemas
export const sendMessageSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
  model: z.enum([AI_MODELS.X1, AI_MODELS.X2, AI_MODELS.X3])
});

export type SendMessageRequest = z.infer<typeof sendMessageSchema>;
export type SendMessageResponse = {
  response: string;
  model: string;
  hasCode?: boolean;
};
