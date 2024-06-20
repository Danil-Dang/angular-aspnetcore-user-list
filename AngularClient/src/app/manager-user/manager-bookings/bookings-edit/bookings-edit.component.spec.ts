import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingsEditComponent } from './bookings-edit.component';

describe('BookingsEditComponent', () => {
  let component: BookingsEditComponent;
  let fixture: ComponentFixture<BookingsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BookingsEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BookingsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
