import { useState, useEffect, useRef } from 'react';
import { Button } from '@/frontend/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScrollToBottomProps {
   className?: string;
}

export function ScrollToBottom({ className }: ScrollToBottomProps) {
   const [isVisible, setIsVisible] = useState(false);
   const scrollContainerRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      const scrollContainer = document.querySelector('[data-scroll-container]') as HTMLDivElement;
      if (!scrollContainer) return;

      scrollContainerRef.current = scrollContainer;

      const handleScroll = () => {
         const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
         const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
         setIsVisible(!isNearBottom && scrollHeight > clientHeight);
      };

      handleScroll();

      scrollContainer.addEventListener('scroll', handleScroll);

      const observer = new MutationObserver(handleScroll);
      observer.observe(scrollContainer, {
         childList: true,
         subtree: true,
         attributes: false,
      });

      return () => {
         scrollContainer.removeEventListener('scroll', handleScroll);
         observer.disconnect();
      };
   }, []);

   const scrollToBottom = () => {
      if (scrollContainerRef.current) {
         scrollContainerRef.current.scrollTo({
            top: scrollContainerRef.current.scrollHeight,
            behavior: 'smooth'
         });
      }
   };

   if (!isVisible) return null;

   return (
      <Button
         onClick={scrollToBottom}
         size="icon"
         variant="secondary"
         className={cn(
            "absolute bottom-50 left-1/2 transform -translate-x-1/2 z-10 h-10 w-40 rounded-full shadow-lg",
            "bg-[#362D3D] border border-border hover:bg-secondary",
            "transition-all duration-200 ease-in-out",
            "text-zinc-400",
            "scale-75",
            "border border-border/50",
            className
         )}
         aria-label="Scroll to bottom"
      >
         Scroll to Bottom
         <ChevronDown className="h-4 w-4" />
      </Button>
   );
}