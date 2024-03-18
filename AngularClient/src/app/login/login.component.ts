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
        // this.roles = this.storageService.getUser().roles;
        this.router.navigate(["/home"]);
    }
  }

  // get formControls() { return this.loginForm.controls; }

  onSubmit(): void {
    // this.submitted = true;

    // if (this.loginForm.invalid) {
    //   return;
    // }

    // this.loading = true;

    // this.authService.login(this.formControls['username'].value, this.formControls['password'].value)
    //   .pipe(first())
    //   .subscribe({
    //     next: data => {
    //       this.storageService.saveUser(data);
    //       this.storageService.saveToken(data.accessToken);

    //       this.isLoginFailed = false;
    //       this.isLoggedIn = true;
    //       this.roles = this.storageService.getUser().roles;
    //       this.reloadPage();
    //       // const redirectUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    //       // this.router.navigate([redirectUrl]);
    //     },
    //     error: err => {
    //       this.errorMessage = err.error.message;
    //       this.isLoginFailed = true;
    //     }
    //   });

      const { username, password } = this.loginForm;

      this.authService.login(username, password).subscribe({
        next: data => {
          this.storageService.saveUser(data);
          this.storageService.saveToken(data.accessToken);

          this.isLoginFailed = false;
          this.isLoggedIn = true;
          this.roles = this.storageService.getUser().roles;
          this.reloadPage();
        },
        error: err => {
          this.errorMessage = err.error.message;
          this.isLoginFailed = true;
        }
      });
    }

    reloadPage(): void {
      window.location.reload();
    }
}
