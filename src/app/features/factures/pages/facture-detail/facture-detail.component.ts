import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { DatePipe, } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { firstValueFrom } from 'rxjs';
import { AchatJournalierService } from '../../services/achat-journalier.service';
import { AuthStore } from '../../../../core/stores/auth.store';
import { FactureDetailResponse } from '../../../../core/models/facture.model';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { LigneFormComponent } from '../../../../shared/components/ligne-form/ligne-form.component';
import { CurrencyFcfaPipe } from '../../../../shared/pipes/currency-fcfa.pipe';

@Component({
  selector: 'app-facture-detail',
  standalone: true,
  imports: [
    RouterLink, DatePipe, 
    LucideAngularModule, ConfirmDialogComponent, LigneFormComponent,CurrencyFcfaPipe
  ],
  templateUrl: './facture-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FactureDetailComponent {

  private readonly route = inject(ActivatedRoute);
  private readonly achatService = inject(AchatJournalierService);
  public readonly authStore = inject(AuthStore);

  // DIRECTIVE: Transforme les paramètres de la route en signal pour récupérer l'ID
  private readonly paramMap = toSignal(this.route.paramMap);

  // --- SIGNAUX D'ÉTAT ---
  facture = signal<FactureDetailResponse | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);
  isConfirmOpen = signal(false);
  showAddForm = signal(false);
  isDeleteConfirmOpen = signal(false);
  ligneToDelete = signal<number | null>(null);
  
  // YOUR CODE HERE (Signaux)

  constructor() {
    // DIRECTIVE: Utilise un effect() pour écouter les changements de paramMap().
    // Si un paramètre 'id' est présent, appelle this.loadFacture(Number(id)).
    // YOUR CODE HERE
    effect(() => {
      const idParam = this.paramMap()?.get('id');
      if (idParam) {
        this.loadFacture(Number(idParam));
      }
    });
  }

  async loadFacture(id: number) {
    // YOUR CODE HERE
    this.isLoading.set(true);
    this.error.set(null);
    try {
       const response = await firstValueFrom(this.achatService.getFactureDetail(id));
      this.facture.set(response.data);
    } catch (err) {
      this.error.set('Erreur lors du chargement de la facture');
    } finally {
      this.isLoading.set(false);
    }
  }

  // DIRECTIVE: Implémente openCloseDialog() qui ouvre la modale de confirmation
  openCloseDialog() {
    // YOUR CODE HERE
    this.isConfirmOpen.set(true);
  }

 
  async executeClose() {
    // YOUR CODE HERE
    const factureId = this.facture()?.id;
    if (!factureId) return;

    try {
      await firstValueFrom(this.achatService.cloturerFacture(factureId));
      await this.loadFacture(factureId);
    } catch (err) {
      this.error.set('Erreur lors de la clôture de la facture');
    } finally {
      this.isConfirmOpen.set(false);
    }
  }

  
  async downloadPdf() {
    const fact = this.facture();
    if (!fact) return;

    try {
      const blob = await firstValueFrom(this.achatService.downloadFacturePdf(fact.id));
      const url = window.URL.createObjectURL(blob);
      
      // 1. Nettoyer le nom du fournisseur (remplacer espaces par des tirets)
      const cleanFournisseur = fact.fournisseurNom.replace(/[^a-zA-Z0-9]/g, '_');
      
      // 2. Créer le beau nom de fichier
      const beauNom = `Facture_${cleanFournisseur}_${fact.dateAchat}.pdf`;
      
      const a = document.createElement('a');
      a.href = url;
      a.download = beauNom; // ✅ On utilise le beau nom ici !
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

    } catch(error) {
      this.error.set('Erreur lors du téléchargement du PDF');
    }
  }

  async onLigneAdded(ligneData: any) {
    const factureId = this.facture()?.id;
    if (!factureId) return;

    this.isLoading.set(true);
    try {
      await firstValueFrom(this.achatService.addLigne(factureId, ligneData));
      await this.loadFacture(factureId); // Recharge la facture pour voir la nouvelle ligne
    } catch (err) {
      this.error.set("Erreur lors de l'ajout de la ligne");
      this.isLoading.set(false);
    }
  }

  deleteLigne(ligneId: number) {
    this.ligneToDelete.set(ligneId);
    this.isDeleteConfirmOpen.set(true);
  }

  // 3. ADD THIS NEW METHOD:
  async executeDeleteLigne() {
    const factureId = this.facture()?.id;
    const ligneId = this.ligneToDelete();
    if (!factureId || !ligneId) return;

    this.isLoading.set(true);
    try {
      await firstValueFrom(this.achatService.deleteLigne(factureId, ligneId));
      await this.loadFacture(factureId);
    } catch (err) {
      this.error.set("Erreur lors de la suppression de la ligne");
    } finally {
      this.isDeleteConfirmOpen.set(false);
      this.ligneToDelete.set(null);
      this.isLoading.set(false);
    }
  }
  

  getTotalPoids(lignes: any[] | undefined): number {
    if (!lignes) return 0;
    return lignes.reduce((sum, ligne) => sum + ligne.poidsKg, 0);
  }

}