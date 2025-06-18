import Fuse from 'fuse.js'
import { type Thread } from '@/convex/schema'
import { useEffect, useMemo, useState } from 'react'

interface UseThreadSearchProps {
   threads: Thread[],
}

export function useThreadSearch({ threads }: UseThreadSearchProps) {
   const [searchQuery, setSearchQuery] = useState('');
   const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
   const [filteredThreads, setFilteredThreads] = useState<Thread[]>(threads)

   const fuseOptions = useMemo(() => ({
      threshold: 0.4,
      keys: ['title'],
      includeScore: false,
      minMatchCharLength: 2
   }), [])

   const fuse = useMemo(() => new Fuse(threads, fuseOptions), [threads, fuseOptions]);

   useEffect(() => {
      const timeout = setTimeout(() => {
         if (searchQuery.trim() === '') {
            setFilteredThreads(threads);
         } else {
            const results = fuse.search(searchQuery);
            const filtered = results.map(result => result.item);
            setFilteredThreads(filtered);
         }
      }, 1000);

      return () => clearTimeout(timeout);
   }, [searchQuery, fuse, threads]);

   useEffect(() => {
      if (searchQuery.trim() === '') {
         setFilteredThreads(threads)
      }
   }, [threads, searchQuery])

   return {
      searchQuery,
      filteredThreads,
      setSearchQuery,
   }
}