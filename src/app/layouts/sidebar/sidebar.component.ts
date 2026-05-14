import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLinkActive } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { AuthStore } from '../../core/stores/auth.store';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [LucideAngularModule, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {

    public readonly authStore = inject(AuthStore);
    private router = inject(Router);

    logout(){
      this.authStore.logout();
      this.router.navigate(['/login']);
    }

}
