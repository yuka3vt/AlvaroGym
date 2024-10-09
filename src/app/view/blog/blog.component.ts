import { Component, AfterViewInit, Renderer2, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';
import { BlogService } from '../../service/blog/blog.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
declare var $: any;
interface Kategori {
  nama: string;
  slug: string;
  jumlah_konten: number;
}
interface Blog {
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
    username: string;
    email: string;
  };
  category: {
    id: number;
    nama: string;
    slug: string;
  };
}
interface Pagination {
  page: number;
  total_pages: number;
  count?: number;
  results?: Blog[];
}
interface ApiResponse<T> {
  status: string;
  data?: T;
  pagination?: Pagination;
}
@Component({
  selector: 'app-blog',
  standalone: true,
  providers: [BlogService],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    FormsModule
  ],
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit, AfterViewInit {
  blogs: Blog[] = [];
  defaultImage: string = 'assets/img/about-us.jpg';
  kategoris: Kategori[] = [];
  kategoriSlug: string | null = null;
  currentPage: number = 1;
  totalPages: number = 0;
  searchQuery: string = '';
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private el: ElementRef,
    private renderer: Renderer2,
    private blogService: BlogService
  ) {}
  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.kategoriSlug = params.get('kategori');
      this.searchQuery = params.get('search') || '';
      const pageParam = params.get('page');
      this.currentPage = pageParam ? +pageParam : 1;
      this.fetchBlogs(this.kategoriSlug, this.currentPage, this.searchQuery);
    });
    
    this.blogService.getKategoris().subscribe(response => {
      if (response.status === 'success') {
        this.kategoris = response.data || [];
      } else {
        this.router.navigate(['/404']);
      }
    });
  }
  private fetchBlogs(kategoriSlug: string | null, page: number, searchQuery: string = ''): void {
    if (kategoriSlug) {
      this.blogService.getBlogsByKategori(kategoriSlug, page, searchQuery).subscribe(response => {
        if (response.status === 'success') {
          this.blogs = response.data.map(blog => ({
            ...blog,
            image: this.constructFullUrl(blog.image)
          })) || [];
          this.currentPage = response.pagination?.page || 1;
          this.totalPages = response.pagination?.total_pages || 1;
        } else {
          this.router.navigate(['/404']);
        }
      });
    } else {
      this.blogService.getBlogs(page, searchQuery).subscribe(response => {
        if (response.status === 'success') {
          this.blogs = response.data.map(blog => ({
            ...blog,
            image: this.constructFullUrl(blog.image)
          })) || [];
          this.currentPage = response.pagination?.page || 1;
          this.totalPages = response.pagination?.total_pages || 1;
        } else {
          this.router.navigate(['/404']);
        }
      });
    }
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
        320: { items: 1 },
        768: { items: 2 },
        992: { items: 3 }
      }
    });
  }
  private setBackgroundImages(selector: string): void {
    const elements = this.el.nativeElement.querySelectorAll(selector);
    elements.forEach((element: HTMLElement) => {
      const bg = element.getAttribute('data-setbg');
      if (bg) {
        this.renderer.setStyle(element, 'background-image', `url(${bg})`);
      }
    });
  }
  private initializeOwlCarousel(): void {
    $(document).ready(() => {
      $('.hs-slider').owlCarousel({
        items: 1,
        loop: true,
        autoplay: true,
        nav: true
      });
    });
  }
  private constructFullUrl(relativePath: string): string {
    return relativePath.startsWith('http') ? relativePath : `${environment.apiUrl}${relativePath}`;
  }
  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    const queryParams: { [key: string]: string } = { page: page.toString() };
    if (this.kategoriSlug) {
      queryParams['kategori'] = this.kategoriSlug;
    }
    if (this.searchQuery) {
      queryParams['search'] = this.searchQuery;
    }
    this.router.navigate([], { queryParams: queryParams }).then(() => {
      this.fetchBlogs(this.kategoriSlug, page, this.searchQuery);
    });
  }
  onSearch() {
    const queryParams: { [key: string]: string } = { page: '1', search: this.searchQuery };
    if (this.kategoriSlug) {
      queryParams['kategori'] = this.kategoriSlug;
    }
    this.router.navigate([], { queryParams: queryParams }).then(() => {
      this.fetchBlogs(this.kategoriSlug, 1, this.searchQuery);
    });
  }
  changeKategori(kategoriSlug: string | null): void {
    this.kategoriSlug = kategoriSlug;
    const queryParams: { [key: string]: string } = { page: '1' };
    if (this.kategoriSlug) {
      queryParams['kategori'] = this.kategoriSlug;
    }
    if (this.searchQuery) {
      queryParams['search'] = this.searchQuery;
    }
    this.router.navigate([], { queryParams: queryParams }).then(() => {
      this.fetchBlogs(this.kategoriSlug, 1, this.searchQuery);
    });
  }
  getImageUrl(imageUrl: string | undefined): string {
    return imageUrl ? imageUrl : this.defaultImage;
  }
}
