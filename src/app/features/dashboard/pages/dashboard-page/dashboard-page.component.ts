import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DashboardStore } from '../../stores/dashboard.store';
import { AuthStore } from '../../../../core/stores/auth.store';
import { StatsRowComponent } from '../../Components/stats-row/stats-row.component';
import { AlertRibbonComponent } from '../../Components/alert-ribbon/alert-ribbon.component';

@Component({
  selector: 'app-dashboard',
  imports: [StatsRowComponent,AlertRibbonComponent],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent {

  private readonly store = inject(DashboardStore);
  private readonly auth = inject(AuthStore);

  ngOnInit() {
    this.store.loadStats(this.auth.user()?.poissonnerieId || 1);
  }


}
