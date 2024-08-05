import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import {
  Observable,
  forkJoin,
  switchMap,
  of,
  map,
  startWith,
  catchError,
  EMPTY,
  toArray,
  concatMap,
  tap,
  from,
  concat,
  filter,
} from 'rxjs';
import { FormControl } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { DecimalPipe } from '@angular/common';

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
  // hoteListsFormatted$: Observable<(string | null)[]> = new Observable();
  hoteListsFormatted$: Observable<FormattedHotel[]> = new Observable();

  roomLists$: Observable<ListRoom[]> = new Observable();

  isFilterByReviews = false;
  isFilterByCity = false;
  isFilterByPriceHigh = false;
  isFilterByPriceLow = false;
  isFilterByDate = false;
  isFIlterByStars = false;
  isFilterByRating = false;
  stars = [
    { name: '1 star', value: 1 },
    { name: '2 stars', value: 2 },
    { name: '3 stars', value: 3 },
    { name: '4 stars', value: 4 },
    { name: '5 stars', value: 5 },
  ];
  reviews = [
    { name: 'Exceptional: 9+', value: '9' },
    { name: 'Excellent: 8+', value: '8' },
    { name: 'Very good: 7+', value: '7' },
    { name: 'Good: 6+', value: '6' },
  ];
  cities: City[] = [
    { name: 'Dalat', value: 'Dalat' },
    { name: 'Da Nang', value: 'Da Nang' },
    { name: 'Hanoi', value: 'Hanoi' },
    { name: 'Ho Chi Minh City', value: 'Ho Chi Minh City' },
  ];
  @ViewChild('cityInput') cityInputRef!: ElementRef;
  @ViewChild('dropdownMenu') dropdownMenuRef!: ElementRef;
  allLocations: string[] = [];
  filteredLocations$: Observable<string[]> = new Observable();
  cityInput = new FormControl('');
  showDropdown: boolean = false;
  isCityOpen = false;
  citySelected = '';
  selectedCity: string = '';
  selectedCityy: string = '';
  totalPropertiesFound = 0;
  isCityInvalid = false;
  isDateInvalid = false;
  prices: Price[] = [
    { name: 'Highest price', value: true },
    { name: 'Lowest price', value: true },
  ];
  selectedPrice: string = '';
  selectedStars: number[] = [];
  iStars = 0;
  selectedStarss = '';
  selectedReviews: number[] = [];
  selectedReview!: number | null;
  iReviews = 0;
  // selectedReviewss = '';
  selectedReviewss: string = '';

  bsConfig: Partial<BsDatepickerConfig> = {
    minDate: new Date(),
    maxDate: new Date(2024, 12, 1),
    showWeekNumbers: true,
    rangeInputFormat: 'DD MMM YYYY',
    dateInputFormat: 'DD MMM YYYY',
    isAnimated: true,
  };
  bsValue = new Date();
  bsRangeValue: Date[] = [];
  maxDate = new Date();
  enabledDates: Date[] = [];
  disabledDates: Date[] = [];
  selectedDateStart = '';
  selectedDateEnd = '';

  constructor(
    private listsService: ListService,
    private storageService: StorageService,
    private _router: Router,
    private dataService: DataService,
    private decimalPipe: DecimalPipe
  ) {
    this.loggedIn = false;
    // this.maxDate.setDate(this.maxDate.getDate() + 1);
    // this.bsRangeValue = [this.bsValue, this.maxDate];
  }

  ngOnInit() {
    this.isLoggedIn = this.storageService.isLoggedIn();
    // if (!this.isLoggedIn) {
    //   this._router.navigate(['/home']);
    // }

    // this.dataService.changeHomeStringCity$.subscribe((newValue: string) => {
    //   this.selectedCity = newValue;
    // });
    // this.dataService.changeHomeStringDateStart$.subscribe(
    //   (newValue: string) => {
    //     this.selectedDateStart = newValue;
    //   }
    // );
    // this.dataService.changeHomeStringDateEnd$.subscribe((newValue: string) => {
    //   this.selectedDateEnd = newValue;
    // });
    // if (this.selectedCity != '' || this.selectedDateStart != '') {
    //   this.isFilterByCity = true;
    //   this.filterByReviews();
    // } else {
    // this._router.navigate(['/home']);
    // }
    let search = JSON.parse(localStorage.getItem('search')!);
    if (search) {
      const storedStartYear = new Date(search.startDate).getFullYear();
      const storedStartMonth = new Date(search.startDate).getMonth();
      const storedStartDay = new Date(search.startDate).getDate();

      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth();
      const currentDay = new Date().getDate();

      if (
        storedStartYear > currentYear ||
        (storedStartYear == currentYear && storedStartMonth > currentMonth) ||
        (storedStartYear == currentYear &&
          storedStartMonth == currentMonth &&
          storedStartDay >= currentDay)
      ) {
        console.log('date correct');
        this.selectedCity = search.citySelected;
        this.selectedCityy = search.citySelected;
        this.selectedDateStart = search.startDate;
        this.selectedDateEnd = search.endDate;
        this.bsValue = new Date(search.startDate);
        this.maxDate = new Date(search.endDate);
        this.bsRangeValue = [this.bsValue, this.maxDate];

        this.isFilterByCity = true;
        this.isFilterByDate = true;
        this.filterByReviews();
        // this.fetchLists();

        this.listsService
          .getLocationsCity()
          .pipe(map((locations) => locations.map((location) => location.city)))
          .subscribe((cityNames) => {
            this.allLocations = cityNames;
          });

        this.filteredLocations$ = this.cityInput.valueChanges.pipe(
          startWith(''),
          map((value) => this._filterLocations(value || ''))
        );
      } else {
        console.log('date incorrect');
        localStorage.removeItem('search');
        this._router.navigate(['/home']);
      }
    } else {
      this._router.navigate(['/home']);
      // this.fetchLists();
    }

    this.currentUser = this.storageService.getUser();
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
                // lowestPrice: this.decimalPipe.transform(lowestPrice, '1.0-0', 'vi-VN'),
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

    this.hoteLists$.subscribe((hotels) => {
      this.totalPropertiesFound = hotels.length;
    });
  }

  // fetchRooms(id: number) {
  //   this.roomLists$ = this.listsService.getRooms(id);
  // }

  generateStars(ratingValue: number): any[] {
    const stars = [];
    for (let i = 0; i < ratingValue; i++) {
      stars.push({});
    }
    return stars;
  }

  showRooms(id: number, averageReview: number, totalReview: number) {
    // this._router.navigate(['/hotels/rooms']);
    this.dataService.changeVariableNumber(id);
    const obj = {
      hotelId: id,
      averageReview: averageReview,
      totalReview: totalReview,
    };
    localStorage.setItem('room', JSON.stringify(obj));
  }
  saveViewed(
    id: number,
    hotelName?: string | null,
    hotelStar?: number | null,
    hotelLocation?: string | null,
    averageReview?: number | null,
    totalReview?: number | null,
    hotelPrice?: string | null
  ) {
    const obj = {
      hotelId: id,
      hotelName: hotelName,
      hotelStar: hotelStar,
      hotelLocation: hotelLocation,
      averageReview: averageReview,
      totalReview: totalReview,
      hotelPrice: hotelPrice,
    };

    let objOld = JSON.parse(localStorage.getItem('last-viewed')!) || [];

    let isUsedId = 0;
    for (let i = objOld.length, x = 0; i != 0; i--) {
      if (objOld[i - 1].hotelId == id) {
        isUsedId++;
      }
    }
    while (objOld.length > 3) {
      objOld.shift();
    }
    if (objOld.length >= 3 && isUsedId == 0) {
      objOld.shift();
    }
    if (isUsedId == 0) {
      objOld.push(obj);
    }

    localStorage.setItem('last-viewed', JSON.stringify(objOld));
  }

  setSelectedCity(cityValue: string) {
    if (cityValue) {
      let searchReplace = JSON.parse(localStorage.getItem('search')!);
      searchReplace.citySelected = cityValue;
      localStorage.setItem('search', JSON.stringify(searchReplace));
    }
    this.selectedCity = cityValue;
    this.isFilterByCity = !!cityValue;
  }
  selectCity(location: string) {
    this.selectedCity = location;
    this.cityInput.setValue(location);
    this.showDropdown = false;
    this.isCityInvalid = false;
  }
  private _filterLocations(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allLocations.filter((city) =>
      city.toLowerCase().includes(filterValue)
    );
  }
  setSelectedPrice(priceName: string) {
    if (priceName === 'Highest price') {
      this.isFilterByPriceHigh = true;
      this.isFilterByPriceLow = false;
      this.isFilterByReviews = false;
      this.selectedPrice = priceName;
    } else if (priceName === 'Lowest price') {
      this.isFilterByPriceLow = true;
      this.isFilterByPriceHigh = false;
      this.isFilterByReviews = false;
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

  onSearch() {
    if (
      this.allLocations.includes(this.selectedCity) &&
      this.bsRangeValue &&
      this.bsRangeValue.length == 2
    ) {
      this.isCityInvalid = false;
      this.isDateInvalid = false;

      this.selectedCityy = this.selectedCity;
      this.selectedDateStart = this.bsRangeValue[0].toISOString().split('T')[0];
      this.selectedDateEnd = this.bsRangeValue[1].toISOString().split('T')[0];

      let searchReplace = JSON.parse(localStorage.getItem('search')!);
      searchReplace.citySelected = this.selectedCity;
      searchReplace.startDate = this.selectedDateStart;
      searchReplace.endDate = this.selectedDateEnd;
      localStorage.setItem('search', JSON.stringify(searchReplace));
      this.isFilterByCity = !!this.selectedCity;
      this.isFilterByDate = true;

      this.filterByReviews();
    } else if (
      this.allLocations.includes(this.selectedCity) &&
      (!this.bsRangeValue || this.bsRangeValue.length !== 2)
    ) {
      this.isDateInvalid = true;
      this.isCityInvalid = false;
      // this.filterByReviews();
    } else if (this.bsRangeValue && this.bsRangeValue.length == 2) {
      this.isCityInvalid = true;
      this.isDateInvalid = false;
    } else {
      this.isCityInvalid = true;
      this.isDateInvalid = true;
    }
    // if (cityValue) {
    // let searchReplace = JSON.parse(localStorage.getItem('search')!);
    // searchReplace.citySelected = cityValue;
    // localStorage.setItem('search', JSON.stringify(searchReplace));
    // }
  }

  onStarCheckboxChange(event: any, starRating: number) {
    if (event.target.checked) {
      this.selectedStars.push(starRating);
      this.iStars++;
    } else {
      const index = this.selectedStars.indexOf(starRating);
      if (index > -1) {
        this.selectedStars.splice(index, 1);
      }
      if (this.iStars > 0) this.iStars--;
    }

    if (this.iStars > 0) {
      this.isFIlterByStars = true;
      this.selectedStarss = this.selectedStars.join(',');
      this.filterByReviews();
    } else {
      this.isFIlterByStars = false;
      this.filterByReviews();
    }
  }
  onReviewCheckboxChange(event: any, reviewRating: string) {
    if (event.target.checked) {
      console.log('have selected Rating');

      this.selectedReviewss = reviewRating;
      this.isFilterByRating = true;
      this.filterByReviews();
    }
  }
  onReviewCheckboxCancel() {
    console.log('do not have selected Rating');
    this.isFilterByRating = false;
    this.filterByReviews();
  }

  formatLowestPrice() {
    this.hoteListsFormatted$ = this.hoteLists$.pipe(
      map((hotels) =>
        hotels.map((hotel) => ({
          ...hotel,
          lowestPricee: this.decimalPipe.transform(hotel.lowestPrice, '1.0-0'),
        }))
      )
    );
  }

  filterByReviews() {
    if (
      this.isFilterByCity &&
      this.isFilterByReviews &&
      this.isFilterByPriceHigh &&
      this.isFilterByDate &&
      this.isFIlterByStars &&
      this.isFilterByRating
    ) {
      const obj = {
        city: this.selectedCity,
        isByReview: true,
        isByPriceHigh: true,
        startDate: this.selectedDateStart,
        endDate: this.selectedDateEnd,
        isByStars: true,
        stars: this.selectedStarss,
        isByRating: true,
        rating: this.selectedReviewss,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (
      this.isFilterByCity &&
      this.isFilterByReviews &&
      this.isFilterByPriceLow &&
      this.isFilterByDate &&
      this.isFIlterByStars &&
      this.isFilterByRating
    ) {
      const obj = {
        city: this.selectedCity,
        isByReview: true,
        isByPriceLow: true,
        startDate: this.selectedDateStart,
        endDate: this.selectedDateEnd,
        isByStars: true,
        stars: this.selectedStarss,
        isByRating: true,
        rating: this.selectedReviewss,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
      // ! 5 Option ---------------------------------------
    } else if (
      this.isFilterByCity &&
      this.isFilterByReviews &&
      this.isFilterByPriceHigh &&
      this.isFilterByDate &&
      this.isFIlterByStars
    ) {
      const obj = {
        city: this.selectedCity,
        isByReview: true,
        isByPriceHigh: true,
        startDate: this.selectedDateStart,
        endDate: this.selectedDateEnd,
        isByStars: true,
        stars: this.selectedStarss,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (
      this.isFilterByCity &&
      this.isFilterByReviews &&
      this.isFilterByPriceHigh &&
      this.isFilterByDate &&
      this.isFilterByRating
    ) {
      const obj = {
        city: this.selectedCity,
        isByReview: true,
        isByPriceHigh: true,
        startDate: this.selectedDateStart,
        endDate: this.selectedDateEnd,
        isByRating: true,
        rating: this.selectedReviewss,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (
      this.isFilterByRating &&
      this.isFilterByReviews &&
      this.isFilterByPriceHigh &&
      this.isFilterByDate &&
      this.isFIlterByStars
    ) {
      const obj = {
        isByReview: true,
        isByPriceHigh: true,
        startDate: this.selectedDateStart,
        endDate: this.selectedDateEnd,
        isByStars: true,
        stars: this.selectedStarss,
        isByRating: true,
        rating: this.selectedReviewss,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (
      this.isFilterByCity &&
      this.isFilterByRating &&
      this.isFilterByPriceHigh &&
      this.isFilterByDate &&
      this.isFIlterByStars
    ) {
      const obj = {
        city: this.selectedCity,
        isByPriceHigh: true,
        startDate: this.selectedDateStart,
        endDate: this.selectedDateEnd,
        isByStars: true,
        stars: this.selectedStarss,
        isByRating: true,
        rating: this.selectedReviewss,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (
      this.isFilterByCity &&
      this.isFilterByReviews &&
      this.isFilterByPriceHigh &&
      this.isFilterByRating &&
      this.isFIlterByStars
    ) {
      const obj = {
        city: this.selectedCity,
        isByReview: true,
        isByPriceHigh: true,
        isByStars: true,
        stars: this.selectedStarss,
        isByRating: true,
        rating: this.selectedReviewss,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (
      this.isFilterByCity &&
      this.isFilterByReviews &&
      this.isFilterByPriceLow &&
      this.isFilterByDate &&
      this.isFIlterByStars
    ) {
      const obj = {
        city: this.selectedCity,
        isByReview: true,
        isByPriceLow: true,
        startDate: this.selectedDateStart,
        endDate: this.selectedDateEnd,
        isByStars: true,
        stars: this.selectedStarss,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (
      this.isFilterByCity &&
      this.isFilterByReviews &&
      this.isFilterByPriceLow &&
      this.isFilterByDate &&
      this.isFilterByRating
    ) {
      const obj = {
        city: this.selectedCity,
        isByReview: true,
        isByPriceLow: true,
        startDate: this.selectedDateStart,
        endDate: this.selectedDateEnd,
        isByRating: true,
        rating: this.selectedReviewss,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (
      this.isFilterByRating &&
      this.isFilterByReviews &&
      this.isFilterByPriceLow &&
      this.isFilterByDate &&
      this.isFIlterByStars
    ) {
      const obj = {
        isByReview: true,
        isByPriceLow: true,
        startDate: this.selectedDateStart,
        endDate: this.selectedDateEnd,
        isByStars: true,
        stars: this.selectedStarss,
        isByRating: true,
        rating: this.selectedReviewss,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (
      this.isFilterByCity &&
      this.isFilterByRating &&
      this.isFilterByPriceLow &&
      this.isFilterByDate &&
      this.isFIlterByStars
    ) {
      const obj = {
        city: this.selectedCity,
        isByPriceLow: true,
        startDate: this.selectedDateStart,
        endDate: this.selectedDateEnd,
        isByStars: true,
        stars: this.selectedStarss,
        isByRating: true,
        rating: this.selectedReviewss,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (
      this.isFilterByCity &&
      this.isFilterByReviews &&
      this.isFilterByPriceLow &&
      this.isFilterByRating &&
      this.isFIlterByStars
    ) {
      const obj = {
        city: this.selectedCity,
        isByReview: true,
        isByPriceLow: true,
        isByStars: true,
        stars: this.selectedStarss,
        isByRating: true,
        rating: this.selectedReviewss,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (
      this.isFilterByCity &&
      this.isFilterByReviews &&
      this.isFilterByRating &&
      this.isFilterByDate &&
      this.isFIlterByStars
    ) {
      const obj = {
        city: this.selectedCity,
        isByReview: true,
        startDate: this.selectedDateStart,
        endDate: this.selectedDateEnd,
        isByStars: true,
        stars: this.selectedStarss,
        isByRating: true,
        rating: this.selectedReviewss,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
      // ! 4 Option ---------------------------------------
    } else if (
      this.isFilterByCity &&
      this.isFilterByReviews &&
      this.isFilterByPriceHigh &&
      this.isFilterByDate
    ) {
      const obj = {
        city: this.selectedCity,
        isByReview: true,
        isByPriceHigh: true,
        startDate: this.selectedDateStart,
        endDate: this.selectedDateEnd,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (
      this.isFilterByCity &&
      this.isFilterByReviews &&
      this.isFilterByPriceHigh &&
      this.isFIlterByStars
    ) {
      const obj = {
        city: this.selectedCity,
        isByReview: true,
        isByPriceHigh: true,
        isByStars: true,
        stars: this.selectedStarss,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (
      this.isFilterByCity &&
      this.isFilterByReviews &&
      this.isFilterByPriceHigh &&
      this.isFilterByRating
    ) {
      const obj = {
        city: this.selectedCity,
        isByReview: true,
        isByPriceHigh: true,
        isByRating: true,
        rating: this.selectedReviewss,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (
      this.isFilterByReviews &&
      this.isFilterByPriceHigh &&
      this.isFilterByDate &&
      this.isFIlterByStars
    ) {
      const obj = {
        isByReview: true,
        isByPriceHigh: true,
        startDate: this.selectedDateStart,
        endDate: this.selectedDateEnd,
        isByStars: true,
        stars: this.selectedStarss,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (
      this.isFilterByReviews &&
      this.isFilterByPriceHigh &&
      this.isFilterByDate &&
      this.isFilterByRating
    ) {
      const obj = {
        isByReview: true,
        isByPriceHigh: true,
        startDate: this.selectedDateStart,
        endDate: this.selectedDateEnd,
        isByRating: true,
        rating: this.selectedReviewss,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (
      this.isFilterByCity &&
      this.isFilterByPriceHigh &&
      this.isFilterByDate &&
      this.isFIlterByStars
    ) {
      const obj = {
        city: this.selectedCity,
        isByPriceHigh: true,
        startDate: this.selectedDateStart,
        endDate: this.selectedDateEnd,
        isByStars: true,
        stars: this.selectedStarss,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (
      this.isFilterByCity &&
      this.isFilterByPriceHigh &&
      this.isFilterByDate &&
      this.isFilterByRating
    ) {
      const obj = {
        city: this.selectedCity,
        isByPriceHigh: true,
        startDate: this.selectedDateStart,
        endDate: this.selectedDateEnd,
        isByRating: true,
        rating: this.selectedReviewss,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (
      this.isFilterByCity &&
      this.isFilterByPriceHigh &&
      this.isFilterByRating &&
      this.isFIlterByStars
    ) {
      const obj = {
        city: this.selectedCity,
        isByPriceHigh: true,
        isByStars: true,
        stars: this.selectedStarss,
        isByRating: true,
        rating: this.selectedReviewss,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (
      this.isFilterByReviews &&
      this.isFilterByPriceHigh &&
      this.isFilterByRating &&
      this.isFIlterByStars
    ) {
      const obj = {
        isByReview: true,
        isByPriceHigh: true,
        isByStars: true,
        stars: this.selectedStarss,
        isByRating: true,
        rating: this.selectedReviewss,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (
      this.isFilterByDate &&
      this.isFilterByPriceHigh &&
      this.isFilterByRating &&
      this.isFIlterByStars
    ) {
      const obj = {
        isByPriceHigh: true,
        startDate: this.selectedDateStart,
        endDate: this.selectedDateEnd,
        isByStars: true,
        stars: this.selectedStarss,
        isByRating: true,
        rating: this.selectedReviewss,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (
      this.isFilterByCity &&
      this.isFilterByReviews &&
      this.isFilterByPriceLow &&
      this.isFilterByDate
    ) {
      const obj = {
        city: this.selectedCity,
        isByReview: true,
        isByPriceLow: true,
        startDate: this.selectedDateStart,
        endDate: this.selectedDateEnd,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (
      this.isFilterByCity &&
      this.isFilterByReviews &&
      this.isFilterByPriceLow &&
      this.isFIlterByStars
    ) {
      const obj = {
        city: this.selectedCity,
        isByReview: true,
        isByPriceLow: true,
        isByStars: true,
        stars: this.selectedStarss,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (
      this.isFilterByCity &&
      this.isFilterByReviews &&
      this.isFilterByPriceLow &&
      this.isFilterByRating
    ) {
      const obj = {
        city: this.selectedCity,
        isByReview: true,
        isByPriceLow: true,
        isByRating: true,
        rating: this.selectedReviewss,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (
      this.isFilterByReviews &&
      this.isFilterByPriceLow &&
      this.isFilterByDate &&
      this.isFIlterByStars
    ) {
      const obj = {
        isByReview: true,
        isByPriceLow: true,
        startDate: this.selectedDateStart,
        endDate: this.selectedDateEnd,
        isByStars: true,
        stars: this.selectedStarss,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (
      this.isFilterByReviews &&
      this.isFilterByPriceLow &&
      this.isFilterByDate &&
      this.isFilterByRating
    ) {
      const obj = {
        isByReview: true,
        isByPriceLow: true,
        startDate: this.selectedDateStart,
        endDate: this.selectedDateEnd,
        isByRating: true,
        rating: this.selectedReviewss,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (
      this.isFilterByCity &&
      this.isFilterByPriceLow &&
      this.isFilterByDate &&
      this.isFIlterByStars
    ) {
      const obj = {
        city: this.selectedCity,
        isByPriceLow: true,
        startDate: this.selectedDateStart,
        endDate: this.selectedDateEnd,
        isByStars: true,
        stars: this.selectedStarss,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (
      this.isFilterByCity &&
      this.isFilterByPriceLow &&
      this.isFilterByDate &&
      this.isFilterByRating
    ) {
      const obj = {
        city: this.selectedCity,
        isByPriceLow: true,
        startDate: this.selectedDateStart,
        endDate: this.selectedDateEnd,
        isByRating: true,
        rating: this.selectedReviewss,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (
      this.isFilterByCity &&
      this.isFilterByPriceLow &&
      this.isFilterByRating &&
      this.isFIlterByStars
    ) {
      const obj = {
        city: this.selectedCity,
        isByPriceLow: true,
        isByStars: true,
        stars: this.selectedStarss,
        isByRating: true,
        rating: this.selectedReviewss,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (
      this.isFilterByReviews &&
      this.isFilterByPriceLow &&
      this.isFilterByRating &&
      this.isFIlterByStars
    ) {
      const obj = {
        isByReview: true,
        isByPriceLow: true,
        isByStars: true,
        stars: this.selectedStarss,
        isByRating: true,
        rating: this.selectedReviewss,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (
      this.isFilterByDate &&
      this.isFilterByPriceLow &&
      this.isFilterByRating &&
      this.isFIlterByStars
    ) {
      const obj = {
        isByPriceLow: true,
        startDate: this.selectedDateStart,
        endDate: this.selectedDateEnd,
        isByStars: true,
        stars: this.selectedStarss,
        isByRating: true,
        rating: this.selectedReviewss,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (
      this.isFilterByCity &&
      this.isFilterByReviews &&
      this.isFilterByDate &&
      this.isFIlterByStars
    ) {
      const obj = {
        city: this.selectedCity,
        isByReview: true,
        startDate: this.selectedDateStart,
        endDate: this.selectedDateEnd,
        isByStars: true,
        stars: this.selectedStarss,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (
      this.isFilterByCity &&
      this.isFilterByReviews &&
      this.isFilterByDate &&
      this.isFilterByRating
    ) {
      const obj = {
        city: this.selectedCity,
        isByReview: true,
        startDate: this.selectedDateStart,
        endDate: this.selectedDateEnd,
        isByRating: true,
        rating: this.selectedReviewss,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (
      this.isFilterByCity &&
      this.isFilterByRating &&
      this.isFilterByDate &&
      this.isFIlterByStars
    ) {
      const obj = {
        city: this.selectedCity,
        startDate: this.selectedDateStart,
        endDate: this.selectedDateEnd,
        isByStars: true,
        stars: this.selectedStarss,
        isByRating: true,
        rating: this.selectedReviewss,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (
      this.isFilterByCity &&
      this.isFilterByReviews &&
      this.isFilterByRating &&
      this.isFIlterByStars
    ) {
      const obj = {
        city: this.selectedCity,
        isByReview: true,
        isByStars: true,
        stars: this.selectedStarss,
        isByRating: true,
        rating: this.selectedReviewss,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (
      this.isFilterByRating &&
      this.isFilterByReviews &&
      this.isFilterByDate &&
      this.isFIlterByStars
    ) {
      const obj = {
        isByReview: true,
        startDate: this.selectedDateStart,
        endDate: this.selectedDateEnd,
        isByStars: true,
        stars: this.selectedStarss,
        isByRating: true,
        rating: this.selectedReviewss,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
      // ! 3 Option ---------------------------------------
    } else if (
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
    } else if (
      this.isFilterByCity &&
      this.isFilterByDate &&
      this.isFilterByPriceHigh
    ) {
      const obj = {
        city: this.selectedCity,
        isByPriceHigh: true,
        startDate: this.selectedDateStart,
        endDate: this.selectedDateEnd,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (
      this.isFilterByCity &&
      this.isFilterByDate &&
      this.isFilterByPriceLow
    ) {
      const obj = {
        city: this.selectedCity,
        isByPriceLow: true,
        startDate: this.selectedDateStart,
        endDate: this.selectedDateEnd,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (
      this.isFilterByCity &&
      this.isFIlterByStars &&
      this.isFilterByPriceHigh
    ) {
      const obj = {
        city: this.selectedCity,
        isByPriceHigh: true,
        isByStars: true,
        stars: this.selectedStarss,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (
      this.isFilterByCity &&
      this.isFIlterByStars &&
      this.isFilterByPriceLow
    ) {
      const obj = {
        city: this.selectedCity,
        isByPriceLow: true,
        isByStars: true,
        stars: this.selectedStarss,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (
      this.isFilterByCity &&
      this.isFilterByRating &&
      this.isFilterByPriceHigh
    ) {
      const obj = {
        city: this.selectedCity,
        isByPriceHigh: true,
        isByRating: true,
        rating: this.selectedReviewss,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (
      this.isFilterByCity &&
      this.isFilterByRating &&
      this.isFilterByPriceLow
    ) {
      const obj = {
        city: this.selectedCity,
        isByPriceLow: true,
        isByRating: true,
        rating: this.selectedReviewss,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (
      this.isFilterByDate &&
      this.isFilterByReviews &&
      this.isFilterByPriceHigh
    ) {
      const obj = {
        isByReview: true,
        isByPriceHigh: true,
        startDate: this.selectedDateStart,
        endDate: this.selectedDateEnd,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (
      this.isFilterByRating &&
      this.isFilterByReviews &&
      this.isFilterByPriceHigh
    ) {
      const obj = {
        isByReview: true,
        isByPriceHigh: true,
        isByRating: true,
        rating: this.selectedReviewss,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (
      this.isFilterByRating &&
      this.isFilterByReviews &&
      this.isFilterByPriceLow
    ) {
      const obj = {
        isByReview: true,
        isByPriceLow: true,
        isByRating: true,
        rating: this.selectedReviewss,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (
      this.isFIlterByStars &&
      this.isFilterByReviews &&
      this.isFilterByPriceHigh
    ) {
      const obj = {
        isByReview: true,
        isByPriceHigh: true,
        isByStars: true,
        stars: this.selectedStarss,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (
      this.isFIlterByStars &&
      this.isFilterByReviews &&
      this.isFilterByPriceLow
    ) {
      const obj = {
        isByReview: true,
        isByPriceLow: true,
        isByStars: true,
        stars: this.selectedStarss,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (
      this.isFilterByDate &&
      this.isFilterByReviews &&
      this.isFilterByPriceLow
    ) {
      const obj = {
        isByReview: true,
        isByPriceLow: true,
        startDate: this.selectedDateStart,
        endDate: this.selectedDateEnd,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (
      this.isFIlterByStars &&
      this.isFilterByDate &&
      this.isFilterByPriceHigh
    ) {
      const obj = {
        isByPriceHigh: true,
        startDate: this.selectedDateStart,
        endDate: this.selectedDateEnd,
        isByStars: true,
        stars: this.selectedStarss,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (
      this.isFilterByDate &&
      this.isFIlterByStars &&
      this.isFilterByPriceLow
    ) {
      const obj = {
        isByPriceLow: true,
        startDate: this.selectedDateStart,
        endDate: this.selectedDateEnd,
        isByStars: true,
        stars: this.selectedStarss,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (
      this.isFilterByRating &&
      this.isFilterByDate &&
      this.isFilterByPriceHigh
    ) {
      const obj = {
        isByPriceHigh: true,
        startDate: this.selectedDateStart,
        endDate: this.selectedDateEnd,
        isByRating: true,
        rating: this.selectedReviewss,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (
      this.isFilterByDate &&
      this.isFilterByRating &&
      this.isFilterByPriceLow
    ) {
      const obj = {
        isByPriceLow: true,
        startDate: this.selectedDateStart,
        endDate: this.selectedDateEnd,
        isByRating: true,
        rating: this.selectedReviewss,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (
      this.isFIlterByStars &&
      this.isFilterByRating &&
      this.isFilterByPriceHigh
    ) {
      const obj = {
        isByPriceHigh: true,
        isByStars: true,
        stars: this.selectedStarss,
        isByRating: true,
        rating: this.selectedReviewss,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (
      this.isFIlterByStars &&
      this.isFilterByRating &&
      this.isFilterByPriceLow
    ) {
      const obj = {
        isByPriceLow: true,
        isByStars: true,
        stars: this.selectedStarss,
        isByRating: true,
        rating: this.selectedReviewss,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (
      this.isFilterByCity &&
      this.isFilterByReviews &&
      this.isFilterByDate
    ) {
      const obj = {
        city: this.selectedCity,
        isByReview: true,
        startDate: this.selectedDateStart,
        endDate: this.selectedDateEnd,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (
      this.isFilterByCity &&
      this.isFilterByReviews &&
      this.isFIlterByStars
    ) {
      const obj = {
        city: this.selectedCity,
        isByReview: true,
        isByStars: true,
        stars: this.selectedStarss,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (
      this.isFilterByCity &&
      this.isFilterByReviews &&
      this.isFilterByRating
    ) {
      const obj = {
        city: this.selectedCity,
        isByReview: true,
        isByRating: true,
        rating: this.selectedReviewss,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (
      this.isFilterByReviews &&
      this.isFilterByDate &&
      this.isFIlterByStars
    ) {
      const obj = {
        isByReview: true,
        startDate: this.selectedDateStart,
        endDate: this.selectedDateEnd,
        isByStars: true,
        stars: this.selectedStarss,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (
      this.isFilterByReviews &&
      this.isFilterByDate &&
      this.isFilterByRating
    ) {
      const obj = {
        isByReview: true,
        startDate: this.selectedDateStart,
        endDate: this.selectedDateEnd,
        isByRating: true,
        rating: this.selectedReviewss,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (
      this.isFilterByReviews &&
      this.isFIlterByStars &&
      this.isFilterByRating
    ) {
      const obj = {
        isByReview: true,
        isByStars: true,
        stars: this.selectedStarss,
        isByRating: true,
        rating: this.selectedReviewss,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (
      this.isFilterByDate &&
      this.isFIlterByStars &&
      this.isFilterByRating
    ) {
      const obj = {
        startDate: this.selectedDateStart,
        endDate: this.selectedDateEnd,
        isByStars: true,
        stars: this.selectedStarss,
        isByRating: true,
        rating: this.selectedReviewss,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (
      this.isFilterByCity &&
      this.isFIlterByStars &&
      this.isFilterByRating
    ) {
      const obj = {
        city: this.selectedCity,
        isByStars: true,
        stars: this.selectedStarss,
        isByRating: true,
        rating: this.selectedReviewss,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (
      this.isFilterByCity &&
      this.isFIlterByStars &&
      this.isFilterByDate
    ) {
      const obj = {
        city: this.selectedCity,
        startDate: this.selectedDateStart,
        endDate: this.selectedDateEnd,
        isByStars: true,
        stars: this.selectedStarss,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (
      this.isFilterByCity &&
      this.isFilterByDate &&
      this.isFilterByRating
    ) {
      const obj = {
        city: this.selectedCity,
        startDate: this.selectedDateStart,
        endDate: this.selectedDateEnd,
        isByRating: true,
        rating: this.selectedReviewss,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
      // ! 2 Option ---------------------------------------
    } else if (this.isFilterByCity && this.isFilterByDate) {
      const obj = {
        city: this.selectedCity,
        startDate: this.selectedDateStart,
        endDate: this.selectedDateEnd,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
      this.formatLowestPrice();
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
    } else if (this.isFIlterByStars && this.isFilterByPriceHigh) {
      const obj = {
        isByPriceHigh: true,
        isByStars: true,
        stars: this.selectedStarss,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (this.isFIlterByStars && this.isFilterByPriceLow) {
      const obj = {
        isByPriceLow: true,
        isByStars: true,
        stars: this.selectedStarss,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (this.isFilterByRating && this.isFilterByPriceHigh) {
      const obj = {
        isByPriceHigh: true,
        isByRating: true,
        rating: this.selectedReviewss,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (this.isFilterByRating && this.isFilterByPriceLow) {
      const obj = {
        isByPriceLow: true,
        isByRating: true,
        rating: this.selectedReviewss,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (this.isFilterByCity && this.isFIlterByStars) {
      const obj = {
        city: this.selectedCity,
        isByStars: true,
        stars: this.selectedStarss,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (this.isFilterByCity && this.isFilterByRating) {
      const obj = {
        city: this.selectedCity,
        isByRating: true,
        rating: this.selectedReviewss,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (this.isFilterByReviews && this.isFIlterByStars) {
      const obj = {
        isByReview: true,
        isByStars: true,
        stars: this.selectedStarss,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (this.isFilterByReviews && this.isFilterByRating) {
      const obj = {
        isByReview: true,
        isByRating: true,
        rating: this.selectedReviewss,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (this.isFilterByDate && this.isFIlterByStars) {
      const obj = {
        startDate: this.selectedDateStart,
        endDate: this.selectedDateEnd,
        isByStars: true,
        stars: this.selectedStarss,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (this.isFilterByDate && this.isFilterByRating) {
      const obj = {
        startDate: this.selectedDateStart,
        endDate: this.selectedDateEnd,
        isByRating: true,
        rating: this.selectedReviewss,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (this.isFilterByRating && this.isFIlterByStars) {
      const obj = {
        isByStars: true,
        stars: this.selectedStarss,
        isByRating: true,
        rating: this.selectedReviewss,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (this.isFilterByReviews && this.isFilterByDate) {
      const obj = {
        isByReview: true,
        startDate: this.selectedDateStart,
        endDate: this.selectedDateEnd,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (this.isFilterByDate && this.isFilterByPriceHigh) {
      const obj = {
        isByPriceHigh: true,
        startDate: this.selectedDateStart,
        endDate: this.selectedDateEnd,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (this.isFilterByDate && this.isFilterByPriceLow) {
      const obj = {
        isByPriceLow: true,
        startDate: this.selectedDateStart,
        endDate: this.selectedDateEnd,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
      // ! 1 Option ---------------------------------------
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
    } else if (this.isFilterByDate) {
      const obj = {
        startDate: this.selectedDateStart,
        endDate: this.selectedDateEnd,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (this.isFIlterByStars) {
      const obj = {
        isByStars: true,
        stars: this.selectedStarss,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else if (this.isFilterByRating) {
      const obj = {
        isByRating: true,
        rating: this.selectedReviewss,
      };
      this.hoteLists$ = this.listsService.filterHotels(obj);
    } else {
      this.fetchLists();
    }

    this.hoteLists$.subscribe((hotels) => {
      this.totalPropertiesFound = hotels.length;
    });
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
interface FormattedHotel {
  id: number;
  hotelName?: string;
  hotelStar?: number;
  roomTotal?: number;
  location?: string;
  imgPath?: string;
  isActive?: boolean;
  createdDate?: Date;

  lowestPrice?: number;
  lowestPricee?: string | null;
  averageReview: number;
  totalReviews: number;
  availableDates: Date;
  bookingDate: Date;
  bookedRooms: number;
}
