import { Injectable } from '@angular/core';

const USER_KEY = 'auth-user';
const TOKEN_KEY = 'auth-token';
const ADMIN_ADD_USER = 'admin-add-user';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  clean(): void {
    // window.localStorage.clear();
    window.localStorage.removeItem(USER_KEY);
    window.localStorage.removeItem('user-id');
    window.localStorage.removeItem('user-role');
    window.localStorage.removeItem('jwt');
  }

  public saveUser(user: any): void {
    window.localStorage.removeItem(USER_KEY);
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
  public getUser(): any {
    const user = window.localStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return {};
  }

  public isLoggedIn(): boolean {
    const user = window.localStorage.getItem(USER_KEY);
    if (user) {
      return true;
    }
    return false;
  }

  public saveToken(token: string): void {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.setItem(TOKEN_KEY, token);
  }
  public getToken(): string | null {
    const token = window.localStorage.getItem(TOKEN_KEY);
    if (token) {
      return token;
    }
    return '';
  }
}
