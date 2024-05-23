import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  FormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

import { AuthService } from '../_services/auth.service';
import { StorageService } from '../_services/storage.service';
import { ListService } from '../_services/list.service';
import { ListUser } from '../manager-user/list-user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginForm: any = {
    username: null,
    password: null,
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  list$: Observable<ListUser> = new Observable();
  username = '';
  // roles: string[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private storageService: StorageService,
    private listService: ListService
  ) {}

  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;

      // this.list$ = this.listService.getList(this.userId);
      // this.list$.subscribe((data) => {
      //   this.username = data.username!;
      // });
      // this.roles = this.storageService.getUser().roles;

      this.router.navigate(['/home']);
    }
  }

  onSubmit(): void {
    const { username, password } = this.loginForm;

    this.authService
      .login(username, password)
      .pipe(first())
      .subscribe({
        next: (data) => {
          // this.list$ = this.listService.getUserByUsername(username);
          this.storageService.saveUser({
            username: username,
          });
          // this.storageService.saveToken(data.token);

          this.isLoginFailed = false;
          this.isLoggedIn = true;
          // this.roles = this.storageService.getUser().roles;
          this.reloadPage();
        },
        error: (err) => {
          if (err.error.error && err.error.error.message) {
            this.errorMessage = err.error.error.message;
          } else {
            this.errorMessage = 'An unknown error occurred.';
          }

          this.isLoginFailed = true;
        },
      });
  }

  reloadPage(): void {
    window.location.reload();
  }
}
