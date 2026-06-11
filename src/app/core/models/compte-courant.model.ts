import { PoissonnerieResponse } from "./PoissonnerieResponse.model";
import { UserResponse } from "./user.model";

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

export interface TransactionCCResponse {
  id: number;
  type: TypeTransaction;
  montant: number;
  soldePrecedent: number;
  soldeApres: number;
  description: string;
  effectuePar: UserResponse;
  transactionDate: string;
  notes:string;
}

export enum StatutCompteCourant{
  ACTIF = 'ACTIF',
  EN_DETTE = 'EN_DETTE',
  BLOQUE = 'BLOQUE'
}

export enum TypeTransaction{
  EMPRUNT = 'EMPRUNT',
  REMBOURSEMENT = 'REMBOURSEMENT'
}