import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerHotelComponent } from './manager-hotel.component';

describe('ManagerHotelComponent', () => {
  let component: ManagerHotelComponent;
  let fixture: ComponentFixture<ManagerHotelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManagerHotelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManagerHotelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
