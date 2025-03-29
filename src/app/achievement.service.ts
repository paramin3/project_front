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
 private baseUrl = `${environment.apiBaseUrl}/api/achievements`; // URL API

  constructor(private http: HttpClient) {
  console.log('API Base URL:', this.baseUrl);
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
