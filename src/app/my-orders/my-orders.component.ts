import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {
  orders: any[] = [];
  currentEmail: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // เรียก API เพื่อดึง email
    this.http.get<any>('/api/users/current-user').subscribe({
      next: (user) => {
        this.currentEmail = user.email; // ดึง email จาก response
        console.log('Current email:', this.currentEmail);

        // ดึงคำสั่งซื้อโดยใช้ email
        this.fetchOrders(this.currentEmail);
      },
      error: (err) => {
        console.error('Error fetching current user:', err);
      }
    });
  }

  fetchOrders(email: string | null): void {
    if (!email) {
      console.error('Email is null, cannot fetch orders.');
      return;
    }

    // เรียก API เพื่อดึงคำสั่งซื้อโดยใช้ email
    this.http.get<any[]>('/api/orders/user/' + email).subscribe({
      next: (orders) => {
        if (Array.isArray(orders)) {
          this.orders = orders; // Assign only if the data is an array
        } else {
          console.error('Error: orders is not an array:', orders);
          this.orders = []; // Assign an empty array if the data is not valid
        }
        console.log('Orders:', this.orders);
      },
      error: (err) => {
        console.error('Error fetching orders:', err);
      }
    });
    
  }
}
