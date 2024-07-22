import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  // storedValueBoolean = localStorage.getItem('admin-add-user');
  // private variableSubjectBoolean = new BehaviorSubject<boolean>(this.storedValueBoolean !== null ? this.storedValueBoolean === 'true' : false)
  private variableSubjectBoolean = new BehaviorSubject<boolean>(false);
  variableChangedBoolean$ = this.variableSubjectBoolean.asObservable();

  // storedValueNumber = localStorage.getItem('admin-edit-user');
  // private variableSubjectNumber = new BehaviorSubject<number>(this.storedValueNumber !== null ? Number(this.storedValueNumber) : 0)
  private variableSubjectNumber = new BehaviorSubject<number>(0);
  variableChangedNumber$ = this.variableSubjectNumber.asObservable();

  private homeStringCity = new BehaviorSubject<string>('');
  changeHomeStringCity$ = this.homeStringCity.asObservable();

  private homeStringDateStart = new BehaviorSubject<string>('');
  changeHomeStringDateStart$ = this.homeStringDateStart.asObservable();

  private homeStringDateEnd = new BehaviorSubject<string>('');
  changeHomeStringDateEnd$ = this.homeStringDateEnd.asObservable();

  constructor() {}

  changeVariableBoolean(newValue: boolean) {
    this.variableSubjectBoolean.next(newValue);
  }

  changeVariableNumber(newValue: number) {
    this.variableSubjectNumber.next(newValue);
  }

  changeHomeStringCity(newValue: string) {
    this.homeStringCity.next(newValue);
  }
  changeHomeStringDateStart(newValue: string) {
    this.homeStringDateStart.next(newValue);
  }
  changeHomeStringDateEnd(newValue: string) {
    this.homeStringDateEnd.next(newValue);
  }
}
