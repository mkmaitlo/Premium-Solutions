import { getLatestReviews } from "@/lib/actions/review.actions";
import ReviewsCarouselClient from "./ReviewsCarouselClient";

export async function ReviewsCarousel() {
  const reviews = await getLatestReviews(20);
  return <ReviewsCarouselClient reviews={reviews || []} />;
}
