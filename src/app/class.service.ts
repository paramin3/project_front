import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClassService {
  private apiUrl = '/api/classes'; // URL ของ API

  constructor(private http: HttpClient) {}

  getClasses(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
