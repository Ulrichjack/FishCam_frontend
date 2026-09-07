// ─── SKELETON: src/app/features/cloture/pages/cloture-page/cloture-page.component.ts ─────────

import { ChangeDetectionStrategy, Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { DatePipe,  NgClass } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ClotureStore } from '../../stores/cloture.store';
import { AuthStore } from '../../../../core/stores/auth.store';
import { CurrencyFcfaPipe } from '../../../../shared/pipes/currency-fcfa.pipe';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cloture-page',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    DatePipe, 
    CurrencyFcfaPipe, 
    LucideAngularModule,
    ConfirmDialogComponent,
    RouterLink,
    NgClass
  ],
  templateUrl: './cloture-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CloturePageComponent implements OnInit {
  
  readonly store = inject(ClotureStore);
  readonly authStore = inject(AuthStore);
  private readonly fb = inject(FormBuilder);

  // --- STATE SIGNALS ---
  readonly selectedDate = signal<string>(this.formatLocalDate(new Date()));
  readonly isConfirmOpen = signal(false);
  readonly isCorrectionMode = signal(false);
  readonly today = this.formatLocalDate(new Date());

  // --- FORM ---
  readonly clotureForm: FormGroup = this.fb.group({
    argentCaisse: [null, [Validators.required, Validators.min(0)]],
    fondDeCaisse: [null, [Validators.required, Validators.min(0)]],
    transport: [0, [Validators.min(0)]],
    ration: [0, [Validators.min(0)]],
    autresFrais: [0, [Validators.min(0)]],
    descriptionAutres: [''],
    motifCorrection: ['']
  });

  // DIRECTIVE: 1. Convert form.valueChanges to a signal using toSignal()
  // YOUR CODE HERE
  readonly formValues = toSignal(this.clotureForm.valueChanges, { initialValue: this.clotureForm.value });

  // --- COMPUTED ---
  // DIRECTIVE: 2. Calculate "venteRealisee" = argentCaisse - fondDeCaisse
  // Use this.formValues() to get the current values. If null/undefined, use 0.
  // YOUR CODE HERE
  readonly venteRealisee = computed(() => {
    const { argentCaisse, fondDeCaisse } = this.formValues();
    return (argentCaisse || 0) - (fondDeCaisse || 0);
  });

  // DIRECTIVE: 3. Calculate "ecart" = venteRealisee - totalVentePrevisible
  // Get totalVentePrevisible from this.store.preparation()
  // YOUR CODE HERE
  readonly ecart = computed(() => {
    const { argentCaisse, fondDeCaisse } = this.formValues();
    const preparation = this.store.preparation();
    
    const totalVentePrevisible = preparation ? preparation.totalVentePrevisible : 0;
    // 🟢 CORRECTION DU BUG : On récupère les dettes et remboursements
    const dettes = preparation ? preparation.montantDettesJour : 0;
    const remboursements = preparation ? preparation.montantRembourseJour : 0;

    // Le patron communique une recette brute qui inclut déjà l'argent utilisé pour les
    // dépenses. Celles-ci seront déduites du résultat, sans modifier la vente réalisée.
    const venteDeclaree = (argentCaisse || 0) - (fondDeCaisse || 0);
    const ventePrevisibleAjustee = totalVentePrevisible - dettes + remboursements;

    return venteDeclaree - ventePrevisibleAjustee;
  });

  // Ajoute ceci juste en dessous de "readonly ecart = computed(...)"
  readonly isAlreadyClosed = computed(() => !!this.store.selectedCloture());

  onPageChange(page: number) {
    const poissonnerieId = this.authStore.activePoissonnerieId();
    if (poissonnerieId) {
      this.store.loadPageData(poissonnerieId, this.selectedDate(), page);
    }
  }

  constructor() {
    // DIRECTIVE: 4. Use an effect to auto-fill "fondDeCaisse" when store.preparation() loads
    // If store.preparation() has data, patch the 'fondDeCaisse' form control with preparation.fondDeCaisseDefaut
    // YOUR CODE HERE
    effect(() => {
      const preparation = this.store.preparation();
      if (preparation && !this.isCorrectionMode() && !this.store.selectedCloture()) {
        this.clotureForm.patchValue({ fondDeCaisse: preparation.fondDeCaisseDefaut }, { emitEvent: false });
      }
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    const poissonnerieId = this.authStore.activePoissonnerieId();
    if (poissonnerieId) {
      this.store.loadPageData(poissonnerieId, this.selectedDate()); 
    }
  }

  onDateChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.selectedDate.set(target.value);
    this.cancelCorrection();
    this.loadData();
  }

  changeDate(delta: number): void {
    const [year, month, day] = this.selectedDate().split('-').map(Number);
    const next = new Date(year, month - 1, day + delta);
    const value = this.formatLocalDate(next);
    if (value > this.today) return;
    this.selectedDate.set(value);
    this.cancelCorrection();
    this.loadData();
  }

  selectHistoryDate(date: string): void {
    this.selectedDate.set(date.substring(0, 10));
    this.cancelCorrection();
    this.loadData();
  }

  startCorrection(): void {
    const c = this.store.selectedCloture(); if (!c) return;
    this.isCorrectionMode.set(true);
    this.clotureForm.patchValue({ argentCaisse:c.argentCaisse,fondDeCaisse:c.fondDeCaisse,transport:c.transport,ration:c.ration,autresFrais:c.autresFrais,descriptionAutres:c.descriptionAutres,motifCorrection:'' });
    this.clotureForm.get('motifCorrection')?.setValidators([Validators.required, Validators.minLength(5), Validators.maxLength(500)]);
    this.clotureForm.get('motifCorrection')?.updateValueAndValidity();
  }

  cancelCorrection(): void {
    this.isCorrectionMode.set(false);
    this.clotureForm.get('motifCorrection')?.clearValidators();
    this.clotureForm.get('motifCorrection')?.setValue('');
    this.clotureForm.get('motifCorrection')?.updateValueAndValidity();
  }

  openConfirm(): void {
    if (this.clotureForm.valid) {
      this.isConfirmOpen.set(true);
    } else {
      this.clotureForm.markAllAsTouched();
    }
  }

  async submitCloture() {
    const poissonnerieId = this.authStore.activePoissonnerieId();
    if (!poissonnerieId || this.clotureForm.invalid) return;
    const formValues = this.clotureForm.value;
    if (this.isCorrectionMode()) {
      const existing = this.store.selectedCloture(); if (!existing) return;
      await this.store.corrigerCloture(existing.id, { argentCaisse:formValues.argentCaisse, fondDeCaisse:formValues.fondDeCaisse, transport:formValues.transport, ration:formValues.ration, autresFrais:formValues.autresFrais, descriptionAutres:formValues.descriptionAutres, motifCorrection:formValues.motifCorrection }, poissonnerieId, this.selectedDate());
      this.isConfirmOpen.set(false); this.cancelCorrection(); return;
    }
    const request = {
      poissonnerieId,
      date: this.selectedDate(),
      argentCaisse: formValues.argentCaisse,
      fondDeCaisse: formValues.fondDeCaisse,
      transport: formValues.transport,
      ration: formValues.ration,
      autresFrais: formValues.autresFrais,
      descriptionAutres: formValues.descriptionAutres
    };
    await this.store.submitCloture(request);
    this.isConfirmOpen.set(false);
    // Reset form but keep fondDeCaisse
    this.clotureForm.reset({ fondDeCaisse: formValues.fondDeCaisse });  
  }

  private formatLocalDate(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
  }
}
