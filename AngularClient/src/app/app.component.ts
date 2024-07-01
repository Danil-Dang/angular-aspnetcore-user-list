import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
// import { HttpClient, HttpHeaders } from '@angular/common/http';

import { StorageService } from './_services/storage.service';
import { AuthService } from './_services/auth.service';
import { DataService } from './_services/data.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  roles: { [key: number]: string } = {};
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username?: string;
  reloadOnce = false;
  isShowBoard = false;
  cart = 0;

  constructor(
    private storageService: StorageService,
    private authService: AuthService,
    private dataService: DataService,
    private jwtHelper: JwtHelperService,
    private router: Router // private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.reloadOnce = JSON.parse(localStorage.getItem('reloadOnce')!);
    if (!this.reloadOnce && !this.isUserAuthenticated()) {
      this.logout();
      this.router.navigate(['/home']);
    } else {
      localStorage.removeItem('reloadOnce');
    }

    this.cart = Number(localStorage.getItem('booking-total'));
    this.isLoggedIn = this.storageService.isLoggedIn();

    if (this.isLoggedIn) {
      const user = this.storageService.getUser();
      this.username = user.username;
      this.roles = JSON.parse(localStorage.getItem('user-role')!);

      // this.showAdminBoard = this.roles.includes('Admin');
      this.showAdminBoard = Object.values(this.roles).includes('Admin');
      this.showModeratorBoard = Object.values(this.roles).includes('Manager');
    }

    localStorage.removeItem('booking-payment');
    localStorage.removeItem('booking-payment-price');
  }

  logout(): void {
    this.authService.logout();
    this.storageService.clean();
    localStorage.setItem('reloadOnce', 'true');
    window.location.reload();
  }

  isUserAuthenticated = (): boolean => {
    const token = localStorage.getItem('jwt');
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      return true;
    }
    return false;
  };

  showBoard() {
    this.isShowBoard = !this.isShowBoard;
  }
  closeBoard() {
    this.isShowBoard = false;
  }

  onCart() {
    this.router.navigate(['/cart']);
  }

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
