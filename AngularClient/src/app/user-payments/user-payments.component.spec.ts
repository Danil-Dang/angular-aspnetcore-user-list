import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPaymentsComponent } from './user-payments.component';

describe('UserPaymentsComponent', () => {
  let component: UserPaymentsComponent;
  let fixture: ComponentFixture<UserPaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserPaymentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
