import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, timestamp } from 'rxjs';

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
  // list: BehaviorSubject<ListUser> = new BehaviorSubject({});
  list: BehaviorSubject<ListUser> = new BehaviorSubject<ListUser>({
    id: 0,
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    isActive: true,
    createdDate: new Date(),
  });
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
  isManager!: boolean;
  editUser!: boolean;
  userId!: number;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private _router: Router,
    private route: ActivatedRoute,
    private storageService: StorageService,
    private dataService: DataService,
    private listService: ListService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.storageService.isLoggedIn();

    this.dataService.variableChangedBoolean$.subscribe((newValue: boolean) => {
      this.isManager = newValue;
      window.localStorage.setItem('admin-add-user', newValue.toString());
    });
    const storedIsManager = localStorage.getItem('admin-add-user');
    this.isManager = storedIsManager === 'true' ? true : false;

    // this.dataService.variableChangedNumber$.subscribe((newValue: number) => {
    //   this.userId = newValue;
    //   window.localStorage.setItem('admin-edit-user', newValue.toString());
    // });
    // // const storedUserId = Number(this.route.snapshot.paramMap.get('id'));
    // this.userId = Number(localStorage.getItem('admin-edit-user'));
    // if (!this.userId || this.userId === 0) {
    //   this.editUser = false;
    //   console.log('No id provided');
    // } else {
    //   this.editUser = true;
    // }
    // this.listService.getList(this.userId!).subscribe((list) => {
    //   this.list.next(list);
    // });

    if (this.isLoggedIn && !this.isManager) {
      this._router.navigate(['/home']);
    }
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
    this._router.navigate(['/list/users']);
  }

  editList(list: ListUser) {
    const { firstName, lastName, username, email, password } = this.form;

    this.listService.updateList(this.list.value.id, list).subscribe({
      next: () => {
        this._router.navigate(['/list/users']);
      },
      error: (error) => {
        alert('Failed to update user');
        console.error(error);
      },
    });
  }
}
