import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { JwtModule } from '@auth0/angular-jwt';
import {
  BsDatepickerModule,
  BsDatepickerConfig,
} from 'ngx-bootstrap/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DecimalPipe } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { BoardAdminComponent } from './board-admin/board-admin.component';
import { BoardModeratorComponent } from './board-moderator/board-moderator.component';
import { BoardUserComponent } from './board-user/board-user.component';
import { ManagerUserComponent } from './manager-user/manager-user.component';
import { EditComponent } from './manager-user/edit/edit.component';
import { HotelsComponent } from './hotels/hotels.component';
import { RoomComponent } from './hotels/room/room.component';
import { ManagerHotelComponent } from './manager-user/manager-hotel/manager-hotel.component';
import { CartComponent } from './cart/cart.component';
import { ManagerBookingsComponent } from './manager-user/manager-bookings/manager-bookings.component';
import { BookingsEditComponent } from './manager-user/manager-bookings/bookings-edit/bookings-edit.component';
import { PaymentComponent } from './cart/payment/payment.component';
import { ManagerPaymentsComponent } from './manager-user/manager-payments/manager-payments.component';
import { ClickOutsideDirective } from './_services/directives/click-outside.directive';
// import { StorageService } from './_services/storage.service';

export function tokenGetter() {
  return localStorage.getItem('jwt');
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ProfileComponent,
    BoardAdminComponent,
    BoardModeratorComponent,
    BoardUserComponent,
    ManagerUserComponent,
    EditComponent,
    HotelsComponent,
    RoomComponent,
    ManagerHotelComponent,
    CartComponent,
    ManagerBookingsComponent,
    BookingsEditComponent,
    PaymentComponent,
    ManagerPaymentsComponent,
    ClickOutsideDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ['localhost:4201'],
        disallowedRoutes: [],
      },
    }),
    BsDatepickerModule.forRoot(),
    BrowserAnimationsModule,
  ],
  providers: [BsDatepickerConfig, DecimalPipe],
  bootstrap: [AppComponent],
})
export class AppModule {}
