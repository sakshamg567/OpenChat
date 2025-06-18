import { v } from "convex/values";
import { mutation, query } from "./_generated/server";


export const getThreads = query({
   handler: async (ctx) => {
      return await ctx.db
         .query("threads")
         .withIndex("by_updated")
         .order("desc")
         .collect();
   }
})

export const createThread = mutation({
   args: {
      id: v.string()
   },
   handler: async (ctx, args) => {
      const now = Date.now();
      return await ctx.db.insert("threads", {
         threadId: args.id,
         title: 'New Chat',
         createdAt: now,
         updatedAt: now,
      });
   }
})


export const updateThread = mutation({
   args: {
      threadId: v.string(),
      title: v.string()
   },
   handler: async (ctx, args) => {
      const thread = await ctx.db
         .query("threads")
         .filter((q) => q.eq(q.field("threadId"), args.threadId))
         .first();

      if (!thread) {
         throw new Error("thread not found");
      }

      return await ctx.db.patch(thread._id, {
         title: args.title,
         updatedAt: Date.now(),
      })
   }
})

export const deleteThread = mutation({
   args: {
      threadId: v.string()
   },
   handler: async (ctx, args) => {
      const messages = await ctx.db
         .query("messages")
         .withIndex("by_thread", (q) => q.eq("threadId", args.threadId))
         .collect();

      for (const msg of messages) {
         await ctx.db.delete(msg._id);
      }


      const thread = await ctx.db
         .query("threads")
         .filter((q) => q.eq(q.field("threadId"), args.threadId))
         .first();

      if (thread) {
         await ctx.db.delete(thread._id)
      }
   }
})

export const getMessagesByThreadId = query({
   args: { threadId: v.string() },
   handler: async (ctx, args) => {
      return await ctx.db
         .query("messages")
         .withIndex("by_thread_created", (q) => q.eq('threadId', args.threadId))
         .order("asc")
         .collect()
   }
})

export const createMessage = mutation({
   args: {
      threadId: v.string(),
      message: v.object({
         id: v.string(),
         role: v.union(
            v.literal("user"),
            v.literal("assistant"),
            v.literal("system"),
            v.literal("data"),
         ),
         parts: v.any(),
         content: v.string(),
      })
   },
   handler: async (ctx, args) => {
      const now = Date.now();
      const messageId = await ctx.db.insert("messages", {
         threadId: args.threadId,
         message: {
            id: args.message.id,
            role: args.message.role,
            parts: args.message.parts,
            content: args.message.content,
            createdAt: now,
         }
      });

      const thread = await ctx.db
         .query("threads")
         .filter((q) => q.eq(q.field("threadId"), args.threadId))
         .first();

      if (thread) {
         await ctx.db.patch(thread._id, {
            updatedAt: now
         })
      }

      return messageId;
   }

})

export const deleteTrailingMessages = mutation({
   args: {
      threadId: v.string(),
      createdAt: v.number(),
      gte: v.optional(v.boolean())
   },
   handler: async (ctx, args) => {
      const gte = args.gte ?? true;

      // Get messages to delete based on timestamp comparison
      const messagesToDelete = await ctx.db
         .query("messages")
         .withIndex("by_thread_created", (q) => q.eq("threadId", args.threadId))
         .filter((q) =>
            gte
               ? q.gte(q.field("message.createdAt"), args.createdAt)
               : q.gt(q.field("message.createdAt"), args.createdAt)
         )
         .collect();

      // Delete each message
      for (const message of messagesToDelete) {
         await ctx.db.delete(message._id);
      }

      // Update thread's updatedAt timestamp
      const thread = await ctx.db
         .query("threads")
         .filter((q) => q.eq(q.field("threadId"), args.threadId))
         .first();

      if (thread) {
         await ctx.db.patch(thread._id, {
            updatedAt: Date.now()
         });
      }

      return messagesToDelete.length;
   }
});

// export const deleteTrailingMessages = async (
//   threadId: string,
//   createdAt: Date,
//   gte: boolean = true
// ) => {
//   const startKey = gte
//     ? [threadId, createdAt]
//     : [threadId, new Date(createdAt.getTime() + 1)];
//   const endKey = [threadId, Dexie.maxKey];

//   return await db.transaction(
//     'rw',
//     [db.messages, db.messageSummaries],
//     async () => {
//       const messagesToDelete = await db.messages
//         .where('[threadId+createdAt]')
//         .between(startKey, endKey)
//         .toArray();

//       const messageIds = messagesToDelete.map((msg) => msg.id);

//       await db.messages
//         .where('[threadId+createdAt]')
//         .between(startKey, endKey)
//         .delete();

//       if (messageIds.length > 0) {
//         await db.messageSummaries.where('messageId').anyOf(messageIds).delete();
//       }
//     }
//   );
// };

// export const createMessageSummary = async (
//   threadId: string,
//   messageId: string,
//   content: string
// ) => {
//   return await db.messageSummaries.add({
//     id: uuidv4(),
//     threadId,
//     messageId,
//     content,
//     createdAt: new Date(),
//   });
// };

// export const getMessageSummaries = async (threadId: string) => {
//   return await db.messageSummaries
//     .where('[threadId+createdAt]')
//     .between([threadId, Dexie.minKey], [threadId, Dexie.maxKey])
//     .toArray();
// };
