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
  toArray,
  concatMap,
  tap,
  from,
  concat,
  filter,
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

  isFilterByReviews = false;
  isFilterByCity = false;
  isFilterByPriceHigh = false;
  isFilterByPriceLow = false;
  cities: City[] = [
    { name: 'Dalat', value: 'Dalat' },
    { name: 'Da Nang', value: 'Da Nang' },
    { name: 'Hanoi', value: 'Hanoi' },
    { name: 'Ho Chi Minh City', value: 'Ho Chi Minh City' },
  ];
  selectedCity: string = '';
  prices: Price[] = [
    { name: 'Highest price', value: true },
    { name: 'Lowest price', value: true },
  ];
  selectedPrice: string = '';

  constructor(
    private listsService: ListService,
    private storageService: StorageService,
    private _router: Router,
    private dataService: DataService // private fb: FormBuilder,
  ) {
    this.loggedIn = false;
  }

  ngOnInit() {
    this.isLoggedIn = this.storageService.isLoggedIn();
    // if (!this.isLoggedIn) {
    //   this._router.navigate(['/home']);
    // }

    this.currentUser = this.storageService.getUser();

    this.fetchLists();
  }

  private fetchLists(): void {
    this.hoteLists$ = this.listsService.getHotelLists().pipe(
      switchMap((hotels) => {
        if (hotels.length === 0) {
          return of([]);
        } else {
          const observables = hotels.map((hotel) => {
            const lowestPrice$ = this.listsService
              .getCheapestRoom(hotel.id)
              .pipe(map((room) => room.lowestPrice));
            const averageReview$ = this.listsService
              .getAverageReview(hotel.id)
              .pipe(map((room) => room.averageReview));
            const totalReview$ = this.listsService
              .getTotalReview(hotel.id)
              .pipe(map((room) => room.totalReviews));

            return forkJoin([lowestPrice$, averageReview$, totalReview$]).pipe(
              map(([lowestPrice, averageReview, totalReviews]) => ({
                // return hotels.map((hotel, index) => ({
                ...hotel,
                // lowestPrice: prices[index].lowestPrice,
                lowestPrice,
                averageReview,
                totalReviews,
              }))
              // })
            );
          });

          return forkJoin(observables);
        }
      })
    );
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

  setSelectedCity(cityValue: string) {
    this.selectedCity = cityValue;
    this.isFilterByCity = !!cityValue;
  }
  setSelectedPrice(priceName: string) {
    if (priceName === 'Highest price') {
      this.isFilterByPriceHigh = true;
      this.isFilterByPriceLow = false;
      this.selectedPrice = priceName;
    } else if (priceName === 'Lowest price') {
      this.isFilterByPriceLow = true;
      this.isFilterByPriceHigh = false;
      this.selectedPrice = priceName;
    } else {
      this.isFilterByPriceLow = false;
      this.isFilterByPriceHigh = false;
      this.selectedPrice = '';
    }
  }
  onReviewSelect() {
    this.isFilterByReviews = !this.isFilterByReviews;
  }

  filterByReviews() {
    if (
      this.isFilterByCity &&
      this.isFilterByReviews &&
      this.isFilterByPriceHigh
    ) {
      const obj = {
        city: this.selectedCity,
        isByReview: true,
        isByPriceHigh: true,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (
      this.isFilterByCity &&
      this.isFilterByReviews &&
      this.isFilterByPriceLow
    ) {
      const obj = {
        city: this.selectedCity,
        isByReview: true,
        isByPriceLow: true,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (this.isFilterByCity && this.isFilterByReviews) {
      const obj = {
        city: this.selectedCity,
        isByReview: true,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (this.isFilterByCity && this.isFilterByPriceHigh) {
      const obj = {
        city: this.selectedCity,
        isByPriceHigh: true,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (this.isFilterByCity && this.isFilterByPriceLow) {
      const obj = {
        city: this.selectedCity,
        isByPriceLow: true,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (this.isFilterByReviews && this.isFilterByPriceHigh) {
      const obj = {
        isByReview: true,
        isByPriceHigh: true,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (this.isFilterByReviews && this.isFilterByPriceLow) {
      const obj = {
        isByReview: true,
        isByPriceLow: true,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (this.isFilterByReviews) {
      const obj = {
        isByReview: true,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (this.isFilterByCity) {
      const obj = {
        city: this.selectedCity,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (this.isFilterByPriceLow) {
      const obj = {
        isByPriceLow: true,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (this.isFilterByPriceHigh) {
      const obj = {
        isByPriceHigh: true,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else {
      this.fetchLists();
    }
  }
}

interface City {
  name: string;
  value: string;
}
interface Price {
  name: string;
  value: boolean;
}
