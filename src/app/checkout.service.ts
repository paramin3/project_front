import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environment';
@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private baseUrl = `${environment.apiBaseUrl}/api/orders`;

  constructor(private http: HttpClient) {}

  confirmOrder(formData: FormData): Observable<any> {
    return this.http.post(this.baseUrl, formData, {
      withCredentials: true
    });
  }
  submitOrder(orderData: FormData): Observable<any> {
    return this.http.post<any>('/api/orders', orderData);
  }
}
