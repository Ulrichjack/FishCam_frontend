import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { NotificationStore } from '../../stores/notification.store';
import { AuthStore } from '../../../../core/stores/auth.store';
import { TypeNotification } from '../../../../core/models/notification.model';

@Component({
  selector: 'app-notifications-list',
  standalone: true,
  imports: [LucideAngularModule, DatePipe], // <-- J'ai retiré NgClass qui ne servait à rien
  templateUrl: './notifications-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationsListComponent implements OnInit {

  readonly notificationStore = inject(NotificationStore);
  readonly authStore = inject(AuthStore);

  // Expose l'enum au template HTML
  readonly TypeNotification = TypeNotification;

  // --- COMPUTED POUR LA PAGINATION (Évite les erreurs "undefined" dans le HTML) ---
  readonly currentPage = computed(() => this.notificationStore.page()?.number ?? 0);
  readonly totalPages = computed(() => this.notificationStore.page()?.totalPages ?? 0);

  ngOnInit() {
    const userId = this.authStore.user()?.id;
    const pId = this.authStore.activePoissonnerieId();
    if (userId && pId) {
      this.notificationStore.loadPage(userId, pId, 0);
    }
  }

  setFilter(filter: TypeNotification | 'ALL') {
    this.notificationStore.setFilter(filter);
  }

  async markAllAsRead() {
    const userId = this.authStore.user()?.id;
    if (userId) {
      await this.notificationStore.markAllAsRead(userId);
      await this.notificationStore.loadPage(userId, this.currentPage()); 
    }
  }

  async onNotificationClick(notifId: number, isRead: boolean) {
    const userId = this.authStore.user()?.id;
    if (userId && !isRead) {
      await this.notificationStore.markAsRead(notifId, userId);
      await this.notificationStore.loadPage(userId, this.currentPage()); 
    }
  }

  previousPage() {
    const userId = this.authStore.user()?.id;
    if (userId && this.currentPage() > 0) {
      this.notificationStore.loadPage(userId, this.currentPage() - 1);
    }
  }

  nextPage() {
    const userId = this.authStore.user()?.id;
    if (userId && this.currentPage() < this.totalPages() - 1) {
      this.notificationStore.loadPage(userId, this.currentPage() + 1);
    }
  }
}