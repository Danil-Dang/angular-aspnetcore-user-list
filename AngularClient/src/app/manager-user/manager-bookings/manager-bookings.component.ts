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
  lists$: Observable<ListUser[]> = new Observable();
  list$: Observable<ListUser> = new Observable();
  userId?: number;
  hotelId?: number;
  roomId?: number;
  listLists: number;

  roles$: Observable<UserRole[]> = new Observable();
  // roles: string[] = [];
  roles: any;
  role1 = '';
  role2 = '';

  loggedIn: boolean;
  currentUser: any;
  isLoggedIn = false;

  bookingsByUser$: Observable<ListBooking[]> = new Observable();
  bookingsByHotel$: Observable<ListBooking[]> = new Observable();
  bookingsByRoom$: Observable<ListBooking[]> = new Observable();
  bookings$: Observable<ListBooking[]> = new Observable();
  booking$: Observable<ListBooking> = new Observable();

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
      this.list$ = this.listsService.getList(idConverted);
    } else {
      this.listLists = 0;
      this.fetchLists();
    }
  }
  onHotelIdFilterChange(id: string) {
    let idConverted = Number(id);
    if (id != '') {
      this.userId = idConverted;
      this.listLists = 1;
      this.list$ = this.listsService.getList(idConverted);
    } else {
      this.listLists = 0;
      this.fetchLists();
    }
  }
  onRoomIdFilterChange(id: string) {
    let idConverted = Number(id);
    if (id != '') {
      this.userId = idConverted;
      this.listLists = 1;
      this.list$ = this.listsService.getList(idConverted);
    } else {
      this.listLists = 0;
      this.fetchLists();
    }
  }
}
