import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Directive,
  Output,
  EventEmitter,
  HostListener,
} from '@angular/core';
import { Observable, startWith, map } from 'rxjs';
import { FormControl } from '@angular/forms';
import {
  BsDatepickerConfig,
  BsDaterangepickerDirective,
} from 'ngx-bootstrap/datepicker';

import { ListBookingWith } from '../manager-user/list-bookingsWith';
import { ListService } from '../_services/list.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  @ViewChild('cityInput') cityInputRef!: ElementRef;
  @ViewChild('dropdownMenu') dropdownMenuRef!: ElementRef;

  allLocations: string[] = [];
  filteredLocations$: Observable<string[]> = new Observable();
  cityInput = new FormControl('');
  selectedCity: string = '';
  showDropdown: boolean = false;

  // bookedObj!: { [key: string]: ListBookingWith };
  // bookedArray!: ListBookingWith[];
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
  enabledDates: Date[] = [];
  disabledDates: Date[] = [];
  @ViewChild('dateRangePicker') dateRangePicker!: BsDaterangepickerDirective;
  isCityOpen = false;
  // dateRoomId: number = 0;
  // currentIndex!: number;

  constructor(private listService: ListService) {
    this.maxDate.setDate(this.maxDate.getDate() + 1);
    this.bsRangeValue = [this.bsValue, this.maxDate];
  }

  ngOnInit(): void {
    this.listService
      .getLocationsCity()
      .pipe(map((locations) => locations.map((location) => location.city)))
      .subscribe((cityNames) => {
        this.allLocations = cityNames;
      });

    this.filteredLocations$ = this.cityInput.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterLocations(value || ''))
    );
  }

  private _filterLocations(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allLocations.filter((city) =>
      city.toLowerCase().includes(filterValue)
    );
  }

  selectCity(location: string) {
    this.selectedCity = location;
    this.cityInput.setValue(location);
    this.showDropdown = false;
  }

  handleBlur() {
    // setTimeout(() => {
    //   this.showDropdown = false;
    // }, 200);
  }
}
