import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { StorageService } from '../_services/storage.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  isLoggedIn = false;
  currentUser: any;
  currentUserr: any;
  currentUserrr: any;

  constructor(
    private storageService: StorageService,
    private _router: Router,
  ) { }

  ngOnInit(): void {
    this.isLoggedIn = this.storageService.isLoggedIn();
    if (!this.isLoggedIn) {this._router.navigate(["/home"]);}

    this.currentUser = this.storageService.getUser();
    this.currentUserr = JSON.stringify(this.currentUser);
    this.currentUserrr = Boolean(this.currentUser);
  }
}
