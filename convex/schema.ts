import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { UIMessage } from "ai";

export interface Message {
   threadId: string,
   message: {
      id: string,
      parts: UIMessage["parts"];
      content: string,
      role: 'user' | 'assistant' | 'system' | 'data';
      createdAt: number;
   }
}

export interface Thread {
   threadId: string,
   title: string,
   createdAt: number,
   updatedAt: number
}

export default defineSchema({
   threads: defineTable({
      threadId: v.string(),
      title: v.string(),
      createdAt: v.number(),
      updatedAt: v.number(),
   }).index("by_updated", ["updatedAt"]),
   messages: defineTable({
      threadId: v.string(),
      message: v.object({
         id: v.string(),
         role: v.union(
            v.literal("user"),
            v.literal("assistant"),
            v.literal("system"),
            v.literal("data")
         ),
         parts: v.any(),
         content: v.string(),
         createdAt: v.number(),
      })
   }).index("by_thread", ["threadId"])
      .index("by_thread_created", ["threadId", "message.createdAt"])
})