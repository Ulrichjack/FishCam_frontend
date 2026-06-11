

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import { TransactionCCResponse } from '../../../core/models/compte-courant.model';

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/comptes-courants`;

  
  getTransactionsByDate(poissonnerieId: number, date: string) {
    return this.http.get<ApiResponse<TransactionCCResponse[]>>(
      `${this.apiUrl}/poissonnerie/${poissonnerieId}/transactions?date=${date}`
    );
  }

  


}