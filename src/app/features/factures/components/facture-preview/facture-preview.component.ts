import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DatePipe, DecimalPipe, NgClass } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-facture-preview',
  standalone: true,
  imports: [DatePipe, DecimalPipe, LucideAngularModule, NgClass],
  templateUrl: './facture-preview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FacturePreviewComponent {

  dateAchat = input.required<string>();
  fournisseurNom = input.required<string>();
  livreurNom = input<string | null>(null);
  lignes = input.required<any[]>();
  totalAchat = input.required<number>();
  totalVente = input.required<number>();
  benefice = input.required<number>();

}