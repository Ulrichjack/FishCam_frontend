import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { AuthStore } from '../../../../core/stores/auth.store';
import { DashboardStore } from '../../stores/dashboard.store';
import { GreetingHeaderComponent } from '../../../../shared/components/greeting-header/greeting-header.component';
import { NotificationPreviewComponent } from '../../components/notification-preview/notification-preview.component';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-enregistreur-dashboard',
  standalone: true,
  imports: [
    RouterLink, DatePipe, DecimalPipe, LucideAngularModule,
    GreetingHeaderComponent, NotificationPreviewComponent
  ],
  templateUrl: './enregistreur-dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EnregistreurDashboardComponent {
    readonly authStore = inject(AuthStore);
    readonly dashboardStore = inject(DashboardStore);
}