import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environment';
@Injectable({
  providedIn: 'root',
})
export class AchievementService {
 private baseUrl = `${environment.apiBaseUrl}/api/achievements`; // URL API

  constructor(private http: HttpClient) {}

  getAchievementById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }
}
