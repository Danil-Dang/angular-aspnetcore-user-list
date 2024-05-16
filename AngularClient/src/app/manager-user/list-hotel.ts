export interface ListHotel {
  id: number;
  hotelName?: string;
  hotelStar?: number;
  roomTotal?: number;
  location?: string;
  isActive: boolean;
  createdDate: Date;
}
