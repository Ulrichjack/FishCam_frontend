import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ApiResponse, PageResponse } from '../../../core/models/api-response.model';
import { PoissonnerieResponse } from '../../../core/models/PoissonnerieResponse.model';

@Injectable({ providedIn: 'root' })
export class PoissonnerieService {
  private http = inject(HttpClient);
  
  getAll() {
    // On met size=100 pour être sûr de toutes les récupérer d'un coup
    return this.http.get<ApiResponse<PageResponse<PoissonnerieResponse>>>(`${environment.apiUrl}/poissonneries?page=0&size=100`);
  }
}