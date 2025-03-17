import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  showAlert: boolean = false;
  alertMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    if (!this.isFormValid()) {
      this.errorMessage = 'Please fill out all fields correctly.';
      return;
    }

    const registerData = { email: this.email, password: this.password };
    this.http.post('http://localhost:8081/api/users/register', registerData).subscribe({
      next: () => {
        alert('การลงทะเบียนสำเร็จ');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Registration failed', error);
        alert('การลงทะเบียนไม่สำเร็จ ชื่ออีเมล์นี้มีคนใช้แล้ว ');
      },
    });
  }

  isFormValid(): boolean {
    return (
      this.email.trim().length > 0 && // Email ต้องไม่ว่าง
      this.password.trim().length > 0 && // Password ต้องไม่ว่าง
      this.confirmPassword.trim().length > 0 && // Confirm Password ต้องไม่ว่าง
      this.password === this.confirmPassword // Password และ Confirm Password ต้องตรงกัน
    );
  }
  closeAlert() {
    this.showAlert = false;
  }
}
