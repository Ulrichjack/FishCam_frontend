import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { AuthStore } from '../../../../core/stores/auth.store';
import { DashboardStore } from '../../stores/dashboard.store';
import { NotificationStore } from '../../../notifications/stores/notification.store';
import { AlertRibbonComponent } from '../../components/alert-ribbon/alert-ribbon.component';
import { NotificationPreviewComponent } from '../../components/notification-preview/notification-preview.component';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { TransactionFormComponent, TransactionMode } from '../../../../shared/components/transaction-form/transaction-form.component';
import { LucideAngularModule } from 'lucide-angular';
// DIRECTIVE: Import the StatCardComponent
import { StatCardComponent } from '../../../../shared/components/stat-card/stat-card.component';
import { GreetingHeaderComponent } from '../../../../shared/components/greeting-header/greeting-header.component';

@Component({
  selector: 'app-caissiere-dashboard',
  standalone: true,
  imports: [
    LucideAngularModule,
    AlertRibbonComponent, NotificationPreviewComponent,
    ModalComponent, TransactionFormComponent, GreetingHeaderComponent,
    StatCardComponent // <-- ADDED HERE
],
  templateUrl: './caissiere-dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CaissiereDashboardComponent {
  readonly authStore = inject(AuthStore);
  readonly dashboardStore = inject(DashboardStore);
  readonly notificationStore = inject(NotificationStore);

  readonly today = new Date();

  // Modal state
  readonly isModalOpen = signal<boolean>(false);
  readonly modalTitle = signal<string>('');
  readonly currentAction = signal<TransactionMode | null>(null);

  // DIRECTIVE: Calculate the number of invoices today
  readonly facturesCount = computed(() => {
    const factures = this.dashboardStore.facturesDuJour();
    return factures ? factures.length : 0;
  });

  openTransactionModal(action: TransactionMode, title: string) {
    this.currentAction.set(action);
    this.modalTitle.set(title);
    this.isModalOpen.set(true);
  }

  onSaveTransaction(data: { amount: number, notes?: string }) {
    console.log('Transaction saved (Caissière):', data);
    this.isModalOpen.set(false);
  }
}