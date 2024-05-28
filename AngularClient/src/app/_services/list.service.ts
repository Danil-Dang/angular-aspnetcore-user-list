import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

import { ListUser } from '../manager-user/list-user';
import { ListHotel } from '../manager-user/list-hotel';
import { UpdateUser } from '../manager-user/list-user-update';
import { UserRole } from '../manager-user/user-role';

@Injectable({
  providedIn: 'root',
})
export class ListService {
  private urlUser = 'http://localhost:4201/api/users';
  private urlHotel = 'http://localhost:4201/api/hotels';
  private lists$: Subject<ListUser[]> = new Subject();
  private hotels$: Subject<ListHotel[]> = new Subject();
  private roles$: Subject<UserRole[]> = new Subject();

  constructor(private httpClient: HttpClient) {}

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

  private refreshUserRole(id: number) {
    this.httpClient
      .get<UserRole[]>(`${this.urlUser}/role-by-id/${id}`)
      .subscribe((roles) => {
        this.roles$.next(roles);
      });
  }

  getUserRole(id: number): Subject<UserRole[]> {
    this.refreshUserRole(id);
    return this.roles$;
  }
}
