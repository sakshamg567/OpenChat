import { memo, useState } from 'react';
import MarkdownRenderer from '@/frontend/components/MemoizedMarkdown';
import { cn } from '@/lib/utils';
import { UIMessage } from 'ai';
import equal from 'fast-deep-equal';
import MessageControls from './MessageControls';
import { UseChatHelpers } from '@ai-sdk/react';
import MessageEditor from './MessageEditor';
// import MessageReasoning from './MessageReasoning';

function PureMessage({
   threadId,
   message,
   setMessages,
   reload,
   isStreaming,
   // registerRef,
   stop,
}: {
   threadId: string;
   message: UIMessage;
   setMessages: UseChatHelpers['setMessages'];
   reload: UseChatHelpers['reload'];
   isStreaming: boolean;
   // registerRef: (id: string, ref: HTMLDivElement | null) => void;
   stop: UseChatHelpers['stop'];
}) {
   const [mode, setMode] = useState<'view' | 'edit'>('view');

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

            // if (type === 'reasoning') {
            // return (
            // <MessageReasoning
            // key={key}
            // reasoning={part.reasoning}
            // id={message.id}
            // />
            // );
            // }

            if (type === 'text') {
               return message.role === 'user' ? (
                  <div
                     key={key}
                     className="relative group px-4 py-3 rounded-xl bg-[#2C2532] border border-secondary-foreground/2 max-w-[80%]"
                  // ref={(el) => registerRef(message.id, el)}
                  >
                     {/* {mode === 'edit' && (
                        <MessageEditor
                           threadId={threadId}
                           message={message}
                           content={part.text}
                           setMessages={setMessages}
                           reload={reload}
                           setMode={setMode}
                           stop={stop}
                        />
                     )} */}
                     {mode === 'view' && <p>{part.text}</p>}

                     {mode === 'view' && (
                        <MessageControls
                           threadId={threadId}
                           content={part.text}
                           message={message}
                           setMode={setMode}
                           setMessages={setMessages}
                           reload={reload}
                           stop={stop}
                        />
                     )}
                  </div>
               ) : (
                  <div key={key} className="group flex flex-col gap-2 w-full">
                     <MarkdownRenderer content={part.text} id={message.id} />
                     {!isStreaming && (
                        <MessageControls
                           threadId={threadId}
                           content={part.text}
                           message={message}
                           setMessages={setMessages}
                           reload={reload}
                           stop={stop}
                        />
                     )}
                  </div>
               );
            }
         })}
      </div>
   );
}

const PreviewMessage = memo(PureMessage, (prevProps, nextProps) => {
   if (prevProps.isStreaming !== nextProps.isStreaming) return false;
   if (prevProps.message.id !== nextProps.message.id) return false;
   if (!equal(prevProps.message.parts, nextProps.message.parts)) return false;
   return true;
});

PreviewMessage.displayName = 'PreviewMessage';

export default PreviewMessage;
