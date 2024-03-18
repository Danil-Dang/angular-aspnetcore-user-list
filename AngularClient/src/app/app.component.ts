import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  private roles: string[] = [];
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username?: string;
  visible = false;

  constructor(
    // private storageService: StorageService, 
    // private authService: AuthService,
    // private _router: Router,
    // private httpClient: HttpClient,
    // private jwtInterceptor: authInterceptor,
  ) {}

  ngOnInit(): void {
    // this.isLoggedIn = this.storageService.isLoggedIn();

    // if (this.isLoggedIn) {
    //   const user = this.storageService.getUser();
    //   this.roles = user.roles;

    //   this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
    //   this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');

    //   this.username = user.username;
    // }
  }

  // logout(): void {
  //   this.authService.logout().subscribe({
  //     next: res => {
  //       console.log(res);
  //       this.storageService.clean();
  //       window.location.reload();
  //     },
  //     error: err => {
  //       console.log(err);
  //     }
  //   });
  // }
}
