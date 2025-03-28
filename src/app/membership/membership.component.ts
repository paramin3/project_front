import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from '../user.service'; // Adjust path as necessary
import { environment } from '../environment';

@Component({
  selector: 'app-membership',
  templateUrl: './membership.component.html',
  styleUrls: ['./membership.component.css']
})
export class MembershipComponent implements OnInit {
  member = {
    name: '',
    surname: '',
    telephone: '',
    thaiNationalId: '',
    weight: 0,
    height: 0,
    belts: '',
    gym: '',
    city: ''
  };

  loggedIn: boolean = false; // Property to check login status

  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    console.log('ngOnInit called');
    this.loggedIn = this.userService.isLoggedIn();
    console.log('Logged in status:', this.loggedIn);
  
    this.loadMemberData();
  
    this.userService.loginStatus$.subscribe(status => {
      this.loggedIn = status;
      console.log('Login status updated:', this.loggedIn);
  
      if (!status) {
        localStorage.removeItem('memberFormData');
        this.resetForm();
      }
    });
  }
  
  loadMemberData(): void {
    console.log('Loading member data from backend');
    this.http.get(`${environment.apiBaseUrl}/api/members/current`, { withCredentials: true }).subscribe({
      next: (response: any) => {
        console.log('Member data from backend:', response);
        this.member = response;
        localStorage.setItem('memberFormData', JSON.stringify(this.member)); // Save to Local Storage
      },
      error: (err) => {
        console.error('Error loading member data from backend:', err);
      }
    });
  }

  submitMemberForm(form: NgForm): void {
    // Check if the user is logged in
     this.http.get<{ email: string }>(`${environment.apiBaseUrl}/api/users/current-user`, { withCredentials: true }).subscribe({
      next: (userResponse) => {
        console.log('Current user:', userResponse.email);

        // Validate form and submit
        if (form.valid) {
         this.http.post(`${environment.apiBaseUrl}/api/members/current`, this.member, { withCredentials: true }).subscribe({
            next: (response) => {
              console.log('Member form submitted successfully:', response);

              // Save updated data in Local Storage
              localStorage.setItem('memberFormData', JSON.stringify(this.member));

              // Show success toast
              this.showToast('ข้อมูลถูกบันทึกเรียบร้อยแล้ว');
            },
            error: (error) => {
              console.error('Error submitting member form:', error);

              // Show error toast
              this.showToast('เกิดข้อผิดพลาดในการส่งข้อมูล');
            }
          });
        } else {
          alert('กรุณากรอกข้อมูลให้ครบถ้วน');
        }
      },
      error: (loginError) => {
        console.error('Error fetching current user:', loginError);

        // Save form data before redirecting to login
        localStorage.setItem('memberFormData', JSON.stringify(this.member));

        // Redirect to login page if not logged in
        alert('กรุณาเข้าสู่ระบบก่อนทำรายการ');
        this.router.navigate(['/login']);
      }
    });
  }

  resetForm(): void {
    this.member = {
      name: '',
      surname: '',
      telephone: '',
      thaiNationalId: '',
      weight: 0,
      height: 0,
      belts: '',
      gym: '',
      city: ''
    };
  }

  showToast(message: string): void {
    const toastContainer = document.getElementById('toast-container');
    if (toastContainer) {
      const toast = document.createElement('div');
      toast.className = 'toast';
      toast.textContent = message;
      toastContainer.appendChild(toast);

      setTimeout(() => {
        toastContainer.removeChild(toast);
      }, 3000);
    }
  }
}
