import { computed, Injectable, signal } from '@angular/core';
import { User } from '../models/user.model';



@Injectable({
  providedIn: 'root',
})
export class AuthStore {

      private currentUser  = signal<User | null>(null);
      readonly user = this.currentUser.asReadonly();

      isLoggedIn = computed(()=> !!this.currentUser());
      isPatron =computed(() => this.currentUser()?.role === 'PATRON');
      isCaissiere = computed(() => this.currentUser()?.role === 'CAISSIERE');
      isEnregistreur = computed(() => this.currentUser()?.role === 'ENREGISTREUR');
      isSuperAdmin = computed(() => this.currentUser()?.role === 'SUPER_ADMIN');

      constructor() {
        // AU DÉMARRAGE : On vérifie si un utilisateur est déjà là (optionnel selon ton API)
        // Idéalement, on stockerait aussi l'objet User en JSON dans le localStorage
        const savedUser = localStorage.getItem('fishcam_user');
        if (savedUser) {
          try {
            this.currentUser.set(JSON.parse(savedUser));
          } catch (error) {
            console.error("Erreur de lecture du profil utilisateur :", error);
            this.logout(); // On nettoie tout si c'est corrompu
          }
        }
      }

      public setUser(user: User){
          this.currentUser.set(user);
          localStorage.setItem('fishcam_user', JSON.stringify(user));
      }

      public logout(){
            this.currentUser.set(null);
            localStorage.removeItem('fishcam_token');
            localStorage.removeItem('fishcam_user');
      }

}
