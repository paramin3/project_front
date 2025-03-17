import { 
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CartItem } from './cart-item.model'; // Ensure the path is correct

/**
 * Error Interceptor to catch HTTP errors globally
 */
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('HTTP Error:', error.message);
        return throwError(() => error);
      })
    );
  }
}

/**
 * Cart Service for managing cart operations
 */
@Injectable({
  providedIn: 'root',
})
export class CartService {
  private baseUrl = 'http://localhost:8081/api/cart';

  constructor(private http: HttpClient) {}

  /**
   * Fetch all cart items for the current user
   * @returns Observable<CartItem[]>
   */
  getCartItems(): Observable<CartItem[]> {
    return this.http
      .get<CartItem[]>(`${this.baseUrl}/products`, { withCredentials: true })
      .pipe(catchError(this.handleError));
  }

  /**
   * Add a product to the cart
   * @param productId - ID of the product to add
   * @param quantity - Quantity to add
   * @returns Observable<any>
   */
  addProductToCart(productId: number, quantity: number): Observable<any> {
    if (!quantity || quantity <= 0) {
      return throwError(() => new Error('Quantity must be greater than zero.'));
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const url = `${this.baseUrl}/products/${productId}?quantity=${quantity}`;

    return this.http
      .post(url, {}, { headers, withCredentials: true })
      .pipe(catchError(this.handleError));
  }

  /**
   * Update product quantity in the cart
   * @param productId - ID of the product
   * @param quantity - New quantity
   * @returns Observable<string>
   */
  updateProductQuantity(productId: number, quantity: number): Observable<string> {
    if (quantity <= 0) {
      return throwError(() => new Error('Quantity must be greater than zero.'));
    }

    return this.http
      .put(`${this.baseUrl}/products/${productId}`, { quantity }, {
        responseType: 'text', // Expect plain text response
        withCredentials: true,
      })
      .pipe(
        map((response) => response as string),
        catchError(this.handleError)
      );
  }

  /**
   * Remove a product from the cart
   * @param productId - ID of the product
   * @returns Observable<string>
   */
  removeProductFromCart(productId: number): Observable<string> {
    return this.http
      .delete(`${this.baseUrl}/products/${productId}`, {
        responseType: 'text', // Expect plain text response
        withCredentials: true,
      })
      .pipe(
        map((response) => response as string),
        catchError(this.handleError)
      );
  }

  /**
   * Validate cart stock for all items
   * @returns Observable<any>
   */
  validateCartStock(): Observable<any> {
    return this.http
      .get<any>(`${this.baseUrl}/validate-stock`, { withCredentials: true })
      .pipe(catchError(this.handleError));
  }

  /**
   * Global error handler for HTTP requests
   * @param error - Error response
   * @returns Observable<never>
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error.message || error);
    return throwError(() => new Error(error.message || 'Server Error'));
  }
}
