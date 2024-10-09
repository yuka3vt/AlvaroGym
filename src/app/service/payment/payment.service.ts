import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private paymentApiUrl = environment.apiUrl + '/api/payment/';
  constructor(private http: HttpClient) { }
  createTransaction(transactionData: any): Observable<any> {
    return this.http.post(this.paymentApiUrl, transactionData);
  }
}
