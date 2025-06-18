import { useCompletion } from '@ai-sdk/react';
import { useAPIKeyStore } from '@/frontend/stores/APIKeyStore';
import { toast } from 'sonner';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
interface MessageSummaryPayload {
   title: string;
   isTitle?: boolean;
   messageId: string;
   threadId: string;
}

export const useMessageSummary = () => {
   const getKey = useAPIKeyStore((state) => state.getKey);

   const updateThreadMutation = useMutation(api.queries.updateThread);

   const { complete, isLoading } = useCompletion({
      api: '/api/completion',
      ...(getKey('google') && {
         headers: { 'X-Google-API-Key': getKey('google')! },
      }),
      onResponse: async (response) => {
         try {
            const payload: MessageSummaryPayload = await response.json();

            if (response.ok) {
               const { title, isTitle, messageId, threadId } = payload;

               if (isTitle) {
                  await updateThreadMutation({ threadId, title });
               }
            } else {
               toast.error('Failed to generate a summary for the message');
            }
         } catch (error) {
            console.error(error);
         }
      },
   });

   return {
      complete,
      isLoading,
   };
};
