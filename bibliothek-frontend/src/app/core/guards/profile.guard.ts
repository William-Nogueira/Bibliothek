import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ProfileGuard {
  constructor(private readonly router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const urlRegistration  = route.paramMap.get('registration');
    const localRegistration  = localStorage.getItem('registration');

    if (urlRegistration  !== localRegistration ) {
      this.router.navigate(['/platform']);
      return false;
    }

    return true;
  }
}
