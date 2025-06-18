import Chat from '@/frontend/components/Chat';
import { useParams } from 'react-router';
import { useQuery } from 'convex/react';
import { UIMessage } from 'ai';
import { api } from '@/convex/_generated/api';

export default function Thread() {
   const { id } = useParams();
   if (!id) throw new Error('Thread ID is required');
   const messages = useQuery(api.queries.getMessagesByThreadId, { threadId: id });

   const initialMessages: UIMessage[] = messages?.map(msg => ({
      id: msg.message.id,
      role: msg.message.role,
      parts: msg.message.parts,
      content: msg.message.content,
   })) || [];

   console.log("initial messages from thread: ", initialMessages);


   return (
      <Chat
         key={id}
         threadId={id}
         initialMessages={initialMessages || []}
      />
   );
}
