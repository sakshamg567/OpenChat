import { UseChatHelpers, useCompletion } from '@ai-sdk/react';
import { useState } from 'react';
import { UIMessage } from 'ai';
import { Dispatch, SetStateAction } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { useAPIKeyStore } from '@/frontend/stores/APIKeyStore';
import { toast } from 'sonner';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

export default function MessageEditor({
   threadId,
   message,
   content,
   setMessages,
   reload,
   setMode,
   stop,
}: {
   threadId: string;
   message: UIMessage;
   content: string;
   setMessages: UseChatHelpers['setMessages'];
   setMode: Dispatch<SetStateAction<'view' | 'edit'>>;
   reload: UseChatHelpers['reload'];
   stop: UseChatHelpers['stop'];
}) {
   const [draftContent, setDraftContent] = useState(content);
   const getKey = useAPIKeyStore((state) => state.getKey);

   const createMessage = useMutation(api.queries.createMessage);
   const deleteTrailingMessages = useMutation(api.queries.deleteTrailingMessages);

   const { complete } = useCompletion({
      api: '/api/completion',
      ...(getKey('google') && {
         headers: { 'X-Google-API-Key': getKey('google')! },
      }),
      onResponse: async (response) => {
         try {
            const payload = await response.json();

            if (response.ok) {
               const { title, messageId, threadId } = payload;
               // await createMessageSummary(threadId, messageId, title);
            } else {
               toast.error(
                  payload.error || 'Failed to generate a summary for the message'
               );
            }
         } catch (error) {
            console.error(error);
         }
      },
   });

   const handleSave = async () => {
      try {
         const dateString = message.createdAt?.getTime();

         // Add null check and don't proceed if createdAt is missing
         if (!dateString) {
            console.error('Message createdAt is missing, cannot save');
            toast.error('Cannot save: message timestamp is missing');
            return;
         }

         await deleteTrailingMessages({ threadId, createdAt: dateString });

         const updatedMessage = {
            ...message,
            id: uuidv4(),
            content: draftContent,
            parts: [
               {
                  type: 'text' as const,
                  text: draftContent,
               },
            ],
            createdAt: new Date(),
         };

         // Convert createdAt to timestamp for Convex
         const messageForConvex = {
            ...updatedMessage,
            createdAt: updatedMessage.createdAt?.getTime() || Date.now()
         };

         await createMessage({ threadId, message: messageForConvex });

         setMessages((messages) => {
            const index = messages.findIndex((m) => m.id === message.id);
            if (index !== -1) {
               return [...messages.slice(0, index), updatedMessage];
            }
            return messages;
         });

         setMode('view');
         stop();

         // Use requestAnimationFrame to avoid setState loop
         requestAnimationFrame(() => {
            reload();
         });
      } catch (error) {
         console.error('Failed to save message:', error);
         toast.error('Failed to save message');
      }
   };

   return (
      <div>
         <Textarea
            value={draftContent}
            onChange={(e) => setDraftContent(e.target.value)}
            onKeyDown={(e) => {
               if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSave();
               }
            }}
         />
         <div className="flex gap-2 mt-2">
            <Button onClick={handleSave}>Save</Button>
            <Button onClick={() => setMode('view')}>Cancel</Button>
         </div>
      </div>
   );
}