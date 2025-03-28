import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environment';
@Injectable({
  providedIn: 'root'
})
export class ClassService { 
  private baseUrl = `${environment.apiBaseUrl}/api/classes`;
  constructor(private http: HttpClient) {}

  getClasses(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }
}
