export interface Review {
  user: string;
  userAvatar: string;
  headline: string;
  review: string;
  userRating: number;
  reviewDate: Date;
  likes: number;
  dislikes: number;
  expandReview?: boolean;
}