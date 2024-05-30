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
import { UserRole } from '../manager-user/user-role';

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
    role1: '',
    role2: '',
  };

  isLoggedIn = false;
  isSuccessful = false;
  isSignUpFailed = false;
  isManager: boolean = false;
  editUser: boolean = false;
  userId: number = 0;
  errorMessage = '';
  list$: Observable<ListUser> = new Observable();
  roles$: Observable<UserRole[]> = new Observable();
  role1Before = '';
  role2Before = '';
  role1Id: any;
  role2Id: any;

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

      this.roles$ = this.listService.getUserRoles(this.userId);
      this.roles$.subscribe((roles) => {
        if (roles) {
          if (roles.length == 1) {
            this.form.role1 = roles[0]?.role === 'Admin' ? 1 : 2;
            this.role1Before = this.form.role1;
            this.role1Id = roles[0]?.id;
          }
          // this.form.role2 = roles.length > 1 ? roles[1]?.role : '';
          if (roles.length > 1) {
            this.form.role1 = roles[0]?.role === 'Admin' ? 1 : 2;
            this.role1Before = this.form.role1;
            this.role1Id = roles[0]?.id;

            this.form.role2 = roles[1]?.role === 'Admin' ? 1 : 2;
            this.role2Before = this.form.role2;
            this.role2Id = roles[1]?.id;
          }
        } else {
          console.log('No roles found');
        }
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
        next: (data: any) => {
          // console.log(data);

          if (this.form.role1) {
            this.createRole1();
          }
          if (this.form.role2) {
            this.createRole2();
          }

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
          if (!this.role1Before && !this.role2Before) {
            if (this.form.role1) {
              this.createRole1();
            }
            if (this.form.role2) {
              this.createRole2();
            }
          } else if (this.role1Before && !this.role2Before) {
            if (this.form.role1 && this.form.role2) {
              if (this.role1Before === this.form.role1) {
                this.createRole2();
              } else {
                this.createRole1();
              }
            } else if (this.form.role1 && !this.form.role2) {
              if (this.role1Before !== this.form.role1) {
                this.updateRole();
              }
            } else {
              this.deleteRole1();
            }
          } else {
            if (!this.form.role1 && !this.form.role2) {
              this.deleteRole1();
              this.deleteRole2();
            } else if (this.form.role1 && !this.form.role2) {
              if (this.role1Before === this.form.role1) {
                this.deleteRole2();
              } else {
                this.deleteRole1();
              }
            }
          }

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

  resetOtherDropdowns() {
    this.form.role2 = '';
  }

  createRole1() {
    let roleObj = {
      roleId: +this.form.role1,
      userId: this.userId,
    };

    this.listService.createRole(roleObj).subscribe({
      next: () => console.log('Role 1 created successfully'),
      error: (err) => console.error('Error creating Role 1:', err),
    });
  }

  createRole2() {
    let roleObj = {
      roleId: +this.form.role2,
      userId: this.userId,
    };

    this.listService.createRole(roleObj).subscribe({
      next: () => console.log('Role 2 created successfully'),
      error: (err) => console.error('Error creating Role 2:', err),
    });
  }

  updateRole() {
    let roleObj = {
      roleId: +this.form.role1,
    };

    this.listService.updateRole(this.role1Id, roleObj).subscribe({
      next: () => console.log('Role updated successfully'),
      error: (err) => console.error('Error updating Role:', err),
    });
  }

  deleteRole1() {
    this.listService.deleteRole(this.role1Id).subscribe({
      next: () => {},
    });
  }

  deleteRole2() {
    this.listService.deleteRole(this.role2Id).subscribe({
      next: () => {},
    });
  }
}
