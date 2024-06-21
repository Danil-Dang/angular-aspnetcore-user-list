import { ListHotel } from './list-hotel';
import { ListRoom } from './list-room';

export interface ListBookingWith {
  id: number;
  userId: number;
  hotelId: number;
  roomId: number;
  checkIn: Date;
  checkOut: Date;
  hotel: ListHotel | null;
  room: ListRoom | null;

  bookingStartDate?: string;
  bookingEndDate?: string;
  bookingRoomId?: number;
  bookingHotelId?: number;
  numberOfDays?: any;
}
