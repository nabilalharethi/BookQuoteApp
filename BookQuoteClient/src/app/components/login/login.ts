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
        this.router.navigate(['/books']);
      },
      error: (err) => {
        this.isLoading = false;
        // Display backend error or default message
        this.errorMessage = err.error || 'Invalid username or password';
      }
    });
  }
}
