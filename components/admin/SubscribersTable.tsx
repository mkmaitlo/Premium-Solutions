"use client";

import { useState, useTransition } from "react";
import { Trash2, Download, Search, Mail, ChevronUp, ChevronDown } from "lucide-react";
import { deleteSubscriber } from "@/lib/actions/subscriber.actions";
import { useRouter } from "next/navigation";

interface Subscriber {
  email: string;
  subscribedAt: string;
}

interface Props {
  subscribers: Subscriber[];
  csvContent: string;
  headerOnly?: boolean; // render only the export button (used in page header)
}

export default function SubscribersTable({ subscribers, csvContent, headerOnly }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [deletingEmail, setDeletingEmail] = useState<string | null>(null);

  // CSV download
  const handleDownload = () => {
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (headerOnly) {
    return (
      <button
        onClick={handleDownload}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-border/60 bg-card/60 hover:bg-card hover:border-primary/30 hover:text-primary transition-all duration-200"
      >
        <Download className="w-4 h-4" />
        Export CSV
      </button>
    );
  }

  // Delete handler
  const handleDelete = (email: string) => {
    if (!confirm(`Remove ${email} from subscribers?`)) return;
    setDeletingEmail(email);
    startTransition(async () => {
      await deleteSubscriber(email);
      router.refresh();
      setDeletingEmail(null);
    });
  };

  // Filter + sort
  const filtered = subscribers
    .filter((s) => s.email.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const diff =
        new Date(a.subscribedAt).getTime() - new Date(b.subscribedAt).getTime();
      return sortAsc ? diff : -diff;
    });

  return (
    <div className="flex flex-col gap-4">
      {/* Search + sort toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search emails…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm bg-card/60 border border-border/50 text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
          />
        </div>
        <button
          onClick={() => setSortAsc((v) => !v)}
          className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold border border-border/50 bg-card/60 hover:border-primary/30 hover:text-primary transition-all duration-200"
        >
          Date {sortAsc ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
        <p className="text-xs text-muted-foreground ml-auto">
          {filtered.length} of {subscribers.length} subscribers
        </p>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20 text-muted-foreground">
          <Mail className="w-10 h-10 opacity-30" />
          <p className="text-sm font-medium">
            {subscribers.length === 0 ? "No subscribers yet." : "No results match your search."}
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50 bg-card/60">
                <th className="text-left px-5 py-3.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Email
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">
                  Subscribed
                </th>
                <th className="px-5 py-3.5 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {filtered.map((s, i) => (
                <tr
                  key={s.email}
                  className="group hover:bg-primary/5 transition-colors duration-150"
                  style={{
                    animation: `fadeSlideIn 0.3s ease both`,
                    animationDelay: `${i * 20}ms`,
                  }}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Mail className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <span className="font-medium text-foreground truncate max-w-[200px] sm:max-w-none">
                        {s.email}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground hidden sm:table-cell">
                    {new Date(s.subscribedAt).toLocaleDateString("en-PK", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => handleDelete(s.email)}
                      disabled={isPending && deletingEmail === s.email}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-500 border border-red-500/20 bg-red-500/5 hover:bg-red-500/15 hover:border-red-500/40 transition-all duration-200 disabled:opacity-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Remove</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
