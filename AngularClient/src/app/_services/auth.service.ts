import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { AuthenticatedResponse } from '../manager-user/authenticated-response';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:4201/api/users';
  private currentUserSubject: BehaviorSubject<any>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem('currentUser')!)
    );
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) {
    // return this.http.post<any>(`${this.apiUrl}/login`, { username, password })
    return this.http
      .post<AuthenticatedResponse>(
        `${this.apiUrl}/login`,
        { username, password },
        { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
      )
      .pipe(
        map((response) => {
          // localStorage.setItem('currentUser', JSON.stringify(response.token));
          localStorage.setItem('jwt', JSON.stringify(response));
          this.currentUserSubject.next(response);
          return response;
        })
      );
  }

  register(user: object) {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}
