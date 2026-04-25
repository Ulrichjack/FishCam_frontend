import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../stores/auth.store';

export const authGuard: CanActivateFn = (route, state) => {

  const authStore = inject(AuthStore);
  const router = inject(Router);

  // TODO: Check if the user is logged in using your authStore
  // Hint: Use authStore.isLoggedIn()
  if (authStore.isLoggedIn()) {
    return true; // Access granted!
  }

  // If not logged in, redirect to login page
  router.navigate(['/login']);
  return false; // Access denied!
};
