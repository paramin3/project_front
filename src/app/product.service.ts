import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from './product.model'; // นำเข้า Product model ที่คุณสร้างไว้
import { environment } from './environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = `${environment.apiBaseUrl}/api/products`; // URL ของ API สำหรับสินค้า
   private baseUrl = `${environment.apiBaseUrl}/api/cart`; // URL ของ API สำหรับ Cart

  constructor(private http: HttpClient) {}

  // ฟังก์ชันสำหรับดึงสินค้าทั้งหมด
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  // ฟังก์ชันสำหรับดึงรายละเอียดสินค้าตาม ID
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  // ฟังก์ชันสำหรับเพิ่มสินค้าเข้า Cart
addToCart(productId: number): Observable<any> {
  return this.http.post(`${this.cartUrl}/add`, { productId }, { withCredentials: true });
}
checkStock(productId: number, quantity: number): Observable<any> {
  return this.http.get<any>(`/api/products/${productId}/check-stock?quantity=${quantity}`);
}
}
