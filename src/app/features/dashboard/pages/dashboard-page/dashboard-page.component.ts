import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { DashboardStore } from '../../stores/dashboard.store';
import { AuthStore } from '../../../../core/stores/auth.store';
import { StatsRowComponent } from '../../Components/stats-row/stats-row.component';
import { AlertRibbonComponent } from '../../Components/alert-ribbon/alert-ribbon.component';
import { NotificationPreviewComponent } from '../../Components/notification-preview/notification-preview.component';
import { DailyReportCardComponent } from '../../Components/daily-report-card/daily-report-card.component';

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

  ngOnInit() {
     const poissonnerieId = this.auth.user()?.poissonnerieId;
    const userId = this.auth.user()?.id; // <-- Get the user ID

    // Pass BOTH IDs to the store
    if (poissonnerieId && userId) {
      this.store.loadStats(poissonnerieId, userId);
    }
  }


}
