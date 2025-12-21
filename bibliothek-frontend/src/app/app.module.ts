import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './features/login/login.component';
import { PlatformComponent } from './features/platform/platform.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { FeaturedBooksComponent } from './layout/featured-books/featured-books.component';
import { BookListComponent } from './features/platform/book/book-list/book-list.component';
import { BookDetailsComponent } from './features/platform/book/book-details/book-details.component';
import { SearchBarComponent } from './layout/search-bar/search-bar.component';
import { FooterComponent } from './layout/footer/footer.component';
import { BookFormComponent } from './features/platform/book/book-form/book-form.component';
import { UserFormComponent } from './features/platform/user/user-form/user-form.component';
import { UserProfileComponent } from './features/platform/user/user-profile/user-profile.component';
import { DatePipe } from '@angular/common';
import { LoansComponent } from './features/platform/loans/loans.component';
import { RecommendationsComponent } from './layout/recommendations/recommendations.component';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NotFoundComponent } from './layout/not-found/not-found.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PlatformComponent,
    NavbarComponent,
    FeaturedBooksComponent,
    BookListComponent,
    BookDetailsComponent,
    SearchBarComponent,
    FooterComponent,
    BookFormComponent,
    UserFormComponent,
    UserProfileComponent,
    LoansComponent,
    RecommendationsComponent,
    LoadingSpinnerComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent],
})
export class AppModule {}
