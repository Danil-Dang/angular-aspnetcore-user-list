export interface ListPayment {
  id: number;
  userId: number;
  bookingId: number;
  price: number;
  visaCard: number;
  paymentMethod: string;
  isActive: boolean;
  date: Date;
  dateFormatted?: string | null;

  username?: string;
  priceFormatted?: string | null;
}
