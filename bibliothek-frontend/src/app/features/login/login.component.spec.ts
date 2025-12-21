import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of, throwError, Subject } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

const MOCK_LOGIN_RESPONSE = { token: 'fake-jwt-token' };
const MOCK_USER_INFO = {
  registration: '123',
  name: 'John',
  profilePic: 'pic.jpg',
};

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let translateServiceSpy: jasmine.SpyObj<TranslateService>;

  let onLangChange$: Subject<any>;
  let onTranslationChange$: Subject<any>;
  let onDefaultLangChange$: Subject<any>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', [
      'login',
      'getUserInfo',
    ]);

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    onLangChange$ = new Subject();
    onTranslationChange$ = new Subject();
    onDefaultLangChange$ = new Subject();

    translateServiceSpy = jasmine.createSpyObj(
      'TranslateService',
      ['use', 'get'],
      {
        onLangChange: onLangChange$,
        onTranslationChange: onTranslationChange$,
        onDefaultLangChange: onDefaultLangChange$,
      }
    );

    translateServiceSpy.get.and.returnValue(of('Translated String'));

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: TranslateService, useValue: translateServiceSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    spyOn(localStorage, 'getItem').and.returnValue(null);
    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'clear');

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with invalid form', () => {
    expect(component.loginForm.valid).toBeFalse();
  });

  it('should mark form as touched if submitted while invalid', () => {
    component.onSubmit();

    expect(component.loginForm.touched).toBeTrue();
    expect(authServiceSpy.login).not.toHaveBeenCalled();
  });

  it('should call login and navigate to platform on success', () => {
    component.loginForm.setValue({
      registration: '12345',
      password: 'secret-pass',
    });

    authServiceSpy.login.and.returnValue(of(MOCK_LOGIN_RESPONSE));
    authServiceSpy.getUserInfo.and.returnValue(of(MOCK_USER_INFO));

    component.onSubmit();

    expect(authServiceSpy.login).toHaveBeenCalledWith('12345', 'secret-pass');

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'token',
      'fake-jwt-token'
    );

    expect(localStorage.setItem).toHaveBeenCalledWith('registration', '12345');

    expect(authServiceSpy.getUserInfo).toHaveBeenCalledWith('12345');

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/platform']);
    expect(component.isLoading).toBeFalse();
  });

  it('should handle login error (Invalid Credentials)', () => {
    component.loginForm.setValue({
      registration: '123',
      password: 'wrong',
    });

    authServiceSpy.login.and.returnValue(
      throwError(() => new Error('401 Unauthorized'))
    );

    component.onSubmit();

    expect(component.errorMessage).toBe('LOGIN.ERROR_INVALID');
    expect(component.isLoading).toBeFalse();
    expect(authServiceSpy.getUserInfo).not.toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should handle User Info retrieval error', () => {
    component.loginForm.setValue({
      registration: '123',
      password: 'pass',
    });

    authServiceSpy.login.and.returnValue(of(MOCK_LOGIN_RESPONSE));
    authServiceSpy.getUserInfo.and.returnValue(
      throwError(() => new Error('Network Error'))
    );

    component.onSubmit();

    expect(component.errorMessage).toBe('LOGIN.ERROR_UNEXPECTED');
    expect(component.isLoading).toBeFalse();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should switch language', () => {
    const newLang = 'pt';

    component.switchLanguage(newLang);

    expect(component.currentLang).toBe(newLang);
    expect(translateServiceSpy.use).toHaveBeenCalledWith(newLang);
    expect(localStorage.setItem).toHaveBeenCalledWith('lang', newLang);
  });
});
