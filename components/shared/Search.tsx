"use client"

import { formUrlQuery, removeKeysFromQuery } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { Search as SearchIcon } from 'lucide-react';

const Search = ({ placeholder = "Search services..." }: { placeholder?: string }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      let newUrl = '';
      if (query) {
        newUrl = formUrlQuery({ params: searchParams.toString(), key: 'query', value: query });
      } else {
        newUrl = removeKeysFromQuery({ params: searchParams.toString(), keysToRemove: ['query'] });
      }
      router.push(newUrl, { scroll: false });
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [query, searchParams, router]);

  return (
    <div
      className={`flex items-center gap-3 w-full rounded-2xl bg-card border px-5 py-3.5 transition-all duration-300 shadow-sm
        ${isFocused
          ? 'border-primary shadow-[0_0_0_4px_hsl(var(--primary)/0.12)]'
          : 'border-border hover:border-primary/40'
        }`}
    >
      <SearchIcon
        className={`w-5 h-5 flex-shrink-0 transition-colors duration-300 ${isFocused ? 'text-primary' : 'text-muted-foreground'}`}
      />
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="flex-1 bg-transparent text-base text-foreground placeholder:text-muted-foreground outline-none border-none"
      />
    </div>
  )
}

export default Search
