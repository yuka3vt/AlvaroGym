// riwayat.service.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

export interface User {
  id: number;
  username: string;
  email: string;
  nama: string;
  telepon: string;
  image: string | null;
  role: string;
  gender: string;
  date_joined: string;
}

export interface Transaksi {
  id: number;
  invoice: string;
  user: User;
  nama: string;
  jenis: string;
  kategori: string;
  keterangan: string | null;
  jumlah: string;
  status: string;
  tanggal_transaksi: string;
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
export class RiwayatService {
  private apiUrl = `${environment.apiUrl}/api/user-riwayat/`;
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
        return this.getTransaksi(); 
      }),
      catchError(error => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('username');
        return throwError(error);
      })
    );
  }

  getTransaksi(): Observable<Transaksi[]> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ApiResponse<Transaksi[]>>(this.apiUrl, { headers }).pipe(
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
