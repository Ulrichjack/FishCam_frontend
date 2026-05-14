import { Component, computed, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { AuthStore } from '../../core/stores/auth.store';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [RouterLink, LucideAngularModule],
  templateUrl: './topbar.component.html',
})
export class TopbarComponent {
  readonly authStore = inject(AuthStore);

  // --- INPUTS ---
  readonly pageTitle = input<string>('Tableau de bord');
  readonly unreadCount = input<number>(3); // Mock value

  // --- OUTPUTS ---
  readonly mobileMenuClicked = output<void>();
  readonly searchClicked = output<void>();

  // --- COMPUTED ---
  readonly initials = computed(() => {
    const first = this.authStore.user()?.firstName ?? 'F';
    const last = this.authStore.user()?.lastName ?? 'C';
    return (first.charAt(0) + last.charAt(0)).toUpperCase();
  });
}