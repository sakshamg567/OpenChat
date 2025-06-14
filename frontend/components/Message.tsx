import { cn } from "@/lib/utils";
import { UseChatHelpers } from "@ai-sdk/react";
import { UIMessage } from "ai";
import equal from 'fast-deep-equal'
import { memo } from "react";

function pureMessage({
   threadId,
   message,
   setMessages,
   reload,
   isStreaming,
   // registerRef,
   stop
}: {
   threadId: string;
   message: UIMessage;
   setMessages: UseChatHelpers['setMessages'],
   reload: UseChatHelpers['reload'],
   isStreaming: boolean,
   stop: UseChatHelpers['stop']
}) {
   return (
      <div
         role="article"
         className={cn(
            'flex flex-col',
            message.role === 'user' ? 'items-end' : 'items-start'
         )}
      >
         {message.parts.map((part, index) => {
            const { type } = part;
            const key = `message-${message.id}-part-${index}`;
            if (type === 'text') {
               return message.role === 'user' ? (
                  <div key={key}>
                     <p>{part.text}</p>
                  </div>
               ) : (
                  <div key={key}>{part.text}</div>
               )
            }
         })}
      </div>
   )
}

const PreviewMessage = memo(pureMessage, (prevProps, nextProps) => {
   if (prevProps.message.id !== nextProps.message.id) return false;
   if (!equal(prevProps.message.parts, nextProps.message.parts)) return false;
   return true;
})

PreviewMessage.displayName = 'PreviewMessage';

export default PreviewMessage;