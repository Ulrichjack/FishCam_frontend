import { ChangeDetectionStrategy, Component, inject, effect, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop'; // <-- IMPORT THIS
import { LucideAngularModule } from 'lucide-angular';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ClientStore } from '../../stores/client.store';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { TransactionFormComponent } from '../../../../shared/components/transaction-form/transaction-form.component';
import { AuthStore } from '../../../../core/stores/auth.store';
import { CurrencyFcfaPipe } from '../../../../shared/pipes/currency-fcfa.pipe';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TransactionCCResponse } from '../../../../core/models/transaction.model';

@Component({
  selector: 'app-client-detail',
  standalone: true,
  imports: [LucideAngularModule, RouterLink, DatePipe,
            ModalComponent, TransactionFormComponent,
            CurrencyFcfaPipe, ReactiveFormsModule],
  templateUrl: './client-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientDetailComponent {

  readonly clientStore = inject(ClientStore);
  private readonly route = inject(ActivatedRoute);
  public readonly authStore = inject(AuthStore);
  private readonly fb = inject(FormBuilder);

  // DIRECTIVE: Convert route params to a Signal
  private readonly paramMap = toSignal(this.route.paramMap);

  // Modal state
  isModalOpen = signal<boolean>(false);
  modalTitle = signal<string>('');
  modalError = signal<string | null>(null);
  correctionDetteOpen = signal(false);
  transactionACorriger = signal<TransactionCCResponse | null>(null);
  correctionError = signal<string | null>(null);
  readonly today = this.formatDate(new Date());
  readonly correctionForm = this.fb.group({
    nouveauMontant: [null as number | null, [Validators.required, Validators.min(0)]],
    nouvelleDateDetteOrigine: [''],
    motif: ['', [Validators.required, Validators.maxLength(500)]]
  });

  // Controls which tab is visible: 'courant' or 'epargne'
  activeTab = signal<'courant' | 'epargne'>('courant');

  currentAction = signal<'emprunt' | 'dette-initiale' | 'remboursement' | 'depot' | 'retrait' | 'limite' | null>(null);

  constructor() {
    // DIRECTIVE: Use effect to reactively load the client when the ID changes
    effect(() => {
      const idParam = this.paramMap()?.get('id');
      if (idParam) {
        this.clientStore.loadClientDetail(Number(idParam));
      }
    });

    // DIRECTIVE: Ajoute un NOUVEL effet réactif pour charger l'historique
    // 1. Récupère le client via this.clientStore.selectedClient()
    // 2. Récupère l'onglet actif via this.activeTab()
    // 3. Si on a un client ET que l'onglet est 'courant' ET qu'il a un compteCourantId
    //    -> Appelle this.clientStore.loadCompteCourantDetail(...)
    // 4. Sinon, si l'onglet est 'epargne' ET qu'il a un epargneId
    //    -> Appelle this.clientStore.loadEpargneDetail(...)
    effect(() => {
      // YOUR CODE HERE
      const client = this.clientStore.selectedClient();
      const tab = this.activeTab();

      if (client) {
        if (tab === 'courant' && client.compteCourantId) {
          this.clientStore.loadCompteCourantDetail(client.compteCourantId);
        } else if (tab === 'epargne' && client.epargneId) {
          this.clientStore.loadEpargneDetail(client.epargneId);
        }
      }
    });
  }

  setTab(tab: 'courant' | 'epargne') {
    this.activeTab.set(tab);
  }

  openTransactionModal(action: 'emprunt' | 'dette-initiale' | 'remboursement' | 'depot' | 'retrait' | 'limite', title: string) {
    this.currentAction.set(action);
    this.modalTitle.set(title);
    this.modalError.set(null);
    this.isModalOpen.set(true);
  }

  async onSaveTransaction(data: { amount: number, notes: string, dateDetteOrigine?: string }) {
    const clientId = this.clientStore.selectedClient()?.id;
    if (!clientId) return;

    const action = this.currentAction();

    try {
      if (action === 'limite') {
        await this.clientStore.modifierLimite(data.amount);
      } else {
        await this.clientStore.executeTransaction(action!, data.amount, data.notes, data.dateDetteOrigine);
      }

      this.isModalOpen.set(false);
      // The effect() won't trigger here because the ID didn't change in the URL,
      // so we still need to call loadClientDetail manually to refresh the data.
      await this.clientStore.loadClientDetail(clientId);
    } catch (error: any) {
      console.error('Transaction failed', error);
      const msg = error.error?.message || 'Une erreur est survenue.';
      this.modalError.set(msg);
    }
  }

  ouvrirCorrectionDette(transaction:TransactionCCResponse){
    this.transactionACorriger.set(transaction);
    this.correctionError.set(null);
    this.correctionForm.reset({nouveauMontant:transaction.montant,nouvelleDateDetteOrigine:transaction.dateDetteOrigine||'',motif:''});
    this.correctionDetteOpen.set(true);
  }

  fermerCorrectionDette(){
    this.correctionDetteOpen.set(false);
    this.transactionACorriger.set(null);
    this.correctionError.set(null);
  }

  async corrigerDette(){
    const transaction=this.transactionACorriger();
    if(!transaction||this.correctionForm.invalid){this.correctionForm.markAllAsTouched();return;}
    const valeur=this.correctionForm.getRawValue();
    try{
      await this.clientStore.corrigerDetteInitiale(transaction.id,valeur.nouveauMontant!,valeur.nouvelleDateDetteOrigine||undefined,valeur.motif!);
      this.fermerCorrectionDette();
    }catch(error:any){
      this.correctionError.set(error.error?.message||'La correction n’a pas pu être enregistrée.');
    }
  }

  libelleTransaction(type:string){
    if(type==='DETTE_INITIALE')return 'DETTE DU CAHIER';
    if(type==='ANNULATION_DETTE_INITIALE')return 'ANNULATION';
    return type;
  }

  signeTransaction(type:string){return type==='REMBOURSEMENT'||type==='ANNULATION_DETTE_INITIALE'?'+':'-';}

  // DIRECTIVE: Implémente la méthode pour le bouton PDF
  // 1. Récupère l'epargneId du client sélectionné
  // 2. S'il existe, appelle this.clientStore.downloadEpargnePdf(epargneId)
  downloadEpargnePdf() {
    // YOUR CODE HERE
    const epargneId = this.clientStore.selectedClient()?.epargneId;
    if (epargneId) {
      this.clientStore.downloadEpargnePdf(epargneId);
    }
  }

  private formatDate(date:Date){return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;}
}
