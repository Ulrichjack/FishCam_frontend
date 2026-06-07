
export interface FactureResponse {
   id:number;
   poissonnerieId: number;
   fournisseurId: number;
   enregistreParId: number;
   dateAchat: string;
   poissonnerieNom: string;
   fournisseurNom: string;
   enregistreParNom: string;
   cloture: boolean;
   createdAt: string;
   totalAchat?: number;
}