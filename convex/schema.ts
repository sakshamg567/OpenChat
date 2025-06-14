import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { UIMessage } from "ai";

interface Message {
   id: string,
   threadId: string,
   parts: UIMessage["parts"];
   content: string,
   role: 'user' | 'assistant' | 'system' | 'data';
   createdAt: Date;
}

interface Thread {
   id: string,
   title: string,
   createdAt: Date,
   updatedAt: Date
}

export default defineSchema({
   threads: defineTable({
      threadId: v.string(),
      title: v.string(),
      createdAt: v.number(),
      updatedAt: v.number()
   }),
   messages: defineTable({
      msgId: v.string(),
      threadId: v.string(),
      role: v.union(
         v.literal("user"),
         v.literal("assistant"),
         v.literal("system"),
         v.literal("data")
      ),
      parts: v.any(),
      content: v.string(),
      createdAt: v.number(),
   }).index("by_thread", ["threadId"])
      .index("by_thread_created", ["threadId", "createdAt"])
})