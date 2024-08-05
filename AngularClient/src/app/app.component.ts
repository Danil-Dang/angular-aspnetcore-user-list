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

  whereNavigate: string = '';

  constructor(
    private storageService: StorageService,
    private authService: AuthService,
    private dataService: DataService,
    private jwtHelper: JwtHelperService,
    private router: Router // private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.reloadOnce = JSON.parse(localStorage.getItem('reloadOnce')!);
    const logoutOnce = JSON.parse(localStorage.getItem('logoutOnce')!);

    if (!this.reloadOnce && !this.isUserAuthenticated() && !logoutOnce) {
      this.logout();
      this.router.navigate(['/home']);
    } else {
      localStorage.removeItem('reloadOnce');
    }

    this.whereNavigate = localStorage.getItem('whereNavigate')!;
    if (this.whereNavigate === 'cart') {
      this.router.navigate(['/cart']);
    }

    const bookings = JSON.parse(localStorage.getItem('booking')!);
    if (bookings != null) {
      const filteredBookings = Object.values(bookings).filter(
        (booking: any) => {
          const storedStartYear = new Date(
            booking.bookingStartDate
          ).getFullYear();
          const storedStartMonth = new Date(
            booking.bookingStartDate
          ).getMonth();
          const storedStartDay = new Date(booking.bookingStartDate).getDate();

          const currentYear = new Date().getFullYear();
          const currentMonth = new Date().getMonth();
          const currentDay = new Date().getDate();
          // (storedStartYear >= currentYear && storedStartMonth > currentMonth) ||
          // (storedStartMonth == currentMonth && storedStartDay >= currentDay)
          if (
            storedStartYear < currentYear ||
            (storedStartYear == currentYear &&
              storedStartMonth < currentMonth) ||
            (storedStartYear == currentYear &&
              storedStartMonth == currentMonth &&
              storedStartDay < currentDay)
          ) {
            let i = localStorage.getItem('booking-total');
            if (i !== null) {
              localStorage.setItem(
                'booking-total',
                JSON.stringify(Number(i) + 1)
              );
            }
          }

          return (
            storedStartYear > currentYear ||
            (storedStartYear == currentYear &&
              storedStartMonth > currentMonth) ||
            (storedStartYear == currentYear &&
              storedStartMonth == currentMonth &&
              storedStartDay >= currentDay)
          );
        }
      );
      localStorage.setItem('booking', JSON.stringify(filteredBookings));
    }

    let bookingTotal = JSON.parse(localStorage.getItem('booking-total')!);
    if (bookingTotal != null) {
      while (bookingTotal > bookings.length) {
        bookingTotal--;
      }
      localStorage.setItem('booking-total', JSON.stringify(bookingTotal));
    }

    // const bookingStorage = localStorage.getItem('booking');
    // if (bookings === null || bookings === '') {
    if (bookingTotal < 1) {
      localStorage.removeItem('booking');
      localStorage.removeItem('booking-total');
    } else {
      this.cart = Number(localStorage.getItem('booking-total'));
    }

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
    localStorage.setItem('logoutOnce', 'true');
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
