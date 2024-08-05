export interface ListHotel {
  id: number;
  hotelName?: string;
  hotelStar?: number;
  roomTotal?: number;
  location?: string;
  imgPath?: string;
  isActive?: boolean;
  createdDate?: Date;
  createdDateFormatted?: string | null;

  lowestPrice?: number;
  lowestPricee?: string | null;
  averageReview: number;
  totalReviews: number;
  availableDates: Date;
  bookingDate: Date;
  bookedRooms: number;
}
