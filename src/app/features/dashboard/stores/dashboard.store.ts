import { Injectable, inject, signal, computed } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { StatistiquesPoissonnerieResponse } from '../../../core/models/statistiques.model';
import { CompteCourantResponse } from '../../../core/models/compte-courant.model';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardStore {

  private dashboardService = inject(DashboardService);

  // --- STATE SIGNALS ---
  private readonly _stats = signal<StatistiquesPoissonnerieResponse | null>(null);
  private readonly _debtors = signal<CompteCourantResponse[]>([]);
  private readonly _isLoading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  readonly stats = this._stats.asReadonly();
  readonly debtors = this._debtors.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  // --- COMPUTED SIGNALS ---
  // 3. ADDED: This automatically finds the daily report!


  // --- ACTIONS ---
  // 4. ADDED: We now require userId as a parameter
  async loadStats(poissonnerieId: number) {
    this._isLoading.set(true);
    this._error.set(null);

    try {
      const [statsResponse, debtorsResponse, ] = await Promise.all([
        firstValueFrom(this.dashboardService.getStats(poissonnerieId)),
        firstValueFrom(this.dashboardService.getDebtors(poissonnerieId)),

      ]);


      this._stats.set(statsResponse.data);
      this._debtors.set(debtorsResponse.data);


    } catch (err) {
      this._error.set('Failed to load dashboard data');
    } finally {
      this._isLoading.set(false);
    }
  }


}

