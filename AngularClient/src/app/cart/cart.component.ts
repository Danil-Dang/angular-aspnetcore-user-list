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
import { DecimalPipe } from '@angular/common';

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
  reloadOnce = false;
  whereNavigate = '';

  hotelId: number = 0;
  roomId: number = 0;
  userId = 0;

  bookings$: Observable<ListBooking[]> = new Observable();
  bookingsWith$!: Observable<ListBookingWith[]>;
  cartFormatted$!: Observable<ListBookingWith[]>;
  cart = 0;

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

  currentPage: number = 1;
  itemsPerPage: number = 3;
  // totalPages!: number;
  totalPages: number = 0;
  isLoggedInPayment = false;

  constructor(
    private storageService: StorageService,
    private dataService: DataService,
    private listService: ListService,
    private _router: Router,
    private decimalPipe: DecimalPipe
  ) {
    // this.minDate.setDate(this.minDate.getDate() - 1);
    // this.maxDate.setDate(this.maxDate.getDate() + 7);
    this.bsRangeValue = [this.bsValue, this.maxDate];
  }

  ngOnInit(): void {
    // this.reloadOnce = JSON.parse(localStorage.getItem('reloadOncee')!);
    // if (!this.reloadOnce) {
    //   console.log('this.reloadOnce in');
    //   localStorage.setItem('reloadOncee', 'true');
    //   window.location.reload();
    // } else {
    //   localStorage.setItem('reloadOnce', 'false');
    // }
    this.whereNavigate = localStorage.getItem('whereNavigate')!;
    if (this.whereNavigate === 'cart') {
      localStorage.setItem('whereNavigate', '');
    }

    this.isLoggedIn = this.storageService.isLoggedIn();
    // if (this.isLoggedIn) {
    // }

    this.cart = Number(localStorage.getItem('booking-total'));

    for (let index = this.cart; index > 0; index--) {
      this.selectedItems[index - 1] = !this.selectedItems[index - 1];
    }
    this.fetchBookingWith();

    for (let i = 1; i <= this.cart; i++) {
      this.hoveredDelete.push(false);
    }

    this.userId = Number(localStorage.getItem('user-id'));

    this.calculateTotalPages();
  }

  fetchBooking() {
    this.bookings$ = this.listService.getBookings();
  }
  fetchBookingWith() {
    this.bookingsWith$ = new Observable<ListBookingWith[]>((observer) => {
      this.bookedObj = JSON.parse(localStorage.getItem('booking')!);
      if (this.bookedObj) {
        const bookings = Object.values(this.bookedObj);

        const bookingObservables = bookings.map((booking) =>
          forkJoin({
            hotel: this.listService.getHotelList(booking.bookingHotelId!),
            room: this.listService.getRoom(booking.bookingRoomId!).pipe(
              map((room) => ({
                ...room,
                priceFormatted: this.decimalPipe.transform(
                  room.price * booking.numberOfDays,
                  '1.0-0'
                ),
              }))
            ),
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
      }
    });

    this.bookingsWith$.subscribe((bookingsWith) => {
      this.bookedArray = bookingsWith;
      this.totalPrice = 0;
      this.bookedArray.forEach((booking, index) => {
        if (this.selectedItems[index] && booking.room) {
          // console.log('totalPrice before', this.totalPrice);
          this.totalPrice += booking.room.price * (booking.numberOfDays ?? 0);
          // console.log('totalPrice after', this.totalPrice);
        }
      });
      this.decimalPipe.transform(this.totalPrice, '1.0-0');
      this.calculateTotalPages();
    });
  }

  openDatePicker(
    startDate: any,
    endDate: any,
    index: number,
    currentPage: number
  ) {
    this.datePickerOpen = !this.datePickerOpen;
    this.bsValue = new Date(startDate);
    this.maxDate = new Date(endDate);
    this.bsRangeValue = [this.bsValue, this.maxDate];
    this.currentIndex = index;
    this.currentPage = currentPage;
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

      const indexx = this.currentIndex + (this.currentPage - 1) * 3;

      this.bookedArray[indexx].bookingStartDate = startDate;
      this.bookedArray[indexx].bookingEndDate = endDate;
      this.bookedArray[indexx].numberOfDays = numberOfDays;

      this.updateLocalStorage();

      this.datePickerOpen = false;
      window.location.reload();
    }
  }

  deleteBooking(index: number) {
    const indexx = index + (this.currentPage - 1) * 3;
    if (indexx >= 0 && indexx < this.bookedArray.length) {
      this.bookedArray.splice(indexx, 1);

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
  calculateTotalPrice() {
    this.totalPrice = 0;
    this.bookedArray.forEach((booking, index) => {
      if (this.selectedItems[index] && booking.room) {
        this.totalPrice += booking.room.price * (booking.numberOfDays ?? 0);
      }
    });
    return this.decimalPipe.transform(this.totalPrice, '1.0-0');
  }

  calculateTotalPages() {
    this.totalPages = Math.ceil(
      this.bookedArray?.length / this.itemsPerPage || 0
    );
  }
  goToPage(pageNumber: number) {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.currentPage = pageNumber;
    }
  }
  getPaginatedBookings(bookings: ListBookingWith[]): ListBookingWith[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return bookings.slice(startIndex, endIndex);
  }

  goToPayment() {
    // const selectedBookings: ListBookingWith[] = [];
    if (!this.isLoggedIn) {
      this.isLoggedInPayment = true;
    } else {
      const selectedBookings: any[] = [];

      this.bookedArray.forEach((booking, index) => {
        if (this.selectedItems[index]) {
          this.totalPrice += booking.room!.price * (booking.numberOfDays ?? 0);
          const roomPrice = booking.room!.price * (booking.numberOfDays ?? 0);
          const obj = {
            roomPrice: roomPrice,
            hotelName: booking.hotel?.hotelName,
            roomType: booking.room?.roomType,

            userId: this.userId,
            hotelId: booking.bookingHotelId,
            roomId: booking.bookingRoomId,
            checkIn: booking.bookingStartDate,
            checkOut: booking.bookingEndDate,

            selectedIndex: index,
          };
          selectedBookings.push(obj);
        }
      });
      localStorage.setItem('booking-payment', JSON.stringify(selectedBookings));
      localStorage.setItem(
        'booking-payment-price',
        JSON.stringify(this.totalPrice)
      );
      this._router.navigate(['/payment']);
    }
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
