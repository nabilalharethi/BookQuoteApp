import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Auth, LoginRequest } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  Username: string = '';
  Password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  private authService = inject(Auth);
  private router = inject(Router);

    ngOnInit(): void {
    // Redirect if user is already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/books']);
    }
  }

  onSubmit(loginForm: NgForm): void {
    if (loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    const request: LoginRequest = {
      Username: this.Username,
      Password: this.Password
    };

      this.authService.login(request).subscribe({
    next: (res) => {
      this.isLoading = false;

      if (res?.username) {
        this.router.navigate(['/books']);
      } else {
        this.errorMessage = 'Login failed: username not found.';
      }

      
    },
    error: (err) => {
      this.isLoading = false;

      
      if (err.status === 0) {
        this.errorMessage = 'Network error or CORS issue. Check backend.';
        return;
      }

      
      if (typeof err.error === 'string') {
        this.errorMessage = err.error;
        return;
      }

      
      if (err.error?.messge) {
        this.errorMessage = err.error.messge;
        return;
      }

      
      if (err.error?.message) {
        this.errorMessage = err.error.message;
        return;
      }

     
      this.errorMessage = 'Invalid username or password';
    }
  });




  }
}
