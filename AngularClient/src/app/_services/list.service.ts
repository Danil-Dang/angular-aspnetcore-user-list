import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, tap, map } from 'rxjs';
import { HttpParams } from '@angular/common/http';

import { ListUser } from '../manager-user/list-user';
import { ListHotel } from '../manager-user/list-hotel';
import { UpdateUser } from '../manager-user/list-user-update';
import { UserRole } from '../manager-user/user-role';
import { ListRoom } from '../manager-user/list-room';
import { ListReview } from '../manager-user/list-review';
import { ListBooking } from '../manager-user/list-bookings';
import { ListPayment } from '../manager-user/list-payment';
import { ListCheapestRoom } from './models/list-cheapest-room';
import { AverageReview } from './models/average-review';
import { TotalReview } from './models/total-review';
import { FilterParams } from './models/filter-params';
import { ListLocations } from './models/locations';
import { ListLocationsCity } from './models/locationsCity';

@Injectable({
  providedIn: 'root',
})
export class ListService {
  private urlUser = 'http://localhost:4201/api/users';
  private urlHotel = 'http://localhost:4201/api/hotels';
  private lists$: Subject<ListUser[]> = new Subject();
  private roles$: Subject<UserRole[]> = new Subject();
  private hotels$: Subject<ListHotel[]> = new Subject();
  private hotelsFiltered$: Subject<ListHotel[]> = new Subject();
  private hotelsFilteredByReviews$: Subject<ListHotel[]> = new Subject();
  private hotelsFilteredByPriceHigh$: Subject<ListHotel[]> = new Subject();
  private hotelsFilteredByPriceLow$: Subject<ListHotel[]> = new Subject();
  private locations$: Subject<ListLocations[]> = new Subject();
  private locationsCity$: Subject<ListLocationsCity[]> = new Subject();
  private rooms$: Subject<ListRoom[]> = new Subject();
  private reviewsUser$: Subject<ListReview[]> = new Subject();
  private reviewsHotel$: Subject<ListReview[]> = new Subject();
  private bookingsUser$: Subject<ListBooking[]> = new Subject();
  private bookingsHotel$: Subject<ListBooking[]> = new Subject();
  private bookingsRoom$: Subject<ListBooking[]> = new Subject();
  private bookings$: Subject<ListBooking[]> = new Subject();
  private paymentsUser$: Subject<ListPayment[]> = new Subject();
  private paymentsHotel$: Subject<ListPayment[]> = new Subject();
  private paymentsRoom$: Subject<ListPayment[]> = new Subject();
  private payments$: Subject<ListPayment[]> = new Subject();

  constructor(private httpClient: HttpClient) {}

  // ! Users ------------------------------------------------------
  private refreshLists() {
    this.httpClient.get<ListUser[]>(`${this.urlUser}`).subscribe((lists) => {
      this.lists$.next(lists);
    });
  }

  getLists(): Subject<ListUser[]> {
    this.refreshLists();
    return this.lists$;
  }

  getList(id: number): Observable<ListUser> {
    return this.httpClient.get<ListUser>(`${this.urlUser}/${id}`);
  }

  getUserByUsername(username: string): Observable<ListUser> {
    return this.httpClient.get<ListUser>(
      `${this.urlUser}/by-username/${username}`
    );
  }

  createList(list: ListUser): Observable<string> {
    return this.httpClient.post(`${this.urlUser}`, list, {
      responseType: 'text',
    });
  }

  // updateList(id: number, list: UpdateUser): Observable<string> {
  updateList(id: number, list: object) {
    return this.httpClient.put(`${this.urlUser}/${id}`, list, {
      responseType: 'text',
    });
  }

  deleteList(id: number): Observable<string> {
    return this.httpClient.delete(`${this.urlUser}/${id}`, {
      responseType: 'text',
    });
  }

  // ! Roles ------------------------------------------------------
  private refreshUserRole(id: number) {
    this.httpClient
      .get<UserRole[]>(`${this.urlUser}/role-by-id/${id}`)
      .subscribe((roles) => {
        this.roles$.next(roles);
      });
  }

  getUserRoles(id: number): Subject<UserRole[]> {
    this.refreshUserRole(id);
    return this.roles$;
  }

  // getUserRole(id: number): Observable<UserRole> {
  //   return this.httpClient.get<UserRole>(`${this.urlUser}/role/${id}`);
  // }

  createRole(list: object) {
    return this.httpClient.post(`${this.urlUser}/role/register`, list, {
      responseType: 'text',
    });
  }

  // updateList(id: number, list: UpdateUser): Observable<string> {
  updateRole(id: number, list: object) {
    return this.httpClient.put(`${this.urlUser}/role/${id}`, list, {
      responseType: 'text',
    });
  }

  deleteRole(id: number): Observable<string> {
    return this.httpClient.delete(`${this.urlUser}/role/${id}`, {
      responseType: 'text',
    });
  }

  // ! Hotels ------------------------------------------------------
  private refreshHotelLists() {
    this.httpClient.get<ListHotel[]>(`${this.urlHotel}`).subscribe((hotels) => {
      this.hotels$.next(hotels);
    });
  }

  getHotelLists(): Subject<ListHotel[]> {
    this.refreshHotelLists();
    return this.hotels$;
  }

  getHotelList(id: number): Observable<ListHotel> {
    return this.httpClient.get<ListHotel>(`${this.urlHotel}/${id}`);
  }

  // createHotelList(list: ListHotel): Observable<string> {
  createHotelList(list: object) {
    return this.httpClient.post(`${this.urlHotel}/register`, list, {
      responseType: 'text',
    });
  }

  // updateList(id: number, list: UpdateUser): Observable<string> {
  updateHotelList(id: number, list: object) {
    return this.httpClient.put(`${this.urlHotel}/${id}`, list, {
      responseType: 'text',
    });
  }

  updateHotelRoomTotal(id: number, list: object) {
    return this.httpClient.put(`${this.urlHotel}/room-total/${id}`, list, {
      responseType: 'text',
    });
  }

  deleteHotelList(id: number): Observable<string> {
    return this.httpClient.delete(`${this.urlHotel}/${id}`, {
      responseType: 'text',
    });
  }

  private refreshHotelsFiltered(filterParams: FilterParams): void {
    let params = new HttpParams();
    if (filterParams.city) {
      params = params.set('city', filterParams.city);
    }
    if (filterParams.isByReview) {
      params = params.set('isByReview', filterParams.isByReview.toString());
    }
    if (filterParams.isByPriceHigh) {
      params = params.set(
        'isByPriceHigh',
        filterParams.isByPriceHigh.toString()
      );
    }
    if (filterParams.isByPriceLow) {
      params = params.set('isByPriceLow', filterParams.isByPriceLow.toString());
    }
    if (filterParams.startDate) {
      params = params.set('startDate', filterParams.startDate);
    }
    if (filterParams.endDate) {
      params = params.set('endDate', filterParams.endDate);
    }
    if (filterParams.isByStars) {
      params = params.set('isByStars', filterParams.isByStars.toString());
    }
    if (filterParams.stars) {
      params = params.set('stars', filterParams.stars);
    }
    if (filterParams.isByRating) {
      params = params.set('isByRating', filterParams.isByRating.toString());
    }
    if (filterParams.rating) {
      params = params.set('rating', filterParams.rating);
    }
    this.httpClient
      .get<ListHotel[]>(`${this.urlHotel}/filtered`, { params })
      .subscribe((hotels) => {
        this.hotelsFiltered$.next(hotels);
      });
  }
  filterHotels(filterParams: FilterParams): Subject<ListHotel[]> {
    this.refreshHotelsFiltered(filterParams);
    return this.hotelsFiltered$;
  }
  private refreshHotelsByReviews() {
    this.httpClient
      .get<ListHotel[]>(`${this.urlHotel}/by-reviews`)
      .subscribe((hotels) => {
        this.hotelsFilteredByReviews$.next(hotels);
      });
  }
  filterHotelsByReviews(): Subject<ListHotel[]> {
    this.refreshHotelsByReviews();
    return this.hotelsFilteredByReviews$;
  }
  private refreshHotelsByPriceHigh() {
    this.httpClient
      .get<ListHotel[]>(`${this.urlHotel}/by-price-high`)
      .subscribe((hotels) => {
        this.hotelsFilteredByPriceHigh$.next(hotels);
      });
  }
  filterHotelsByPriceHigh(): Subject<ListHotel[]> {
    this.refreshHotelsByPriceHigh();
    return this.hotelsFilteredByPriceHigh$;
  }
  private refreshHotelsByPriceLow() {
    this.httpClient
      .get<ListHotel[]>(`${this.urlHotel}/by-price-low`)
      .subscribe((hotels) => {
        this.hotelsFilteredByPriceLow$.next(hotels);
      });
  }
  filterHotelsByPriceLow(): Subject<ListHotel[]> {
    this.refreshHotelsByPriceLow();
    return this.hotelsFilteredByPriceLow$;
  }

  // ! Locations ------------------------------------------------------
  private refreshLocations() {
    this.httpClient
      .get<ListLocations[]>(`${this.urlHotel}/locations`)
      .subscribe((locations) => {
        this.locations$.next(locations);
      });
  }
  getLocations(): Subject<ListLocations[]> {
    this.refreshLocations();
    return this.locations$;
  }

  private refreshLocationsCity() {
    this.httpClient
      .get<ListLocationsCity[]>(`${this.urlHotel}/locations/city`)
      .subscribe((locations) => {
        this.locationsCity$.next(locations);
      });
  }
  getLocationsCity(): Subject<ListLocationsCity[]> {
    this.refreshLocationsCity();
    return this.locationsCity$;
  }

  getLocation(id: number): Observable<ListLocations> {
    return this.httpClient.get<ListLocations>(
      `${this.urlHotel}/locations/${id}`
    );
  }

  createLocation(list: object) {
    return this.httpClient.post(`${this.urlHotel}/locations/register`, list, {
      responseType: 'text',
    });
  }

  deleteLocation(id: number): Observable<string> {
    return this.httpClient.delete(`${this.urlHotel}/locations/${id}`, {
      responseType: 'text',
    });
  }

  // ! Rooms ------------------------------------------------------
  // private refreshRoomLists(id: number, filterParams: FilterParams) {
  private refreshRoomLists(id: number) {
    // let params = new HttpParams();
    // if (filterParams.startDate) {
    //   params = params.set('startDate', filterParams.startDate);
    // }
    // if (filterParams.endDate) {
    //   params = params.set('endDate', filterParams.endDate);
    // }

    this.httpClient
      // .get<ListRoom[]>(`${this.urlHotel}/rooms-by-hotel/${id}`, { params })
      .get<ListRoom[]>(`${this.urlHotel}/rooms-by-hotel/${id}`)
      .subscribe((rooms) => {
        this.rooms$.next(rooms);
      });
  }

  getRooms(id: number): Subject<ListRoom[]> {
    // getRooms(filterParams: FilterParams): Subject<ListRoom[]> {
    // this.refreshRoomLists(filterParams);
    this.refreshRoomLists(id);
    return this.rooms$;
  }

  getRoom(id: number): Observable<ListRoom> {
    return this.httpClient.get<ListRoom>(`${this.urlHotel}/rooms/${id}`);
  }

  getCheapestRoom(id: number): Observable<ListCheapestRoom> {
    return this.httpClient.get<ListCheapestRoom>(
      `${this.urlHotel}/rooms-by-price/${id}`
    );
  }

  // createHotelList(list: ListHotel): Observable<string> {
  createRoom(list: object) {
    return this.httpClient.post(`${this.urlHotel}/rooms/register`, list, {
      responseType: 'text',
    });
  }

  // updateList(id: number, list: UpdateUser): Observable<string> {
  updateRoom(id: number, list: object) {
    return this.httpClient.put(`${this.urlHotel}/rooms/${id}`, list, {
      responseType: 'text',
    });
  }

  deleteRoom(id: number): Observable<string> {
    return this.httpClient.delete(`${this.urlHotel}/rooms/${id}`, {
      responseType: 'text',
    });
  }

  // ! Reviews ------------------------------------------------------
  private refreshReviewUser(id: number) {
    this.httpClient
      .get<ListReview[]>(`${this.urlHotel}/reviews-by-user/${id}`)
      .subscribe((reviews) => {
        this.reviewsUser$.next(reviews);
      });
  }
  private refreshReviewHotel(id: number) {
    this.httpClient
      .get<ListReview[]>(`${this.urlHotel}/reviews-by-hotel/${id}`)
      .subscribe((reviews) => {
        this.reviewsHotel$.next(reviews);
      });
  }

  getReviewsUser(id: number): Subject<ListReview[]> {
    this.refreshReviewUser(id);
    return this.reviewsUser$;
  }
  getReviewsHotel(id: number): Subject<ListReview[]> {
    this.refreshReviewHotel(id);
    return this.reviewsHotel$;
  }

  getReview(id: number): Observable<ListReview> {
    return this.httpClient.get<ListReview>(`${this.urlHotel}/reviews/${id}`);
  }

  getAverageReview(id: number): Observable<AverageReview> {
    return this.httpClient.get<AverageReview>(
      `${this.urlHotel}/reviews-average/${id}`
    );
  }

  getTotalReview(id: number): Observable<TotalReview> {
    return this.httpClient.get<TotalReview>(
      `${this.urlHotel}/reviews-total/${id}`
    );
  }

  // createHotelList(list: ListHotel): Observable<string> {
  createReview(list: object) {
    return this.httpClient.post(`${this.urlHotel}/reviews/register`, list, {
      responseType: 'text',
    });
  }

  // updateList(id: number, list: UpdateUser): Observable<string> {
  updateReview(id: number, list: object) {
    return this.httpClient.put(`${this.urlHotel}/reviews/${id}`, list, {
      responseType: 'text',
    });
  }

  deleteReview(id: number): Observable<string> {
    return this.httpClient.delete(`${this.urlHotel}/reviews/${id}`, {
      responseType: 'text',
    });
  }

  // ! Bookings ------------------------------------------------------
  private refreshBookingsUser(id: number) {
    this.httpClient
      .get<ListBooking[]>(`${this.urlHotel}/bookings-by-user/${id}`)
      .subscribe((bookings) => {
        this.bookingsUser$.next(bookings);
      });
  }
  private refreshBookingsHotel(id: number) {
    this.httpClient
      .get<ListBooking[]>(`${this.urlHotel}/bookings-by-hotel/${id}`)
      .subscribe((bookings) => {
        this.bookingsHotel$.next(bookings);
      });
  }
  private refreshBookingsRoom(id: number) {
    this.httpClient
      .get<ListBooking[]>(`${this.urlHotel}/bookings-by-room/${id}`)
      .subscribe((bookings) => {
        this.bookingsRoom$.next(bookings);
      });
  }
  private refreshBookings() {
    this.httpClient
      .get<ListBooking[]>(`${this.urlHotel}/bookings`)
      .subscribe((bookings) => {
        this.bookings$.next(bookings);
      });
  }

  getBookingsUser(id: number): Subject<ListBooking[]> {
    this.refreshBookingsUser(id);
    return this.bookingsUser$;
  }
  getBookingsHotel(id: number): Subject<ListBooking[]> {
    this.refreshBookingsHotel(id);
    return this.bookingsHotel$;
  }
  getBookingsRoom(id: number): Subject<ListBooking[]> {
    this.refreshBookingsRoom(id);
    return this.bookingsRoom$;
  }
  getBookings(): Subject<ListBooking[]> {
    this.refreshBookings();
    return this.bookings$;
  }

  getBooking(id: number): Observable<ListBooking> {
    return this.httpClient.get<ListBooking>(`${this.urlHotel}/bookings/${id}`);
  }

  createBooking(list: object) {
    return this.httpClient.post(`${this.urlHotel}/bookings/register`, list, {
      responseType: 'text',
    });
  }

  updateBooking(id: number, list: object) {
    return this.httpClient.put(`${this.urlHotel}/bookings/${id}`, list, {
      responseType: 'text',
    });
  }

  deleteBooking(id: number): Observable<string> {
    return this.httpClient.delete(`${this.urlHotel}/bookings/${id}`, {
      responseType: 'text',
    });
  }

  // ! Payments ------------------------------------------------------
  private refreshPaymentsUser(id: number) {
    this.httpClient
      .get<ListPayment[]>(`${this.urlHotel}/payments-by-user/${id}`)
      .subscribe((payments) => {
        this.paymentsUser$.next(payments);
      });
  }
  private refreshPaymentsHotel(id: number) {
    this.httpClient
      .get<ListPayment[]>(`${this.urlHotel}/payments-by-hotel/${id}`)
      .subscribe((payments) => {
        this.paymentsHotel$.next(payments);
      });
  }
  private refreshPaymentsRoom(id: number) {
    this.httpClient
      .get<ListPayment[]>(`${this.urlHotel}/payments-by-room/${id}`)
      .subscribe((payments) => {
        this.paymentsRoom$.next(payments);
      });
  }
  private refreshPayments() {
    this.httpClient
      .get<ListPayment[]>(`${this.urlHotel}/payments`)
      .subscribe((payments) => {
        this.payments$.next(payments);
      });
  }

  getPaymentsUser(id: number): Subject<ListPayment[]> {
    this.refreshPaymentsUser(id);
    return this.paymentsUser$;
  }
  getPaymentsHotel(id: number): Subject<ListPayment[]> {
    this.refreshPaymentsHotel(id);
    return this.paymentsHotel$;
  }
  getPaymentsRoom(id: number): Subject<ListPayment[]> {
    this.refreshPaymentsRoom(id);
    return this.paymentsRoom$;
  }
  getPayments(): Subject<ListPayment[]> {
    this.refreshPayments();
    return this.payments$;
  }

  getPayment(id: number): Observable<ListPayment> {
    return this.httpClient.get<ListPayment>(`${this.urlHotel}/payments/${id}`);
  }
  getPaymentBooking(id: number): Observable<ListPayment> {
    return this.httpClient.get<ListPayment>(
      `${this.urlHotel}/payments-by-booking/${id}`
    );
  }

  createPayment(list: object) {
    return this.httpClient.post(`${this.urlHotel}/payments/register`, list, {
      responseType: 'text',
    });
  }

  updatePayment(id: number, list: object) {
    return this.httpClient.put(`${this.urlHotel}/payments/${id}`, list, {
      responseType: 'text',
    });
  }

  deletePayment(id: number): Observable<string> {
    return this.httpClient.delete(`${this.urlHotel}/payments/${id}`, {
      responseType: 'text',
    });
  }
}
