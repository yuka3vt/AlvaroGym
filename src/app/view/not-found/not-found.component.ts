import { Component, ElementRef, Renderer2 } from '@angular/core';
declare var $: any
@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css'
})
export class NotFoundComponent {

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {}
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
