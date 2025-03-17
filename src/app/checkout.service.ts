import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private baseUrl = 'http://localhost:8081/api/orders';

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