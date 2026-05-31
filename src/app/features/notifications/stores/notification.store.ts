import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { NotificationService } from '../services/notification.service';
import { NotificationResponse } from '../../../core/models/notification.model';
import { PageResponse } from '../../../core/models/api-response.model';

@Injectable({ providedIn: 'root' })
export class NotificationStore {
  private readonly api = inject(NotificationService);

  // --- STATE ---
  private readonly _recent = signal<NotificationResponse[]>([]);
  private readonly _unreadCount = signal<number>(0);
  private readonly _page = signal<PageResponse<NotificationResponse> | null>(null);

  // --- READONLY ---
  readonly recent = this._recent.asReadonly();
  readonly unreadCount = this._unreadCount.asReadonly();
  readonly page = this._page.asReadonly();

  // --- COMPUTED (Dashboard) ---
  readonly dailyReport = computed(() =>
    this.recent().find(n => n.type === 'RAPPORT_JOURNALIER') ?? null
  );

  readonly dailyReportMessage = computed(() =>
    this.dailyReport()?.message ?? "Aucun rapport disponible pour aujourd'hui."
  );

  readonly preview = computed(() =>
    this.recent()
      .filter(n => n.type !== 'RAPPORT_JOURNALIER')
      .slice(0, 3)
  );

  // --- ACTIONS ---
  /**
   * À appeler au chargement du shell/dashboard:
   * rapide, évite de télécharger 1000 notifications.
   */
  async refreshShell(userId: number) {
    const [recentRes, countRes] = await Promise.all([
      firstValueFrom(this.api.getRecent(userId, 10)), // 10 pour avoir une chance d'attraper le rapport
      firstValueFrom(this.api.getUnreadCount(userId)),
    ]);

    this._recent.set(recentRes.data ?? []);
    this._unreadCount.set(countRes.data?.count ?? 0);
  }

  /**
   * À appeler seulement sur la page "Notifications"
   */
  async loadPage(userId: number, page = 0, size = 20) {
    const res = await firstValueFrom(this.api.getNotificationsPage(userId, page, size));
    this._page.set(res.data ?? null);
  }

  async markAsRead(notificationId: number, userId: number) {
    await firstValueFrom(this.api.markAsRead(notificationId));
    await this.refreshShell(userId);
  }

  async markAllAsRead(userId: number) {
    await firstValueFrom(this.api.markAllAsRead(userId));
    await this.refreshShell(userId);
  }
}
