import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { DatePipe, DecimalPipe } from '@angular/common';

import { ListService } from '../../_services/list.service';
import { StorageService } from '../../_services/storage.service';
import { ListPayment } from '../list-payment';

@Component({
  selector: 'app-manager-payments',
  templateUrl: './manager-payments.component.html',
  styleUrl: './manager-payments.component.css',
})
export class ManagerPaymentsComponent implements OnInit {
  loggedIn: boolean;
  currentUser: any;
  isLoggedIn = false;
  roles: { [key: number]: string } = {};
  showAdminBoard = false;

  // paymentsByUser$: Observable<ListPayment[]> = new Observable();
  userId?: number;
  isByUser = false;
  // paymentsByHotel$: Observable<ListPayment[]> = new Observable();
  hotelId?: number;
  isByHotel = false;
  // paymentsByRoom$: Observable<ListPayment[]> = new Observable();
  roomId?: number;
  isByRoom = false;
  payments$: Observable<ListPayment[]> = new Observable();
  paymentsFormatted$: Observable<ListPayment[]> = new Observable();
  // payment$: Observable<ListPayment> = new Observable();
  listLists: number;

  constructor(
    private listsService: ListService,
    private storageService: StorageService,
    private _router: Router,
    private datePipe: DatePipe,
    private decimalPipe: DecimalPipe // private dataService: DataService
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
    this.paymentsFormatted$ = this.payments$.pipe(
      map((payments) =>
        payments.map((payment) => ({
          ...payment,
          priceFormatted: this.decimalPipe.transform(payment.price, '1.0-0'),
        }))
      )
    );
    // this.currentUser = this.storageService.getUser();
  }

  private fetchLists(): void {
    this.payments$ = this.listsService.getPayments().pipe(
      map((payments) =>
        payments.map((payment) => ({
          ...payment,
          dateFormatted: this.datePipe.transform(payment.date, 'yyyy-MM-dd'),
        }))
      )
    );
  }

  editList(id: number): void {
    // this._router.navigate(['/list/bookings/edit']);
    // this.dataService.changeVariableNumber(id);
    // this.dataService.changeVariableBoolean(false);
  }

  deleteList(id: number): void {
    this.listsService.deletePayment(id).subscribe({
      next: () => this.fetchLists(),
    });
  }
}
