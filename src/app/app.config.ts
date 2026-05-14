import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { jwtInterceptor } from './core/auth/jwt.interceptor';
import { errorInterceptor } from './core/auth/error.interceptor';
import { importProvidersFrom } from '@angular/core';
import {
  LucideAngularModule,
  LayoutDashboard,
  Users,
  AlertTriangle,
  ArrowLeftRight,
  Bell,
  Building2,
  UserCog,
  LogOut,
  Settings,
  Headphones,
  CircleDollarSign,
  Menu,           // <-- ADDED
  TrendingDown,   // <-- ADDED
  PiggyBank,      // <-- ADDED
  Wallet,         // <-- ADDED
  Search          // <-- ADDED
} from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([jwtInterceptor, errorInterceptor])),
    importProvidersFrom(
      LucideAngularModule.pick({
        LayoutDashboard,
        Users,
        AlertTriangle,
        ArrowLeftRight,
        Bell,
        Building2,
        UserCog,
        LogOut,
        Settings,
        Headphones,
        CircleDollarSign,
        Menu,           // <-- ADDED
        TrendingDown,   // <-- ADDED
        PiggyBank,      // <-- ADDED
        Wallet,         // <-- ADDED
        Search          // <-- ADDED
      })
    )

    ]
};
