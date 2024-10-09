import { CommonModule } from '@angular/common';
import { Component, ElementRef, Renderer2, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../service/notification/notification.service';
declare var $: any
@Component({
  selector: 'app-bmi-kalkulator',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './bmi-kalkulator.component.html',
  styleUrl: './bmi-kalkulator.component.css'
})
export class BmiKalkulatorComponent implements AfterViewInit {
  height: number | null = null;
  weight: number | null = null;
  age: number | null = null;
  gender: string = '';
  bmi: number | null = null;
  bmiStatus: string = '';
  constructor(
    private el: ElementRef, 
    private renderer: Renderer2, 
    private notificationService: NotificationService) {}
  ngAfterViewInit() {
    this.setBackgroundImages('.set-bg');
  }
  private setBackgroundImages(selector: string) {
    const elements = this.el.nativeElement.querySelectorAll(selector);
    elements.forEach((element: HTMLElement) => {
      const bg = element.getAttribute('data-setbg');
      if (bg) {
        this.renderer.setStyle(element, 'background-image', `url(${bg})`);
      }
    });
  }
  calculateBMI(): void {
    if (this.height && this.weight) {
      const heightInMeters = this.height / 100;
      this.bmi = this.weight / (heightInMeters * heightInMeters);
      this.bmi = parseFloat(this.bmi.toFixed(1));

      if (this.bmi < 18.5) {
        this.bmiStatus = 'Kekurangan Berat Badan';
      } else if (this.bmi >= 18.5 && this.bmi < 24.9) {
        this.bmiStatus = 'Sehat';
      } else if (this.bmi >= 25.0 && this.bmi < 29.9) {
        this.bmiStatus = 'Kelebihan Berat Badan';
      } else {
        this.bmiStatus = 'Obesitas';
      }
      this.notificationService.showSuccess('Perhitungan Berhasil', `BMI Anda adalah ${this.bmi} (${this.bmiStatus})`);
    } else {
      this.notificationService.showError('Perhitungan Gagal', 'Silakan masukkan tinggi dan berat badan yang valid.');
    }
  }
}
