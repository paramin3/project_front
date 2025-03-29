// src/app/checkout/checkout.component.ts
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { CartService } from '../cart.service';
import { CheckoutService } from '../checkout.service';
import { Router } from '@angular/router';
import { environment } from '../environment';

interface CartItem {
  product: { name: string; price: number; imagePaths: string[] };
  quantity: number;
}

interface Address {
  id?: number;
  name: string;
  homeAddress: string;
  road?: string | null;
  soi?: string | null;
  moo?: string | null;
  subDistrict: string;
  district: string;
  city: string;
  postcode: string;
  default?: boolean; // Changed from isDefault to default
  user?: any; // Added to match server's known properties
}

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  @ViewChild('checkoutForm') checkoutForm!: NgForm;
  @ViewChild('shippingFields') shippingFields!: ElementRef<HTMLElement>;
  @ViewChild('newAddressFields') newAddressFields!: ElementRef<HTMLElement>;

  orderDetails = {
    name: '',
    surname: '',
    telephone: '',
    deliveryType: '',
    email: ''
  };

  newAddress: Address = {
    name: 'Checkout Address',
    homeAddress: '',
    road: null,
    soi: null,
    moo: null,
    subDistrict: '',
    district: '',
    city: '',
    postcode: '',
    default: false // Changed from isDefault to default
  };

  cartItems: CartItem[] = [];
  savedAddresses: Address[] = [];
  selectedAddressId: string = 'new';
  totalPrice = 0;
  receiptFile: File | null = null;
  receiptError: string | null = null;
  isSubmitting = false;

  constructor(
    private http: HttpClient,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getCurrentUsername();
    this.loadCartItems();
    this.loadSavedAddresses();
  }

  getCurrentUsername(): void {
    this.http.get<any>(`${environment.apiBaseUrl}/api/users/current-user`, { withCredentials: true }).subscribe({
      next: (response) => {
        this.orderDetails.email = typeof response === 'string' ? response : response.email || response.username || '';
        console.log('Current user:', this.orderDetails.email);
      },
      error: (err) => {
        console.error('Error fetching current user:', err);
        alert('ไม่สามารถดึงข้อมูลอีเมลได้ กรุณาเข้าสู่ระบบอีกครั้ง');
        this.router.navigate(['/login']);
      }
    });
  }

  loadCartItems(): void {
    this.cartService.getCartItems().subscribe({
      next: (response) => {
        this.cartItems = response;
        this.totalPrice = this.cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
        console.log('Cart items loaded:', this.cartItems);
        console.log('Total price:', this.totalPrice);
      },
      error: (err) => {
        console.error('Error fetching cart items:', err);
        document.getElementById('order-summary')!.innerHTML = '<p>เกิดข้อผิดพลาดในการโหลดรายการในตะกร้า กรุณาลองใหม่ภายหลัง</p>';
      }
    });
  }

  loadSavedAddresses(): void {
     this.http.get<Address[]>(`${environment.apiBaseUrl}/api/addresses`,  { withCredentials: true }).subscribe({
      next: (response) => {
        this.savedAddresses = response;
      },
      error: (error) => {
        console.error('Error loading saved addresses:', error);
      }
    });
  }

  handleDeliveryTypeChange(): void {
    if (this.shippingFields) {
      this.shippingFields.nativeElement.style.display = this.orderDetails.deliveryType === 'shipping' ? 'block' : 'none';
    }

    const newAddressInputs = this.newAddressFields?.nativeElement.querySelectorAll<HTMLInputElement>('input');
    newAddressInputs?.forEach((input) => {
      input.required = this.orderDetails.deliveryType === 'shipping' && this.selectedAddressId === 'new';
      if (this.orderDetails.deliveryType !== 'shipping') input.value = '';
    });
  }

  handleSavedAddressChange(): void {
    if (this.newAddressFields) {
      this.newAddressFields.nativeElement.style.display = this.selectedAddressId === 'new' ? 'block' : 'none';
    }

    const newAddressInputs = this.newAddressFields?.nativeElement.querySelectorAll<HTMLInputElement>('input');
    newAddressInputs?.forEach((input) => {
      input.required = this.selectedAddressId === 'new' && this.orderDetails.deliveryType === 'shipping';
      if (this.selectedAddressId !== 'new') input.value = '';
    });
  }

  onImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'placeholder-image.jpg';
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      if (!file.type.startsWith('image/')) {
        this.receiptError = 'กรุณาเลือกไฟล์รูปภาพเท่านั้น';
        this.receiptFile = null;
        return;
      }
      this.receiptFile = file;
      this.receiptError = null;
    } else {
      this.receiptError = 'กรุณาอัปโหลดภาพใบเสร็จ';
      this.receiptFile = null;
    }
  }

  validateForm(): boolean {
    if (!this.checkoutForm.valid) {
      this.checkoutForm.form.markAllAsTouched();
      return false;
    }

    if (!this.receiptFile) {
      this.receiptError = 'กรุณาอัปโหลดภาพใบเสร็จ';
      return false;
    }

    if (this.orderDetails.deliveryType === 'shipping' && this.selectedAddressId === 'new') {
      const requiredFields: (keyof Address)[] = ['homeAddress', 'postcode', 'city', 'district', 'subDistrict'];
      const isValid = requiredFields.every(field => {
        const value = this.newAddress[field];
        return value !== undefined && value !== null && value.toString().trim().length > 0;
      });
      if (!isValid) {
        alert('กรุณากรอกข้อมูลที่อยู่จัดส่งให้ครบถ้วน');
        return false;
      }
    }

    if (this.cartItems.length === 0) {
      alert('ไม่พบสินค้าในตะกร้า');
      return false;
    }

    return true;
  }

  submitOrder(): void {
    if (this.isSubmitting || !this.validateForm()) {
      return;
    }

    this.isSubmitting = true;
    const formData = new FormData();

    const orderKeys: (keyof typeof this.orderDetails)[] = ['name', 'surname', 'telephone', 'deliveryType', 'email'];
    orderKeys.forEach((key) => {
      const value = this.orderDetails[key];
      if (value) {
        formData.append(key, value.trim());
      }
    });

    if (this.orderDetails.deliveryType === 'shipping') {
      if (this.selectedAddressId === 'new') {
        formData.append('shippingAddress', JSON.stringify(this.newAddress));
      } else {
        formData.append('addressId', this.selectedAddressId);
      }
    }

    if (this.receiptFile) {
      formData.append('receiptImage', this.receiptFile);
    }

    // Log FormData contents manually
    const logFormData = (fd: FormData) => {
      const entries: [string, FormDataEntryValue][] = [];
      fd.forEach((value, key) => entries.push([key, value]));
      console.log('FormData being sent:', entries);
    };
    logFormData(formData);

    this.checkoutService.confirmOrder(formData).subscribe({
      next: (response: any) => {
        alert('คำสั่งซื้อสำเร็จ');
        this.resetForm();
        this.router.navigate(['/my-orders']);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error submitting order:', err);
        console.log('Server response:', err.error);
        alert(err.error?.message || 'เกิดข้อผิดพลาดในการยืนยันคำสั่งซื้อ');
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }

  resetForm(): void {
    this.orderDetails = {
      name: '',
      surname: '',
      telephone: '',
      deliveryType: '',
      email: ''
    };
    this.newAddress = {
      name: 'Checkout Address',
      homeAddress: '',
      road: null,
      soi: null,
      moo: null,
      subDistrict: '',
      district: '',
      city: '',
      postcode: '',
      default: false // Changed from isDefault to default
    };
    this.cartItems = [];
    this.totalPrice = 0;
    this.receiptFile = null;
    this.selectedAddressId = 'new';
    this.checkoutForm.resetForm();
    this.handleDeliveryTypeChange();
  }
}
