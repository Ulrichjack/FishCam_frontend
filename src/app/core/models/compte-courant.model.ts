import { PoissonnerieResponse } from "./PoissonnerieResponse.model";

export interface CompteCourantResponse {
  id: number;
  client: ClientResponse;
  solde: number;
  limiteCreditMax: number;
  statut:StatutCompteCourant;
  dateOuverture: string;
  updatedAt: string;

}


export interface ClientResponse{
  id:number;
  firstName:string;
  lastName:string;
  phone:string;
  address:string;
  quartier:string;
  poissonnerie:PoissonnerieResponse;
  active: boolean;
  createdAt: string;
  soldeCompteCourant?: number;
}

export enum StatutCompteCourant{
  ACTIF = 'ACTIF',
  EN_DETTE = 'EN_DETTE',
  BLOQUE = 'BLOQUE'
}