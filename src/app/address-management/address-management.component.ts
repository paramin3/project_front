// src/app/address-management/address-management.component.ts
import { Component, OnInit } from '@angular/core';
import { AddressService } from '../address.service'; // Adjusted path
import { Address } from '../address.model';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-address-management',
  templateUrl: './address-management.component.html',
  styleUrls: ['./address-management.component.css']
})
export class AddressManagementComponent implements OnInit {
  addresses: Address[] = [];
  editingAddressId: number | null = null;
  addressForm: Address = {
    name: '',
    homeAddress: '',
    road: null,
    soi: null,
    moo: null,
    subDistrict: '',
    district: '',
    city: '',
    postcode: '',
    isDefault: false
  };

  constructor(private addressService: AddressService, private router: Router) {}

  ngOnInit(): void {
    this.loadAddresses();
  }

loadAddresses(): void {
  this.addressService.getAddresses().subscribe({
    next: (addresses: Address[]) => {
      this.addresses = addresses;
    },
    error: (error: any) => {
      console.error('Error loading addresses:', error);
      alert('กรุณาเข้าสู่ระบบเพื่อทำการบันทึกข้อมูล');
      this.router.navigate(['/login']); // ← Redirect ไปที่หน้า login
    }
  });
}

  editAddress(id: number): void {
    this.addressService.getAddressById(id).subscribe({
      next: (address: Address) => {
        this.addressForm = { ...address };
        this.editingAddressId = id;
      },
      error: (error: any) => console.error('Error fetching address:', error)
    });
  }

  deleteAddress(id: number): void {
    if (confirm('Are you sure you want to delete this address?')) {
      this.addressService.deleteAddress(id).subscribe({
        next: () => {
          alert('Address deleted successfully');
          this.loadAddresses();
        },
        error: (error: any) => {
          console.error('Error deleting address:', error);
          alert(error.status === 404 ? 'Address not found' : 'Failed to delete address');
        }
      });
    }
  }

  onSubmit(): void {
    if (this.editingAddressId) {
      this.addressService.updateAddress(this.editingAddressId, this.addressForm).subscribe({
        next: () => {
          alert('Address updated successfully');
          this.resetForm();
          this.loadAddresses();
        },
        error: (error: any) => {
          console.error('Error updating address:', error);
          alert('Failed to update address');
        }
      });
    } else {
      this.addressService.addAddress(this.addressForm).subscribe({
        next: () => {
          alert('Address added successfully');
          this.resetForm();
          this.loadAddresses();
        },
        error: (error: any) => {
          console.error('Error adding address:', error);
          alert('Failed to add address');
        }
      });
    }
  }

  resetForm(): void {
    this.addressForm = {
      name: '',
      homeAddress: '',
      road: null,
      soi: null,
      moo: null,
      subDistrict: '',
      district: '',
      city: '',
      postcode: '',
      isDefault: false
    };
    this.editingAddressId = null;
  }
}
