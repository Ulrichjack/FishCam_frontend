import { UserResponse } from "./user.model";

export interface TransactionGlobalResponse{
  id: string;
  dateHeure: string;
  clientNom: string;
  clientTelephone: string;
  type: 'EMPRUNT' | 'DETTE_INITIALE' | 'ANNULATION_DETTE_INITIALE' | 'REMBOURSEMENT' | 'DEPOT' | 'RETRAIT';
  montant: number;
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
  dateDetteOrigine?: string;
  transactionOrigineId?: number;
  annulee?: boolean;
  notes:string;
}



export enum TypeTransaction{
  EMPRUNT = 'EMPRUNT',
  DETTE_INITIALE = 'DETTE_INITIALE',
  ANNULATION_DETTE_INITIALE = 'ANNULATION_DETTE_INITIALE',
  REMBOURSEMENT = 'REMBOURSEMENT'
}
