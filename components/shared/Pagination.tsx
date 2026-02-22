"use client"

import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'
import { formUrlQuery } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type PaginationProps = {
  page: number | string,
  totalPages: number,
  urlParamName?: string
}

const Pagination = ({ page, totalPages, urlParamName }: PaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(page);

  const navigate = (pageNum: number) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: urlParamName || 'page',
      value: pageNum.toString()
    });
    router.push(newUrl, { scroll: false });
  };

  // Build page numbers array
  const pages: (number | '...')[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push('...');
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push('...');
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center gap-2 mt-4">
      {/* Prev */}
      <button
        onClick={() => navigate(currentPage - 1)}
        disabled={currentPage <= 1}
        className="flex items-center justify-center w-10 h-10 rounded-xl border border-border bg-card text-foreground disabled:opacity-30 hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all duration-200"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Page numbers */}
      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`dots-${i}`} className="w-10 h-10 flex items-center justify-center text-muted-foreground text-sm">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => navigate(p as number)}
            className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all duration-200 border
              ${currentPage === p
                ? 'bg-gradient-to-r from-primary to-secondary text-white border-transparent shadow-md shadow-primary/30'
                : 'border-border bg-card text-foreground hover:bg-primary/10 hover:border-primary/30 hover:text-primary'
              }`}
          >
            {p}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => navigate(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="flex items-center justify-center w-10 h-10 rounded-xl border border-border bg-card text-foreground disabled:opacity-30 hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all duration-200"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Pagination