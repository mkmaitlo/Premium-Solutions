"use server";

import { connectToDatabase } from "@/lib/database";
import Subscriber from "@/lib/database/models/subscriber.model";
import { revalidatePath } from "next/cache";

// ─── Subscribe ────────────────────────────────────────────────────────────────
export async function subscribeEmail(
  email: string
): Promise<{ success: boolean; message: string; alreadyExists?: boolean }> {
  try {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { success: false, message: "Please enter a valid email address." };
    }

    await connectToDatabase();

    const existing = await Subscriber.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return {
        success: true,
        message: "You're already subscribed!",
        alreadyExists: true,
      };
    }

    await Subscriber.create({ email: email.toLowerCase().trim() });
    revalidatePath("/subscribers");

    return { success: true, message: "You're subscribed — welcome aboard! 🎉" };
  } catch (error: any) {
    // Duplicate key race condition
    if (error?.code === 11000) {
      return { success: true, message: "You're already subscribed!", alreadyExists: true };
    }
    console.error("[subscribeEmail]", error);
    return { success: false, message: "Something went wrong. Please try again." };
  }
}

// ─── Get All Subscribers (admin) ──────────────────────────────────────────────
export async function getAllSubscribers(): Promise<{
  subscribers: { email: string; subscribedAt: string }[];
  total: number;
}> {
  try {
    await connectToDatabase();

    const subscribers = await Subscriber.find({})
      .sort({ subscribedAt: -1 })
      .lean();

    return {
      subscribers: subscribers.map((s: any) => ({
        email: s.email,
        subscribedAt: s.subscribedAt
          ? new Date(s.subscribedAt).toISOString()
          : new Date().toISOString(),
      })),
      total: subscribers.length,
    };
  } catch (error) {
    console.error("[getAllSubscribers]", error);
    return { subscribers: [], total: 0 };
  }
}

// ─── Delete Subscriber (admin) ────────────────────────────────────────────────
export async function deleteSubscriber(email: string): Promise<{ success: boolean }> {
  try {
    await connectToDatabase();
    await Subscriber.findOneAndDelete({ email });
    revalidatePath("/subscribers");
    return { success: true };
  } catch {
    return { success: false };
  }
}
