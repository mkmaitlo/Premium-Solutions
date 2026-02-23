"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/database";
import Review from "@/lib/database/models/review.model";
import Subscription from "@/lib/database/models/subscription.model";
import User from "@/lib/database/models/user.model";
import { handleError } from "@/lib/utils";
import { Types } from "mongoose";

// ─── Existing User-Facing Actions ────────────────────────────────────────────

export async function createReview({
  subscriptionId,
  clerkId,
  rating,
  comment,
  path: _path,
}: {
  subscriptionId: string;
  clerkId: string;
  rating: number;
  comment: string;
  path: string;
}) {
  try {
    await connectToDatabase();

    const user = await User.findOne({ clerkId });
    if (!user) throw new Error("User not found");

    const existingReview = await Review.findOne({
      user: user._id,
      subscription: subscriptionId,
    });

    if (existingReview) {
      existingReview.rating = rating;
      existingReview.comment = comment;
      await existingReview.save();
    } else {
      await Review.create({
        subscription: subscriptionId,
        user: user._id,
        rating,
        comment,
      });
    }

    await recalcSubscriptionRating(subscriptionId);

    revalidatePath("/", "layout");
    return JSON.parse(JSON.stringify({ success: true }));
  } catch (error) {
    handleError(error);
  }
}

export async function getReviewsBySubscriptionId(subscriptionId: string, limit = 20) {
  try {
    await connectToDatabase();
    const reviews = await Review.find({ subscription: subscriptionId })
      .populate({ path: "user", model: User, select: "_id firstName lastName photo" })
      .sort({ createdAt: -1 })
      .limit(limit);
    return JSON.parse(JSON.stringify(reviews));
  } catch (error) {
    handleError(error);
  }
}

export async function getLatestReviews(limit = 20) {
  try {
    await connectToDatabase();
    const reviews = await Review.find({})
      .populate({ path: "user", model: User, select: "_id firstName lastName photo" })
      .sort({ createdAt: -1 })
      .limit(limit);
    return JSON.parse(JSON.stringify(reviews));
  } catch (error) {
    handleError(error);
  }
}

// ─── Shared Helper ────────────────────────────────────────────────────────────

async function recalcSubscriptionRating(subscriptionId: string) {
  const stats = await Review.aggregate([
    { $match: { subscription: new Types.ObjectId(subscriptionId) } },
    {
      $group: {
        _id: "$subscription",
        averageRating: { $avg: "$rating" },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    const { averageRating, reviewCount } = stats[0];
    await Subscription.findByIdAndUpdate(
      subscriptionId,
      { $set: { averageRating: parseFloat(averageRating.toFixed(1)), reviewCount } },
      { strict: false }
    );
  } else {
    // No reviews left — reset
    await Subscription.findByIdAndUpdate(
      subscriptionId,
      { $set: { averageRating: 5, reviewCount: 0 } },
      { strict: false }
    );
  }
}

// ─── Admin Actions ────────────────────────────────────────────────────────────

export type AdminReviewRow = {
  _id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    photo: string;
    email?: string;
  };
  subscription: {
    _id: string;
    title: string;
  };
};

export async function getAllReviewsAdmin(): Promise<AdminReviewRow[]> {
  try {
    await connectToDatabase();

    const reviews = await Review.find({})
      .populate({ path: "user", model: User, select: "_id firstName lastName photo email" })
      .populate({ path: "subscription", model: Subscription, select: "_id title" })
      .sort({ rating: -1, createdAt: -1 });

    return JSON.parse(JSON.stringify(reviews));
  } catch (error) {
    handleError(error);
    return [];
  }
}

export async function adminUpdateReview({
  reviewId,
  rating,
  comment,
}: {
  reviewId: string;
  rating: number;
  comment: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    await connectToDatabase();

    const review = await Review.findById(reviewId);
    if (!review) return { success: false, error: "Review not found" };

    review.rating = rating;
    review.comment = comment;
    await review.save();

    await recalcSubscriptionRating(review.subscription.toString());
    revalidatePath("/", "layout");

    return { success: true };
  } catch (error) {
    handleError(error);
    return { success: false, error: "Update failed" };
  }
}

export async function adminDeleteReview(
  reviewId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await connectToDatabase();

    const review = await Review.findById(reviewId);
    if (!review) return { success: false, error: "Review not found" };

    const subscriptionId = review.subscription.toString();
    await Review.findByIdAndDelete(reviewId);

    await recalcSubscriptionRating(subscriptionId);
    revalidatePath("/", "layout");

    return { success: true };
  } catch (error) {
    handleError(error);
    return { success: false, error: "Delete failed" };
  }
}
