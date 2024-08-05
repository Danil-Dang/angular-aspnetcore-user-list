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
  tap,
  flatMap,
  from,
} from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import {
  BsDaterangepickerDirective,
  BsDatepickerConfig,
} from 'ngx-bootstrap/datepicker';
import { getTime } from 'ngx-bootstrap/chronos/utils/date-getters';
import { DecimalPipe } from '@angular/common';
import { DatePipe } from '@angular/common';

import { StorageService } from '../../_services/storage.service';
import { DataService } from '../../_services/data.service';
import { ListService } from '../../_services/list.service';
import { ListHotel } from '../../manager-user/list-hotel';
import { ListRoom } from '../../manager-user/list-room';
import { ListReview } from '../../manager-user/list-review';
import { ListUser } from '../../manager-user/list-user';
import { ListBooking } from '../../manager-user/list-bookings';
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
  startDate!: string;
  startDatee!: Date;
  startDateYear!: number;
  startDateMonth!: number;
  startDateDay!: number;
  endDate!: string;
  endDatee!: Date;
  endDateYear!: number;
  endDateMonth!: number;
  endDateDay!: number;
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
  bookings$: Observable<ListBooking[]> = new Observable();

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

  isGoToCart = false;

  constructor(
    private storageService: StorageService,
    private dataService: DataService,
    private listService: ListService,
    private _router: Router,
    private decimalPipe: DecimalPipe,
    private datePipe: DatePipe
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
    // this.startDate = JSON.parse(localStorage.getItem('room')!).startDate;
    // this.endDate = JSON.parse(localStorage.getItem('room')!).endDate;
    this.startDate = JSON.parse(localStorage.getItem('search')!).startDate;
    this.endDate = JSON.parse(localStorage.getItem('search')!).endDate;
    this.startDatee = new Date(this.startDate);
    this.endDatee = new Date(this.endDate);
    this.startDateYear = this.startDatee.getFullYear();
    this.startDateMonth = this.startDatee.getMonth();
    this.startDateDay = this.startDatee.getDay();
    this.endDateYear = this.endDatee.getFullYear();
    this.endDateMonth = this.endDatee.getMonth();
    this.endDateDay = this.endDatee.getDay();

    if (this.hotelId === 0) {
      this._router.navigate(['/hotels']);
    } else {
      this.fetchHotel(this.hotelId);
      this.fetchRooms(this.hotelId);
      this.fetchReviews(this.hotelId);
      this.fetchUserReview();
      // this.roomListsFormatted$.subscribe((rooms) => {
      //   for (const room of rooms) {

      //   }
      // }
      // );
      // const isAvailable = await this.fetchBookings(7);
      // console.log(isAvailable);

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
          // isAvailable: await this.fetchBookings(room.id),
          // booking: this.listService.getBookingsRoom(room.id),
        }))
      )
    );
  }
  fetchBookings(id: number) {
    return new Promise((resolve, reject) => {
      this.bookings$ = this.listService.getBookingsRoom(id).pipe(
        map((bookings) =>
          bookings.map((booking) => ({
            ...booking,
            isRoomAvailable:
              (this.startDateYear > new Date().getFullYear() ||
                (this.startDateYear == new Date().getFullYear() &&
                  this.startDateMonth > new Date().getMonth()) ||
                (this.startDateYear == new Date().getFullYear() &&
                  this.startDateMonth == new Date().getMonth() &&
                  this.startDateDay >= new Date().getDay())) &&
              (this.endDateYear < new Date(booking.checkIn).getFullYear() ||
                (this.endDateYear == new Date(booking.checkIn).getFullYear() &&
                  this.endDateMonth < new Date(booking.checkIn).getMonth()) ||
                (this.endDateYear == new Date(booking.checkIn).getFullYear() &&
                  this.endDateMonth == new Date(booking.checkIn).getMonth() &&
                  this.endDateDay < new Date(booking.checkIn).getDay()) ||
                this.startDateYear > new Date(booking.checkOut).getFullYear() ||
                (this.startDateYear ==
                  new Date(booking.checkOut).getFullYear() &&
                  this.startDateMonth >
                    new Date(booking.checkOut).getMonth()) ||
                (this.startDateYear ==
                  new Date(booking.checkOut).getFullYear() &&
                  this.startDateMonth ==
                    new Date(booking.checkOut).getMonth() &&
                  this.startDateDay > new Date(booking.checkOut).getDay()))
                ? true
                : false,
            // checkOutFormatted: this.datePipe.transform(
            //   booking.checkOut,
            //   'yyyy-MM-dd'
            // ),
            // checkInFormatted: this.datePipe.transform(
            //   booking.checkIn,
            //   'yyyy-MM-dd'
            // ),
          }))
        )
      );

      this.bookings$
        .pipe(
          map((bookings) =>
            bookings.every((booking) => booking.isRoomAvailable)
          )
        )
        .subscribe(
          (allRoomsAvailable) => resolve(allRoomsAvailable),
          (error) => reject(error)
        );
    });
    // bookings.forEach((booking) =>
    //   console.log(booking.id + ': ' + booking.isRoomAvailable)
    // )
    // this.bookings$
    //   .pipe(
    //     flatMap((bookings) =>
    //       from(bookings).pipe(
    //         map((booking) => {
    //           console.log(booking.id + ': ' + booking.isRoomAvailable);
    //           return booking;
    //         })
    //       )
    //     )
    //   )
    //   .subscribe();
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

      let i = JSON.parse(localStorage.getItem('booking-total')!);
      if (i !== null) {
        localStorage.setItem('booking-total', JSON.stringify(Number(i) + 1));
        let objOld = JSON.parse(localStorage.getItem('booking')!);
        let arr = Object.keys(objOld!).map(Number);
        let x = 1;
        const max = Math.max(...arr) + 1;

        console.log('booking total >');
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
        console.log('booking objOld: ', objOld);
        localStorage.setItem('booking', JSON.stringify(objOld));
      } else {
        localStorage.setItem('booking-total', '1');
        console.log('booking total <');
        let objNew = {
          1: {
            bookingStartDate: dates.startDate,
            bookingEndDate: dates.endDate,
            bookingRoomId: roomId,
            bookingHotelId: this.hotelId,
            numberOfDays: numberOfDays,
          },
        };
        console.log('booking objNew: ', objNew[1]);
        localStorage.setItem('booking', JSON.stringify(objNew));
      }

      // window.location.reload();
      if (this.isGoToCart) {
        // this._router.navigate(['/cart'], { onSameUrlNavigation: 'reload' });
        // this._router.navigate(['/cart']);
        localStorage.setItem('whereNavigate', 'cart');
        window.location.reload();
      } else {
        window.location.reload();
      }
    }
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
  booking?: Observable<ListBooking[]> | null;
  isAvailable?: boolean | null;
}
