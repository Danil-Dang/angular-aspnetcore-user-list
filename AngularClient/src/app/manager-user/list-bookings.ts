export interface ListBooking {
  id: number;
  userId?: number;
  hotelId?: number;
  roomId?: number;
  isActive?: boolean;
  checkIn: Date;
  checkInFormatted?: string | null;
  checkOut: Date;
  checkOutFormatted?: string | null;
  createdDate?: Date;
  createdDateFormatted?: string | null;

  username?: string;
  hotelName?: string;
  roomType?: string;
  location?: string;
  price?: number;
  priceChanged?: string | null;
  daysTotal?: number;
  isRoomAvailable?: boolean;
}
