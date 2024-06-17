export interface ListReview {
  id: number;
  userId: number;
  hotelId: number;
  reviewStar: number;
  description: string;
  createdDate: Date;
}
