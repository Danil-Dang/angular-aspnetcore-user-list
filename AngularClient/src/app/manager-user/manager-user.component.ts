import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  Observable,
  BehaviorSubject,
  combineLatest,
  of,
  startWith,
  switchMap,
} from 'rxjs';
import { map } from 'rxjs/operators';
import { RouterModule, Router } from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

import { ListUser } from './list-user';
import { ListHotel } from './list-hotel';
import { ListService } from '../_services/list.service';
import { DataService } from '../_services/data.service';
import { StorageService } from '../_services/storage.service';

@Component({
  selector: 'app-manager-user',
  templateUrl: './manager-user.component.html',
  styleUrl: './manager-user.component.css',
})
export class ManagerUserComponent implements OnInit {
  lists$: Observable<ListUser[]> = new Observable();
  list$: Observable<ListUser> = new Observable();
  // lists$: Observable<ListUser[]> = new BehaviorSubject<ListUser[]>([]);
  userId?: number;
  listLists: number;

  hoteLists$: Observable<ListHotel[]> = new Observable();
  hotelId?: number;

  loggedIn: boolean;
  currentUser: any;
  isLoggedIn = false;

  constructor(
    private listsService: ListService,
    private storageService: StorageService,
    private _router: Router,
    private dataService: DataService // private fb: FormBuilder,
  ) {
    this.loggedIn = false;
    this.listLists = 0;
  }

  ngOnInit(): void {
    this.isLoggedIn = this.storageService.isLoggedIn();
    if (!this.isLoggedIn) {
      this._router.navigate(['/home']);
    }

    this.fetchLists();
    this.currentUser = this.storageService.getUser();
  }

  private fetchLists(): void {
    this.lists$ = this.listsService.getLists();
    this.hoteLists$ = this.listsService.getHotelLists();
  }

  onAddUser() {
    this._router.navigate(['/register']);
    this.dataService.changeVariableBoolean(true);
    this.dataService.changeVariableNumber(0);
  }

  addHotel() {
    this._router.navigate(['/list/hotels/edit']);
    this.dataService.changeVariableNumber(0.5);
  }

  editList(id: number): void {
    this._router.navigate(['/register']);
    this.dataService.changeVariableNumber(id);
    this.dataService.changeVariableBoolean(false);
  }

  editHotel(id: number) {
    this._router.navigate(['/list/hotels/edit']);
    this.dataService.changeVariableNumber(id);
  }

  deleteList(id: number): void {
    this.listsService.deleteList(id).subscribe({
      next: () => this.fetchLists(),
    });
  }

  deleteHotel(id: number) {
    this.listsService.deleteHotelList(id).subscribe({
      next: () => this.fetchLists(),
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

  // @Input()
  // initialState: BehaviorSubject<ListUser> = new BehaviorSubject({});
  // @Output()
  // formValuesChanged = new EventEmitter<ListUser>();
  // @Output()
  // formSubmitted = new EventEmitter<ListUser>();
  // listForm: FormGroup = new FormGroup({});

  // get firstName() { return this.listForm.get('firstName')!; }
  // get lastName() { return this.listForm.get('lastName')!; }
  // get username() { return this.listForm.get('username')!; }
  // get email() { return this.listForm.get('email')!; }
  // get password() { return this.listForm.get('password')!; }

  // this.initialState.subscribe(list => {
  //   this.listForm = this.fb.group({
  //     description: [ list.description, [Validators.required] ],
  //     status: [ list.status, [Validators.required] ]
  //   });
  // });
  // this.listForm.valueChanges.subscribe((val) => { this.formValuesChanged.emit(val); });

  // submitForm() {
  //   this.formSubmitted.emit(this.listForm.value);
  //   this.lists$ = this.listsService.getLists();
  //   this._router.navigate(["/list/users"]);
  // }
  // cancel() {
  //   this._router.navigate(["/list/users"]);
  // }
}
