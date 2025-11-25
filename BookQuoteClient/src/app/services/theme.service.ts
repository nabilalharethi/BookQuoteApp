import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private darkModeKey = 'darkMode';
  private darkModeSubject = new BehaviorSubject<boolean>(
    this.getDarkMode()
  );
  public darkMode$ = this.darkModeSubject.asObservable();

  private getDarkMode(): boolean {
    const stored = localStorage.getItem(this.darkModeKey);
    return stored === 'true';
  }

  toggleDarkMode(): void {
    const newValue = !this.darkModeSubject.value;
    localStorage.setItem(this.darkModeKey, newValue.toString());
    this.darkModeSubject.next(newValue);
    this.applyTheme(newValue);
  }

  initializeTheme(): void {
    this.applyTheme(this.darkModeSubject.value);
  }

  private applyTheme(isDark: boolean): void {
    if (isDark) {
      document.body.setAttribute('data-bs-theme', 'dark');
    } else {
      document.body.removeAttribute('data-bs-theme');
    }
  }
}