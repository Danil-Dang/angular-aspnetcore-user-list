export interface ListBooking {
  id: number;
  userId: number;
  hotelId: number;
  roomId: number;
  isActive: boolean;
  checkIn: Date;
  checkOut: Date;
  createdDate: Date;
}
