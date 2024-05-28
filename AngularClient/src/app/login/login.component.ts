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
          // this.list$.subscribe((data) => {
          //   this.userId = data.id!;
          //   this.roles$ = this.listService.getUserRole(this.userId);

          //   this.roles$.subscribe((roles) => {
          //     if (roles) {
          //       for (const role of roles) {
          //         this.roles.push(role.role!);
          //       }
          //       localStorage.setItem('userRole2', JSON.stringify(this.roles));
          //     } else {
          //       console.log('No roles found');
          //     }
          //   });
          // });

          this.storageService.saveUser({
            username: username,
            // role: this.roles,
          });

          this.isLoginFailed = false;
          this.isLoggedIn = true;
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
      this.roles$ = this.listService.getUserRole(this.userId);

      this.roles$.subscribe((roles) => {
        if (roles) {
          for (const role of roles) {
            this.roles.push(role.role!);
          }
          localStorage.setItem('user-role', JSON.stringify(this.roles));
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
