export interface ListRoom {
  id: number;
  hotelId: number;
  roomType?: number;
  price: number;
  isActive: boolean;
  createdDate: Date;

  roomTotal?: number;
}
