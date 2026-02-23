"use client";

import { useState } from "react";
import { Star, MessageSquare } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { SignInButton } from "@clerk/nextjs";
import { createReview } from "@/lib/actions/review.actions";

type ReviewUser = {
  _id: string;
  firstName: string;
  lastName: string;
  photo: string;
};

type ReviewProps = {
  _id: string;
  user: ReviewUser;
  rating: number;
  comment: string;
  createdAt: string;
};

export default function ReviewsSection({
  subscriptionId,
  clerkId,
  initialReviews,
}: {
  subscriptionId: string;
  clerkId: string | null;
  initialReviews: ReviewProps[];
}) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clerkId) {
      alert("Please sign in to leave a review.");
      return;
    }
    if (!comment.trim()) return;

    setIsSubmitting(true);
    try {
      await createReview({
        subscriptionId,
        clerkId,
        rating,
        comment,
        path: pathname,
      });
      setComment("");
      setRating(5);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to submit review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-10 mt-16 pb-10">
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <MessageSquare className="w-8 h-8 text-primary" />
        <h2 className="text-3xl font-extrabold text-foreground">Customer Reviews</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* ADD REVIEW FORM */}
        <div className="col-span-1 lg:col-span-5 flex flex-col gap-6">
          <div className="p-6 rounded-3xl bg-card border border-border/50 shadow-md">
            <h3 className="text-xl font-bold mb-4">Write a Review</h3>
            {clerkId ? (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-muted-foreground">Select Rating</label>
                  <div className="flex gap-1" onMouseLeave={() => setHoverRating(0)}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-8 h-8 cursor-pointer transition-all duration-200 ${(hoverRating || rating) >= star ? "text-yellow-400 fill-yellow-400 scale-110 drop-shadow-sm" : "text-muted stroke-muted-foreground"} `}
                        onMouseEnter={() => setHoverRating(star)}
                        onClick={() => setRating(star)}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-muted-foreground">Your Experience</label>
                  <textarea
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell others what you think about this subscription..."
                    rows={4}
                    className="w-full resize-none rounded-xl p-4 bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-muted-foreground/60"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-2 w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Post Review"}
                </button>
              </form>
            ) : (
              <div className="py-8 px-4 bg-primary/5 rounded-xl border border-primary/20 text-center flex flex-col items-center justify-center gap-4">
                <MessageSquare className="w-10 h-10 text-primary/50" />
                <div className="flex flex-col gap-1">
                  <h4 className="text-lg font-bold text-foreground">Join the Conversation</h4>
                  <p className="text-muted-foreground font-medium text-sm">You must be signed in to post a review.</p>
                </div>
                <SignInButton mode="modal">
                  <button className="px-6 py-2.5 bg-primary text-white rounded-full font-bold shadow-sm hover:shadow-md hover:bg-primary/90 transition-all">
                    Sign In
                  </button>
                </SignInButton>
              </div>
            )}
          </div>
        </div>

        {/* REVIEW LIST */}
        <div className="col-span-1 lg:col-span-7 flex flex-col gap-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
          {initialReviews.length === 0 ? (
            <div className="p-10 text-center rounded-3xl bg-card/50 border border-border/50">
              <Star className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <h4 className="text-lg font-bold text-foreground">No reviews yet</h4>
              <p className="text-muted-foreground">Be the first to rate this subscription!</p>
            </div>
          ) : (
            initialReviews.map((review) => (
              <div key={review._id} className="p-6 rounded-2xl bg-card border border-border/50 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-muted border border-border">
                      <Image
                        src={review.user.photo || "/assets/images/user-placeholder.svg"}
                        alt={review.user.firstName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground">
                        {review.user.firstName} {review.user.lastName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1 bg-yellow-400/10 px-3 py-1.5 rounded-full border border-yellow-400/20">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${review.rating >= star ? "text-yellow-500 fill-yellow-500" : "text-muted stroke-muted"}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed pl-16">
                  {review.comment}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
