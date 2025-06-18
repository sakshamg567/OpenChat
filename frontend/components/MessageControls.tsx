import { Dispatch, SetStateAction, useState } from 'react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { Check, Copy, RefreshCcw } from 'lucide-react';
import { UIMessage } from 'ai';
import { UseChatHelpers } from '@ai-sdk/react';
import { useAPIKeyStore } from '@/frontend/stores/APIKeyStore';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { toast } from 'sonner';

interface MessageControlsProps {
   threadId: string;
   message: UIMessage;
   setMessages: UseChatHelpers['setMessages'];
   content: string;
   setMode?: Dispatch<SetStateAction<'view' | 'edit'>>;
   reload: UseChatHelpers['reload'];
   stop: UseChatHelpers['stop'];
}

export default function MessageControls({
   threadId,
   message,
   setMessages,
   content,
   setMode,
   reload,
   stop,
}: MessageControlsProps) {
   const [copied, setCopied] = useState(false);
   const hasRequiredKeys = useAPIKeyStore((state) => state.hasRequiredKeys());

   const handleCopy = () => {
      navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => {
         setCopied(false);
      }, 2000);
   };

   const deleteTrailingMessages = useMutation(api.queries.deleteTrailingMessages);

   const handleRegenerate = async () => {
      try {
         // stop the current request
         stop();

         const dateString = message.createdAt?.getTime();

         // Add null check and don't proceed if createdAt is missing
         if (!dateString) {
            console.error('Message createdAt is missing, cannot regenerate');
            toast.error('Cannot regenerate: message timestamp is missing');
            return;
         }

         if (message.role === 'user') {
            await deleteTrailingMessages({
               threadId,
               createdAt: dateString,
               gte: false,
            });

            setMessages((messages) => {
               const index = messages.findIndex((m) => m.id === message.id);
               if (index !== -1) {
                  return [...messages.slice(0, index + 1)];
               }
               return messages;
            });
         } else {
            await deleteTrailingMessages({
               threadId,
               createdAt: dateString,
            });

            setMessages((messages) => {
               const index = messages.findIndex((m) => m.id === message.id);
               if (index !== -1) {
                  return [...messages.slice(0, index)];
               }
               return messages;
            });
         }

         // Use requestAnimationFrame to avoid setState loop
         requestAnimationFrame(() => {
            reload();
         });
      } catch (error) {
         console.error('Error regenerating message:', error);
         toast.error('Failed to regenerate message');
      }
   };

   return (
      <div
         className={cn(
            'opacity-0 group-hover:opacity-100 transition-opacity duration-100 flex gap-1',
            {
               'absolute mt-5 right-2': message.role === 'user',
            }
         )}
      >
         <Button variant="ghost" size="icon" onClick={handleCopy}>
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
         </Button>
         {/* {setMode && hasRequiredKeys && (
            <Button variant="ghost" size="icon" onClick={() => setMode('edit')}>
               <SquarePen className="w-4 h-4" />
            </Button>
         )} */}
         {hasRequiredKeys && (
            <Button variant="ghost" size="icon" onClick={handleRegenerate}>
               <RefreshCcw className="w-4 h-4" />
            </Button>
         )}
      </div>
   );
}