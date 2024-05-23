import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './_guards/auth.guard';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { ManagerUserComponent } from './manager-user/manager-user.component';
import { HotelsComponent } from './hotels/hotels.component';
import { EditComponent } from './manager-user/edit/edit.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  { path: 'hotels', component: HotelsComponent },
  // { path: 'hotels/edit', component: EditComponent },

  { path: 'profile', component: ProfileComponent },
  // { path: 'user', component: BoardUserComponent },
  // { path: 'mod', component: BoardModeratorComponent },
  // { path: 'admin', component: BoardAdminComponent },

  {
    path: 'list/users',
    component: ManagerUserComponent,
    // canActivate: [AuthGuard],
  },
  {
    path: 'list/hotels/edit',
    component: EditComponent,
    // canActivate: [AuthGuard],
  },
  // { path: 'list', component: TodosListComponent },
  // { path: 'list/new', component: AddTodoComponent },
  // { path: 'list/edit/:id', component: EditTodoComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
