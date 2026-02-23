// ====== USER PARAMS
export type CreateUserParams = {
  clerkId: string
  firstName: string
  lastName: string
  username: string
  email: string
  photo: string
}

export type UpdateUserParams = {
  firstName: string
  lastName: string
  username: string
  photo: string
}

// ====== SUBSCRIPTION PARAMS
export type CreateSubscriptionParams = {
  userId: string
  subscription: {
    title: string
    description: string
    imageUrl: string
    price: string
  }
  path: string
}

export type UpdateSubscriptionParams = {
  userId: string
  subscription: {
    _id: string
    title: string
    imageUrl: string
    description: string
    price: string
  }
  path: string
}

export type DeleteSubscriptionParams = {
  subscriptionId: string
  path: string
}

export type GetAllSubscriptionsParams = {
  query: string
  category: string
  limit: number
  page: number
}

export type GetSubscriptionsByUserParams = {
  userId: string
  limit?: number
  page: number
}

export type GetRelatedSubscriptionsByCategoryParams = {
  categoryId: string
  subscriptionId: string
  limit?: number
  page: number | string
}

export type Subscription = {
  _id: string
  title: string
  description: string
  price: string
  isFree: boolean
  imageUrl: string
  location: string
  startDateTime: Date
  endDateTime: Date
  url: string
  organizer: {
    _id: string
    firstName: string
    lastName: string
  }
  category: {
    _id: string
    name: string
  }
}

// ====== CATEGORY PARAMS
export type CreateCategoryParams = {
  categoryName: string
}

// ====== ORDER PARAMS
export type CheckoutOrderParams = {
  subscriptionTitle: string
  subscriptionId: string
  price: string
  isFree: boolean
  buyerId: string
}

export type CreateOrderParams = {
  stripeId: string
  subscriptionId: string
  buyerId: string
  totalAmount: string
  createdAt: Date
}

export type GetOrdersByEventParams = {
  subscriptionId: string
  searchString: string
}

export type GetOrdersByUserParams = {
  userId: string | null
  limit?: number
  page: string | number | null
}

// ====== URL QUERY PARAMS
export type UrlQueryParams = {
  params: string
  key: string
  value: string | null
}

export type RemoveUrlQueryParams = {
  params: string
  keysToRemove: string[]
}

export type SearchParamProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}
