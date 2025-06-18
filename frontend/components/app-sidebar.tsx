import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarFooter,
  SidebarTrigger,
} from '@/frontend/components/ui/sidebar';
import { Button, buttonVariants } from './ui/button';
import { Link, NavigateFunction, useNavigate, useParams } from 'react-router';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { memo, useEffect, useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Component from './comp-01';
import { type Thread } from '@/convex/schema';

function getStartofDayTimestamp(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export default function AppSidebar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const threads = useQuery(api.queries.getThreads) || [];

  const todayTimestamp = getStartofDayTimestamp(new Date());
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 1);
  const lastweekTimestamp = getStartofDayTimestamp(lastWeek);
  const lastMonth = new Date();
  lastMonth.setDate(lastMonth.getDate() - 30);
  const lastMonthTimestamp = getStartofDayTimestamp(lastMonth);

  const todayThreads: Thread[] = [];
  const lastweekThreads: Thread[] = [];
  const lastMonthThreads: Thread[] = [];
  const olderThreads: Thread[] = [];

  const [currThreads, setCurrThreads] = useState<Thread[]>(threads);

  currThreads.map((thread) => {
    const threadTimestamp = thread.createdAt;
    if (threadTimestamp >= todayTimestamp) {
      todayThreads.push(thread);
    } else if (threadTimestamp >= lastweekTimestamp && threadTimestamp < todayTimestamp) {
      lastweekThreads.push(thread);
    } else if (threadTimestamp >= lastMonthTimestamp && threadTimestamp < lastweekTimestamp) {
      lastMonthThreads.push(thread);
    } else {
      olderThreads.push(thread);
    }
  })
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        navigate('/chat');
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <Sidebar variant='inset'>
      <div className="flex flex-col h-full p-2">
        <Header threads={threads} setCurrThreads={setCurrThreads} />
        <SidebarContent className="no-scrollbar">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {todayThreads.length > 0 && (
                  <>
                    <label className='p-1 font-semibold text-pink-text'>Today</label>
                    <ThreadDisplay
                      threads={todayThreads}
                      navigate={navigate}
                      id={id as string}
                    />
                  </>
                )}

                {lastweekThreads.length > 0 && (
                  <>
                    <label className='p-1 font-semibold text-pink-text'>Last 7 Days</label>
                    <ThreadDisplay
                      threads={lastweekThreads}
                      navigate={navigate}
                      id={id as string}
                    />
                  </>
                )}
                {lastMonthThreads.length > 0 && (
                  <>
                    <label className='p-1 font-semibold text-pink-text'>Last 7 Days</label>
                    <ThreadDisplay
                      threads={lastMonthThreads}
                      navigate={navigate}
                      id={id as string}
                    />
                  </>
                )}
                {olderThreads.length > 0 && (
                  <>
                    <label className='p-1 font-semibold text-pink-text'>Last 7 Days</label>
                    <ThreadDisplay
                      threads={olderThreads}
                      navigate={navigate}
                      id={id as string}
                    />
                  </>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <Footer />
      </div>
    </Sidebar>
  );
}

function PureHeader({ threads, setCurrThreads }: {
  threads: Thread[], setCurrThreads: (results: Thread[]) => void;
}) {
  return (
    <SidebarHeader className="flex justify-between items-center gap-4 relative">
      <SidebarTrigger className="absolute left-1 top-2.5 scale-125" />
      <h1 className="text-2xl font-bold">
        OpenChat
      </h1>
      <Link
        to="/chat"
        className={buttonVariants({
          variant: 'default',
          className: 'w-full',
        })}
      >
        New Chat
      </Link>
      <Component
        threads={threads}
        onSearchResults={setCurrThreads}
      />
    </SidebarHeader>
  );
}

const Header = memo(PureHeader);

const PureFooter = () => {
  const { id: chatId } = useParams();

  return (
    <SidebarFooter>
      <Link
        to={{
          pathname: "/settings",
          search: chatId ? `?from=${encodeURIComponent(chatId)}` : "",
        }}
        className={buttonVariants({ variant: "outline" })}
      >
        Settings
      </Link>
    </SidebarFooter>
  );
};

interface ThreadDisplayProps {
  threads: Thread[];
  navigate: NavigateFunction;
  id: string;
}

const ThreadDisplay = ({ threads, navigate, id }: ThreadDisplayProps) => {

  const threadDeleteMutation = useMutation(api.queries.deleteThread);

  return (
    <>
      {threads?.map((thread) => (
        <SidebarMenuItem key={thread.threadId}>
          <div
            className={cn(
              'cursor-pointer group/thread h-9 flex items-center px-2 py-1 rounded-[8px] overflow-hidden w-full hover:bg-secondary',
              id === thread.threadId && 'bg-secondary'
            )}
            onClick={() => {
              if (id === thread.threadId) {
                return;
              }
              navigate(`/chat/${thread.threadId}`);
            }}
          >
            <span className="truncate block">{thread.title}</span>
            <Button
              variant="ghost"
              size="icon"
              className="hidden group-hover/thread:flex ml-auto h-7 w-7"
              onClick={async (event) => {
                event.preventDefault();
                event.stopPropagation();
                await threadDeleteMutation({ threadId: thread.threadId });
                navigate(`/chat`);
              }}
            >
              <X size={16} />
            </Button>
          </div>
        </SidebarMenuItem>
      ))}
    </>
  );
}

const Footer = memo(PureFooter);
