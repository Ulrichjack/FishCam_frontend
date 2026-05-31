import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { DashboardStore } from '../../stores/dashboard.store';
import { AuthStore } from '../../../../core/stores/auth.store';
import { StatsRowComponent } from '../../components/stats-row/stats-row.component';
import { AlertRibbonComponent } from '../../components/alert-ribbon/alert-ribbon.component';
import { NotificationPreviewComponent } from '../../components/notification-preview/notification-preview.component';
import { DailyReportCardComponent } from '../../components/daily-report-card/daily-report-card.component';
import { NotificationStore } from '../../../notifications/stores/notification.store';

@Component({
  selector: 'app-dashboard',
  imports: [StatsRowComponent,AlertRibbonComponent,NotificationPreviewComponent,DailyReportCardComponent],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent implements OnInit {

  readonly store = inject(DashboardStore);
  private readonly auth = inject(AuthStore);
  readonly notificationStore = inject(NotificationStore);


  ngOnInit() {
     const poissonnerieId = this.auth.user()?.poissonnerieId;
    console.log('dashboard init', { poissonnerieId});

    // Pass BOTH IDs to the store
    if (poissonnerieId) {
      this.store.loadStats(poissonnerieId);
    }
  }


}
