import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  currentUser: string | null = null;
  errorMessage: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getCurrentUser();
  }
  logout(): void {
    this.http.post('http://localhost:8081/api/users/logout', {}, { withCredentials: true }).subscribe({
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
    this.http.get<string>('http://localhost:8081/api/users/current-user', { withCredentials: true }).subscribe({
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
