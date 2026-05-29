import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { NotificationService } from '../services/notification.service';
import { NotificationResponse } from '../../../core/models/notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationStore {
  private readonly api = inject(NotificationService);

  private readonly _items = signal<NotificationResponse[]>([]);
  private readonly _unreadCount = signal<number>(0);

  readonly items = this._items.asReadonly();
  readonly unreadCount = this._unreadCount.asReadonly();

  readonly recent = computed(() => this.items().slice(0, 5));

  async refreshAll(userId: number) {
    const [itemsRes, countRes] = await Promise.all([
      firstValueFrom(this.api.getNotifications(userId)),
      firstValueFrom(this.api.getUnreadCount(userId)),
    ]);

    this._items.set(itemsRes.data ?? []);
    this._unreadCount.set(countRes.data?.count ?? 0);
  }

  async refreshUnreadCount(userId: number) {
    const res = await firstValueFrom(this.api.getUnreadCount(userId));
    this._unreadCount.set(res.data?.count ?? 0);
  }

  async markAsRead(notificationId: number, userId: number) {
    await firstValueFrom(this.api.markAsRead(notificationId));
    await this.refreshAll(userId);
  }
}
