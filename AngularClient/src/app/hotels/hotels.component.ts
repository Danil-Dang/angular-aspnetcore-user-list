import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { ListHotel } from '../manager-user/list-hotel';
import { ListService } from '../_services/list.service';
import { DataService } from '../_services/data.service';
import { StorageService } from '../_services/storage.service';

@Component({
  selector: 'app-hotels',
  templateUrl: './hotels.component.html',
  styleUrl: './hotels.component.css',
})
export class HotelsComponent implements OnInit {
  loggedIn: boolean;
  currentUser: any;
  isLoggedIn = false;

  hoteLists$: Observable<ListHotel[]> = new Observable();
  hotelId?: number;

  constructor(
    private listsService: ListService,
    private storageService: StorageService,
    private _router: Router,
    private dataService: DataService // private fb: FormBuilder,
  ) {
    this.loggedIn = false;
  }

  ngOnInit(): void {
    this.isLoggedIn = this.storageService.isLoggedIn();

    this.currentUser = this.storageService.getUser();
    this.fetchLists();
  }

  private fetchLists(): void {
    this.hoteLists$ = this.listsService.getHotelLists();
  }

  generateStars(ratingValue: number): any[] {
    const stars = [];
    for (let i = 0; i < ratingValue; i++) {
      stars.push({}); // Placeholder for each star element
    }
    return stars;
  }
}
