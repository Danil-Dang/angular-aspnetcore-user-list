import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthService } from '../_services/auth.service';
import { StorageService } from '../_services/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  // loginForm: any = this.formBuilder.group({
  //   username: ['', Validators.required],
  //   password: ['', Validators.required]
  // });
  loginForm: any = {
    username: null,
    password: null
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private storageService: StorageService
  ) {}

  ngOnInit() : void {
    if (this.storageService.isLoggedIn()) {
        this.isLoggedIn = true;
        this.roles = this.storageService.getUser().roles;
        this.router.navigate(["/home"]);
    }
  }

  onSubmit(): void {
      const { username, password } = this.loginForm;

      this.authService.login(username, password)
        .pipe(first())
        .subscribe({
          next: data => {
            this.storageService.saveUser(data);
            this.storageService.saveToken(data.token);

            this.isLoginFailed = false;
            this.isLoggedIn = true;
            // this.roles = this.storageService.getUser().roles;
            this.reloadPage();
          },
          error: err => {            
            if (err.error.error && err.error.error.message) {
              this.errorMessage = err.error.error.message;
            } else { 
              this.errorMessage = "An unknown error occurred.";
            }
            
            this.isLoginFailed = true;
          }
        });
    }

    reloadPage(): void {
      window.location.reload();
    }
}
