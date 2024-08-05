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
import { UserRole } from '../manager-user/user-role';

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
  userId = 0;
  roles: string[] = [];
  roles$: Observable<UserRole[]> = new Observable();

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
          this.storageService.saveUser({
            username: username,
          });

          this.isLoginFailed = false;
          this.isLoggedIn = true;
          localStorage.setItem('logoutOnce', 'false');

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

    this.list$ = this.listService.getUserByUsername(username);
    this.list$.subscribe((data) => {
      this.userId = data.id!;
      localStorage.setItem('user-id', JSON.stringify(this.userId));
      this.roles$ = this.listService.getUserRoles(this.userId);
      // console.log(this.roles$);

      this.roles$.subscribe((roles) => {
        if (roles) {
          const roleMap: any = {};
          for (const role of roles) {
            // this.roles.push(role.role!);
            roleMap[role.id] = role.role!;
          }
          localStorage.setItem('user-role', JSON.stringify(roleMap));
        } else {
          console.log('No roles found');
        }
      });
    });
  }

  reloadPage(): void {
    window.location.reload();
  }
}
