import { useChat } from '@ai-sdk/react';
import ChatInput from './ChatInput';
// import ChatNavigator from './ChatNavigator';
import { UIMessage } from 'ai';
import { v4 as uuidv4 } from 'uuid';
import { useAPIKeyStore } from '@/frontend/stores/APIKeyStore';
import { useModelStore } from '@/frontend/stores/ModelStore';
import { useCapabilityStore } from '@/frontend/stores/CapabilityStore';
// import ThemeToggler from './ui/ThemeToggler';
import { SidebarInset, SidebarTrigger, useSidebar } from './ui/sidebar';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';
import Messages from './Messages';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useLocation, useNavigate } from 'react-router';
import { useState, useEffect, use } from 'react';
import { ScrollToBottom } from './ScrollToBottom';
import { useTitle } from 'react-haiku';
import { useUserId } from '@/hooks/useUserId';
// import { useChatNavigator } from '@/frontend/hooks/useChatNavigator';

interface ChatProps {
   threadId: string;
   initialMessages: UIMessage[];
}

export default function Chat({ threadId, initialMessages }: ChatProps) {
   const { getKey } = useAPIKeyStore();
   const selectedModel = useModelStore((state) => state.selectedModel);
   const modelConfig = useModelStore((state) => state.getModelConfig());
   const webSearchEnabled = useCapabilityStore((state) => state.webSearchEnabled);

   const thread = useQuery(api.queries.getThreadsById, { threadId });

   useTitle(thread?.title ? `${thread.title} - OpenChat` : 'OpenChat')

   const userId = useUserId();

   // const {
   // isNavigatorVisible,
   // handleToggleNavigator,
   // closeNavigator,
   // registerRef,
   // scrollToMessage,
   // } = useChatNavigator();

   const createMessageMutation = useMutation(api.queries.createMessage);

   useEffect(() => {
      console.log(initialMessages);
   })

   const {
      messages,
      input,
      status,
      setInput,
      setMessages,
      append,
      stop,
      reload,
      error,
   } = useChat({
      id: threadId,
      initialMessages,
      experimental_throttle: 50,
      onFinish: async ({ parts }) => {
         const aiMessage: UIMessage = {
            id: uuidv4(),
            parts: parts as UIMessage['parts'],
            role: 'assistant',
            content: '',
         };

         try {
            console.log("thread id : ", threadId);

            await createMessageMutation({ threadId: threadId, message: aiMessage });
         } catch (error) {
            console.error(error);
         }
      },
      headers: {
         [modelConfig.headerKey]: getKey(modelConfig.provider) || '',
      },
      body: {
         model: selectedModel,
         useWebSearch: webSearchEnabled,
      },
   });

   return (
      <SidebarInset className='border border-border border-r-0 border-b-0 flex flex-col h-screen overflow-hidden mt-2 rounded-tr-none rounded-md relative'>
         <ChatSidebarTrigger />
         {/* Messages container - full height with padding for floating input */}
         <div className="flex-1 overflow-y-auto overflow-x-hidden" data-scroll-container>
            <div className="w-full max-w-3xl mx-auto px-4 pt-10 pb-56">
               <Messages
                  threadId={threadId}
                  messages={messages}
                  status={status}
                  setMessages={setMessages}
                  reload={reload}
                  error={error}
                  stop={stop}
               />
            </div>
         </div>

         {/* Floating ChatInput */}
         <div className="absolute bottom-0 left-0 right-0 z-10">
            <div className="w-full max-w-3xl mx-auto px-4 py-4">
               <ChatInput
                  threadId={threadId}
                  input={input}
                  status={status}
                  append={append}
                  setInput={setInput}
                  stop={stop}
                  userId={userId as string}
               />
            </div>
         </div>

         <ScrollToBottom />
      </SidebarInset>
   );
}


const ChatSidebarTrigger = () => {
   const { state } = useSidebar();
   const [isAnimated, setIsAnimated] = useState(false);
   const location = useLocation();
   const navigate = useNavigate();

   const isOnBaseChatRoute = location.pathname === '/chat';

   useEffect(() => {
      if (state === 'collapsed') {
         setIsAnimated(false);
         // Trigger animation after component mounts
         const timer = setTimeout(() => {
            setIsAnimated(true);
         }, 100); // Small delay to ensure smooth animation

         return () => clearTimeout(timer);
      } else {
         setIsAnimated(false);
      }
   }, [state]);

   if (state === 'collapsed') {
      return (
         <div className={`flex flex-row fixed left-4 top-6 z-100 items-center rounded-sm p-0.5 text-sidebar-foreground scale-125 transition-all duration-500 ease-in-out overflow-hidden ${isAnimated ? 'bg-[#1B181D]' : 'bg-[#1B181D]/0'
            }`}>
            <SidebarTrigger className="rounded-sm transition-all duration-300 ease-in-out" />
            <Button
               data-sidebar="trigger"
               data-slot="sidebar-trigger"
               variant="ghost"
               size="icon"
               className={`size-7 rounded-sm transition-all duration-500 ease-in-out ${isAnimated
                  ? 'translate-x-0 opacity-100'
                  : 'translate-x-[-100%] opacity-0'
                  }`}
               onClick={() => {
                  if (!isOnBaseChatRoute) {
                     navigate("/");
                  }
               }}
               disabled={isOnBaseChatRoute}
            >
               <Plus className={`transition-transform duration-500 ease-in-out`} />
               <span className="sr-only">New Chat</span>
            </Button>
         </div>
      )
   }
   return null;
};