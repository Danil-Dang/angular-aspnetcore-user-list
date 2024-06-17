import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

import { ListUser } from '../manager-user/list-user';
import { ListHotel } from '../manager-user/list-hotel';
import { UpdateUser } from '../manager-user/list-user-update';
import { UserRole } from '../manager-user/user-role';
import { ListRoom } from '../manager-user/list-room';
import { ListReview } from '../manager-user/list-review';

@Injectable({
  providedIn: 'root',
})
export class ListService {
  private urlUser = 'http://localhost:4201/api/users';
  private urlHotel = 'http://localhost:4201/api/hotels';
  private lists$: Subject<ListUser[]> = new Subject();
  private roles$: Subject<UserRole[]> = new Subject();
  private hotels$: Subject<ListHotel[]> = new Subject();
  private rooms$: Subject<ListRoom[]> = new Subject();
  private reviewsUser$: Subject<ListReview[]> = new Subject();
  private reviewsHotel$: Subject<ListReview[]> = new Subject();

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

  deleteHotelList(id: number): Observable<string> {
    return this.httpClient.delete(`${this.urlHotel}/${id}`, {
      responseType: 'text',
    });
  }

  // ! Rooms ------------------------------------------------------
  private refreshRoomLists(id: number) {
    this.httpClient
      .get<ListRoom[]>(`${this.urlHotel}/rooms-by-hotel/${id}`)
      .subscribe((rooms) => {
        this.rooms$.next(rooms);
      });
  }

  getRooms(id: number): Subject<ListRoom[]> {
    this.refreshRoomLists(id);
    return this.rooms$;
  }

  getRoom(id: number): Observable<ListRoom> {
    return this.httpClient.get<ListRoom>(`${this.urlHotel}/rooms/${id}`);
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
}
