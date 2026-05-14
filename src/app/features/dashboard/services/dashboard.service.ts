import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import { StatistiquesPoissonnerieResponse } from '../../../core/models/statistiques.model';
import { CompteCourantResponse } from '../../../core/models/compte-courant.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/statistiques`;
  private readonly apiUrl1 = `${environment.apiUrl}/comptes-courants`;


  // TODO: Create a method called 'getStats' that takes a 'poissonnerieId: number' as a parameter.
  // It should return a GET request to: /poissonneries/{poissonnerieId}/dashboard
  // Remember to use the ApiResponse wrapper!
  
  // Write your code here:
  getStats(poissonnerieId: number) {
    return this.http.get<ApiResponse<StatistiquesPoissonnerieResponse>>(`${this.apiUrl}/poissonneries/${poissonnerieId}/dashboard`);    
  }

  getDebtors(poissonnerieId: number) {
    return this.http.get<ApiResponse<CompteCourantResponse[]>>(`${this.apiUrl1}/poissonnerie/${poissonnerieId}/en-dette`);    
  }
  
}