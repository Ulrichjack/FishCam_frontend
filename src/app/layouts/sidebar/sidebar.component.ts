import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { AuthStore } from '../../core/stores/auth.store';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [LucideAngularModule, RouterLink,RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {

    public readonly authStore = inject(AuthStore);
    private router = inject(Router);

    isAdministrationMenuOpen = signal(false);
    isGestionMenuOpen = signal(false);

    readonly closeRequested = output<void>();

    logout(){
      this.authStore.logout();
      this.router.navigate(['/login']);
    }

    toggleAdministrationMenu() {
    this.isAdministrationMenuOpen.set(!this.isAdministrationMenuOpen());
  }

  toggleGestionMenu() {
    this.isGestionMenuOpen.set(!this.isGestionMenuOpen());
  }

}
