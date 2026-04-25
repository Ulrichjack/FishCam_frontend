export interface User {
  id:number;
  phone:string;
  firstName:string;
  lastName:string;
  role: 'SUPER_ADMIN' | 'PATRON' | 'CAISSIERE' | 'ENREGISTREUR';
  poissonnerieId: number | null; 
  poissonnerieName: string | null;
}
