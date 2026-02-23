import { ISubscription } from '@/lib/database/models/subscription.model'
import Link from 'next/link'
import React from 'react'
import { DeleteConfirmation } from './DeleteConfirmation'
import { ArrowRight, Star, Pencil } from 'lucide-react'
import Image from 'next/image'

type CardProps = {
  subscription: ISubscription,
  index?: number
  isAdmin?: boolean
}



const Card = ({ subscription, index = 0, isAdmin = false }: CardProps) => {
  const showAdminActions = isAdmin;

  const isFree = subscription.price === "0" || subscription.price === "Free" || !subscription.price;

  return (
    <div
      className="group relative flex flex-col w-full overflow-hidden rounded-2xl bg-card border border-border shadow-sm transition-all duration-300 
        hover:shadow-[0_12px_40px_-10px_hsl(var(--primary) / 0.4)] hover:-translate-y-2 hover:border-transparent"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Gradient border on hover - top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 rounded-t-2xl" />

      {/* Card Header: Full clear image */}
      <div className="relative w-full aspect-[4/3] bg-muted overflow-hidden">
        <Link href={`/subscriptions/${subscription._id}`} className="absolute inset-0">
          {subscription.imageUrl && (
            <Image
              src={subscription.imageUrl}
              alt={subscription.title}
              fill
              className="object-contain transition-transform duration-500 group-hover:scale-105"
            />
          )}
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2 z-10">
          {isFree ? (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-sm">FREE</span>
          ) : (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-primary text-white shadow-sm">PREMIUM</span>
          )}
        </div>

        {/* Creator actions */}
        {showAdminActions && (
          <div className="absolute top-3 right-3 z-10 flex gap-2">
            <Link href={`/subscriptions/${subscription._id}/update`} className="flex items-center justify-center p-2.5 rounded-full bg-card/90 backdrop-blur-sm shadow-sm border border-border/50 hover:bg-primary/10 hover:border-primary/30 hover:shadow-md transition-all duration-300 group cursor-pointer">
              <Pencil className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:scale-110 transition-all duration-300" />
            </Link>
            <DeleteConfirmation subscriptionId={subscription._id.toString()} />
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="flex flex-col gap-3 p-5 flex-1">
        <div className="flex items-start justify-between gap-3">
          <Link href={`/subscriptions/${subscription._id}`}>
            <h3 className="font-bold text-base text-foreground leading-snug line-clamp-2 group-hover:text-primary dark:group-hover:text-primary transition-colors duration-300">
              {subscription.title}
            </h3>
          </Link>
        </div>

        {/* Stars dynamic algorithm */}
        <div className="flex items-center gap-0.5 group/rating">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star 
              key={i} 
              className={`w-3.5 h-3.5 ${(subscription.averageRating ?? 5.0) >= i ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30 fill-transparent'}`} 
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1.5 self-center mt-[1px]">
            {Number(subscription.averageRating ?? 5.0).toFixed(1)} ({subscription.reviewCount ?? 0})
          </span>
        </div>

        {/* Price Row */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
          <div>
            {isFree ? (
              <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">Free</span>
            ) : (
              <span className="text-xl font-extrabold text-foreground">
                <span className="text-sm font-semibold text-muted-foreground mr-1">PKR</span>
                {Number(subscription.price).toLocaleString()}
              </span>
            )}
          </div>

          <Link
            href={`/subscriptions/${subscription._id}`}
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary dark:text-primary hover:gap-2 transition-all duration-200 group/link"
          >
            View Details
            <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Card