'use server'

import { revalidatePath } from 'next/cache'

import { connectToDatabase } from '@/lib/database'
import Subscription from '@/lib/database/models/subscription.model'
import User from '@/lib/database/models/user.model'
import { handleError } from '@/lib/utils'

import {
  CreateSubscriptionParams,
  UpdateSubscriptionParams,
  DeleteSubscriptionParams,
  GetAllSubscriptionsParams,
  GetSubscriptionsByUserParams,
} from '@/types'


const populateEvent = (query: any) => {
  return query
    .populate({ path: 'organizer', model: User, select: '_id firstName lastName' })
}

// CREATE
export async function createEvent({ userId, subscription, path }: CreateSubscriptionParams) {
  try {
    await connectToDatabase()

    let organizer;
    try {
      organizer = await User.findById(userId);
    } catch {
      organizer = null;
    }
    
    // Fallback if userId passed was a Clerk ID instead of Mongo ID
    if (!organizer) {
      organizer = await User.findOne({ clerkId: userId });
    }

    if (!organizer) throw new Error('Organizer not found');

    const newEvent = await Subscription.create({ ...subscription, organizer: organizer._id });
    revalidatePath(path)

    return JSON.parse(JSON.stringify(newEvent))
  } catch (error) {
    handleError(error)
  }
}

// GET ONE SUBSCRIPTION BY ID
export async function getSubscriptionById(subscriptionId: string) {
  try {
    await connectToDatabase()

    const subscription = await populateEvent(Subscription.findById(subscriptionId))

    if (!subscription) throw new Error('Subscription not found')

    return JSON.parse(JSON.stringify(subscription))
  } catch (error) {
    handleError(error)
  }
}

// UPDATE
export async function updateEvent({ userId, subscription, path }: UpdateSubscriptionParams) {
  try {
    await connectToDatabase()

    const eventToUpdate = await Subscription.findById(subscription._id)
    if (!eventToUpdate) {
      throw new Error('Subscription not found')
    }
    
    let organizer;
    try {
      organizer = await User.findById(userId);
    } catch {
      organizer = null;
    }
    if (!organizer) organizer = await User.findOne({ clerkId: userId });

    const organizerMatches = eventToUpdate.organizer && organizer &&
      eventToUpdate.organizer.toHexString() === organizer._id.toHexString();
    if (!organizer || !organizerMatches) {
      throw new Error('Unauthorized or subscription not found')
    }

    const updatedEvent = await Subscription.findByIdAndUpdate(
      subscription._id,
      { ...subscription },
      { new: true }
    )
    revalidatePath(path)

    return JSON.parse(JSON.stringify(updatedEvent))
  } catch (error) {
    handleError(error)
  }
}

// DELETE
export async function deleteEvent({ subscriptionId, path }: DeleteSubscriptionParams) {
  try {
    await connectToDatabase()

    const deletedEvent = await Subscription.findByIdAndDelete(subscriptionId)
    if (deletedEvent) revalidatePath(path)
  } catch (error) {
    handleError(error)
  }
}

// GET ALL SUBSCRIPTIONS
export async function getAllSubscriptions({ query, limit = 6, page, category: _category }: GetAllSubscriptionsParams) {
  try {
    await connectToDatabase()

    const titleCondition = query ? { title: { $regex: query, $options: 'i' } } : {}
    const conditions = {
      $and: [titleCondition],
    }

    const skipAmount = (Number(page) - 1) * limit
    const eventsQuery = Subscription.find(conditions)
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(limit)

    const subscriptions = await populateEvent(eventsQuery)
    const eventsCount = await Subscription.countDocuments(conditions)

    return {
      data: JSON.parse(JSON.stringify(subscriptions)),
      totalPages: Math.ceil(eventsCount / limit),
    }
  } catch (error) {
    handleError(error)
  }
}

// GET SUBSCRIPTIONS BY ORGANIZER
export async function getSubscriptionsByUser({ userId, limit = 6, page }: GetSubscriptionsByUserParams) {
  try {
    await connectToDatabase()

    let organizer;
    try {
      organizer = await User.findById(userId);
    } catch {
      organizer = null;
    }
    if (!organizer) organizer = await User.findOne({ clerkId: userId });

    const conditions = { organizer: organizer ? organizer._id : userId }
    const skipAmount = (page - 1) * limit

    const eventsQuery = Subscription.find(conditions)
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(limit)

    const subscriptions = await populateEvent(eventsQuery)
    const eventsCount = await Subscription.countDocuments(conditions)

    return { data: JSON.parse(JSON.stringify(subscriptions)), totalPages: Math.ceil(eventsCount / limit) }
  } catch (error) {
    handleError(error)
  }
}

// GET ALL SUBSCRIPTION IDs — used by generateStaticParams to pre-render every listing
export async function getAllSubscriptionIds(): Promise<{ id: string }[]> {
  try {
    await connectToDatabase()
    const subs = await Subscription.find({}, { _id: 1 }).lean()
    return subs.map((s: any) => ({ id: s._id.toString() }))
  } catch {
    return []
  }
}

