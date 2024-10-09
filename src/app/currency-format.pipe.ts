import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyFormat',
  standalone: true
})
export class CurrencyFormatPipe implements PipeTransform {
  formattedValue: any
  transform(value: number | string): string {
    if (typeof value === 'string') {
      value = parseFloat(value);
    }

    if (isNaN(value)) {
      return 'Invalid amount';
    }

    this.formattedValue = value.toLocaleString('id-ID', { 
      style: 'currency', 
      currency: 'IDR', 
      minimumFractionDigits: 0, 
      maximumFractionDigits: 0 
    });

    this.formattedValue = value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return 'Rp. ' + this.formattedValue ;
  }
}
