import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../service/Auth/auth.service';
declare var $: any;

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  userName: string | null = null;
  currentUrl: string = '';
  dropdownOpen: boolean = false;

  constructor(
    private router: Router,
    public authService: AuthService, 
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.urlAfterRedirects;
      }
    });
  }

  ngOnInit() {
    this.userName = localStorage.getItem('username');
    
    $('.mobile-menu').slicknav({
      prependTo: '#mobile-menu-wrap',
      allowParentLinks: true
    });

    const offcanvasMenuWrapper = document.querySelector('.offcanvas-menu-wrapper');
    const offcanvasMenuOverlay = document.querySelector('.offcanvas-menu-overlay');

    document.querySelector('.canvas-open')?.addEventListener('click', () => {
      offcanvasMenuWrapper?.classList.add('show-offcanvas-menu-wrapper');
      offcanvasMenuOverlay?.classList.add('active');
    });

    document.querySelector('.canvas-close')?.addEventListener('click', () => {
      offcanvasMenuWrapper?.classList.remove('show-offcanvas-menu-wrapper');
      offcanvasMenuOverlay?.classList.remove('active');
    });

    offcanvasMenuOverlay?.addEventListener('click', () => {
      offcanvasMenuWrapper?.classList.remove('show-offcanvas-menu-wrapper');
      offcanvasMenuOverlay?.classList.remove('active');
    });
  }

  isActive(routePath: string): boolean {
    return this.currentUrl.startsWith(routePath);
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/sign-in']);
  }
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }
}
