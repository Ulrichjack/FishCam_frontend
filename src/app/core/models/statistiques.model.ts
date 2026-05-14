import { PoissonnerieResponse } from "./PoissonnerieResponse.model";

export interface StatistiquesPoissonnerieResponse{
  poissonnerieResponse: PoissonnerieResponse;
  nombreClients: number;
  epargnes: StatistiquesEpargneResponse;
  courantResponse: StatistiquesCompteCourantResponse;
  topProduits: TopProduitResponse[];
  topDebiteurs: TopDebiteurResponse[];
  revenueMensuel : RevenueJournalierResponse[];
  topProduitsRentables:TopProduitRentableResponse[];



}


export interface StatistiquesEpargneResponse  {
     poissonnerieId: number;
     poissonnerieNom: string;
     nombreComptes : number;
     totalEpargne:number;
     moyenneParCompte: number;

}


export interface StatistiquesCompteCourantResponse {
  nombreComptesEnDette: number;
  totalDettes: number;

}

export interface TopProduitResponse {
  nomProduit: string;
  totalCartons: number;
  totalDepenses: number;
}

export interface TopDebiteurResponse{
  nomClient: string;
  telephone: string;
  montantDette: number;
}

export interface RevenueJournalierResponse{
  date: string;
  revenue: number;
}

export interface TopProduitRentableResponse{
  nomProduit: string;
  margeTotale: number;
}