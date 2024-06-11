import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  Observable,
  forkJoin,
  switchMap,
  of,
  map,
  catchError,
  EMPTY,
} from 'rxjs';

import { ListHotel } from '../manager-user/list-hotel';
import { ListService } from '../_services/list.service';
import { DataService } from '../_services/data.service';
import { StorageService } from '../_services/storage.service';
import { ListRoom } from '../manager-user/list-room';

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

  roomLists$: Observable<ListRoom[]> = new Observable();
  roomPrices: number[] = [];
  cheapestRooms: any = [];
  cheapestRoom$: any;
  cheapestRooms$: any;
  // hotelIds: any;
  hotelIds: number[] = [1, 2, 3, 5];
  roomMap: any = {};

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
    // if (!this.isLoggedIn) {
    //   this._router.navigate(['/home']);
    // }

    this.currentUser = this.storageService.getUser();
    this.fetchLists();

    // this.hotelIds
    //   .reduce((acc: any, hotelId: any) => {
    //     // Use reduce to process IDs sequentially
    //     return acc.pipe(
    //       switchMap(() => this.fetchAndFindCheapestRooms(hotelId))
    //     );
    //   }, EMPTY) // Start with an empty observable
    //   .subscribe(); // Initiate the sequence

    // this.hoteLists$
    //   .pipe(
    //     switchMap((hotels) =>
    //       forkJoin(
    //         hotels.map((hotel) => this.fetchAndFindCheapestRooms(hotel.id))
    //       )
    //     )
    //   )
    //   .subscribe();
  }

  private fetchLists(): void {
    this.hoteLists$ = this.listsService.getHotelLists();
  }

  fetchRooms(id: number) {
    this.roomLists$ = this.listsService.getRooms(id);
  }

  generateStars(ratingValue: number): any[] {
    const stars = [];
    for (let i = 0; i < ratingValue; i++) {
      stars.push({});
    }
    return stars;
  }

  showRooms(id: number) {
    // this._router.navigate(['/hotels/rooms']);
    this.dataService.changeVariableNumber(id);
  }

  private fetchAndFindCheapestRooms(hotelId: number) {
    return this.listsService.getRooms(hotelId).pipe(
      catchError(() => of([])),
      map((rooms) => {
        if (rooms.length === 0) return null;
        return rooms.reduce((cheapest, current) =>
          cheapest && cheapest.price < current.price ? cheapest : current
        );
      }),
      switchMap((cheapestRoom) => {
        if (cheapestRoom) {
          this.cheapestRooms$.next(cheapestRoom); // Emit the cheapest room
        }
        return of(null); // Complete the observable after emitting (or not)
      })
    );
  }

  private fetchAndFindCheapestRoom(hotelId: number) {
    this.fetchRooms(1);
    this.cheapestRoom$ = this.roomLists$.pipe(
      map((rooms) => {
        if (rooms.length === 0) {
          return null;
        }

        return rooms.reduce((cheapest, current) =>
          cheapest && cheapest.price < current.price ? cheapest : current
        );
      })
    );
    this.cheapestRoom$.subscribe((cheapestRoom: any) => {
      if (cheapestRoom) {
        console.log('Cheapest room:', cheapestRoom);
      } else {
        console.log('No rooms found for this hotel.');
      }
    });
  }
}
