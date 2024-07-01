import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { BsDaterangepickerDirective } from 'ngx-bootstrap/datepicker';

import { AuthService } from '../../../_services/auth.service';
import { StorageService } from '../../../_services/storage.service';
import { DataService } from '../../../_services/data.service';
import { ListService } from '../../../_services/list.service';
import { ListHotel } from '../../list-hotel';
import { ListBooking } from '../../list-bookings';

@Component({
  selector: 'app-bookings-edit',
  templateUrl: './bookings-edit.component.html',
  styleUrl: './bookings-edit.component.css',
})
export class BookingsEditComponent {
  isLoggedIn = false;
  errorMessage = '';
  roles: { [key: number]: string } = {};
  showAdminBoard = false;

  booking$: Observable<ListBooking> = new Observable();
  // editUser: boolean = false;
  bookingId: number = 0;

  form: any = {
    userId: 0,
    hotelId: 0,
    roomId: 0,
    checkIn: null,
    checkOut: null,
  };

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

  constructor(
    private authService: AuthService,
    private _router: Router,
    private route: ActivatedRoute,
    private storageService: StorageService,
    private dataService: DataService,
    private listService: ListService,
    private http: HttpClient
  ) {
    this.minDate.setDate(this.minDate.getDate() - 1);
    this.maxDate.setDate(this.maxDate.getDate() + 7);
    this.bsRangeValue = [this.bsValue, this.maxDate];
  }

  ngOnInit(): void {
    this.isLoggedIn = this.storageService.isLoggedIn();
    if (!this.isLoggedIn) {
      this._router.navigate(['/home']);
    } else {
      this.roles = JSON.parse(localStorage.getItem('user-role')!);
      this.showAdminBoard = Object.values(this.roles).includes('Admin');
    }

    if (!this.showAdminBoard) {
      this._router.navigate(['/home']);
    }

    this.dataService.variableChangedNumber$.subscribe((newValue: number) => {
      this.bookingId = newValue;
    });
    if (this.bookingId === 0) {
      // this.editUser = false;
      this._router.navigate(['/home']);
    } else if (this.bookingId >= 1) {
      // this.editUser = true;
      this.fetchList();
      this.booking$.subscribe((data) => {
        this.form.userId = data.userId;
        this.form.hotelId = data.hotelId;
        this.form.roomId = data.roomId;
        this.form.checkIn = data.checkIn;
        this.form.checkOut = data.checkOut;
      });
    }
  }

  private fetchList(): void {
    this.booking$ = this.listService.getBooking(this.bookingId);
  }

  onSubmit(): void {
    // if (this.bsRangeValue) {
    const startDate = this.bsRangeValue[0].toISOString().split('T')[0];
    const endDate = this.bsRangeValue[1].toISOString().split('T')[0];

    const obj = {
      userId: this.form.userId,
      hotelId: this.form.hotelId,
      roomId: this.form.roomId,
      checkIn: startDate,
      checkOut: endDate,
    };

    this.listService.createBooking(obj).subscribe({
      next: () => {
        this._router.navigate(['/list/bookings']);
      },
      error: (err) => {
        this.errorMessage = err.error.message;
      },
    });
  }

  onCancel(): void {
    this.bookingId = 0;
    this._router.navigate(['/list/bookings']);
  }

  onEditList() {
    const startDate = this.bsRangeValue[0].toISOString().split('T')[0];
    const endDate = this.bsRangeValue[1].toISOString().split('T')[0];

    const obj = {
      userId: this.form.userId,
      hotelId: this.form.hotelId,
      roomId: this.form.roomId,
      checkIn: startDate,
      checkOut: endDate,
    };

    this.listService.updateBooking(this.bookingId, obj).subscribe({
      next: () => {
        this._router.navigate(['/list/bookings']);
      },
      error: (error) => {
        alert('Failed to update booking');
        console.error(error);
      },
    });
  }
}
