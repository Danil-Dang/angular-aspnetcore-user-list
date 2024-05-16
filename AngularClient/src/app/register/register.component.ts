import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, timestamp } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from '../_services/auth.service';
import { StorageService } from '../_services/storage.service';
import { DataService } from '../_services/data.service';
import { ListUser } from '../manager-user/list-user';
import { ListService } from '../_services/list.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  form: any = {
    firstName: null,
    lastName: null,
    username: null,
    email: null,
    password: null,
  };

  isLoggedIn = false;
  isSuccessful = false;
  isSignUpFailed = false;
  isManager: boolean = false;
  editUser: boolean = false;
  userId: number = 0;
  errorMessage = '';
  list$: Observable<ListUser> = new Observable();

  constructor(
    private authService: AuthService,
    private _router: Router,
    private route: ActivatedRoute,
    private storageService: StorageService,
    private dataService: DataService,
    private listService: ListService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.storageService.isLoggedIn();

    this.dataService.variableChangedBoolean$.subscribe((newValue: boolean) => {
      this.isManager = newValue;
    });

    this.dataService.variableChangedNumber$.subscribe((newValue: number) => {
      this.userId = newValue;
    });
    if (this.userId === 0) {
      this.editUser = false;
      console.log('No id provided');
    } else {
      this.editUser = true;
      this.fetchList();
      this.list$.subscribe((data) => {
        this.form.firstName = data.firstName;
        this.form.lastName = data.lastName;
        this.form.username = data.username;
        this.form.email = data.email;
      });
    }

    if (this.isLoggedIn && !this.isManager && !this.editUser) {
      this._router.navigate(['/home']);
    }
  }

  private fetchList(): void {
    this.list$ = this.listService.getList(this.userId);
  }

  onSubmit(): void {
    const { firstName, lastName, username, email, password } = this.form;

    this.authService
      .register({ firstName, lastName, username, email, password })
      .subscribe({
        next: (data) => {
          console.log(data);
          this.isSuccessful = true;
          this.isSignUpFailed = false;
          if (this.isManager) this._router.navigate(['/list/users']);
        },
        error: (err) => {
          this.errorMessage = err.error.message;
          this.isSignUpFailed = true;
        },
      });
  }

  onCancel(): void {
    this.isManager = false;
    this.userId = 0;
    this._router.navigate(['/list/users']);
  }

  onEditList() {
    const { firstName, lastName, username, email } = this.form;

    this.listService
      .updateList(this.userId, { firstName, lastName, username, email })
      .subscribe({
        next: () => {
          this.isSuccessful = true;
          this.isSignUpFailed = false;
          this._router.navigate(['/list/users']);
        },
        error: (error) => {
          alert('Failed to update user');
          console.error(error);
        },
      });
  }
}
