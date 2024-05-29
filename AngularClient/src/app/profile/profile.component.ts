import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { StorageService } from '../_services/storage.service';
import { ListService } from '../_services/list.service';
import { ListUser } from '../manager-user/list-user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  isLoggedIn = false;
  list$: Observable<ListUser> = new Observable();
  currentUser: any;
  currentUserr: any;
  roles: { [key: number]: string } = {};

  constructor(
    private storageService: StorageService,
    private _router: Router,
    private listService: ListService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.storageService.isLoggedIn();
    if (!this.isLoggedIn) {
      this._router.navigate(['/home']);
    }

    this.currentUser = this.storageService.getUser();
    this.currentUserr = JSON.parse(localStorage.getItem('jwt')!);
    this.list$ = this.listService.getUserByUsername(this.currentUser.username);
    this.list$.subscribe((data) => {
      this.currentUser.email = data.email;
    });

    const storedRoles = localStorage.getItem('user-role');
    if (storedRoles) {
      this.roles = JSON.parse(storedRoles);
    }
  }
}
