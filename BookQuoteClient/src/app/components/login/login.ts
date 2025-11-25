import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private authService = inject(Auth);
  private router = inject(Router);

  username = '';
  password = '';
  errorMessage = '';

  onSubmit(): void {
    this.errorMessage = '';
    
    this.authService.login({ 
      username: this.username, 
      password: this.password 
    }).subscribe({
      next: () => {
        this.router.navigate(['/books']);
      },
      error: (error) => {
        this.errorMessage = error.error || 'Login failed. Please try again.';
      }
    });
  }
}