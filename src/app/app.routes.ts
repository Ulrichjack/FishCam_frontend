import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { authGuard } from './core/auth/auth.guard';
import { Dashboard } from './features/dashboard/pages/dashboard/dashboard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },


  {
    path: '',
    component: MainLayoutComponent,
     canActivate:[authGuard],
    children: [
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      {path: 'dashboard', component: Dashboard}
    ]
   },

   //Fallback route - redirige vers login si aucune route ne correspond
  { path: '**', redirectTo: 'login' }


];
