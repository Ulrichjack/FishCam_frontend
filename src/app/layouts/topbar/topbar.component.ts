import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
  HostListener,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { AuthStore } from '../../core/stores/auth.store';
import { NotificationStore } from '../../features/notifications/stores/notification.store';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [RouterLink, LucideAngularModule, DatePipe],
  templateUrl: './topbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopbarComponent {
  readonly authStore = inject(AuthStore);
  readonly notificationStore = inject(NotificationStore);

  // --- INPUTS ---
  readonly pageTitle = input<string>('Tableau de bord');
  readonly unreadCount = input<number>(0);

  // --- OUTPUTS ---
  readonly mobileMenuClicked = output<void>();
  readonly searchClicked = output<void>();

  // --- UI STATE ---
  readonly isNotifOpen = signal<boolean>(false);

  // --- COMPUTED ---
  readonly initials = computed(() => {
    const first = this.authStore.user()?.firstName ?? 'F';
    const last = this.authStore.user()?.lastName ?? 'C';
    return (first.charAt(0) + last.charAt(0)).toUpperCase();
  });

  readonly recentNotifications = computed(() => this.notificationStore.recent());

  toggleNotifDropdown(event: MouseEvent) {
    event.stopPropagation();
    this.isNotifOpen.update(v => !v);
  }

  closeNotifDropdown() {
    this.isNotifOpen.set(false);
  }

  async onNotificationClick(id: number, read: boolean) {
    const userId = this.authStore.user()?.id;
    if (!userId) return;

    // Option: only call backend if it's unread
    if (!read) {
      await this.notificationStore.markAsRead(id, userId);
    }
    this.closeNotifDropdown();
  }

  formatMessage(msg: string): string {
    // sécurité: si tu as encore des "\n" littéraux
    return (msg ?? '').replaceAll('\\n', '\n');
  }

  // Close on outside click
  @HostListener('document:click')
  onDocClick() {
    this.closeNotifDropdown();
  }
}
