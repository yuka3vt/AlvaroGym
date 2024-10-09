import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProdukService {
  private memberApiUrl = environment.apiUrl + '/api/membership-produk/';
  private trainerApiUrl = environment.apiUrl + '/api/trainer-produk/';
  private coachApiUrl = environment.apiUrl + '/api/coach/';
  private usersApiUrl = environment.apiUrl + '/api/users/';
  constructor(private http: HttpClient) { }
  getMembershipProduk(): Observable<any> {
    return this.http.get<any>(this.memberApiUrl);
  }
  getTrainerProduk(): Observable<any> {
    return this.http.get<any>(this.trainerApiUrl);
  }
  getCoaches(): Observable<any> {
    return this.http.get<any>(this.coachApiUrl);
  }
  getUsers(): Observable<any> {
    return this.http.get<any>(this.usersApiUrl);
  }
}
