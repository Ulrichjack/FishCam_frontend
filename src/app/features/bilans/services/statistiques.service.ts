import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import { StatistiquesGlobalesResponse, StatistiquesPoissonnerieResponse } from '../../../core/models/statistiques.model';

@Injectable({ providedIn: 'root' })
export class StatistiquesService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/statistiques`;

  getDashboardStats(poissonnerieId: number, mois: number, annee: number) {
    return this.http.get<ApiResponse<StatistiquesPoissonnerieResponse>>(`${this.apiUrl}/poissonneries/${poissonnerieId}/dashboard`, { params: { mois, annee } });
  }

  getGlobalDashboardStats(mois: number, annee: number) {
    return this.http.get<ApiResponse<StatistiquesGlobalesResponse>>(`${this.apiUrl}/global`, { params: { mois, annee } });
  }
}
