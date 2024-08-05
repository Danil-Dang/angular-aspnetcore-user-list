import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { DatePipe } from '@angular/common';

import { StorageService } from '../../_services/storage.service';
import { ListService } from '../../_services/list.service';
import { DataService } from '../../_services/data.service';
import { ListHotel } from '../list-hotel';

@Component({
  selector: 'app-manager-hotel',
  templateUrl: './manager-hotel.component.html',
  styleUrl: './manager-hotel.component.css',
})
export class ManagerHotelComponent implements OnInit {
  isLoggedIn = false;
  roles: { [key: number]: string } = {};
  showAdminBoard = false;

  hoteLists$: Observable<ListHotel[]> = new Observable();
  hotelId?: number;

  constructor(
    private listsService: ListService,
    private storageService: StorageService,
    private _router: Router,
    private dataService: DataService,
    private datePipe: DatePipe
  ) {}

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
  }

  private fetchLists(): void {
    this.hoteLists$ = this.listsService.getHotelLists().pipe(
      map((hotels) =>
        hotels.map((hotel) => ({
          ...hotel,
          createdDateFormatted: this.datePipe.transform(
            hotel.createdDate,
            'yyyy-MM-dd'
          ),
        }))
      )
    );
  }

  addHotel() {
    this._router.navigate(['/list/hotels/edit']);
    this.dataService.changeVariableNumber(0.5);
  }

  editHotel(id: number) {
    this._router.navigate(['/list/hotels/edit']);
    this.dataService.changeVariableNumber(id);
  }

  deleteHotel(id: number) {
    this.listsService.deleteHotelList(id).subscribe({
      next: () => this.fetchLists(),
    });
  }
}
