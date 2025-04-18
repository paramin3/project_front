import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from './environment';

// Define the Achievement interface
interface Achievement {
  id: number;
  createdAt: string | Date;
  imagePaths?: string[];
  name?: string;
  title?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AchievementService {
  private baseUrl = `${environment.apiBaseUrl}/api/achievements`;

  constructor(private http: HttpClient) {
    console.log('Base URL in AchievementService:', this.baseUrl);
  }

  getAllAchievements(): Observable<Achievement[]> {
    console.log('Fetching achievements from:', this.baseUrl);
    return this.http.get<Achievement[]>(this.baseUrl, { withCredentials: true }).pipe(
      catchError(error => {
        console.error('Error fetching achievements:', error);
        return throwError(() => new Error('Failed to fetch achievements'));
      })
    );
  }

  getAchievementById(id: string): Observable<HttpResponse<Achievement>> {
    return this.http.get<Achievement>(`${this.baseUrl}/${id}`, {
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
