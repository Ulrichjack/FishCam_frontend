// ─── SKELETON: src/app/features/cloture/stores/cloture.store.ts ─────────

import { inject, Injectable, signal } from "@angular/core";
import { ClotureService } from "../services/cloture.service";
import { firstValueFrom } from "rxjs";
import { ClotureJournaliereRequest, ClotureJournaliereResponse, PreparationClotureResponse } from "../../../core/models/cloture.model";

@Injectable({ providedIn: 'root' })
export class ClotureStore {
  private readonly clotureService = inject(ClotureService);

  // --- STATE SIGNALS ---
  private _preparation = signal<PreparationClotureResponse | null>(null);
  private _historique = signal<ClotureJournaliereResponse[]>([]);
  private _isLoading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  // --- READONLY SIGNALS ---
  readonly preparation = this._preparation.asReadonly();
  readonly historique = this._historique.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  // --- ACTIONS ---

  // DIRECTIVE: Implement loadPreparation(poissonnerieId: number, date: string)
  // 1. Set isLoading to true, error to null
  // 2. Call service.preparerCloture
  // 3. Set _preparation with result.data
  // 4. Handle errors and finally block
  async loadPreparation(poissonnerieId: number, date: string) {
    // YOUR CODE HERE
    this._isLoading.set(true);
    this._error.set(null);
    try {
      const response = await firstValueFrom(this.clotureService.preparerCloture(poissonnerieId, date));
      this._preparation.set(response.data);
    } catch (error: any) {
      this._error.set(error.message || 'An error occurred while loading preparation.');
    } finally {
      this._isLoading.set(false);
    }
  }

  // DIRECTIVE: Implement loadHistorique(poissonnerieId: number)
  // 1. Set isLoading to true, error to null
  // 2. Call service.getHistorique
  // 3. Set _historique with result.data
  // 4. Handle errors and finally block
  async loadHistorique(poissonnerieId: number) {
    // YOUR CODE HERE
    this._isLoading.set(true);
    this._error.set(null);
    try {
      const response = await firstValueFrom(this.clotureService.getHistorique(poissonnerieId));
      this._historique.set(response.data);
    } catch (error: any) {
      this._error.set(error.message || 'An error occurred while loading historique.');
    } finally {
      this._isLoading.set(false);
    }
  }

  // DIRECTIVE: Implement submitCloture(request: ClotureJournaliereRequest)
  // 1. Set isLoading to true, error to null
  // 2. Call service.cloturer
  // 3. Reload the historique by calling this.loadHistorique(request.poissonnerieId)
  // 4. Handle errors and finally block
  async submitCloture(request: ClotureJournaliereRequest) {
    // YOUR CODE HERE
    this._isLoading.set(true);
    this._error.set(null);
    try {
      await firstValueFrom(this.clotureService.cloturer(request));
      await this.loadHistorique(request.poissonnerieId);
    } catch (error: any) {
      this._error.set(error.message || 'An error occurred while submitting cloture.');
    } finally {
      this._isLoading.set(false);
    }
  }
}