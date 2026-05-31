import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import { StatistiquesPoissonnerieResponse } from '../../../core/models/statistiques.model';
import { CompteCourantResponse } from '../../../core/models/compte-courant.model';
import { NotificationResponse } from '../../../core/models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private readonly http = inject(HttpClient);
  //private readonly apiUrl = `${environment.apiUrl}/statistiques`;

  // TODO: Create a method called 'getStats' that takes a 'poissonnerieId: number' as a parameter.
  // It should return a GET request to: /poissonneries/{poissonnerieId}/dashboard
  // Remember to use the ApiResponse wrapper!

  // Write your code here:
  getStats(poissonnerieId: number) {
    return this.http.get<ApiResponse<StatistiquesPoissonnerieResponse>>(`${environment.apiUrl}/statistiques/poissonneries/${poissonnerieId}/dashboard`);
  }

  getDebtors(poissonnerieId: number) {
    return this.http.get<ApiResponse<CompteCourantResponse[]>>(`${environment.apiUrl}/comptes-courants/poissonnerie/${poissonnerieId}/en-dette`);
  }

 

}
