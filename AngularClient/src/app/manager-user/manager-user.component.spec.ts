import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerUserComponent } from './manager-user.component';

describe('ManagerUserComponent', () => {
  let component: ManagerUserComponent;
  let fixture: ComponentFixture<ManagerUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManagerUserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManagerUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
