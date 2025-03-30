import { Injectable } from '@angular/core';       
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap, map } from 'rxjs/operators'; 
import { environment } from './environment';
import { catchError } from 'rxjs/operators';

interface LoginResponse {
  message: string;
  username: string;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = environment.apiBaseUrl;
  private loginStatusSubject = new BehaviorSubject<boolean>(this.hasValidToken());
  public loginStatus$ = this.loginStatusSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.baseUrl}/api/users/login`,
      { username, password }, 
      { withCredentials: true }
    )
  }

  getProtectedData(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/protected-data`, {
      headers: { 'Authorization': `Bearer ${this.getToken()}` },
      withCredentials: true
    });
  }

getCurrentUser(): Observable<string> {
  return this.http.get(`${this.baseUrl}/api/users/current-user`, { 
    responseType: 'text',
    withCredentials: true // Sends JSESSIONID cookie
  }).pipe(
    catchError(error => {
      console.error('Error fetching current user:', error);
      if (error.status === 401) {
        this.logout(); // Clear session if unauthorized
      }
      return throwError(() => new Error('Failed to fetch current user'));
    })
  );
}

  logout(): Observable<boolean> {
    return this.http.post(`${this.baseUrl}/api/users/logout`, {}, {
      headers: { 'Authorization': `Bearer ${this.getToken()}` },
      withCredentials: true
    })
      .pipe(
        tap(() => {
          this.clearUserData();
        }),
        map(() => true)
      );
  }

  clearUserData() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('username');
    this.setLoginStatus(false);
  }

  isLoggedIn(): boolean {
    return this.hasValidToken();
  }

  // New method to get the username
  getUsername(): string | null {
    return sessionStorage.getItem('username');
  }

  private hasValidToken(): boolean {
    const token = this.getToken();
    return !!token;
  }

  private getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  setLoginStatus(isLoggedIn: boolean) {
    this.loginStatusSubject.next(isLoggedIn);
  }
}
