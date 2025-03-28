import { Injectable } from '@angular/core';  
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from './environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
private baseUrl = environment.apiBaseUrl;

  private loginUrl = `${this.baseUrl}/api/users/login`;
  private logoutUrl = `${this.baseUrl}/logout`;
  private userDetailsUrl = `${this.baseUrl}/api/users/current-user`;
  
  private loggedIn: boolean = false;
  private userEmail: string = '';

  constructor(private http: HttpClient) {
    this.checkLoginState(); // ตรวจสอบสถานะการเข้าสู่ระบบเมื่อเริ่มต้น
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(this.loginUrl, { email, password }, { withCredentials: true })
      .pipe(
        tap(() => {
          this.setLoginState(true);
        })
      );
  }

  logout(): Observable<any> {
    return this.http.post<any>(this.logoutUrl, {}, { withCredentials: true })
      .pipe(
        tap(() => {
          this.setLoginState(false);
          this.userEmail = ''; // ล้างข้อมูลอีเมลเมื่อออกจากระบบ
        })
      );
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  getUserEmail(): string {
    return this.userEmail;
  }

  private setLoginState(state: boolean): void {
    this.loggedIn = state;
    if (state) {
      localStorage.setItem('isLoggedIn', 'true');
    } else {
      localStorage.removeItem('isLoggedIn');
    }
  }

  /**
   * ดึงข้อมูลผู้ใช้งานจากเซิร์ฟเวอร์
   */
  fetchUserDetails(): Observable<any> {
    return this.http.get<any>(this.userDetailsUrl, { withCredentials: true }).pipe(
      tap({
        next: (userDetails) => {
          if (userDetails.email) {
            this.userEmail = userDetails.email; // เก็บข้อมูลผู้ใช้
            this.setLoginState(true);
          } else {
            console.warn('User details are incomplete.');
            this.setLoginState(false);
          }
        },
        error: (error: HttpErrorResponse) => {
          console.error('Fetch user details error:', error);
          if (error.status === 200 && !error.ok) {
            console.warn('Response format is invalid. Check Content-Type or JSON structure.');
          }
          this.setLoginState(false); // เซสชันหมดอายุ
        }
      })
    );
  }

  /**
   * ตรวจสอบสถานะการล็อกอินจากเซิร์ฟเวอร์
   */
  checkLoginState(): void {
    this.fetchUserDetails().subscribe({
      next: () => {
        console.log('User is logged in.');
      },
      error: () => {
        console.warn('User is not logged in or session expired.');
        this.setLoginState(false);
      }
    });
  }
}
