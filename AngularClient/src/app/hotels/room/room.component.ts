import { Component, OnInit } from '@angular/core';
import { Observable, switchMap, forkJoin, map, catchError, of } from 'rxjs';
import { Router } from '@angular/router';

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

  constructor(
    private storageService: StorageService,
    private dataService: DataService,
    private listService: ListService,
    private _router: Router
  ) {}

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
            this.listService.getList(review.userId).pipe(
              catchError(() => of(null)) // Handle errors if user not found
            )
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
}
