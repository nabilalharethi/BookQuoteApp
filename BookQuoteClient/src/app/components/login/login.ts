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
  styleUrls: ['./login.css']
})
export class Login {
  private authService = inject(Auth);
  private router = inject(Router);

  Username = '';
  Password = '';
  errorMessage = '';
  isLoading = false;

  onSubmit(): void {
    this.errorMessage = '';
    this.isLoading = true;

    console.log("Login attempt:" , this.Username);
    
    this.authService.login({ 
      Username: this.Username, 
      Password: this.Password 
    }).subscribe({
      next: (response) => {
        console.log("Login successful:" , response)
        this.isLoading = false;
        this.router.navigate(['/books']);
      },
      error: (error) => {
        this.errorMessage = error.error || 'Login failed. Please try again.';
      
      }
    });
  }
}