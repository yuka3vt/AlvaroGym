import { Component, ElementRef, Renderer2, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
declare var $: any
@Component({
  selector: 'app-hubungi',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './hubungi.component.html',
  styleUrl: './hubungi.component.css'
})
export class HubungiComponent implements AfterViewInit {
  name: string = '';
  email: string = '';
  website: string = '';
  comment: string = '';
  constructor(private el: ElementRef, private renderer: Renderer2) {}
  onSubmit(): void {
    const subject = encodeURIComponent('Pesan dari ' + this.name);
    const body = encodeURIComponent(`Nama: ${this.name}\nEmail: ${this.email}\nSitus Web: ${this.website}\n\nKomentar:\n${this.comment}`);
    window.location.href = `mailto:support.gymcenter@gmail.com?subject=${subject}&body=${body}`;
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
}
