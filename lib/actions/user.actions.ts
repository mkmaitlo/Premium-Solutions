'use server'

import { revalidatePath } from 'next/cache'
import { connectToDatabase } from '@/lib/database'
import User from '@/lib/database/models/user.model'
import Subscription from '@/lib/database/models/subscription.model'
import Review from '@/lib/database/models/review.model'
import { handleError } from '@/lib/utils'
import { CreateUserParams, UpdateUserParams } from '@/types'

export async function createUser(user: CreateUserParams) {
  try {
    await connectToDatabase()
    const newUser = await User.create(user)
    return JSON.parse(JSON.stringify(newUser))
  } catch (error) {
    handleError(error)
  }
}

export async function getUserById(userId: string) {
  try {
    await connectToDatabase()
    const user = await User.findById(userId)
    if (!user) throw new Error('User not found')
    return JSON.parse(JSON.stringify(user))
  } catch (error) {
    handleError(error)
  }
}

export async function updateUser(clerkId: string, user: UpdateUserParams) {
  try {
    await connectToDatabase()
    const updatedUser = await User.findOneAndUpdate({ clerkId }, user, { new: true })
    if (!updatedUser) throw new Error('User update failed')
    return JSON.parse(JSON.stringify(updatedUser))
  } catch (error) {
    handleError(error)
  }
}

export async function deleteUser(clerkId: string) {
  try {
    await connectToDatabase()
    const userToDelete = await User.findOne({ clerkId })
    if (!userToDelete) throw new Error('User not found')

    await Subscription.updateMany(
      { _id: { $in: userToDelete.subscriptions } },
      { $pull: { organizer: userToDelete._id } }
    )

    const deletedUser = await User.findByIdAndDelete(userToDelete._id)
    revalidatePath('/')
    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null
  } catch (error) {
    handleError(error)
  }
}

// ─── ADMIN: Get all users with search, filter, sort & pagination ─────────────
export type GetAllUsersParams = {
  search?: string
  role?: 'all' | 'admin' | 'user'
  sortBy?: 'newest' | 'oldest' | 'name'
  page?: number
  limit?: number
}

export type UserRow = {
  _id: string
  clerkId: string
  email: string
  username: string
  firstName: string
  lastName: string
  photo: string
  isAdmin: boolean
  reviewCount: number
}

export async function getAllUsers({
  search = '',
  role = 'all',
  sortBy = 'newest',
  page = 1,
  limit = 10,
}: GetAllUsersParams = {}): Promise<{ users: UserRow[]; totalPages: number; totalCount: number }> {
  try {
    await connectToDatabase()

    const roleFilter =
      role === 'admin' ? { isAdmin: true } :
      role === 'user'  ? { isAdmin: false } :
      {}

    const searchFilter = search.trim()
      ? {
          $or: [
            { email:     { $regex: search, $options: 'i' } },
            { username:  { $regex: search, $options: 'i' } },
            { firstName: { $regex: search, $options: 'i' } },
            { lastName:  { $regex: search, $options: 'i' } },
          ],
        }
      : {}

    const matchStage = { ...roleFilter, ...searchFilter }

    const sortStage: Record<string, 1 | -1> =
      sortBy === 'newest' ? { _id: -1 } :
      sortBy === 'oldest' ? { _id:  1 } :
      { firstName: 1, lastName: 1 }

    const skip = (page - 1) * limit

    const [users, totalCount] = await Promise.all([
      User.aggregate([
        { $match: matchStage },
        { $sort: sortStage },
        { $skip: skip },
        { $limit: limit },
        // Join reviews to count per user
        {
          $lookup: {
            from: 'reviews',
            localField: '_id',
            foreignField: 'user',
            as: 'reviews',
          },
        },
        {
          $project: {
            _id: 1,
            clerkId: 1,
            email: 1,
            username: 1,
            firstName: 1,
            lastName: 1,
            photo: 1,
            isAdmin: 1,
            reviewCount: { $size: '$reviews' },
          },
        },
      ]),
      User.countDocuments(matchStage),
    ])

    return {
      users: JSON.parse(JSON.stringify(users)),
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
    }
  } catch (error) {
    handleError(error)
    return { users: [], totalPages: 0, totalCount: 0 }
  }
}

// ─── ADMIN: Dashboard stats ───────────────────────────────────────────────────
export async function getDashboardStats() {
  try {
    await connectToDatabase()

    const [totalUsers, totalAdmins, totalReviews, avgRating] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isAdmin: true }),
      Review.countDocuments(),
      Review.aggregate([
        { $group: { _id: null, avg: { $avg: '$rating' } } },
      ]),
    ])

    return {
      totalUsers,
      totalAdmins,
      regularUsers: totalUsers - totalAdmins,
      totalReviews,
      averageRating: avgRating[0]?.avg ? parseFloat(avgRating[0].avg.toFixed(1)) : 0,
    }
  } catch (error) {
    handleError(error)
    return { totalUsers: 0, totalAdmins: 0, regularUsers: 0, totalReviews: 0, averageRating: 0 }
  }
}
