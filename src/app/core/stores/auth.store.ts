import { computed, Injectable, signal } from '@angular/core';
import { UserResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthStore {

  private currentUser = signal<UserResponse | null>(null);
  
  // NOUVEAU : Signal pour la boutique actuellement sélectionnée
  private currentPoissonnerieId = signal<number | null>(null);

  readonly user = this.currentUser.asReadonly();
  
  // NOUVEAU : On expose l'ID actif. S'il n'y en a pas, on prend celui par défaut du user.
  readonly activePoissonnerieId = computed(() => 
    this.currentPoissonnerieId() ?? this.currentUser()?.poissonnerieId ?? null
  );

  isLoggedIn = computed(()=> !!this.currentUser());
  isPatron = computed(() => this.currentUser()?.role === 'PATRON');
  isCaissiere = computed(() => this.currentUser()?.role === 'CAISSIERE');
  isEnregistreur = computed(() => this.currentUser()?.role === 'ENREGISTREUR');
  isSuperAdmin = computed(() => this.currentUser()?.role === 'SUPER_ADMIN');
  
  // NOUVEAU : Vérifie si l'utilisateur a le droit de voir plusieurs boutiques
  isMultiPoissonnerie = computed(() => this.currentUser()?.scope === 'MULTI_POISSONNERIE');

  constructor() {
    const savedUser = localStorage.getItem('fishcam_user');
    const savedPoissonnerieId = localStorage.getItem('fishcam_active_poissonnerie');
    
    if (savedUser) {
      try {
        this.currentUser.set(JSON.parse(savedUser));
        if (savedPoissonnerieId) {
          this.currentPoissonnerieId.set(Number(savedPoissonnerieId));
        }
      } catch (error) {
        console.error("Erreur de lecture du profil utilisateur :", error);
        this.logout();
      }
    }
  }

  public setUser(user: UserResponse){
    this.currentUser.set(user);
    this.currentPoissonnerieId.set(user.poissonnerieId); // Par défaut
    localStorage.setItem('fishcam_user', JSON.stringify(user));
    if (user.poissonnerieId) {
      localStorage.setItem('fishcam_active_poissonnerie', user.poissonnerieId.toString());
    }
  }

  // NOUVEAU : Méthode pour changer de boutique
  public setActivePoissonnerie(id: number) {
    this.currentPoissonnerieId.set(id);
    localStorage.setItem('fishcam_active_poissonnerie', id.toString());
    // Recharge la page pour appliquer les changements partout
    window.location.reload(); 
  }

  public logout(){
    this.currentUser.set(null);
    this.currentPoissonnerieId.set(null);
    localStorage.removeItem('fishcam_token');
    localStorage.removeItem('fishcam_user');
    localStorage.removeItem('fishcam_active_poissonnerie');
  }
}