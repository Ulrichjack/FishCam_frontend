import { inject, Injectable, signal } from "@angular/core";
import { DashboardService } from "../../dashboard/services/dashboard.service";
import { CompteCourantResponse } from "../../../core/models/compte-courant.model";
import { firstValueFrom } from "rxjs";

@Injectable({ providedIn: 'root' })
export class DettesStore {
  private readonly dashboardService = inject(DashboardService);

  // --- STATE SIGNALS ---
  private readonly _debtors = signal<CompteCourantResponse[]>([]);
  private readonly _isLoading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  // --- READONLY SIGNALS ---
  readonly debtors = this._debtors.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  // --- ACTIONS ---
  async loadDebtors(poissonnerieId: number) {
    this._isLoading.set(true);
    this._error.set(null);
    try {
      const response = await firstValueFrom(this.dashboardService.getDebtors(poissonnerieId));
      this._debtors.set(response.data);
    } catch (err) {
      console.error("Error loading debtors:", err);
      this._error.set("Failed to load debtors. Please try again.");
    } finally {
      this._isLoading.set(false);
    }
  }
}