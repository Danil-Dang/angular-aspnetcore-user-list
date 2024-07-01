import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  Observable,
  forkJoin,
  mergeMap,
  BehaviorSubject,
  combineLatest,
  of,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { ListUser } from './list-user';
import { ListService } from '../_services/list.service';
import { DataService } from '../_services/data.service';
import { StorageService } from '../_services/storage.service';
import { UserRole } from './user-role';

@Component({
  selector: 'app-manager-user',
  templateUrl: './manager-user.component.html',
  styleUrl: './manager-user.component.css',
})
export class ManagerUserComponent implements OnInit {
  lists$: Observable<ListUser[]> = new Observable();
  list$: Observable<ListUser> = new Observable();
  userId?: number;
  listLists: number;

  roles$: Observable<UserRole[]> = new Observable();
  // roles: string[] = [];
  roles: any;
  role1 = '';
  role2 = '';

  loggedIn: boolean;
  currentUser: any;
  isLoggedIn = false;
  roless: { [key: number]: string } = {};
  showAdminBoard = false;

  constructor(
    private listsService: ListService,
    private storageService: StorageService,
    private _router: Router,
    private dataService: DataService
  ) {
    this.loggedIn = false;
    this.listLists = 0;
  }

  ngOnInit(): void {
    this.isLoggedIn = this.storageService.isLoggedIn();
    if (!this.isLoggedIn) {
      this._router.navigate(['/home']);
    } else {
      this.roless = JSON.parse(localStorage.getItem('user-role')!);
      this.showAdminBoard = Object.values(this.roless).includes('Admin');
    }

    if (this.showAdminBoard) {
      this.fetchLists();
      this.currentUser = this.storageService.getUser();
    } else {
      this._router.navigate(['/home']);
    }

    // this.lists$.subscribe((lists) => {
    //   lists.forEach((list) => {
    //     this.roles$ = this.listsService.getUserRoles(list.id);
    //     this.roles$.subscribe((roles) => {
    //       console.log(roles);
    //     });
    //   });
    // });

    // this.lists$.subscribe((lists) => {
    //   lists.forEach(async (list) => {
    //     try {
    //       const roles =
    //         (await this.listsService.getUserRoles(list.id).toPromise()) || [];
    //       console.log('Roles emitted 1:', roles);
    //       this.roles$ = of(roles);
    //       console.log('Roles emitted 2:', this.roles$);
    //       this.roles$.subscribe((roles) =>
    //         console.log('Roles emitted:', roles)
    //       );
    //     } catch (error) {
    //       console.error(`Error fetching roles for list ${list.id}:`, error);
    //     }
    //   });
    // });
  }

  private fetchLists(): void {
    this.lists$ = this.listsService.getLists();
  }

  onAddUser() {
    this._router.navigate(['/register']);
    this.dataService.changeVariableBoolean(true);
    this.dataService.changeVariableNumber(0);
  }

  editList(id: number): void {
    this._router.navigate(['/register']);
    this.dataService.changeVariableNumber(id);
    this.dataService.changeVariableBoolean(false);
  }

  deleteList(id: number): void {
    this.roles$ = this.listsService.getUserRoles(id);
    this.roles$.subscribe((roles) => {
      if (roles?.length > 0) {
        const deleteRoleObservables = [];
        for (const role of roles) {
          deleteRoleObservables.push(this.listsService.deleteRole(role.id));
        }

        forkJoin(deleteRoleObservables).subscribe({
          next: () => {
            console.log('All roles deleted successfully');
            this.listsService.deleteList(id).subscribe({
              next: () => this.fetchLists(),
            });
          },
          error: (error) => console.error('Error deleting roles:', error),
        });
      } else {
        console.log('No roles found');
        this.listsService.deleteList(id).subscribe({
          next: () => this.fetchLists(),
        });
      }
    });
  }

  onIdFilterChange(id: string) {
    console.log('listLists:', this.listLists);
    console.log('id:', id);
    let idConverted = Number(id);
    if (id != '') {
      this.userId = idConverted;
      this.listLists = 1;
      this.list$ = this.listsService.getList(idConverted);
    } else {
      this.listLists = 0;
      this.fetchLists();
    }
  }
}
