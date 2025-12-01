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
  styleUrls: ['./register.css']
})
export class Register {
  private authService = inject(Auth);
  private router = inject(Router);

  Username = '';
  Password = '';
  confirmPassword = '';
  errorMessage = '';
  isLoading = false;

  onSubmit(): void {
    this.errorMessage = '';
    
    if (this.Password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }
    this.isLoading = true;
    console.log("Register attrmpt:", this.Username);

    this.authService.register({ 
      Username: this.Username, 
      Password: this.Password 
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