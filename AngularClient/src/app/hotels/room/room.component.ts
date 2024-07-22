import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import {
  Observable,
  switchMap,
  forkJoin,
  map,
  catchError,
  of,
  filter,
} from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import {
  BsDaterangepickerDirective,
  BsDatepickerConfig,
} from 'ngx-bootstrap/datepicker';
import { getTime } from 'ngx-bootstrap/chronos/utils/date-getters';
import { DecimalPipe } from '@angular/common';
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
  averageReview!: number;
  totalReview!: number;
  roomId: number = 0;
  roomTotal = 0;
  userId = null;
  hoteList$: Observable<ListHotel> = new Observable();
  roomLists$: Observable<ListRoom[]> = new Observable();
  roomListsFormatted$: Observable<ListRoomFormatted[]> = new Observable();
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
  isReviewLogin = false;

  bsConfig: Partial<BsDatepickerConfig> = {
    minDate: new Date(),
    maxDate: new Date(2024, 12, 1),
    showWeekNumbers: true,
    rangeInputFormat: 'DD MMM YYYY',
    dateInputFormat: 'DD MMM YYYY',
    isAnimated: true,
  };
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

  scrollContainer = document.querySelector('.scrolling-container');
  content = document.querySelector('.content');
  scrollLeftBtn = document.querySelector('.scroll-left');
  scrollRightBtn = document.querySelector('.scroll-right');
  @ViewChild('content') contentt!: ElementRef;

  constructor(
    private storageService: StorageService,
    private dataService: DataService,
    private listService: ListService,
    private _router: Router,
    private decimalPipe: DecimalPipe
  ) {
    this.maxDate.setDate(this.maxDate.getDate() + 1);
    this.bsRangeValue = [this.bsValue, this.maxDate];
    this._router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        if (this._router.url.includes('#')) {
          this._router.navigate([], { fragment: undefined });
        }
      });
  }

  ngOnInit(): void {
    this.isLoggedIn = this.storageService.isLoggedIn();
    // if (this.isLoggedIn) {
    // }

    // this.dataService.variableChangedNumber$.subscribe((newValue: number) => {
    //   this.hotelId = newValue;
    // });
    this.hotelId = JSON.parse(localStorage.getItem('room')!).hotelId;
    this.averageReview = JSON.parse(
      localStorage.getItem('room')!
    ).averageReview;
    this.totalReview = JSON.parse(localStorage.getItem('room')!).totalReview;

    if (this.hotelId === 0) {
      this._router.navigate(['/hotels']);
    } else {
      this.fetchHotel(this.hotelId);
      this.fetchRooms(this.hotelId);
      this.fetchReviews(this.hotelId);
      this.fetchUserReview();

      this.userId = JSON.parse(localStorage.getItem('user-id')!);
      this.roles = JSON.parse(localStorage.getItem('user-role')!);
      if (this.roles) {
        this.isModerator = Object.values(this.roles).includes('Manager');
      }
    }
  }

  ngAfterViewInit() {
    if (this.contentt && this.contentt.nativeElement) {
      console.log('ngAfter works');
      this.adjustContentWidth();
    }
  }
  adjustContentWidth() {
    const contentElement = this.contentt.nativeElement;
    const paragraphElements = contentElement.querySelectorAll('p');

    let totalWidth = 0;
    paragraphElements.forEach(
      (p: HTMLParagraphElement) => (totalWidth += p.offsetWidth)
    );

    contentElement.style.width = totalWidth + 'px';
  }

  fetchHotel(id: number) {
    this.hoteList$ = this.listService.getHotelList(id);
  }

  fetchRooms(id: number) {
    this.roomLists$ = this.listService.getRooms(id);
    this.roomLists$.subscribe((data) => {
      this.roomTotal = data.length;
    });
    this.roomListsFormatted$ = this.roomLists$.pipe(
      map((rooms) =>
        rooms.map((room) => ({
          ...room,
          priceFormatted: this.decimalPipe.transform(room.price, '1.0-0'),
        }))
      )
    );
  }

  fetchReviews(id: number) {
    this.reviewLists$ = this.listService.getReviewsHotel(id);
  }

  fetchUserReview() {
    // this.reviewLists$ = this.listService.getReviewsUser(id);
    this.reviewsWithUsers$ = this.reviewLists$.pipe(
      switchMap((reviews) => {
        const userObservables = reviews.map((review) =>
          this.listService
            .getList(review.userId)
            .pipe(catchError(() => of(null)))
        );

        return forkJoin(userObservables).pipe(
          map((users) => {
            return reviews.map((review, index) => ({
              ...review,
              user: users[index],
            }));
          })
        );
      })
    );
  }

  scrollContent(direction: 'left' | 'right') {
    const contentElement = this.contentt.nativeElement;
    const scrollAmount = 120;

    if (direction === 'left') {
      contentElement.scrollLeft -= scrollAmount;
    } else {
      contentElement.scrollLeft += scrollAmount;
    }

    // const scrollPercentage = 25;
    // const scrollAmount =
    //   direction === 'left'
    //     ? -contentElement.offsetWidth * (scrollPercentage / 100)
    //     : contentElement.offsetWidth * (scrollPercentage / 100);

    // contentElement.scrollLeft += scrollAmount;
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
    const objUpdate = { roomTotal: this.roomTotal + 1 };

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

    this.listService.updateHotelRoomTotal(this.hotelId, objUpdate).subscribe({
      next: (data: any) => {
        this.roomForm = false;
        this.fetchRooms(this.hotelId);
        this.fetchHotel(this.hotelId);
      },
      error: (err) => {
        this.errorMessage = err.error.message;
      },
    });

    this.form.roomType = '';
    this.form.price = undefined;
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
    const objUpdate = { roomTotal: this.roomTotal - 1 };

    this.listService.deleteRoom(id).subscribe({
      next: () => {},
    });

    this.listService.updateHotelRoomTotal(this.hotelId, objUpdate).subscribe({
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
    if (this.isLoggedIn) {
      this.isReviewOpen = !this.isReviewOpen;
      this.formReview.reviewStar = 0;
      this.formReview.description = null;
      this.rating = 0;
    } else {
      this.isReviewLogin = true;
    }
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

      const startDatee = new Date(this.bsRangeValue[0]);
      const endDatee = new Date(this.bsRangeValue[1]);

      const timeDifference = endDatee.getTime() - startDatee.getTime();
      const numberOfDays = Math.ceil(timeDifference / (1000 * 3600 * 24));

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
              numberOfDays: numberOfDays,
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
            numberOfDays: numberOfDays,
          },
        };
        localStorage.setItem('booking', JSON.stringify(objNew));
      }

      this.datePickerOpen = false;
      window.location.reload();
    }
  }
  book(roomId: number) {
    const dates = JSON.parse(localStorage.getItem('search')!);

    if (dates) {
      // const startDate = this.bsRangeValue[0].toISOString().split('T')[0];
      // const endDate = this.bsRangeValue[1].toISOString().split('T')[0];

      const startDatee = new Date(dates.startDate);
      const endDatee = new Date(dates.endDate);

      const timeDifference = endDatee.getTime() - startDatee.getTime();
      const numberOfDays = Math.ceil(timeDifference / (1000 * 3600 * 24));

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
              bookingStartDate: dates.startDate,
              bookingEndDate: dates.endDate,
              bookingRoomId: roomId,
              bookingHotelId: this.hotelId,
              numberOfDays: numberOfDays,
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
            bookingStartDate: dates.startDate,
            bookingEndDate: dates.endDate,
            bookingRoomId: roomId,
            bookingHotelId: this.hotelId,
            numberOfDays: numberOfDays,
          },
        };
        localStorage.setItem('booking', JSON.stringify(objNew));
      }

      window.location.reload();
    }
  }

  clearDate() {
    window.localStorage.clear();
  }
}

interface ListRoomFormatted {
  id: number;
  hotelId: number;
  roomType?: number;
  price: number;
  isActive: boolean;
  createdDate: Date;

  roomTotal?: number;
  priceFormatted?: string | null;
}
