import { Component, OnInit } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { Router } from '@angular/router';

import { ListUser } from '../list-user';
import { ListService } from '../../_services/list.service';
import { DataService } from '../../_services/data.service';
import { StorageService } from '../../_services/storage.service';
import { UserRole } from '../user-role';

import { ListBooking } from '../list-bookings';

@Component({
  selector: 'app-manager-bookings',
  templateUrl: './manager-bookings.component.html',
  styleUrl: './manager-bookings.component.css',
})
export class ManagerBookingsComponent implements OnInit {
  loggedIn: boolean;
  currentUser: any;
  isLoggedIn = false;
  roles: { [key: number]: string } = {};
  showAdminBoard = false;

  bookingsByUser$: Observable<ListBooking[]> = new Observable();
  userId?: number;
  isByUser = false;
  bookingsByHotel$: Observable<ListBooking[]> = new Observable();
  hotelId?: number;
  isByHotel = false;
  bookingsByRoom$: Observable<ListBooking[]> = new Observable();
  roomId?: number;
  isByRoom = false;
  bookings$: Observable<ListBooking[]> = new Observable();
  booking$: Observable<ListBooking> = new Observable();
  listLists: number;

  constructor(
    private listsService: ListService,
    private storageService: StorageService,
    private _router: Router,
    private dataService: DataService
  ) {
    this.loggedIn = false;
    this.listLists = 0;
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

    this.fetchLists();
    // this.currentUser = this.storageService.getUser();
  }

  private fetchLists(): void {
    this.bookings$ = this.listsService.getBookings();
  }

  onAddBooking() {
    this._router.navigate(['/list/bookings/edit']);
    this.dataService.changeVariableBoolean(true);
    // this.dataService.changeVariableNumber(0);
    this.dataService.changeVariableNumber(0.5);
  }

  editList(id: number): void {
    this._router.navigate(['/list/bookings/edit']);
    this.dataService.changeVariableNumber(id);
    this.dataService.changeVariableBoolean(false);
  }

  deleteList(id: number): void {
    this.listsService.deleteBooking(id).subscribe({
      next: () => this.fetchLists(),
    });
  }

  onUserIdFilterChange(id: string) {
    let idConverted = Number(id);
    if (id != '') {
      this.userId = idConverted;
      this.listLists = 1;
      this.isByUser = true;
      this.bookingsByUser$ = this.listsService.getBookingsUser(idConverted);
    } else {
      this.listLists = 0;
      this.isByUser = false;
      this.fetchLists();
    }
  }
  onHotelIdFilterChange(id: string) {
    let idConverted = Number(id);
    if (id != '') {
      this.hotelId = idConverted;
      this.listLists = 1;
      this.isByHotel = true;
      this.bookingsByHotel$ = this.listsService.getBookingsHotel(idConverted);
    } else {
      this.listLists = 0;
      this.isByHotel = false;
      this.fetchLists();
    }
  }
  onRoomIdFilterChange(id: string) {
    let idConverted = Number(id);
    if (id != '') {
      this.roomId = idConverted;
      this.listLists = 1;
      this.isByRoom = true;
      this.bookingsByRoom$ = this.listsService.getBookingsRoom(idConverted);
    } else {
      this.listLists = 0;
      this.isByRoom = false;
      this.fetchLists();
    }
  }
}
