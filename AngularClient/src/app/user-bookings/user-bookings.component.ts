import { Component, OnInit } from '@angular/core';
import { Observable, forkJoin, map } from 'rxjs';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { DecimalPipe } from '@angular/common';

import { ListUser } from '../manager-user/list-user';
import { UserRole } from '../manager-user/user-role';
import { ListService } from '../_services/list.service';
import { DataService } from '../_services/data.service';
import { StorageService } from '../_services/storage.service';

import { ListBooking } from '../manager-user/list-bookings';

@Component({
  selector: 'app-user-bookings',
  templateUrl: './user-bookings.component.html',
  styleUrl: './user-bookings.component.css',
})
export class UserBookingsComponent {
  loggedIn: boolean;
  currentUser: any;
  isLoggedIn = false;

  bookingsByUser$: Observable<ListBooking[]> = new Observable();
  userId?: number;
  bookings$: Observable<ListBooking[]> = new Observable();

  constructor(
    private listsService: ListService,
    private storageService: StorageService,
    private _router: Router,
    private dataService: DataService,
    private datePipe: DatePipe,
    private decimalPipe: DecimalPipe
  ) {
    this.loggedIn = false;
  }

  ngOnInit(): void {
    this.isLoggedIn = this.storageService.isLoggedIn();
    if (!this.isLoggedIn) {
      this._router.navigate(['/home']);
    } else {
      this, (this.userId = JSON.parse(localStorage.getItem('user-id')!));
      this.fetchLists();
    }
  }

  private fetchLists(): void {
    this.bookings$ = this.listsService.getBookingsUser(this.userId!).pipe(
      map((bookings) =>
        bookings.map((booking) => ({
          ...booking,
          checkInFormatted: this.datePipe.transform(
            booking.checkIn,
            'yyyy-MM-dd'
          ),
          checkOutFormatted: this.datePipe.transform(
            booking.checkOut,
            'yyyy-MM-dd'
          ),
          priceChanged: this.decimalPipe.transform(booking.price, '1.0-0'),
          daysTotal: Math.ceil(
            (new Date(booking.checkOut).getTime() -
              new Date(booking.checkIn).getTime()) /
              (1000 * 3600 * 24)
          ),
        }))
      )
    );
  }
}
