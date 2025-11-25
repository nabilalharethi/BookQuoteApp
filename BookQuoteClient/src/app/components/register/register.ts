import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  private authService = inject(Auth);
  private router = inject(Router);

  username = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';

  onSubmit(): void {
    this.errorMessage = '';
    
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.authService.register({ 
      username: this.username, 
      password: this.password 
    }).subscribe({
      next: () => {
        this.router.navigate(['/books']);
      },
      error: (error) => {
        this.errorMessage = error.error || 'Registration failed. Please try again.';
      }
    });
  }
}