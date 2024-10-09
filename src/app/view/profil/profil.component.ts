import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Renderer2 } from '@angular/core';
import { MembershipComponent } from './membership/membership.component';
import { RiwayatComponent } from './riwayat/riwayat.component';
import { TrainerComponent } from './trainer/trainer.component';
import { ProfileComponent } from './profile/profile.component';

declare var $: any
@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [
    CommonModule,
    MembershipComponent,
    ProfileComponent,
    RiwayatComponent,
    TrainerComponent
  ],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.css'
})
export class ProfilComponent implements AfterViewInit {
  selectedMenu: string = 'Profile';
  selectedMenuTitle: string = 'Profil';
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
  selectMenu(menu: string) {
    this.selectedMenu = menu;
    switch(menu) {
      case 'Profile':
        this.selectedMenuTitle = 'Profil';
        break;
      case 'Membership':
        this.selectedMenuTitle = 'Membership';
        break;
      case 'Trainer':
        this.selectedMenuTitle = 'Trainer';
        break;
      case 'Riwayat':
        this.selectedMenuTitle = 'Riwayat Transaksi';
        break;
    }
  }
}