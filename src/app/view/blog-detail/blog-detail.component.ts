import { Component, AfterViewInit, Renderer2, ElementRef, OnInit } from '@angular/core';
import { BlogService } from '../../service/blog/blog.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
declare var $: any

export interface Blog {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  image: string;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    nama: string;
    username: string;
    email: string;
    telepon:string;
    image: string;
  };
  category: {
    id: number;
    nama: string;
    slug: string;
  };
}

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  providers: [BlogService],
  imports: [
    HttpClientModule,
    CommonModule,
    RouterModule
  ],
  templateUrl: './blog-detail.component.html',
  styleUrl: './blog-detail.component.css'
})
export class BlogDetailComponent implements AfterViewInit, OnInit {
  blog: Blog | undefined;
  constructor(
    private el: ElementRef, 
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private blogService: BlogService,
    private router: Router,
  ) {}
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (slug) {
        this.blogService.getBlogBySlug(slug).subscribe(blog => {
          const baseUrl = environment.apiUrl;
          blog.image = this.constructFullUrl(blog.image, baseUrl);
          if (blog.user && blog.user.image) {
            blog.user.image =  blog.user.image ? this.constructFullUrl( blog.user.image, baseUrl) : 'assets/img/coach/coach-default.jpg';
          }
          this.blog = blog;
        }, error => {
          this.router.navigate(['/404']);
        });
      }
    });
  }
  private constructFullUrl(relativePath: string, baseUrl: string): string {
    return relativePath.startsWith('http') ? relativePath : `${baseUrl}${relativePath}`;
  }
  ngAfterViewInit() {
    this.setBackgroundImages('.set-bg');
    this.initializeOwlCarousel();
    
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
    $(document).ready(function(){
      $('.hs-slider').owlCarousel({
        items: 1,
        loop: true,
        autoplay: true,
        nav: true
      });
    });
  }
}
