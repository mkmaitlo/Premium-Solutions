"use client";

import { useState, useTransition, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Search, Filter, ChevronLeft, ChevronRight, Users,
  MessageSquare, ArrowUpDown, X, RefreshCw, BadgeCheck,
} from "lucide-react";

import { getAllUsers, UserRow } from "@/lib/actions/user.actions";

type Role = "all" | "admin" | "user";
type SortBy = "newest" | "oldest" | "name";

type Props = {
  initialUsers: UserRow[];
  initialTotalPages: number;
  initialTotalCount: number;
};

function Avatar({ user }: { user: UserRow }) {
  if (user.photo) {
    return (
      <Image
        src={user.photo}
        alt={user.firstName}
        width={36}
        height={36}
        className="w-9 h-9 rounded-full object-cover ring-2 ring-primary/20"
      />
    );
  }
  const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase();
  const hue = (user.email.charCodeAt(0) * 37) % 360;
  return (
    <div
      className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0"
      style={{ background: `hsl(${hue}, 65%, 55%)` }}
    >
      {initials}
    </div>
  );
}

function RoleBadge({ isAdmin }: { isAdmin: boolean }) {
  return isAdmin ? (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary/15 text-primary border border-primary/20">
      <BadgeCheck className="w-3 h-3" /> Admin
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-muted text-muted-foreground border border-border/60">
      <Users className="w-3 h-3" /> User
    </span>
  );
}

export default function DashboardUsersTable({
  initialUsers,
  initialTotalPages,
  initialTotalCount,
}: Props) {
  const [users, setUsers] = useState<UserRow[]>(initialUsers);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [totalCount, setTotalCount] = useState(initialTotalCount);

  const [search, setSearch] = useState("");
  const [role, setRole] = useState<Role>("all");
  const [sortBy, setSortBy] = useState<SortBy>("newest");
  const [page, setPage] = useState(1);

  const [isPending, startTransition] = useTransition();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const fetchUsers = useCallback(
    (params: { search: string; role: Role; sortBy: SortBy; page: number }) => {
      startTransition(async () => {
        const result = await getAllUsers({ ...params, limit: 10 });
        setUsers(result.users);
        setTotalPages(result.totalPages);
        setTotalCount(result.totalCount);
      });
    },
    []
  );

  // Debounce search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(1);
      fetchUsers({ search, role, sortBy, page: 1 });
    }, 380);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [search]);

  // Immediate for role/sort/page changes
  useEffect(() => {
    fetchUsers({ search, role, sortBy, page });
  }, [role, sortBy, page]);

  const handleReset = () => {
    setSearch(""); setRole("all"); setSortBy("newest"); setPage(1);
    fetchUsers({ search: "", role: "all", sortBy: "newest", page: 1 });
  };

  const hasActiveFilters = search || role !== "all" || sortBy !== "newest";

  return (
    <div className="flex flex-col gap-4">

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, email or username…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-border/60 bg-background/60 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Role filter */}
        <div className="flex items-center gap-1.5 bg-muted/50 rounded-xl p-1 border border-border/40">
          <Filter className="w-3.5 h-3.5 text-muted-foreground ml-1.5" />
          {(["all", "admin", "user"] as Role[]).map((r) => (
            <button
              key={r}
              onClick={() => { setRole(r); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all duration-200 ${
                role === r
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/60"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="relative">
          <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          <select
            value={sortBy}
            onChange={(e) => { setSortBy(e.target.value as SortBy); setPage(1); }}
            className="h-10 pl-9 pr-8 rounded-xl border border-border/60 bg-background/60 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all appearance-none cursor-pointer"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="name">By name</option>
          </select>
        </div>

        {/* Reset */}
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 h-10 px-3.5 rounded-xl border border-border/60 bg-background/60 text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset
          </button>
        )}
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between text-xs text-muted-foreground px-0.5">
        <span>
          {isPending ? "Loading…" : (
            <>Showing <span className="font-semibold text-foreground">{users.length}</span> of <span className="font-semibold text-foreground">{totalCount}</span> users</>
          )}
        </span>
        <span>Page {page} of {totalPages || 1}</span>
      </div>

      {/* Table */}
      <div className={`relative rounded-2xl border border-border/50 overflow-hidden transition-opacity duration-200 ${isPending ? "opacity-60" : "opacity-100"}`}>
        {/* Loading shimmer bar */}
        {isPending && (
          <div className="absolute top-0 left-0 right-0 h-0.5 overflow-hidden z-10">
            <div
              className="h-full rounded-full"
              style={{
                background: "linear-gradient(to right, hsl(var(--primary)), hsl(var(--secondary)), hsl(var(--primary)))",
                backgroundSize: "200% 100%",
                animation: "shimmerBar 1.5s linear infinite",
              }}
            />
          </div>
        )}

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/40 bg-muted/30">
                <th className="text-left px-5 py-3.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">User</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">Email</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">Username</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">Role</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">Reviews</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {users.length > 0 ? users.map((user, i) => (
                <tr
                  key={user._id}
                  className="bg-card/40 hover:bg-primary/5 transition-colors duration-150 group"
                  style={{ animationDelay: `${i * 30}ms` }}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar user={user} />
                      <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {user.firstName} {user.lastName}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground font-mono text-xs">{user.email}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">@{user.username}</td>
                  <td className="px-5 py-3.5"><RoleBadge isAdmin={user.isAdmin} /></td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <MessageSquare className="w-3.5 h-3.5 text-primary/60" />
                      <span className="font-semibold text-foreground">{user.reviewCount}</span>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-5 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center">
                        <Users className="w-6 h-6 text-muted-foreground/50" />
                      </div>
                      <p className="text-muted-foreground font-medium">No users found</p>
                      {hasActiveFilters && (
                        <button onClick={handleReset} className="text-xs text-primary hover:underline">Clear filters</button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-border/30">
          {users.length > 0 ? users.map((user) => (
            <div key={user._id} className="flex items-center gap-3 px-4 py-3.5 bg-card/40 hover:bg-primary/5 transition-colors">
              <Avatar user={user} />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground text-sm truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-muted-foreground font-mono truncate">{user.email}</p>
              </div>
              <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                <RoleBadge isAdmin={user.isAdmin} />
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" /> {user.reviewCount}
                </span>
              </div>
            </div>
          )) : (
            <div className="py-16 text-center text-muted-foreground text-sm">No users found</div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1 || isPending}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border/60 bg-card/40 text-sm font-semibold text-muted-foreground hover:text-primary hover:border-primary/40 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" /> Prev
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              const p = totalPages <= 7 ? i + 1 :
                page <= 4 ? i + 1 :
                page >= totalPages - 3 ? totalPages - 6 + i :
                page - 3 + i;
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  disabled={isPending}
                  className={`w-9 h-9 rounded-xl text-sm font-bold transition-all duration-200 ${
                    page === p
                      ? "text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                  style={page === p ? {
                    background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))",
                  } : {}}
                >
                  {p}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages || isPending}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border/60 bg-card/40 text-sm font-semibold text-muted-foreground hover:text-primary hover:border-primary/40 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      <style>{`
        @keyframes shimmerBar {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
      `}</style>
    </div>
  );
}
