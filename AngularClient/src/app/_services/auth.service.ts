
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private apiUrl = 'http://localhost:4201/api/users';
    private currentUserSubject: BehaviorSubject<any>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser')!));
    }

    public get currentUserValue() {
        return this.currentUserSubject.value;
    }

    login(username: string, password: string) {
        return this.http.post<any>(`${this.apiUrl}/login`, { username, password })
            .pipe(
              map(response => {
                // localStorage.setItem('currentUser', JSON.stringify(response.token));
                localStorage.setItem('currentUser', JSON.stringify(response));
                this.currentUserSubject.next(response);
                return response; 
              })
            //   catchError(err => {
            //     // console.log('Original error object:', err);

            //     let errorMessage = 'An unknown error occurred.';
            //     if (err.error) {
            //         errorMessage = err.error.message || errorMessage; 
            //      } 
            //      return throwError(() => new Error(errorMessage));
            //   })
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