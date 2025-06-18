import { Input } from "@/frontend/components/ui/input"
import { Search, Loader2 } from "lucide-react"
import { useThreadSearch } from "@/frontend/hooks/useThreadSearch"
import { useEffect } from "react";
import { type Thread } from "@/convex/schema";

interface ComponentProps {
  threads: Thread[];
  onSearchResults: (results: Thread[]) => void;
}

export default function Component({ threads, onSearchResults }: ComponentProps) {
  const {
    searchQuery,
    setSearchQuery,
    filteredThreads,
  } = useThreadSearch({
    threads,
  });

  // Update parent component with search results
  useEffect(() => {
    onSearchResults(filteredThreads);
  }, [filteredThreads, onSearchResults]);

  return (
    <div className="flex flex-row items-center border-b">
      <div className="relative">
        <Search className="h-5" />
      </div>
      <div className="*:not-first:mt-2 flex-1">
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search your Threads..."
          type="search"
          className="border-0 focus-visible:ring-0 focus:ring-0 text-white placeholder:text-[#80717B]"
        />
      </div>
    </div>
  )
}