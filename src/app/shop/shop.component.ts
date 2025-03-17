import { Component, OnInit } from '@angular/core'; 
import { ProductService } from '../product.service';
import { CartService } from '../cart.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {
  products: any[] = [];

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  // Load products from the backend and filter only available products
  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data: any) => {
        this.products = data.filter((product: any) => product.available) // Filter available products
          .map((product: any) => ({
            ...product,
            quantity: 1 // Set default quantity
          }));
      },
      error: (err: any) => {
        console.error('Error loading products:', err);
      }
    });
  }

  // Add product to cart with the selected quantity and check stock
  addToCart(productId: number, quantity: number): void {
    const product = this.products.find((p) => p.id === productId);

    if (!product) {
      console.error('Product not found!');
      return;
    }

    if (quantity <= 0) {
      alert('กรุณาเลือกจำนวนสินค้าที่ถูกต้อง');
      return;
    }

    if (quantity > product.stock) {
      alert('ไม่สามารถเพิ่มสินค้าเกินจำนวนสต็อกที่มีได้');
      return;
    }

    this.cartService.addProductToCart(productId, quantity).subscribe({
      next: () => {
        product.stock -= quantity; // ลดจำนวนสต็อก
        if (product.stock === 0) {
        } else {
          alert('เพิ่มสินค้าลงในตะกร้าสำเร็จ');
        }
      },
      error: (err: any) => {
        console.error('Error adding product to cart:', err);
        alert('Error adding product to cart');
      }
    });
  }
}
