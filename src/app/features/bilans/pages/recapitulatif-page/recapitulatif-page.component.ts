import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { DatePipe, NgClass } from '@angular/common';
import { RecapitulatifStore } from '../../stores/recapitulatif.store';
import { AuthStore } from '../../../../core/stores/auth.store';
import { CurrencyFcfaPipe } from '../../../../shared/pipes/currency-fcfa.pipe';

@Component({
  selector: 'app-recapitulatif-page',
  standalone: true,
  imports: [FormsModule, LucideAngularModule, DatePipe, NgClass, CurrencyFcfaPipe],
  templateUrl: './recapitulatif-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecapitulatifPageComponent implements OnInit {
  
  readonly store = inject(RecapitulatifStore);
  readonly authStore = inject(AuthStore);

  // Par défaut : du 1er du mois en cours à aujourd'hui
  readonly startDate = signal<string>('');
  readonly endDate = signal<string>('');
  readonly today = this.formatDate(new Date());

  ngOnInit(): void {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    
    // Format YYYY-MM-DD
    this.startDate.set(this.formatDate(firstDay));
    this.endDate.set(this.formatDate(today));
  }

  generateReport() {
    const poissonnerieId = this.authStore.activePoissonnerieId();
    if (poissonnerieId) {
      this.store.loadRecapitulatif(poissonnerieId, this.startDate(), this.endDate());
    }
  }

  downloadPdf() {
    const poissonnerieId = this.authStore.activePoissonnerieId();
    if (poissonnerieId) {
      this.store.downloadPdf(poissonnerieId, this.startDate(), this.endDate());
    }
  }

  changeDate(field: 'start' | 'end', delta: number): void {
    const signal = field === 'start' ? this.startDate : this.endDate;
    const [year, month, day] = signal().split('-').map(Number);
    const date = new Date(year, month - 1, day + delta);
    const value = this.formatDate(date);
    if (value > this.today) return;
    signal.set(value);
    if (this.startDate() > this.endDate()) {
      field === 'start' ? this.endDate.set(value) : this.startDate.set(value);
    }
  }

  private formatDate(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }
}
