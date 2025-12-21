import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { PlatformComponent } from './features/platform/platform.component';
import { BookDetailsComponent } from './features/platform/book/book-details/book-details.component';
import { AuthGuard } from './core/guards/auth.guard';
import { BookFormComponent } from './features/platform/book/book-form/book-form.component';
import { UserFormComponent } from './features/platform/user/user-form/user-form.component';
import { AdminAuthGuard } from './core/guards/admin.auth.guard';
import { UserProfileComponent } from './features/platform/user/user-profile/user-profile.component';
import { ProfileGuard } from './core/guards/profile.guard';
import { LoansComponent } from './features/platform/loans/loans.component';
import { NotFoundComponent } from './layout/not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    title: 'Bibliothek - Login',
  },
  {
    path: 'platform',
    component: PlatformComponent,
    canActivate: [AuthGuard],
    title: 'Bibliothek',
  },
  {
    path: 'platform/details/:bookId',
    component: BookDetailsComponent,
    canActivate: [AuthGuard],
    title: 'Bibliothek',
  },
  {
    path: 'platform/user/:registration',
    component: UserProfileComponent,
    canActivate: [AuthGuard, ProfileGuard],
    title: 'Bibliothek',
  },
  {
    path: 'platform/newBook',
    component: BookFormComponent,
    canActivate: [AuthGuard, AdminAuthGuard],
    title: 'Bibliothek',
  },
  {
    path: 'platform/newUser',
    component: UserFormComponent,
    canActivate: [AuthGuard, AdminAuthGuard],
    title: 'Bibliothek',
  },
  {
    path: 'platform/loans',
    component: LoansComponent,
    canActivate: [AuthGuard, AdminAuthGuard],
    title: 'Bibliothek',
  },
  {
    path: '404',
    component: NotFoundComponent,
    title: 'Bibliothek - Page Not Found'
  },
  {
    path: '**',
    redirectTo: '404'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
