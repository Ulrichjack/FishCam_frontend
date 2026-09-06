import { ChangeDetectionStrategy, Component, inject, signal, effect, OnInit, untracked } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { TransactionStore } from '../../stores/transaction.store';
import { AuthStore } from '../../../../core/stores/auth.store';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { CurrencyFcfaPipe } from '../../../../shared/pipes/currency-fcfa.pipe';
import { LucideAngularModule } from 'lucide-angular';
import { RouterLink } from '@angular/router';
// DIRECTIVE: Import other necessary components like loading-skeleton, empty-state, etc.

@Component({
  selector: 'app-transactions-list',
  standalone: true,
  imports: [
    FormsModule, 
    DatePipe, 
    CurrencyFcfaPipe, 
    LucideAngularModule,
    RouterLink,
    // DIRECTIVE: Add other necessary components like loading-skeleton, empty-state, etc.],
  ],
  templateUrl: './transactions-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransactionsListComponent implements OnInit {
  
  readonly store = inject(TransactionStore);
  readonly authStore = inject(AuthStore);

  // --- FILTER SIGNALS ---
  readonly searchTerm = signal<string>('');
  readonly selectedType = signal<string>('');
  readonly selectedDate = signal<string>('');
  readonly today = this.formatDate(new Date());
  readonly currentPage = signal<number>(0);

  constructor() {
    // 1. Recherche avec Debounce
    toObservable(this.searchTerm).pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.currentPage.set(0);
      this.loadData();
    });

    // 2. Filtres Type et Date
    effect(() => {
      this.selectedType();
      this.selectedDate();
      
      // untracked évite que loadData() ne rajoute des dépendances à l'effet
      untracked(() => {
        this.currentPage.set(0);
        this.loadData();
      });
    }, { allowSignalWrites: true }); // <-- OBLIGATOIRE pour modifier currentPage ici
  }

  ngOnInit(): void {
    // VIDE ! L'effect() va se déclencher tout seul au démarrage et charger les données.
  }

  loadData(): void {
    // DIRECTIVE: Get activePoissonnerieId from authStore
    // If it exists, call this.store.loadTransactions(...) with all current filter signals
    // YOUR CODE HERE
    if(this.authStore.activePoissonnerieId()) {
      this.store.loadTransactions(
        this.authStore.activePoissonnerieId()!, 
        this.currentPage(), 
        20, // page size
        this.selectedType() || undefined, // pass undefined if empty
        this.searchTerm() || undefined, // pass undefined if empty
        this.selectedDate() || undefined // pass undefined if empty
      );
    }
  }

  onPageChange(page: number): void {
    // DIRECTIVE: Update currentPage signal and call loadData()
    // YOUR CODE HERE
    this.currentPage.set(page);
    this.loadData();
  }

  getTypeBadgeClass(type: string): string {
    switch(type) {
      case 'EMPRUNT':
        return 'bg-fc-red-light text-fc-red';
      case 'DETTE_INITIALE':
        return 'bg-amber-100 text-amber-800';
      case 'ANNULATION_DETTE_INITIALE':
        return 'bg-gray-200 text-gray-700';
      case 'REMBOURSEMENT':
        return 'bg-fc-green-light text-fc-green';
      case 'DEPOT':
        return 'bg-blue-50 text-blue-700';
      case 'RETRAIT':
        return 'bg-orange-50 text-fc-orange';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  }

  getTypeLabel(type:string):string{
    if(type==='DETTE_INITIALE')return 'Dette du cahier';
    if(type==='ANNULATION_DETTE_INITIALE')return 'Annulation dette';
    return type;
  }

  onSearch(event: Event) {
    // DIRECTIVE: Extract value from event.target and set searchTerm signal
    // YOUR CODE HERE
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
  }

  changeDate(delta: number): void {
    const base = this.selectedDate() ? this.parseDate(this.selectedDate()) : new Date();
    base.setDate(base.getDate() + delta);
    const value = this.formatDate(base);
    if (value <= this.today) this.selectedDate.set(value);
  }

  private parseDate(value: string): Date {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  private formatDate(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

}
