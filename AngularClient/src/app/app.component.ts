import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
// import { HttpClient, HttpHeaders } from '@angular/common/http';

import { StorageService } from './_services/storage.service';
import { AuthService } from './_services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  private roles: string[] = [];
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username?: string;
  visible = false;

  // data: any;

  constructor(
    private storageService: StorageService,
    private authService: AuthService,
    private jwtHelper: JwtHelperService // private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.storageService.isLoggedIn();

    if (this.isLoggedIn) {
      const user = this.storageService.getUser();
      // this.roles = user.roles;
      this.username = user.username;

      // this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      // this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');
    }
  }

  logout(): void {
    this.authService.logout();
    this.storageService.clean();
    window.location.reload();
  }

  isUserAuthenticated = (): boolean => {
    const token = localStorage.getItem('jwt');
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      return true;
    }
    return false;
  };

  // getToken() {
  //   return localStorage.getItem('jwt');
  // }

  // setHeaders() {
  //   const token = this.getToken();
  //   if (token) {
  //     // return { Authorization: `Bearer ${token}` };
  //     const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  //     return headers;
  //   } else {
  //     // return {};
  //     return new HttpHeaders();
  //   }
  // }

  // makeHttpCall() {
  //   const url = 'http://localhost:4201/api/users';
  //   const headers = this.setHeaders();

  //   this.http.get(url, { headers })
  //     .subscribe(response => {
  //       this.data = response;
  //     }, error => {
  //       console.error('Error fetching data:', error);
  //     });
  // }
}
