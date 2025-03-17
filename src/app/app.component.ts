import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  menuOpen = false;
  userEmail: string = '';

  // Define allowed routes
  private allowedRoutes = [
    '/home',
    '/about',
    '/classes',
    '/shop',
    '/cart',
    '/register',
    '/trainers',
    '/membership'
  ];

  // Define dynamic route patterns
  private dynamicRoutes = [
    /^\/shop\/\d+$/,
    /^\/achievement\/\d+$/
  ];

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserDetails();
  }

  private loadUserDetails(): void {
    this.authService.fetchUserDetails().subscribe({
      next: (userDetails) => {
        this.userEmail = userDetails.email || '';
        console.log('User details loaded successfully.');
      },
      error: (err) => {
        console.warn('Session expired or user is not logged in:', err);
        this.handleUnauthorizedAccess();
      }
    });
  }

  private handleUnauthorizedAccess(): void {
    const currentRoute = this.router.url;
    const isAllowed = this.isRouteAllowed(currentRoute);

    if (!isAllowed) {
      setTimeout(() => this.router.navigate(['/login']), 0);
    }
  }

  private isRouteAllowed(route: string): boolean {
    return this.allowedRoutes.includes(route) ||
           this.dynamicRoutes.some(pattern => pattern.test(route));
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  onLogoutAndCloseMenu(): void {
    this.closeMenu();
    this.onLogout();
  }

  onLogout(): void {
    this.authService.logout().subscribe({
      next: () => {
        alert('ออกจากระบบ!');
        this.userEmail = ''; // Clear email data
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Logout error:', err);
        alert('An error occurred while logging out. Please try again.');
      }
    });
  }
}