import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

import { ListUser } from '../manager-user/list-user';

@Injectable({
  providedIn: 'root'
})
export class ListService {
  private url = 'http://localhost:4201/api';
  private lists$: Subject<ListUser[]> = new Subject();
 
  constructor(private httpClient: HttpClient) { }
 
  private refreshLists() {
    this.httpClient.get<ListUser[]>(`${this.url}/users`)
      .subscribe(lists => {
        this.lists$.next(lists);
      });
  }
  
  getLists(): Subject<ListUser[]> {
    this.refreshLists();
    return this.lists$;
  }
  
  getList(id: number): Observable<ListUser> {
    return this.httpClient.get<ListUser>(`${this.url}/users/${id}`);
  }
  
  createList(list: ListUser): Observable<string> {
    return this.httpClient.post(`${this.url}/users`, list, { responseType: 'text' });
  }
  
  updateList(id: number, list: ListUser): Observable<string> {
    return this.httpClient.put(`${this.url}/users/${id}`, list, { responseType: 'text' });
  }
  
  deleteList(id: number): Observable<string> {
    return this.httpClient.delete(`${this.url}/users/${id}`, { responseType: 'text' });
  }
}
