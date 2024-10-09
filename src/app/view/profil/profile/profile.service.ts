import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

interface UserProfile {
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

interface ApiResponse<T> {
  status: string;
  status_code: number;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = `${environment.apiUrl}/api/profile/`;
  private refreshTokenUrl = `${environment.apiUrl}/api/token/refresh/`;

  constructor(private http: HttpClient) { }

  getUserProfile(): Observable<ApiResponse<UserProfile>> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ApiResponse<UserProfile>>(this.apiUrl, { headers }).pipe(
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

  updateUserProfile(data: any): Observable<ApiResponse<any>> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.put<ApiResponse<any>>(this.apiUrl, data, { headers });
  }

  private refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('username');
      return throwError('No refresh token found');
    }
    return this.http.post<any>(this.refreshTokenUrl, { refresh: refreshToken }).pipe(
      switchMap((response: any) => {
        const newAccessToken = response.access;
        localStorage.setItem('access_token', newAccessToken);
        return this.getUserProfile(); 
      }),
      catchError(error => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('username');
        return throwError(error);
      })
    );
  }
}
