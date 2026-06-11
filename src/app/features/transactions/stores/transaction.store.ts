

import { inject, Injectable, signal } from "@angular/core";
import { TransactionService } from "../services/transaction.service";
import { TransactionCCResponse } from "../../../core/models/compte-courant.model";
import { firstValueFrom } from "rxjs";

@Injectable({ providedIn: 'root' })
export class TransactionStore {
  private readonly transactionService = inject(TransactionService);

  // --- SIGNAUX D'ÉTAT ---
  private _transactions = signal<TransactionCCResponse[]>([]);
  private _isLoading = signal<boolean>(false);  
  private _error = signal<string | null>(null);

  // --- SIGNAUX LECTURE SEULE ---
  readonly transactions = this._transactions.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  // --- ACTIONS ---
  // DIRECTIVE: Implémente loadTransactions(poissonnerieId: number, date: string)
  // 1. Active isLoading, reset error
  // 2. Fais un firstValueFrom sur le service
  // 3. Mets à jour _transactions avec response.data
  // 4. Gère les erreurs et désactive isLoading dans le finally
  async loadTransactions(poissonnerieId: number, date: string) {
    this._isLoading.set(true);
    this._error.set(null);
    
    try {
      const result = await firstValueFrom(this.transactionService.getTransactionsByDate(poissonnerieId, date));
      this._transactions.set(result.data ?? []);
    } catch (error) {
      this._error.set('Erreur lors du chargement des transactions');
    } finally {
      this._isLoading.set(false);
    }

  }
}