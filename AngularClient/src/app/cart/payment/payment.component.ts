import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
// import { loadStripe } from '@stripe/stripe-js';
import { from, concatMap } from 'rxjs';
import { DecimalPipe } from '@angular/common';

import { AuthService } from '../../_services/auth.service';
import { StorageService } from '../../_services/storage.service';
import { PaymentService } from '../../_services/payment.service';
import { ListService } from '../../_services/list.service';
import { ListBookingWith } from '../../manager-user/list-bookingsWith';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css',
})
export class PaymentComponent implements OnInit {
  isLoggedIn = false;

  // selectedBookings!: [];
  selectedBookings: SelectedBooking[] = [];
  selectedBookingss: SelectedBooking[] = [];
  totalPrice!: number;
  totalPricee!: string;

  // stripePromise = loadStripe('YOUR_STRIPE_PUBLISHABLE_KEY');
  cardElement: any;
  @ViewChild('cardElement') cardElementRef!: ElementRef;
  isVisa = false;
  payMethod = '';

  userId = 0;
  bookingId = 0;
  hotelId = 0;
  roomId = 0;

  bookings = [];

  constructor(
    private _router: Router,
    private storageService: StorageService,
    private paymentService: PaymentService,
    private listService: ListService,
    private decimalPipe: DecimalPipe
  ) {}

  async ngOnInit() {
    this.isLoggedIn = this.storageService.isLoggedIn();
    // if (!this.isLoggedIn) {
    //   this._router.navigate(['/home']);
    // } else {
    // }

    if (!localStorage.getItem('booking-payment')) {
      this._router.navigate(['/cart']);
    }
    const preSelectedBookings = JSON.parse(
      localStorage.getItem('booking-payment')!
    );
    this.selectedBookings = preSelectedBookings
      ? Object.values(preSelectedBookings)
      : [];
    this.selectedBookingss = this.selectedBookings.map((item) => {
      return {
        ...item,
        priceFormatted: this.decimalPipe.transform(item.roomPrice, '1.0-0'),
      };
    });

    this.totalPrice! =
      JSON.parse(localStorage.getItem('booking-payment-price')!) / 2;
    this.totalPricee = this.decimalPipe.transform(this.totalPrice, '1.0-0')!;
  }

  onCancel() {
    localStorage.removeItem('booking-payment');
    localStorage.removeItem('booking-payment-price');
    this._router.navigate(['/cart']);
  }

  onPay() {
    // if () {}
    this.bookings = Object.values(JSON.parse(localStorage.getItem('booking')!));
    let i = 0;

    from(this.selectedBookings)
      .pipe(
        concatMap((booking) => {
          const objBooking = {
            userId: booking.userId,
            hotelId: booking.hotelId,
            roomId: booking.roomId,
            checkIn: booking.checkIn,
            checkOut: booking.checkOut,
          };

          return this.listService.createBooking(objBooking).pipe(
            concatMap((createdBooking) => {
              if (this.isVisa) {
                this.payMethod = 'visa';
              }

              const createdBookingg = createdBooking
                ? JSON.parse(createdBooking)
                : [];

              const objPayment = {
                bookingId: createdBookingg.id,
                userId: booking.userId,
                // price: this.totalPrice,
                price: booking.roomPrice,
                paymentMethod: this.payMethod,
                // visaCard: ,
              };

              this.deleteBooking(booking.selectedIndex - i);
              i++;
              return this.listService.createPayment(objPayment);
            })
          );
        })
      )
      .subscribe({
        next: () => {},
        error: (error) => {},
        complete: () => {
          this._router.navigate(['/cart']);
          window.location.reload();
        },
      });

    // this._router.navigate(['/cart']);
    // window.location.reload();
  }

  deleteBooking(index: number) {
    if (this.bookings && index >= 0 && index < this.bookings.length) {
      this.bookings.splice(index, 1);

      this.updateLocalStorage();
      const updatedBookingTotal =
        Number(localStorage.getItem('booking-total')) - 1;
      localStorage.setItem(
        'booking-total',
        JSON.stringify(updatedBookingTotal)
      );
      // window.location.reload();
    }
  }
  updateLocalStorage() {
    const updatedBookedObj = this.bookings.reduce((acc, booking, index) => {
      acc[index + 1] = booking;
      return acc;
    }, {} as { [key: string]: ListBookingWith });

    localStorage.setItem('booking', JSON.stringify(updatedBookedObj));
  }
}

export interface SelectedBooking {
  roomPrice: number;
  hotelName: string;
  roomType: string;
  userId: number;
  hotelId: number;
  roomId: number;
  checkIn: string;
  checkOut: string;
  selectedIndex: number;

  priceFormatted?: string | null;
}

export interface BookingResponse {
  id: number;
}
