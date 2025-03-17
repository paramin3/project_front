import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  isLoggedIn: boolean = false;
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {
    this.isLoggedIn = this.authService.isLoggedIn(); // Check initial login state
  }

  onLogin() {
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        this.isLoggedIn = true;
        alert(`เข้าสู่ระบบสำเร็จ ยินดีต้อนรับคุณ, ${response.email}`);
        this.router.navigate(['/']); // Navigate to the home page
      },
      error: (err) => {
        console.error('Login failed:', err);
        this.errorMessage = 'อีเมลหรือรหัสผ่านไม่ถูกต้อง';
      }
    });
  }

  onLogout() {
    this.authService.logout().subscribe({
      next: () => {
        this.isLoggedIn = false;
        alert('ออกจากระบบ!');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Logout failed:', err);
      }
    });
  }
}
