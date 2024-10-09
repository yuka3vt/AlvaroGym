import { Component, ElementRef, Renderer2, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProdukService } from '../../service/produk/produk.service';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment';

declare var $: any

export interface User {
  id: number;
  nama: string;
  image: string | null;
}
@Component({
  selector: 'app-tentang-kami',
  standalone: true,
  providers: [ProdukService],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  templateUrl: './tentang-kami.component.html',
  styleUrl: './tentang-kami.component.css'
})
export class TentangKamiComponent implements AfterViewInit {
  coaches: User[] = [];
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private produkService: ProdukService,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnInit() {
    this.produkService.getCoaches().subscribe(response => {
      if (response.status === 'success') {
        const baseUrl = environment.apiUrl;
        this.coaches = response.data.map((coach: User) => {
          coach.image = coach.image ? this.constructFullUrl(coach.image, baseUrl) : 'assets/img/coach/coach-default.jpg';
          return coach;
        });
        this.cdr.detectChanges();
        this.initializeOwlCarousel();
      }
    });
  }

  private constructFullUrl(imagePath: string, baseUrl: string): string {
    return `${baseUrl}${imagePath}`;
  }
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
  private initializeOwlCarousel() {
    $('.ts-slider').owlCarousel({
      loop: true,
      margin: 0,
      items: 3,
      dots: true,
      dotsEach: 2,
      smartSpeed: 1200,
      autoHeight: false,
      autoplay: true,
      responsive: {
        320: {
          items: 1,
        },
        768: {
          items: 2,
        },
        992: {
          items: 3,
        }
      }
    });
  }
}
