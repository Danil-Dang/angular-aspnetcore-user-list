import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Observable, switchMap, forkJoin, map, catchError, of } from 'rxjs';
import { Router } from '@angular/router';
import { BsDaterangepickerDirective } from 'ngx-bootstrap/datepicker';
// import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { StorageService } from '../../_services/storage.service';
import { DataService } from '../../_services/data.service';
import { ListService } from '../../_services/list.service';
import { ListHotel } from '../../manager-user/list-hotel';
import { ListRoom } from '../../manager-user/list-room';
import { ListReview } from '../../manager-user/list-review';
import { ListUser } from '../../manager-user/list-user';
import { ReviewWithUser } from '../../manager-user/list-revieWithUser';

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
  userId = null;
  hoteList$: Observable<ListHotel> = new Observable();
  roomLists$: Observable<ListRoom[]> = new Observable();
  room$: Observable<ListRoom> = new Observable();
  reviewLists$: Observable<ListReview[]> = new Observable();
  user$: Observable<ListUser> = new Observable();
  reviewsWithUsers$!: Observable<ReviewWithUser[]>;

  form: any = {
    roomType: null,
    price: null,
  };
  roomForm = false;
  editUser = false;

  formReview: any = {
    reviewStar: 0,
    description: null,
  };
  rating: number = 0;
  hoveredRating: number = -1;
  isReviewOpen = false;
  isSignUpFailed = false;
  isFirstReview = true;

  bsValue = new Date();
  bsRangeValue: Date[] = [];
  maxDate = new Date();
  minDate = new Date();
  // disabledDates: Date[] = [new Date('2024-06-20'), new Date('2024-06-25')];
  disabledDates: Date[] = [];
  enabledDates: Date[] = [];
  datePickerOpen: boolean = false;
  @ViewChild('dateRangePicker') dateRangePicker!: BsDaterangepickerDirective;
  dateRoomId: number = 0;

  constructor(
    private storageService: StorageService,
    private dataService: DataService,
    private listService: ListService,
    private _router: Router
  ) {
    // this.bsConfig = Object.assign(
    //   {},
    //   {
    //     containerClass: 'theme-default',
    //     rangeInputFormat: 'YYYY-MM-DD',
    //     minDate: new Date(),
    //     maxDate: new Date(2025, 0, 1),
    //   }
    // );
    this.minDate.setDate(this.minDate.getDate() - 1);
    this.maxDate.setDate(this.maxDate.getDate() + 7);
    this.bsRangeValue = [this.bsValue, this.maxDate];
  }

  ngOnInit(): void {
    this.isLoggedIn = this.storageService.isLoggedIn();
    if (this.isLoggedIn) {
    }

    this.dataService.variableChangedNumber$.subscribe((newValue: number) => {
      this.hotelId = newValue;
    });
    if (this.hotelId === 0) {
      console.log('No id provided');
      this._router.navigate(['/hotels']);
    } else {
      this.fetchHotel(this.hotelId);
      this.fetchRooms(this.hotelId);
      this.fetchReviews(this.hotelId);
      this.reviewsWithUsers$ = this.reviewLists$.pipe(
        switchMap((reviews) => {
          // Create an array of observables to fetch users
          const userObservables = reviews.map((review) =>
            this.listService
              .getList(review.userId)
              .pipe(catchError(() => of(null)))
          );

          // Fetch all users in parallel
          return forkJoin(userObservables).pipe(
            map((users) => {
              // Combine reviews with their corresponding user data
              return reviews.map((review, index) => ({
                ...review, // Spread the review properties
                user: users[index], // Add the fetched user object
              }));
            })
          );
        })
      );

      this.userId = JSON.parse(localStorage.getItem('user-id')!);
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

  fetchReviews(id: number) {
    this.reviewLists$ = this.listService.getReviewsHotel(id);
  }

  fetchUserReview(id: number) {
    this.reviewLists$ = this.listService.getReviewsUser(id);
  }
  // fetchUser(id: number) {
  //   this.user$ = this.listService.getList(id);
  // }

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

  onStarHover(index: number) {
    this.hoveredRating = index + 1;
  }

  onStarClick(index: number) {
    this.rating = index + 1;
    this.formReview.reviewStar = index + 1;
  }

  getStarImage(index: number): string {
    if (
      index < this.rating ||
      (index < this.hoveredRating && this.hoveredRating !== -1)
    ) {
      return '../../../assets/rooms/star.png';
    } else {
      return '../../../assets/rooms/star-empty.png';
    }
  }

  onReviewOpen() {
    this.isReviewOpen = !this.isReviewOpen;
    this.formReview.reviewStar = 0;
    this.formReview.description = null;
    this.rating = 0;
  }

  onAddReview() {
    const obj = {
      userId: this.userId,
      hotelId: this.hotelId,
      reviewStar: this.formReview.reviewStar,
      description: this.formReview.description,
    };

    this.listService.createReview(obj).subscribe({
      next: () => this.fetchReviews(this.hotelId),
      error: (err) => console.error('Error creating Review:', err),
    });

    this.isReviewOpen = !this.isReviewOpen;
    this.formReview.reviewStar = 0;
    this.formReview.description = null;
    this.rating = 0;
  }

  onReviewDelete(id: number) {
    this.listService.deleteReview(id).subscribe({
      next: () => this.fetchReviews(this.hotelId),
      error: (err) => console.error('Error deleting Review:', err),
    });
  }

  openDatePicker(roomId: number) {
    this.datePickerOpen = !this.datePickerOpen;
    this.dateRoomId = roomId;
    setTimeout(() => {
      this.dateRangePicker.toggle();
    }, 0);
  }

  confirmDates() {
    if (this.bsRangeValue) {
      const startDate = this.bsRangeValue[0].toISOString().split('T')[0];
      const endDate = this.bsRangeValue[1].toISOString().split('T')[0];

      let i = localStorage.getItem('booking-total');
      if (i !== null) {
        localStorage.setItem('booking-total', JSON.stringify(Number(i) + 1));
        let objOld = JSON.parse(localStorage.getItem('booking')!);
        let arr = Object.keys(objOld!).map(Number);
        let x = 1;
        const max = Math.max(...arr) + 1;

        while (x <= max) {
          if (!arr.includes(x)) {
            objOld[x] = {
              bookingStartDate: startDate,
              bookingEndDate: endDate,
              bookingRoomId: this.dateRoomId,
              bookingHotelId: this.hotelId,
            };
            break;
          }
          x++;
        }
        localStorage.setItem('booking', JSON.stringify(objOld));
      } else {
        localStorage.setItem('booking-total', '1');
        let objNew = {
          1: {
            bookingStartDate: startDate,
            bookingEndDate: endDate,
            bookingRoomId: this.dateRoomId,
            bookingHotelId: this.hotelId,
          },
        };
        localStorage.setItem('booking', JSON.stringify(objNew));
      }

      this.datePickerOpen = false;
      window.location.reload();
    }
  }
  clearDate() {
    window.localStorage.clear();
  }
}
