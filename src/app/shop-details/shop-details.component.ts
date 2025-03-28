import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environment';

@Component({
  selector: 'app-shop-details',
  templateUrl: './shop-details.component.html',
  styleUrls: ['./shop-details.component.css']
})
export class ShopDetailsComponent implements OnInit {
  product: any;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}
  
getImageUrl(filename: string): string {
  return `${environment.apiBaseUrl}/uploads/images/products/${filename}`;
}
  
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.loadProductDetails(id);
  }

  loadProductDetails(id: string | null): void {
    if (id) {
      this.http.get(`${environment.apiBaseUrl}/api/products/${id}`).subscribe({
        next: (data) => {
          this.product = data;
        },
        error: (error) => {
          console.error('Error loading product details:', error);
        }
      });
    }
  }
}
