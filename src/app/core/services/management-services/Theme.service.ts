// theme.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private _isLightTheme = new BehaviorSubject<boolean>(
    localStorage.getItem('theme') === 'light'
  );
  isLightTheme$ = this._isLightTheme.asObservable();

  constructor() {
    if (this._isLightTheme.value) {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
  }

  toggleLightTheme() {
    const current = this._isLightTheme.value;
    const newValue = !current;
    this._isLightTheme.next(newValue);

    if (newValue) {
      document.documentElement.classList.add('light-theme');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.remove('light-theme');
      localStorage.setItem('theme', 'dark');
    }
  }

  get isLightTheme() {
    return this._isLightTheme.value;
  }
}
