"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/database";
import Deal, { IDeal } from "@/lib/database/models/deal.model";
import { handleError } from "@/lib/utils";

// Make sure to parse results
export async function getAllDeals() {
  try {
    await connectToDatabase();
    const deals = await Deal.find({}).sort({ order: 1, createdAt: -1 });
    return JSON.parse(JSON.stringify(deals));
  } catch (error) {
    handleError(error);
    return [];
  }
}

export async function createDeal(deal: Partial<IDeal>) {
  try {
    await connectToDatabase();
    const newDeal = await Deal.create(deal);
    revalidatePath("/", "layout");
    return JSON.parse(JSON.stringify(newDeal));
  } catch (error) {
    handleError(error);
    return null;
  }
}

export async function updateDeal({ dealId, deal }: { dealId: string; deal: Partial<IDeal> }) {
  try {
    await connectToDatabase();
    const updatedDeal = await Deal.findByIdAndUpdate(dealId, { ...deal }, { new: true });
    revalidatePath("/", "layout");
    return JSON.parse(JSON.stringify(updatedDeal));
  } catch (error) {
    handleError(error);
    return null;
  }
}

export async function reorderDeals(dealIds: string[]) {
  try {
    await connectToDatabase();
    
    const bulkOps = dealIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { order: index } }
      }
    }));
    
    await Deal.bulkWrite(bulkOps);
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    handleError(error);
    return { success: false };
  }
}

export async function deleteDeal(dealId: string) {
  try {
    await connectToDatabase();
    await Deal.findByIdAndDelete(dealId);
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    handleError(error);
    return { success: false, error: "Failed to delete" };
  }
}
