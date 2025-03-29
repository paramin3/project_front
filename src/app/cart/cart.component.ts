import { Component, OnInit } from '@angular/core'; 
import { CartService } from '../cart.service';
import { CartItem } from '../cart-item.model';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ProductService } from '../product.service';
import { environment } from '../environment'; 

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalPrice: number = 0;

  constructor(
    private cartService: CartService,
    private productService: ProductService, 
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadCartItems();
  }

  loadCartItems(): void {
    this.cartService.getCartItems().subscribe({
      next: (items) => {
        this.cartItems = items;
        this.calculateTotalPrice();
      },
      error: (error) => console.error('Error loading cart items:', error)
    });
  }

  calculateTotalPrice(): void {
    this.totalPrice = this.cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }

  adjustQuantity(productId: number, change: number): void {
    const item = this.cartItems.find((i) => i.product.id === productId);
    if (item) {
      const newQuantity = item.quantity + change;
  
      // ลดจำนวนสินค้าได้เสมอ
      if (change < 0 && newQuantity > 0) {
        this.updateQuantity(productId, newQuantity);
      } 
      // เพิ่มจำนวนสินค้าตามเงื่อนไข stock
      else if (change > 0 && newQuantity <= item.product.stock) {
        this.updateQuantity(productId, newQuantity);
      } 
      // แจ้งเตือนเมื่อเพิ่มสินค้าเกิน stock
      else if (newQuantity > item.product.stock) {
        alert('จำนวนสินค้าที่เลือกเกินจำนวนสต็อกที่มีอยู่');
      }
    }
  
  }

  updateQuantity(productId: number, newQuantity: number): void {
  const item = this.cartItems.find((i) => i.product.id === productId);

  if (!item) {
    console.error('Item not found in cart');
    return;
  }
  this.productService.checkStock(productId, newQuantity).subscribe({
    next: (response) => {
      if (response.available || newQuantity <= item.product.stock) {
        this.cartService.updateProductQuantity(productId, newQuantity).subscribe({
          next: () => {
            // Reduce quantity or set it to max stock if exceeded
            item.quantity = Math.min(newQuantity, item.product.stock);
            this.calculateTotalPrice();
          },
          error: (err) => {
            console.error('Error updating product quantity:', err);
            alert('เกิดข้อผิดพลาดในการอัปเดตจำนวนสินค้า');
          }
        });
      } else {
        // Execute the same logic for updating the quantity with restrictions
        this.cartService.updateProductQuantity(productId, item.product.stock).subscribe({
          next: () => {
            // Reset quantity to the maximum available stock
            item.quantity = item.product.stock;
            this.calculateTotalPrice();
            alert('ไม่สามารถเพิ่มจำนวนได้เนื่องจาก Stock ไม่เพียงพอ');
          },
          error: (err) => {
            console.error('Error updating product quantity in else block:', err);
            alert('เกิดข้อผิดพลาดในการอัปเดตจำนวนสินค้า');
          }
        });
      }
    },
    error: (err) => {
      console.error('Error checking stock:', err);
      alert('เกิดข้อผิดพลาดในการตรวจสอบ Stock');
    }
  });  
}

  removeProduct(productId: number): void {
    this.cartService.removeProductFromCart(productId).subscribe({
      next: () => {
        this.cartItems = this.cartItems.filter((item) => item.product.id !== productId);
        this.calculateTotalPrice();
      },
      error: (error) => console.error('Error removing product:', error)
    });
  }
  
  goToCheckout(): void {
    // ตรวจสอบสถานะการล็อกอิน
    this.http.get<{ email: string }>(`${environment.apiBaseUrl}/api/users/current-user`, { withCredentials: true }).subscribe({
      next: (response) => {
        console.log('Current user:', response.email);
  
        // ตรวจสอบสต็อกสินค้า
        let stockAvailable = true;
  
        for (const item of this.cartItems) {
          if (item.quantity > item.product.stock) {
            stockAvailable = false;
            alert(`มีสินค้า ${item.product.name} ไม่พอ`);
            break; // หยุดการตรวจสอบเมื่อพบสินค้าที่สต็อกไม่พอ
          }
        }
  
        if (!stockAvailable) {
          return; // หยุดกระบวนการชำระเงินหากสต็อกไม่เพียงพอ
        }
  
        // ดำเนินการไปที่หน้าชำระเงินหากสต็อกเพียงพอ
        this.router.navigate(['/checkout']);
      },
      error: (err) => {
        console.error('Error fetching current user:', err);
        alert('ไม่สามารถชำระเงินได้ กรุณาเข้าสู่ระบบก่อนทำรายการ');
      },
    });
  }

  getInputValue(event: Event): number {
    return parseInt((event.target as HTMLInputElement).value, 10);
  }
}
