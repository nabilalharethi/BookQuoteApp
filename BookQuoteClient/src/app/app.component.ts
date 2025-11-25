import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterModule } from '@angular/router';
import { Auth } from './services/auth';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  authService = inject(Auth);
  themeService = inject(ThemeService);
  router = inject(Router);
  
  title = 'Book & Quote Manager';
  
  isAuthenticated$ = this.authService.isAuthenticated$;
  darkMode$ = this.themeService.darkMode$;

  ngOnInit(): void {
    this.themeService.initializeTheme();
  }

  toggleTheme(): void {
    this.themeService.toggleDarkMode();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getUsername(): string | null {
    return this.authService.getUsername();
  }
}