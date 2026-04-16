import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NoRedirectGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    // Check if the route is the dashboard or any child route of the dashboard
    if (state.url.startsWith('/dashboard')) {
      return true; // Allow navigation to the dashboard
    } else {
      // Redirect to the dashboard if the route is not allowed
      this.router.navigateByUrl('/dashboard');
      return false;
    }
  }
}
