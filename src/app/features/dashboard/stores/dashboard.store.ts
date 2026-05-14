import { Injectable, inject, signal } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { StatistiquesPoissonnerieResponse } from '../../../core/models/statistiques.model';
import { firstValueFrom } from 'rxjs';
import { CompteCourantResponse } from '../../../core/models/compte-courant.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardStore {
  
  private dashboardService = inject(DashboardService);

  // --- STATE SIGNALS ---
  stats = signal<StatistiquesPoissonnerieResponse | null>(null);
  debtors = signal<CompteCourantResponse []>([]);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  // --- ACTIONS ---
  async loadStats(poissonnerieId: number) {
    // 1. TODO: Set isLoading to true, and error to null
    this.isLoading.set(true);
    this.error.set(null);

    try {
      // 2. TODO: Await the service call using firstValueFrom
      // Hint: const response = await firstValueFrom(this.dashboardService.getStats(poissonnerieId));
      const response = await firstValueFrom(this.dashboardService.getStats(poissonnerieId));
      const responseCompteCourant = await firstValueFrom(this.dashboardService.getDebtors(poissonnerieId));
      
      // 3. TODO: Update the stats signal with response.data, and set isLoading to false
      this.stats.set(response.data);
      this.debtors.set(responseCompteCourant.data);
      this.isLoading.set(false);

    } catch (err) {
      // 4. TODO: Set the error signal to a message, and set isLoading to false
      this.error.set('Failed to load statistics');
      this.isLoading.set(false);
    }
  }


}