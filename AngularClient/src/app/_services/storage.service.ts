import { Injectable } from '@angular/core';

const USER_KEY = 'auth-user';
const TOKEN_KEY = 'auth-token';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  clean(): void {
    // window.sessionStorage.clear();
    window.localStorage.clear();
  }

  public saveUser(user: any): void {
    // window.sessionStorage.removeItem(USER_KEY);
    // window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    window.localStorage.removeItem(USER_KEY);
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    // const user = window.sessionStorage.getItem(USER_KEY);
    const user = window.localStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return {};
  }

  public isLoggedIn(): boolean {
    // const user = window.sessionStorage.getItem(USER_KEY);
    const user = window.localStorage.getItem(USER_KEY);
    if (user) {
      return true;
    }
    return false;
  }

  public saveToken(token: string): void {
    // window.sessionStorage.removeItem(TOKEN_KEY);
    // window.sessionStorage.setItem(TOKEN_KEY, token);
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    // return window.sessionStorage.getItem(TOKEN_KEY);
    return window.localStorage.getItem(TOKEN_KEY);
  }
}
