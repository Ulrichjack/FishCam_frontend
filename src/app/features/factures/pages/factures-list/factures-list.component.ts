import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { FactureStore } from '../../stores/facture.store';
import { AuthStore } from '../../../../core/stores/auth.store';
import { FormsModule } from '@angular/forms'; // Needed for ngModel on the date input
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { CurrencyFcfaPipe } from '../../../../shared/pipes/currency-fcfa.pipe';

@Component({
  selector: 'app-factures-list',
  standalone: true,
  imports: [RouterLink, LucideAngularModule,  FormsModule, ConfirmDialogComponent, CurrencyFcfaPipe],
  templateUrl: './factures-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FacturesListComponent implements OnInit {

  readonly factureStore = inject(FactureStore);
  public readonly authStore = inject(AuthStore);

 
  selectedDate = signal<string>('');

  // Signals for the Confirm Dialog
  isConfirmOpen = signal<boolean>(false);
  factureToClose = signal<number | null>(null);
  isDeleteConfirmOpen = signal<boolean>(false);
  factureToDelete = signal<number | null>(null);

  ngOnInit() {
    this.selectedDate.set(this.formatLocalDate(new Date()));
    this.loadData();
  }

  loadData() {
    
    const poissonnerieId = this.authStore.activePoissonnerieId();
    if (poissonnerieId) {
      this.factureStore.loadFactures(poissonnerieId, this.selectedDate());
    }
  }

  onDateChange(newDate: string) {
    if (!newDate) return;
    this.selectedDate.set(newDate);
    this.loadData();
  }

  changeDay(offset: number) {
    const [year, month, day] = this.selectedDate().split('-').map(Number);
    const target = new Date(year, month - 1, day);
    target.setDate(target.getDate() + offset);
    this.selectedDate.set(this.formatLocalDate(target));
    this.loadData();
  }

  goToToday() {
    this.selectedDate.set(this.formatLocalDate(new Date()));
    this.loadData();
  }

  private formatLocalDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  openCloseDialog(factureId: number) {
    this.factureToClose.set(factureId);
    this.isConfirmOpen.set(true);
  }

  async executeClose() {
    const id = this.factureToClose();
    if (id) {
      await this.factureStore.cloturerFacture(id);
    }
    this.isConfirmOpen.set(false);
  }

  openDeleteDialog(factureId: number) {
    this.factureToDelete.set(factureId);
    this.isDeleteConfirmOpen.set(true);
  }

  async executeDelete() {
    const id = this.factureToDelete();
    if (id) {
      await this.factureStore.deleteFacture(id);
    }
    this.factureToDelete.set(null);
    this.isDeleteConfirmOpen.set(false);
  }
}
