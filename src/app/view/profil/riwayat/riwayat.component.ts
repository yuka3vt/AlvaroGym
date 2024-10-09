import { Component, OnInit } from '@angular/core';
import { RiwayatService, Transaksi } from './riwayat.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CurrencyFormatPipe } from '../../../currency-format.pipe';

@Component({
  selector: 'app-riwayat',
  standalone: true,
  providers:[
    RiwayatService,
    HttpClientModule
  ],
  imports: [
    CommonModule,
    CurrencyFormatPipe
  ],
  templateUrl: './riwayat.component.html',
  styleUrl: './riwayat.component.css'
})
export class RiwayatComponent implements OnInit {
  transaksiList: Transaksi[] = [];
  errorMessage: string | null = null;

  constructor(private riwayatService: RiwayatService) { }

  ngOnInit(): void {
    this.riwayatService.getTransaksi().subscribe(
      (data: Transaksi[]) => {
        this.transaksiList = data;
      },
      (error: any) => {
        this.errorMessage = 'Failed to load transaction data';
        console.error(error);
      }
    );
  }
}