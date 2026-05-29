import { Injectable, inject, signal, computed } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { StatistiquesPoissonnerieResponse } from '../../../core/models/statistiques.model';
import { CompteCourantResponse } from '../../../core/models/compte-courant.model';
import { firstValueFrom } from 'rxjs';
import { NotificationResponse } from '../../../core/models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardStore {

  private dashboardService = inject(DashboardService);

  // --- STATE SIGNALS ---
  private readonly _stats = signal<StatistiquesPoissonnerieResponse | null>(null);
  private readonly _debtors = signal<CompteCourantResponse[]>([]);
  private readonly _notifications = signal<NotificationResponse[]>([]); // <-- 1. ADDED
  private readonly _isLoading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);
  private readonly _unreadCount = signal<number>(0);

  readonly unreadCount = this._unreadCount.asReadonly();
  readonly stats = this._stats.asReadonly();
  readonly debtors = this._debtors.asReadonly();
  readonly notifications = this._notifications.asReadonly(); // <-- 2. ADDED
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  // --- COMPUTED SIGNALS ---
  // 3. ADDED: This automatically finds the daily report!
  readonly lastReport = computed(() =>
    this.notifications().find((n: NotificationResponse) => n.type === 'RAPPORT_JOURNALIER')
  );

  // --- ACTIONS ---
  // 4. ADDED: We now require userId as a parameter
  async loadStats(poissonnerieId: number, userId: number) {
    this._isLoading.set(true);
    this._error.set(null);

    try {
      const [statsResponse, debtorsResponse, notificationsResponse, unreadResponse] = await Promise.all([
        firstValueFrom(this.dashboardService.getStats(poissonnerieId)),
        firstValueFrom(this.dashboardService.getDebtors(poissonnerieId)),
        firstValueFrom(this.dashboardService.getNotifications(userId)),
        firstValueFrom(this.dashboardService.getUnreadCount(userId)),
      ]);

      this._stats.set(statsResponse.data);
      this._debtors.set(debtorsResponse.data);
      this._notifications.set(notificationsResponse.data);
      this._unreadCount.set(unreadResponse.data?.count ?? 0);

    } catch (err) {
      this._error.set('Failed to load dashboard data');
    } finally {
      this._isLoading.set(false);
    }
  }
async loadUnreadCountOnly(userId: number) {
    try {
      const res = await firstValueFrom(this.dashboardService.getUnreadCount(userId));
      this._unreadCount.set(res.data?.count ?? 0);
    } catch {
      this._unreadCount.set(0);
    }
  }

  
}

