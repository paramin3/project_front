import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environment';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  currentUser: string | null = null;
  errorMessage: string | null = null;
  
 private baseUrl = environment.apiBaseUrl;
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getCurrentUser();
  }
  logout(): void {
    this.http.post(`${this.baseUrl}/api/users/logout`, {}, { withCredentials: true }).subscribe({
      next: () => {
        this.currentUser = null;
        alert('Logged out successfully');
      },
      error: (error) => {
        console.error('Error during logout:', error);
      }
    });
  }
  getCurrentUser(): void {
     this.http.get<string>(`${this.baseUrl}/api/users/current-user`, { withCredentials: true }).subscribe({
      next: (username) => {
        this.currentUser = username;
      },
      error: (error) => {
        console.error('Error fetching current user:', error);
        this.errorMessage = 'User not authenticated';
      }
    });
  }
}
