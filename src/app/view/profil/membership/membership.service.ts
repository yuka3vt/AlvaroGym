import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';

export interface Membership {
  id: number;
  produk: {
    id: number;
    nama: string;
    deskripsi: string;
    tipe: string;
    durasi_hari: number;
    harga: number;
  };
  tanggal_mulai: string;
  tanggal_akhir: string;
}

interface ApiResponse<T> {
  status: string;
  status_code: number;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class MembershipService {
  private apiUrl = `${environment.apiUrl}/api/user-membership/`;
  private refreshTokenUrl = `${environment.apiUrl}/api/token/refresh/`;

  constructor(private http: HttpClient) { }
  private refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('username');
      return throwError('No refresh token found');
    }
    return this.http.post(this.refreshTokenUrl, { refresh: refreshToken }).pipe(
      switchMap((response: any) => {
        const newAccessToken = response.access;
        localStorage.setItem('access_token', newAccessToken);
        return this.getMembership(); 
      }),
      catchError(error => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('username');
        return throwError(error);
      })
    );
  }

  getMembership(): Observable<Membership> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ApiResponse<Membership>>(this.apiUrl, { headers }).pipe(
      map(response => response.data),
      catchError(error => {
        if (error.status === 401) { 
          return this.refreshToken().pipe(
            catchError(refreshError => {
              localStorage.removeItem('access_token');
              localStorage.removeItem('refresh_token');
              localStorage.removeItem('username');
              return throwError(refreshError);
            })
          );
        } else {
          return throwError(error);
        }
      })
    );
  }
}
