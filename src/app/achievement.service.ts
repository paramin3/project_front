import { Injectable } from '@angular/core';  
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from './environment';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AchievementService {
  private baseUrl = `${environment.apiBaseUrl}/api/achievements`;

  constructor(private http: HttpClient) {
    console.log('Base URL in AchievementService:', this.baseUrl);
  }

  getAchievementById(id: string): Observable<HttpResponse<any>> {
    return this.http.get<any>(`${this.baseUrl}/${id}`, {
      withCredentials: true,
      observe: 'response',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    }).pipe(
      catchError(error => {
        console.error('Raw error from API:', error);
        return throwError(() => new Error(`Error fetching achievement: ${error.message}`));
      })
    );
  }
}
