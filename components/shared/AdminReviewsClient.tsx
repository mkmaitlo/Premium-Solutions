"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Star, Pencil, Trash2, X, Loader2, AlertTriangle,
  CheckCircle2, Search, ChevronDown, MessageSquare,
} from "lucide-react";
import {
  adminUpdateReview,
  adminDeleteReview,
  AdminReviewRow,
} from "@/lib/actions/review.actions";

// ─── Star Rating Picker ───────────────────────────────────────────────────────
function StarPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(i)}
          className="transition-transform duration-150 hover:scale-125 focus:outline-none"
        >
          <Star
            className={`w-7 h-7 transition-colors duration-150 ${
              (hovered || value) >= i
                ? "text-amber-400 fill-amber-400"
                : "text-muted-foreground/30 fill-transparent"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

// ─── User Avatar ──────────────────────────────────────────────────────────────
function ReviewAvatar({ user }: { user: AdminReviewRow["user"] }) {
  if (!user) {
    return (
      <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black text-white flex-shrink-0 bg-muted-foreground/30">
        ??
      </div>
    );
  }

  const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase();
  const hue = ((user._id?.charCodeAt(0) ?? 0) * 37) % 360;
  if (user.photo) {
    return (
      <Image
        src={user.photo}
        alt={user.firstName || "Unknown User"}
        width={40}
        height={40}
        className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20 flex-shrink-0"
      />
    );
  }
  return (
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black text-white flex-shrink-0"
      style={{ background: `hsl(${hue}, 65%, 55%)` }}
    >
      {initials}
    </div>
  );
}

// ─── Static Star display ──────────────────────────────────────────────────────
function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${
            rating >= i ? "text-amber-400 fill-amber-400" : "text-muted-foreground/20 fill-transparent"
          }`}
        />
      ))}
    </div>
  );
}

// ─── Rating badge colour ──────────────────────────────────────────────────────
function ratingBg(r: number) {
  if (r >= 5) return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
  if (r >= 4) return "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/20";
  if (r >= 3) return "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20";
  return "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/20";
}

// ─── Edit Modal ───────────────────────────────────────────────────────────────
function EditModal({
  review,
  onClose,
  onSaved,
}: {
  review: AdminReviewRow;
  onClose: () => void;
  onSaved: (updated: Pick<AdminReviewRow, "_id" | "rating" | "comment">) => void;
}) {
  const [rating, setRating] = useState(review.rating);
  const [comment, setComment] = useState(review.comment);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleSave = () => {
    if (!comment.trim()) { setError("Comment cannot be empty."); return; }
    setError("");
    startTransition(async () => {
      const res = await adminUpdateReview({ reviewId: review._id, rating, comment });
      if (res?.success) {
        onSaved({ _id: review._id, rating, comment });
        onClose();
      } else {
        setError(res?.error ?? "Something went wrong.");
      }
    });
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/60 backdrop-blur-md"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div
        className="w-full max-w-lg rounded-3xl bg-card border border-border/60 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300"
        style={{ boxShadow: "0 25px 80px -12px hsl(var(--primary)/0.25)" }}
      >
        {/* Header */}
        <div
          className="relative p-6 pb-5 border-b border-border/40"
          style={{ background: "linear-gradient(135deg, hsl(var(--primary)/0.08), hsl(var(--secondary)/0.05))" }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-primary/5 blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))" }}
              >
                <Pencil className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-base font-black text-foreground">Edit Review</h2>
                <p className="text-xs text-muted-foreground">
                  {review.user?.firstName || "Unknown"} {review.user?.lastName || "User"} · {review.subscription?.title || "Unknown Subscription"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-muted hover:bg-destructive/10 hover:text-destructive flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-5">
          {/* Rating */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Rating</label>
            <StarPicker value={rating} onChange={setRating} />
            <p className="text-xs text-muted-foreground">
              {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
            </p>
          </div>

          {/* Comment */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Comment <span className="text-destructive">*</span>
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-border/60 bg-background/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
              placeholder="Write the review comment…"
            />
            <p className="text-xs text-muted-foreground text-right">{comment.length} chars</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 rounded-xl px-4 py-3 border border-destructive/20">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 px-6 pb-6">
          <button
            onClick={onClose}
            className="flex-1 h-11 rounded-2xl border border-border/60 text-sm font-semibold text-muted-foreground hover:text-foreground hover:border-border transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isPending}
            className="flex-1 h-11 rounded-2xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:scale-[1.01] disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100"
            style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))" }}
          >
            {isPending ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
            ) : (
              <><CheckCircle2 className="w-4 h-4" /> Save Changes</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Delete Modal ─────────────────────────────────────────────────────────────
function DeleteModal({
  review,
  onClose,
  onDeleted,
}: {
  review: AdminReviewRow;
  onClose: () => void;
  onDeleted: (id: string) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleDelete = () => {
    startTransition(async () => {
      const res = await adminDeleteReview(review._id);
      if (res?.success) {
        onDeleted(review._id);
        onClose();
      } else {
        setError(res?.error ?? "Delete failed.");
      }
    });
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/60 backdrop-blur-md"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div
        className="w-full max-w-md rounded-3xl bg-card border border-border/60 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300"
        style={{ boxShadow: "0 25px 80px -12px hsl(0 70% 50% / 0.2)" }}
      >
        {/* Header */}
        <div className="relative p-6 pb-5 border-b border-border/40 bg-destructive/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-destructive/15 flex items-center justify-center">
                <Trash2 className="w-4 h-4 text-destructive" />
              </div>
              <h2 className="text-base font-black text-foreground">Delete Review</h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            You are about to permanently delete the review by{" "}
            <span className="font-bold text-foreground">
              {review.user?.firstName || "Unknown"} {review.user?.lastName || "User"}
            </span>{" "}
            for <span className="font-bold text-foreground">{review.subscription?.title || "Unknown Subscription"}</span>.
            This action <span className="text-destructive font-bold">cannot be undone</span>.
          </p>

          {/* Preview */}
          <div className="rounded-xl border border-border/50 bg-muted/30 p-4">
            <StarDisplay rating={review.rating} />
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2 italic">"{review.comment}"</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 rounded-xl px-4 py-3 border border-destructive/20">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 px-6 pb-6">
          <button
            onClick={onClose}
            className="flex-1 h-11 rounded-2xl border border-border/60 text-sm font-semibold text-muted-foreground hover:text-foreground hover:border-border transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="flex-1 h-11 rounded-2xl bg-destructive text-destructive-foreground text-sm font-bold flex items-center justify-center gap-2 transition-all hover:bg-destructive/90 hover:shadow-lg hover:scale-[1.01] disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100"
          >
            {isPending ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Deleting…</>
            ) : (
              <><Trash2 className="w-4 h-4" /> Delete Review</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminReviewsClient({
  initialReviews,
}: {
  initialReviews: AdminReviewRow[];
}) {
  const [reviews, setReviews] = useState<AdminReviewRow[]>(initialReviews);
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState<number | "all">("all");
  const [editTarget, setEditTarget] = useState<AdminReviewRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminReviewRow | null>(null);

  // Filter
  const filtered = reviews.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      r.user?.firstName?.toLowerCase().includes(q) ||
      r.user?.lastName?.toLowerCase().includes(q) ||
      r.subscription?.title?.toLowerCase().includes(q) ||
      r.comment?.toLowerCase().includes(q);
    const matchRating = ratingFilter === "all" || r.rating === ratingFilter;
    return matchSearch && matchRating;
  });

  const handleSaved = (updated: Pick<AdminReviewRow, "_id" | "rating" | "comment">) => {
    setReviews((prev) =>
      prev.map((r) => (r._id === updated._id ? { ...r, ...updated } : r))
    );
  };

  const handleDeleted = (id: string) => {
    setReviews((prev) => prev.filter((r) => r._id !== id));
  };

  // Stats derived from current full list (not filtered)
  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "—";
  const dist = [5, 4, 3, 2, 1].map((s) => ({
    star: s,
    count: reviews.filter((r) => r.rating === s).length,
    pct: reviews.length ? Math.round((reviews.filter((r) => r.rating === s).length / reviews.length) * 100) : 0,
    color: s >= 5 ? "#10b981" : s >= 4 ? "#3b82f6" : s >= 3 ? "#f59e0b" : "#ef4444",
  }));

  return (
    <>
      {/* Modals */}
      {editTarget && (
        <EditModal
          review={editTarget}
          onClose={() => setEditTarget(null)}
          onSaved={handleSaved}
        />
      )}
      {deleteTarget && (
        <DeleteModal
          review={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onDeleted={handleDeleted}
        />
      )}

      <div className="flex flex-col gap-6">

        {/* Stats strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Avg */}
          <div className="col-span-2 lg:col-span-1 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-secondary/10 p-5 flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center flex-shrink-0 text-white shadow-lg"
              style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))" }}
            >
              <span className="text-xl font-black leading-none">{avgRating}</span>
              <Star className="w-3.5 h-3.5 mt-0.5 fill-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Avg Rating</p>
              <p className="text-2xl font-black text-foreground">{avgRating}</p>
              <p className="text-xs text-muted-foreground">{reviews.length} total reviews</p>
            </div>
          </div>

          {/* Distribution */}
          {dist.slice(0, 3).map((d) => (
            <div key={d.star} className="rounded-2xl border border-border/40 bg-card/60 p-4 flex items-center gap-3">
              <div className="flex items-center gap-1 flex-shrink-0 w-10">
                <span className="text-sm font-black text-foreground">{d.star}</span>
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${d.pct}%`, background: d.color }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{d.count} reviews</p>
              </div>
              <span className="text-xs font-bold text-foreground flex-shrink-0">{d.pct}%</span>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search by user, subscription or comment…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-10 rounded-xl border border-border/60 bg-background/60 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Rating filter */}
          <div className="relative flex-shrink-0">
            <Star className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-amber-400 fill-amber-400 pointer-events-none" />
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value === "all" ? "all" : Number(e.target.value))}
              className="h-10 pl-9 pr-9 rounded-xl border border-border/60 bg-background/60 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all appearance-none cursor-pointer"
            >
              <option value="all">All ratings</option>
              {[5, 4, 3, 2, 1].map((s) => (
                <option key={s} value={s}>{s} star{s !== 1 ? "s" : ""}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="flex items-center justify-between text-xs text-muted-foreground px-0.5">
          <span>
            Showing <span className="font-semibold text-foreground">{filtered.length}</span> of{" "}
            <span className="font-semibold text-foreground">{reviews.length}</span> reviews
          </span>
          <span>Sorted by rating ↓</span>
        </div>

        {/* Reviews list */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 rounded-2xl border border-dashed border-border/60 gap-4">
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
              <MessageSquare className="w-7 h-7 text-muted-foreground/40" />
            </div>
            <p className="text-muted-foreground font-medium">No reviews match your filters</p>
            {(search || ratingFilter !== "all") && (
              <button
                onClick={() => { setSearch(""); setRatingFilter("all"); }}
                className="text-xs text-primary hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((review, i) => (
              <div
                key={review._id}
                className="group relative flex flex-col sm:flex-row sm:items-start gap-4 rounded-2xl border border-border/40 bg-card/60 p-5 hover:border-primary/30 hover:shadow-md transition-all duration-300 overflow-hidden"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                {/* Left accent */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(to bottom, hsl(var(--primary)), hsl(var(--secondary)))` }}
                />

                {/* Avatar */}
                <ReviewAvatar user={review.user} />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-foreground text-sm">
                          {review.user?.firstName || "Unknown"} {review.user?.lastName || "User"}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold border ${ratingBg(review.rating)}`}
                        >
                          <Star className="w-2.5 h-2.5 fill-current" />
                          {review.rating}.0
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                        <span className="font-medium text-foreground/70">{review.subscription?.title || "Unknown Subscription"}</span>
                        <span>·</span>
                        <span>
                          {new Date(review.createdAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </p>
                    </div>

                    {/* Star row */}
                    <StarDisplay rating={review.rating} />
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 italic">
                    &ldquo;{review.comment}&rdquo;
                  </p>
                </div>

                {/* Actions */}
                <div className="flex sm:flex-col gap-2 flex-shrink-0">
                  <button
                    onClick={() => setEditTarget(review)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 text-xs font-bold transition-all duration-200 hover:scale-105"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteTarget(review)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 text-xs font-bold transition-all duration-200 hover:scale-105"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
