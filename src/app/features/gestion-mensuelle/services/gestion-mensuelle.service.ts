import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import { ChargeGestion, CreateChargeGestionRequest, ReleveSituation, ResultatAnnuel, ResultatMensuelGlobal, SaveReleveSituationRequest } from '../../../core/models/gestion-mensuelle.model';
@Injectable({providedIn:'root'})
export class GestionMensuelleService {
  private readonly http=inject(HttpClient); private readonly api=environment.apiUrl;
  resultatGlobal(mois:number,annee:number){return this.http.get<ApiResponse<ResultatMensuelGlobal>>(`${this.api}/resultats-mensuels/global`,{params:{mois,annee}});}
  resultatAnnuel(annee:number){return this.http.get<ApiResponse<ResultatAnnuel>>(`${this.api}/resultats-mensuels/annuel`,{params:{annee}});}
  charges(mois:number,annee:number,poissonnerieId?:number){let params=new HttpParams().set('mois',mois).set('annee',annee);if(poissonnerieId)params=params.set('poissonnerieId',poissonnerieId);return this.http.get<ApiResponse<ChargeGestion[]>>(`${this.api}/charges-gestion`,{params});}
  creerCharge(request:CreateChargeGestionRequest){return this.http.post<ApiResponse<ChargeGestion>>(`${this.api}/charges-gestion`,request);}
  modifierCharge(id:number,request:CreateChargeGestionRequest){return this.http.put<ApiResponse<ChargeGestion>>(`${this.api}/charges-gestion/${id}`,request);}
  supprimerCharge(id:number){return this.http.delete<ApiResponse<ChargeGestion>>(`${this.api}/charges-gestion/${id}`);}
  enregistrerReleve(request:SaveReleveSituationRequest){return this.http.post<ApiResponse<ReleveSituation>>(`${this.api}/releves-mensuels`,request);}
  telechargerPdf(mois:number,annee:number){return this.http.get(`${this.api}/exports/resultat-mensuel/pdf`,{params:{mois,annee},responseType:'blob'});}
}
