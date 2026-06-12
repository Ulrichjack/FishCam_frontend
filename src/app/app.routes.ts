import { Routes } from '@angular/router';
import { AppShellComponent } from './layouts/shell/app-shell/app-shell.component';
import { authGuard } from './core/auth/auth.guard';
import { DashboardPageComponent } from './features/dashboard/pages/dashboard-page/dashboard-page.component';

export const routes: Routes = [
  { path: 'login', loadComponent: () =>
      import('./features/auth/pages/login/login.component').then(m => m.LoginComponent)
  },

  {
    path: '',
    component: AppShellComponent,
     canActivate:[authGuard],
     children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardPageComponent },
      { path: 'clients',loadComponent: () => import('./features/clients/pages/clients-list/clients-list.component').then(m => m.ClientsListComponent) },
      { path: 'clients/:id',loadComponent: () => import('./features/clients/pages/client-detail/client-detail.component').then(m => m.ClientDetailComponent) },
      { path: 'factures', loadComponent: () => import('./features/factures/pages/factures-list/factures-list.component').then(m => m.FacturesListComponent) },
      { path: 'factures/new', loadComponent: () => import('./features/factures/pages/facture-create/facture-create.component').then(m => m.FactureCreateComponent) },
      { path: 'factures/:id', loadComponent: () => import('./features/factures/pages/facture-detail/facture-detail.component').then(m => m.FactureDetailComponent) },
      { path: 'transactions', loadComponent: () => import('./features/transactions/pages/transactions-list/transactions-list.component').then(m => m.TransactionsListComponent) },
      { path: 'dettes', loadComponent: () => import('./features/dettes/pages/dettes-list/dettes-list.component').then(m => m.DettesListComponent) },
    ]
   },

   //Fallback route - redirige vers login si aucune route ne correspond
  { path: '**', redirectTo: 'login' }


];
