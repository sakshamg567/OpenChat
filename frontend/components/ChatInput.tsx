import { ChevronDown, Check, ArrowUpIcon } from 'lucide-react';
import { Dispatch, memo, SetStateAction, useCallback, useMemo } from 'react';
import { Textarea } from '@/frontend/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Button } from '@/frontend/components/ui/button';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from '@/frontend/components/ui/dropdown-menu';
import useAutoResizeTextarea from '@/hooks/useAutoResizeTextArea';
import { UseChatHelpers, useCompletion } from '@ai-sdk/react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router';

// should come from convex

import { useMutation } from "convex/react"
import { api } from '@/convex/_generated/api';
import { useAPIKeyStore } from '@/frontend/stores/APIKeyStore';
import { useModelStore } from '@/frontend/stores/ModelStore';
import { AI_MODELS, AIModel, getModelConfig, hasCapability } from '@/lib/models';
// import KeyPrompt from '@/frontend/components/KeyPrompt';
import { UIMessage } from 'ai';
import { v4 as uuidv4 } from 'uuid';
import { StopIcon } from './ui/icons';
import { useMessageSummary } from '../hooks/useMessageSummary';
import { CapabilityList } from './ui/capability-badge';
import { WebSearchToggle } from './ui/webSearchToggle';
import { useCapabilityStore } from '@/frontend/stores/CapabilityStore';

interface ChatInputProps {
   threadId: string;
   input: UseChatHelpers['input'];
   status: UseChatHelpers['status'];
   setInput: UseChatHelpers['setInput'];
   append: UseChatHelpers['append'];
   stop: UseChatHelpers['stop'];
   // webSearchEnabled: boolean;
   // setWebSearchEnabled: Dispatch<SetStateAction<boolean>>;
}

interface StopButtonProps {
   stop: UseChatHelpers['stop'];
}

interface SendButtonProps {
   onSubmit: () => void;
   disabled: boolean;
}

const createUserMessage = (id: string, text: string): UIMessage => ({
   id,
   parts: [{ type: 'text', text }],
   role: 'user',
   content: text,
});

function PureChatInput({
   threadId,
   input,
   status,
   setInput,
   append,
   stop,
   // webSearchEnabled,
   // setWebSearchEnabled
}: ChatInputProps) {
   const canChat = useAPIKeyStore((state) => state.hasRequiredKeys());
   const { textareaRef, adjustHeight } = useAutoResizeTextarea({
      minHeight: 72,
      maxHeight: 200,
   });
   const { selectedModel } = useModelStore();
   const supportsWebSearch = hasCapability(selectedModel, 'web_search');

   const navigate = useNavigate();
   const { id } = useParams();

   // Move useMutation to the top level of the component
   const createThreadMutation = useMutation(api.queries.createThread);
   const createMessageMutation = useMutation(api.queries.createMessage);

   const isDisabled = useMemo(
      () => !input.trim() || status === 'streaming' || status === 'submitted',
      [input, status]
   );

   const { complete } = useMessageSummary();

   const handleSubmit = useCallback(async () => {
      const currentInput = textareaRef.current?.value || input;

      if (
         !currentInput.trim() ||
         status === 'streaming' ||
         status === 'submitted'
      )
         return;

      const messageId = uuidv4();

      if (!id) {
         navigate(`/chat/${threadId}`);
         await createThreadMutation({ id: threadId });
         complete(currentInput.trim(), {
            body: { threadId, messageId, isTitle: true },
         });
      } else {
         // complete(currentInput.trim(), { body: { messageId, threadId } });
      }

      const userMessage = createUserMessage(messageId, currentInput.trim());
      await createMessageMutation({ threadId: id || threadId, message: userMessage });

      append(userMessage);
      setInput('');
      adjustHeight(true);
   }, [
      input,
      status,
      setInput,
      adjustHeight,
      append,
      id,
      textareaRef,
      threadId,
      createThreadMutation,
      createMessageMutation,
      navigate
      // complete,
   ]);

   // if (!canChat) {
   // return <KeyPrompt />;
   // }

   const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         handleSubmit();
      }
   };

   const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInput(e.target.value);
      adjustHeight();
   };

   const webSearchEnabled = useCapabilityStore((state) => state.webSearchEnabled);
   const toggleWebSearch = useCapabilityStore((state) => state.toggleWebSearch);

   return (
      <div className='absolute bottom-0 left-0 right-0 flex justify-center px-4'>
         <div className='w-full max-w-3xl p-2 pb-0 rounded-3xl rounded-b-none border border-border/50 backdrop:blur-3xl bg-background/50'
            style={{
               backdropFilter: 'blur(20px)'
            }}>
            <div className="rounded-t-[20px] p-2 pb-2 w-full border border-zinc-800 bg-[#2B2431]/30">
               <div className="relative">
                  <div className="flex flex-col">
                     <div className="overflow-y-auto max-h-[300px]">
                        <Textarea
                           id='text-area'
                           value={input}
                           ref={textareaRef}
                           className={cn(
                              'rounded-b-none',
                              'dark:bg-transparent',
                              'w-full px-4 py-3 border-none shadow-none',
                              'placeholder:text-muted-foreground resize-none',
                              'focus-visible:ring-0 focus-visible:ring-offset-0',
                              'scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted-foreground/30',
                              'scrollbar-thumb-rounded-full',
                              'min-h-[72px]'
                           )}
                           placeholder="Type your message here..."
                           onChange={handleInputChange}
                           onKeyDown={handleKeyDown}
                        />
                        <span id="chat-input-description" className="sr-only">
                           Press Enter to send, Shift+Enter for new line
                        </span>
                     </div>
                     <div className="h-14 flex items-center px-2">
                        <div className="flex items-center justify-between w-full">
                           <div className='flex flex-row gap-5'>
                              <ChatModelDropdown />
                              {supportsWebSearch && (<WebSearchToggle
                                 enabled={webSearchEnabled}
                                 onToggle={toggleWebSearch}
                              />)}
                           </div>
                           {status === 'submitted' || status === 'streaming' ? (
                              <StopButton stop={stop} />
                           ) : (
                              <SendButton onSubmit={handleSubmit} disabled={isDisabled} />
                           )}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}

const ChatInput = memo(PureChatInput, (prevProps, nextProps) => {
   if (prevProps.input !== nextProps.input) return false;
   if (prevProps.status !== nextProps.status) return false;
   return true;
});

const PureChatModelDropdown = () => {
   const getKey = useAPIKeyStore((state) => state.getKey);
   const { selectedModel, setModel } = useModelStore();

   const isModelEnabled = useCallback(
      (model: AIModel) => {
         const modelConfig = getModelConfig(model);
         const apiKey = getKey(modelConfig.provider);
         return !!apiKey;
      },
      [getKey]
   );

   return (
      <div className="flex items-center gap-2">
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Button
                  variant="ghost"
                  className="flex items-center gap-1 h-8 pl-2 pr-2 text-xs rounded-md text-foreground hover:bg-primary/10 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-blue-500"
                  aria-label={`Selected model: ${selectedModel}`}
               >
                  <div className="flex items-center gap-1">
                     {selectedModel}
                     <ChevronDown className="w-3 h-3 opacity-50" />
                  </div>
               </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
               className={cn('min-w-[10rem]', 'border-border', 'bg-popover')}
            >
               {AI_MODELS.map((model) => {
                  const isEnabled = isModelEnabled(model);
                  const config = getModelConfig(model);
                  return (
                     <DropdownMenuItem
                        key={model}
                        onSelect={() => isEnabled && setModel(model)}
                        disabled={!isEnabled}
                        className={cn(
                           'flex items-center justify-between gap-2',
                           'cursor-pointer'
                        )}
                     >
                        <span>{model}</span>
                        {selectedModel === model && (
                           <Check
                              className="w-4 h-4 text-blue-500"
                              aria-label="Selected"
                           />
                        )}
                        <CapabilityList
                           capabilities={config.capabilities}
                           maxVisible={4}
                           size='sm'
                        />
                     </DropdownMenuItem>
                  );
               })}
            </DropdownMenuContent>
         </DropdownMenu>
      </div>
   );
};

const ChatModelDropdown = memo(PureChatModelDropdown);

function PureStopButton({ stop }: StopButtonProps) {
   return (
      <Button
         variant="outline"
         size="icon"
         onClick={stop}
         aria-label="Stop generating response"
      >
         <StopIcon size={20} />
      </Button>
   );
}

const StopButton = memo(PureStopButton);

const PureSendButton = ({ onSubmit, disabled }: SendButtonProps) => {
   return (
      <Button
         onClick={onSubmit}
         variant="default"
         size="icon"
         disabled={disabled}
         aria-label="Send message"
      >
         <ArrowUpIcon size={18} />
      </Button>
   );
};

const SendButton = memo(PureSendButton);

export default ChatInput;