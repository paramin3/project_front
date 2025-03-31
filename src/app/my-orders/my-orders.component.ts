import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environment';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {
  orders: any[] = [];
  currentEmail: string | null = null;

  constructor(private http: HttpClient) {}
  
formatThaiDate(dateStr: string | null): string {
  if (!dateStr) return 'N/A';

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return 'Invalid Date';

  return date.toLocaleString('th-TH', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Bangkok'
  });
}

  ngOnInit(): void {
    // เรียก API เพื่อดึง email
   this.http.get<any>(`${environment.apiBaseUrl}/api/users/current-user`, { withCredentials: true }).subscribe({
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
    this.http.get<any[]>(`${environment.apiBaseUrl}/api/orders/user/${email}`, { withCredentials: true }).subscribe({
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
