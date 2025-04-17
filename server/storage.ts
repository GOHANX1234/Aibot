import { InsertMessage, Message } from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  saveMessage(message: InsertMessage): Promise<Message>;
  getMessages(): Promise<Message[]>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private messages: Map<number, Message>;
  private currentId: number;

  constructor() {
    this.messages = new Map();
    this.currentId = 1;
  }

  async saveMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.currentId++;
    const message = { ...insertMessage, id };
    this.messages.set(id, message);
    return message;
  }

  async getMessages(): Promise<Message[]> {
    return Array.from(this.messages.values())
      .sort((a, b) => a.timestamp - b.timestamp);
  }
}

// Export the storage instance
export const storage = new MemStorage();
