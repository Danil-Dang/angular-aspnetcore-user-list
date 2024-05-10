import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  storedValueBoolean = localStorage.getItem('admin-add-user');
  private variableSubjectBoolean = new BehaviorSubject<boolean>(this.storedValueBoolean !== null ? this.storedValueBoolean === 'true' : false)
  variableChangedBoolean$ = this.variableSubjectBoolean.asObservable();
  
  storedValueNumber = localStorage.getItem('admin-edit-user');
  private variableSubjectNumber = new BehaviorSubject<number>(this.storedValueNumber !== null ? Number(this.storedValueNumber) : 0)
  variableChangedNumber$ = this.variableSubjectNumber.asObservable();

  constructor() {}

  changeVariableBoolean(newValue: boolean) {
    this.variableSubjectBoolean.next(newValue);
  }
  changeVariableNumber(newValue: number) {
    this.variableSubjectNumber.next(newValue);
  }
}
