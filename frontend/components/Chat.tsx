import { useChat } from '@ai-sdk/react';
import ChatInput from './ChatInput';
// import ChatNavigator from './ChatNavigator';
import { UIMessage } from 'ai';
import { v4 as uuidv4 } from 'uuid';
// import { createMessage } from '@/frontend/dexie/queries';
// import { useAPIKeyStore } from '@/frontend/stores/APIKeyStore';
// import { useModelStore } from '@/frontend/stores/ModelStore';
// import ThemeToggler from './ui/ThemeToggler';
import { SidebarInset, SidebarProvider, SidebarTrigger, useSidebar } from './ui/sidebar';
import { Button } from './ui/button';
import { MessageSquareMore } from 'lucide-react';
import { AppSidebar } from './app-sidebar';
// import { useChatNavigator } from '@/frontend/hooks/useChatNavigator';

interface ChatProps {
   threadId: string;
   initialMessages: UIMessage[];
}

export default function Chat({ threadId, initialMessages }: ChatProps) {
   // const { getKey } = useAPIKeyStore();
   // const selectedModel = useModelStore((state) => state.selectedModel);
   // const modelConfig = useModelStore((state) => state.getModelConfig());

   // const {
   // isNavigatorVisible,
   // handleToggleNavigator,
   // closeNavigator,
   // registerRef,
   // scrollToMessage,
   // } = useChatNavigator();

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
            createdAt: new Date(),
         };

         try {
            // await createMessage(threadId, aiMessage);
         } catch (error) {
            console.error(error);
         }
      },
      // headers: {
      //    [modelConfig.headerKey]: getKey(modelConfig.provider) || '',
      // },
      // body: {
      // model: selectedModel,
      // },
   });

   return (
      <SidebarProvider
         style={
            {
               "--sidebar-width": "calc(var(--spacing) * 72)",
               "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties
         }
      >
         <AppSidebar variant="inset" />
         <SidebarInset>
            <ChatSidebarTrigger />
            <main
               className={`flex flex-col w-full max-w-3xl pt-10 pb-44 mx-auto transition-all duration-300 ease-in-out px-4 justify-center`}
            >

               {/* <Messages
               threadId={threadId}
               messages={messages}
               status={status}
               setMessages={setMessages}
               reload={reload}
               error={error}
               registerRef={registerRef}
               stop={stop}
               /> */}
               {messages.map(message => (<div key={message.id}>{message.content}</div>))}
               <ChatInput
                  threadId={threadId}
                  input={input}
                  status={status}
                  append={append}
                  setInput={setInput}
                  stop={stop}
               />
               {/* <ChatNavigator 
            // threadId={threadId}
            // scrollToMessage={scrollToMessage}
            // isVisible={isNavigatorVisible}
            // onClose={closeNavigator}
            // /> */}
            </main>
         </SidebarInset >
      </SidebarProvider >
   );
}

const ChatSidebarTrigger = () => {
   const { state } = useSidebar();
   if (state === 'collapsed') {
      return <SidebarTrigger className="fixed left-4 top-4 z-100" />;
   }
   return null;
};