import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

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
    nama: string;
    username: string;
    email: string;
    telepon: string;
    image: string;
  };
  category: {
    id: number;
    nama: string;
    slug: string;
  };
}
interface ApiResponse<T> {
  status: string;
  data: T;
  pagination?: {
    page: number;
    total_pages: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private blog = environment.apiUrl + '/api/blog/';
  private kategori = environment.apiUrl + '/api/blog-kategori/';
  constructor(private http: HttpClient) { }
  getBlogs(page: number = 1, searchQuery: string = ''): Observable<ApiResponse<Blog[]>> {
    const url = `${this.blog}?page=${page}${searchQuery ? `&search=${searchQuery}` : ''}`;
    return this.http.get<ApiResponse<Blog[]>>(url);
  }
  getKategoris(): Observable<ApiResponse<Kategori[]>> {
    return this.http.get<ApiResponse<Kategori[]>>(this.kategori);
  }
  getBlogsByKategori(slug: string, page: number = 1, searchQuery: string = ''): Observable<ApiResponse<Blog[]>> {
    const url = `${this.blog}?kategori=${slug}&page=${page}${searchQuery ? `&search=${searchQuery}` : ''}`;
    return this.http.get<ApiResponse<Blog[]>>(url);
  }
  getBlogBySlug(slug: string): Observable<Blog> {
    return this.http.get<ApiResponse<Blog>>(`${this.blog}${slug}`).pipe(
      map(response => response.data)
    );
  }
}
