import { IEvent } from '@/lib/database/models/event.model'
import Link from 'next/link'
import React from 'react'
import { DeleteConfirmation } from './DeleteConfirmation'
import { ArrowRight, Star, Edit } from 'lucide-react'
import Image from 'next/image'

type CardProps = {
  event: IEvent,
  userId?: string
  index?: number
}

// Gives each card a branded gradient accent based on title keywords
const getCardGradient = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes('microsoft') || t.includes('office') || t.includes('365'))
    return 'from-[#0078d4]/20 via-primary/10 to-transparent';
  if (t.includes('chatgpt') || t.includes('openai') || t.includes('ai'))
    return 'from-emerald-500/20 via-primary/10 to-transparent';
  if (t.includes('linkedin'))
    return 'from-[#0A66C2]/20 via-primary/10 to-transparent';
  if (t.includes('grammarly'))
    return 'from-green-500/20 via-primary/10 to-transparent';
  if (t.includes('netflix'))
    return 'from-red-600/20 via-primary/10 to-transparent';
  if (t.includes('adobe'))
    return 'from-red-500/20 via-primary/10 to-transparent';
  if (t.includes('spotify'))
    return 'from-green-400/20 via-primary/10 to-transparent';
  // Default gradient
  return 'from-primary/15 via-secondary/10 to-transparent';
};

const Card = ({ event, userId, index = 0 }: CardProps) => {
  const isEventCreator = userId && event.organizer?._id
    ? userId === event.organizer._id.toString()
    : false;

  const isFree = event.price === "0" || event.price === "Free" || !event.price;
  const gradient = getCardGradient(event.title);

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
        <Link href={`/events/${event._id}`} className="absolute inset-0">
          {event.imageUrl && (
            <Image
              src={event.imageUrl}
              alt={event.title}
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
        {isEventCreator && (
          <div className="absolute top-3 right-3 z-10 flex gap-2">
            <Link href={`/events/${event._id}`} className="p-2 rounded-full bg-white/90 dark:bg-card/90 backdrop-blur-sm shadow border border-border hover:bg-primary/10 transition-colors">
              <Edit className="w-3.5 h-3.5 text-primary" />
            </Link>
            <div className="p-2 rounded-full bg-white/90 dark:bg-card/90 backdrop-blur-sm shadow border border-border">
              <DeleteConfirmation eventId={event._id.toString()} />
            </div>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="flex flex-col gap-3 p-5 flex-1">
        <div className="flex items-start justify-between gap-3">
          <Link href={`/events/${event._id}`}>
            <h3 className="font-bold text-base text-foreground leading-snug line-clamp-2 group-hover:text-primary dark:group-hover:text-primary transition-colors duration-300">
              {event.title}
            </h3>
          </Link>
        </div>

        {/* Stars decorative */}
        <div className="flex gap-0.5">
          {[1,2,3,4,5].map(i => (
            <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
          ))}
          <span className="text-xs text-muted-foreground ml-1.5 self-center">5.0</span>
        </div>

        {/* Price Row */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
          <div>
            {isFree ? (
              <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">Free</span>
            ) : (
              <span className="text-xl font-extrabold text-foreground">
                <span className="text-sm font-semibold text-muted-foreground mr-1">Rs</span>
                {event.price}
              </span>
            )}
          </div>

          <Link
            href={`/events/${event._id}`}
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