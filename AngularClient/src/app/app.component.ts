import { Component, OnInit } from '@angular/core';

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

  constructor(
    private storageService: StorageService,
    private authService: AuthService
  ) // private _router: Router,
  // private httpClient: HttpClient,
  // private jwtInterceptor: authInterceptor,
  {}

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
}
