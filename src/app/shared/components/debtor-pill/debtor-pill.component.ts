import { Component, computed, input } from '@angular/core';
import { NgClass } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { CompteCourantResponse } from '../../../core/models/compte-courant.model';

@Component({
  selector: 'app-debtor-pill',
  standalone: true,
  imports: [NgClass, LucideAngularModule],
  templateUrl: './debtor-pill.component.html',
})
export class DebtorPillComponent {
  
  // We receive one debtor from the parent
  debtor = input.required<CompteCourantResponse>();

  // We calculate the color dynamically based on the debt amount!
  colorClasses = computed(() => {
    const solde = this.debtor().solde;
    const limit = this.debtor().limiteCreditMax;

    if (solde < -limit) {
      // BEYOND LIMIT: Dark Red + Pulse animation
      return 'bg-fc-red text-white border-2 border-fc-red-dark animate-pulse';
    } else if (solde <= -5000) {
      // TIER 2: Red
      return 'bg-fc-red-light text-fc-red border border-fc-red';
    } else {
      // TIER 1: Orange/Yellow
      return 'bg-fc-yellow-light text-fc-yellow-dark border border-fc-yellow';
    }
  });
}