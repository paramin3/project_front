import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TrainerService {
  private baseUrl = '/api/trainers';

  constructor(private http: HttpClient) {}

  // Method for getting all trainers
  getTrainers(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  // Method for deleting a trainer
  deleteTrainer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
