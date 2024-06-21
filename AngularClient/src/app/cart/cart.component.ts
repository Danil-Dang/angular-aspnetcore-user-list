import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import {
  Observable,
  switchMap,
  forkJoin,
  map,
  catchError,
  of,
  tap,
} from 'rxjs';
import { Router } from '@angular/router';
import { BsDaterangepickerDirective } from 'ngx-bootstrap/datepicker';
// import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { StorageService } from '../_services/storage.service';
import { DataService } from '../_services/data.service';
import { ListService } from '../_services/list.service';
import { ListHotel } from '../manager-user/list-hotel';
import { ListRoom } from '../manager-user/list-room';
import { ListReview } from '../manager-user/list-review';
import { ListUser } from '../manager-user/list-user';
import { ReviewWithUser } from '../manager-user/list-revieWithUser';
import { ListBooking } from '../manager-user/list-bookings';
import { ListBookingWith } from '../manager-user/list-bookingsWith';
import { BookingStorage } from './booking-storage';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  isLoggedIn: any;

  hotelId: number = 0;
  roomId: number = 0;
  userId = null;

  bookings$: Observable<ListBooking[]> = new Observable();
  bookingsWith$!: Observable<ListBookingWith[]>;
  cart = 0;

  // bookedStartDay!: any;
  // bookedEndDay!: any;
  bookedObj!: { [key: string]: ListBookingWith };
  bookedArray!: ListBookingWith[];
  bsValue = new Date();
  bsRangeValue: Date[] = [];
  maxDate = new Date();
  minDate = new Date();
  // disabledDates: Date[] = [new Date('2024-06-20'), new Date('2024-06-25')];
  disabledDates: Date[] = [];
  enabledDates: Date[] = [];
  datePickerOpen: boolean = false;
  @ViewChild('dateRangePicker') dateRangePicker!: BsDaterangepickerDirective;
  dateRoomId: number = 0;
  currentIndex!: number;

  hoveredDelete: boolean[] = [];
  selectedItems: { [index: number]: boolean } = {};
  totalPrice = 0;

  constructor(
    private storageService: StorageService,
    private dataService: DataService,
    private listService: ListService,
    private _router: Router
  ) {
    // this.minDate.setDate(this.minDate.getDate() - 1);
    // this.maxDate.setDate(this.maxDate.getDate() + 7);
    this.bsRangeValue = [this.bsValue, this.maxDate];
  }

  ngOnInit(): void {
    this.isLoggedIn = this.storageService.isLoggedIn();
    if (this.isLoggedIn) {
    }

    this.cart = Number(localStorage.getItem('booking-total'));

    this.fetchBookingWith();

    for (let i = 1; i <= this.cart; i++) {
      this.hoveredDelete.push(false);
    }
  }

  fetchBooking() {
    this.bookings$ = this.listService.getBookings();
  }
  fetchBookingWith() {
    this.bookingsWith$ = new Observable<ListBookingWith[]>((observer) => {
      this.bookedObj = JSON.parse(localStorage.getItem('booking')!);
      const bookings = Object.values(this.bookedObj);
      // console.log(bookings);

      const bookingObservables = bookings.map((booking) =>
        forkJoin({
          hotel: this.listService.getHotelList(booking.bookingHotelId!),
          room: this.listService.getRoom(booking.bookingRoomId!),
        }).pipe(
          tap(({ hotel, room }) => {
            booking.hotel = hotel;
            booking.room = room;
          })
        )
      );

      forkJoin(bookingObservables).subscribe(
        () => {
          observer.next(bookings);
          observer.complete();
        },
        (error) => observer.error(error)
      );
    });

    this.bookingsWith$.subscribe((bookingsWith) => {
      this.bookedArray = bookingsWith;
    });
  }

  openDatePicker(startDate: any, endDate: any, index: number) {
    this.datePickerOpen = !this.datePickerOpen;
    this.bsValue = new Date(startDate);
    this.maxDate = new Date(endDate);
    this.bsRangeValue = [this.bsValue, this.maxDate];
    this.currentIndex = index;
    setTimeout(() => {
      this.dateRangePicker.toggle();
    }, 0);
  }
  confirmDates() {
    if (this.bsRangeValue && this.currentIndex !== undefined) {
      const startDate = this.bsRangeValue[0].toISOString().split('T')[0];
      const endDate = this.bsRangeValue[1].toISOString().split('T')[0];

      const startDatee = new Date(this.bsRangeValue[0]);
      const endDatee = new Date(this.bsRangeValue[1]);

      const timeDifference = endDatee.getTime() - startDatee.getTime();
      const numberOfDays = Math.ceil(timeDifference / (1000 * 3600 * 24));

      this.bookedArray[this.currentIndex].bookingStartDate = startDate;
      this.bookedArray[this.currentIndex].bookingEndDate = endDate;
      this.bookedArray[this.currentIndex].numberOfDays = numberOfDays;

      this.updateLocalStorage();

      this.datePickerOpen = false;
      window.location.reload();
    }
  }

  deleteBooking(index: number) {
    if (index >= 0 && index < this.bookedArray.length) {
      this.bookedArray.splice(index, 1);

      this.updateLocalStorage();
      const updatedBookingTotal =
        Number(localStorage.getItem('booking-total')) - 1;
      localStorage.setItem(
        'booking-total',
        JSON.stringify(updatedBookingTotal)
      );
      window.location.reload();
    }
  }
  updateLocalStorage() {
    const updatedBookedObj = this.bookedArray.reduce((acc, booking, index) => {
      acc[index + 1] = booking;
      return acc;
    }, {} as { [key: string]: ListBookingWith });

    localStorage.setItem('booking', JSON.stringify(updatedBookedObj));
  }

  getImage(index: number) {
    if (this.hoveredDelete[index]) {
      return '../../assets/cart/close1.png';
    } else {
      return '../../assets/cart/close.png';
    }
  }

  toggleSelection(index: number) {
    this.selectedItems[index] = !this.selectedItems[index];
    this.calculateTotalPrice();
  }

  calculateTotalPrice(): number {
    this.totalPrice = 0;
    this.bookedArray.forEach((booking, index) => {
      if (this.selectedItems[index] && booking.room) {
        this.totalPrice += booking.room.price * (booking.numberOfDays ?? 0);
      }
    });
    return this.totalPrice;
  }
}

// this.bookingsWith$ = this.bookings$.pipe(
//   switchMap((bookings) => {
//     const hotelCache: { [key: number]: ListHotel } = {};
//     const roomCache: { [key: number]: ListRoom } = {};

//     // Fetch hotel and room details for each booking
//     const combinedObservables = bookings.map((booking) => {
//       return forkJoin({
//         hotel: hotelCache[booking.hotelId]
//           ? of(hotelCache[booking.hotelId]) // Use cached hotel if available
//           : this.listService.getHotelList(booking.hotelId).pipe(
//               tap((hotel) => (hotelCache[booking.hotelId] = hotel)),
//               catchError(() => of(null))
//             ),
//         room: roomCache[booking.roomId]
//           ? of(roomCache[booking.roomId]) // Use cached room if available
//           : this.listService.getRoom(booking.roomId).pipe(
//               tap((room) => (roomCache[booking.roomId] = room)),
//               catchError(() => of(null))
//             ),
//       });
//     });

//     return forkJoin(combinedObservables).pipe(
//       map((combinedData) => {
//         return bookings.map((booking, index) => ({
//           ...booking,
//           hotel: combinedData[index].hotel,
//           room: combinedData[index].room,
//         }));
//       })
//     );
//   })
// );
