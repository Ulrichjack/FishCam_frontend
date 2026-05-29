import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DashboardStore } from '../../stores/dashboard.store';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-notification-preview',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './notification-preview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationPreviewComponent {

  readonly store = inject(DashboardStore);

  // We filter out the daily report (because it has its own card)
  // and we only take the first 3 notifications to keep the UI clean.
  readonly recentNotifications = computed(() => {
    return this.store.notifications()
      .filter(n => n.type !== 'RAPPORT_JOURNALIER')
      .slice(0, 3);
  });

  // Helper method to get the right color based on the type
  getColorForType(type: string): string {
  switch (type) {
    case 'COMPTE_COURANT_ALERTE': return 'text-red-700 bg-red-50 px-2 py-1 rounded-md';
    case 'COMPTE_SOLDE': return 'text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md';
    case 'RAPPORT_JOURNALIER': return 'text-blue-700 bg-blue-50 px-2 py-1 rounded-md';
    default: return 'text-gray-700 bg-gray-100 px-2 py-1 rounded-md';
  }
}
}
