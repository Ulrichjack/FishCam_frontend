import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthStore } from '../stores/auth.store';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {

   const authStore = inject(AuthStore);
   const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = 'Une erreur est survenue';

      switch (error.status) {
        case 401:
          message = 'Session expirée';
          authStore.logout();
          router.navigate(['/login']);
          break;
        case 403:
          message = 'Accès refusé (403)';
          break;
        case 404:
          message = 'Serveur introuvable (404)';
          break;
        case 400:
                  case 409:
                  case 422:
                      // On récupère le message spécifique envoyé par ton backend
                      message = error.error?.message || error.message || error.error || "Données invalides ou déjà existantes";
                      break;
        case 500:
          message = 'Erreur serveur (500)';
          break;
        case 0:
          message = 'Erreur réseau (Vérifiez votre connexion)';
          break;
      }

      console.error(`[Erreur ${error.status}]:`, message);
      return throwError(() => error);
    })
  );
};
