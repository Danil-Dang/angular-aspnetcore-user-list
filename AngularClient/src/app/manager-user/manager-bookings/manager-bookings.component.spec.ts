import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerBookingsComponent } from './manager-bookings.component';

describe('ManagerBookingsComponent', () => {
  let component: ManagerBookingsComponent;
  let fixture: ComponentFixture<ManagerBookingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManagerBookingsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManagerBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
