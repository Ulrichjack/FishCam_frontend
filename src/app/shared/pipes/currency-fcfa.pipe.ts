import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyFcfa',
  standalone: true,
  pure: true
})
export class CurrencyFcfaPipe implements PipeTransform {
  transform(value: number | null | undefined): string {

    if (value == null) {
      return '0 FCFA';
    }
    return value.toLocaleString('fr-FR') + ' FCFA';
  }
}