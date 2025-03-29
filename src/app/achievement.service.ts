import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environment';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AchievementService {
  // Use direct backend URL for testing
  private baseUrl = 'https://adorable-freedom-production.up.railway.app/api/achievements';
  
  constructor(private http: HttpClient) {
    console.log('Environment API URL:', environment.apiBaseUrl);
    console.log('Using direct API URL:', this.baseUrl);
  }
  
  getAchievementById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Raw error from API:', error);
        return throwError(() => new Error(`Error fetching achievement: ${error.message}`));
      })
    );
  }
}
