import { Component, ChangeDetectionStrategy, inject,  effect, signal } from '@angular/core';
import { SidebarComponent } from "../../sidebar/sidebar.component";
import { RouterOutlet } from "@angular/router";
import { TopbarComponent } from '../../topbar/topbar.component';
import { AuthStore } from '../../../core/stores/auth.store';
import { NotificationStore } from '../../../features/notifications/stores/notification.store';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [SidebarComponent, RouterOutlet,SidebarComponent, TopbarComponent, RouterOutlet],
  templateUrl: './app-shell.component.html',
  styleUrl: './app-shell.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppShellComponent  {
  readonly notificationStore = inject(NotificationStore);
  private readonly auth = inject(AuthStore);
  readonly isSidebarOpen = signal(false);


  openSidebar() { this.isSidebarOpen.set(true); }
  closeSidebar() { this.isSidebarOpen.set(false); }

  constructor() {
    effect(() => {
      const userId = this.auth.user()?.id;
      if (!userId) return;
      this.notificationStore.refreshAll(userId);
    });
  }
}
