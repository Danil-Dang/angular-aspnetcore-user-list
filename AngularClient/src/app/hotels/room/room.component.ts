import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { StorageService } from '../../_services/storage.service';
import { DataService } from '../../_services/data.service';
import { ListService } from '../../_services/list.service';
import { ListHotel } from '../../manager-user/list-hotel';
import { ListRoom } from '../../manager-user/list-room';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrl: './room.component.css',
})
export class RoomComponent implements OnInit {
  isLoggedIn: any;
  errorMessage: any;
  isModerator = false;
  roles: any;

  hotelId: number = 0;
  roomId: number = 0;
  hoteList$: Observable<ListHotel> = new Observable();
  roomLists$: Observable<ListRoom[]> = new Observable();
  room$: Observable<ListRoom> = new Observable();

  form: any = {
    roomType: null,
    price: null,
  };

  roomForm = false;
  editUser = false;

  constructor(
    private storageService: StorageService,
    private dataService: DataService,
    private listService: ListService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.storageService.isLoggedIn();
    // if (!this.isLoggedIn) {
    //   this._router.navigate(['/home']);
    // }

    this.dataService.variableChangedNumber$.subscribe((newValue: number) => {
      this.hotelId = newValue;
    });
    if (this.hotelId === 0) {
      console.log('No id provided');
      this._router.navigate(['/hotels']);
    } else {
      this.fetchHotel(this.hotelId);
      this.fetchRooms(this.hotelId);
      this.roles = JSON.parse(localStorage.getItem('user-role')!);
      this.isModerator = Object.values(this.roles).includes('Manager');
    }
  }

  fetchHotel(id: number) {
    this.hoteList$ = this.listService.getHotelList(id);
  }

  fetchRooms(id: number) {
    this.roomLists$ = this.listService.getRooms(id);
  }

  addRoom() {
    this.roomForm = true;
  }

  onCancel() {
    this.roomForm = false;
    this.form.reset();
  }

  onSubmit() {
    const { hotelId = this.hotelId, roomType, price } = this.form;

    this.listService.createRoom({ hotelId, roomType, price }).subscribe({
      next: (data: any) => {
        this.roomForm = false;
        this.fetchRooms(this.hotelId);
        this.fetchHotel(this.hotelId);
      },
      error: (err) => {
        this.errorMessage = err.error.message;
      },
    });
  }

  editRoom(id: number) {
    this.roomForm = true;
    this.editUser = true;
    this.roomId = id;
    this.room$ = this.listService.getRoom(id);
    this.room$.subscribe((data) => {
      this.form.roomType = data.roomType;
      this.form.price = data.price;
    });
  }

  onEditRoom() {
    const { roomType, price } = this.form;

    this.listService.updateRoom(this.roomId, { roomType, price }).subscribe({
      next: () => {
        this.roomForm = false;
        this.editUser = false;
        this.fetchRooms(this.hotelId);
        this.fetchHotel(this.hotelId);
      },
      error: (error) => {
        alert('Failed to update room');
        console.error(error);
      },
    });
  }

  deleteRoom(id: number) {
    this.listService.deleteRoom(id).subscribe({
      next: () => this.fetchRooms(this.hotelId),
    });
  }

  generateStars(ratingValue: number): any[] {
    const stars = [];
    for (let i = 0; i < ratingValue; i++) {
      stars.push({});
    }
    return stars;
  }
}
