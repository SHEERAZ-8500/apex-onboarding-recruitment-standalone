import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../service/auth.service';
import { EncryptionService } from '../../../../core/services/management-services/encryption.service';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { ThemeService } from '../../../../core/services/management-services/Theme.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [AuthService, EncryptionService, LoaderService, ThemeService],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss'
})
export class LogInComponent {
  isDarkMode = false;
  constructor(private router: Router, private authService: AuthService, private toaster: ToastrService, private encryptionService: EncryptionService, private loader: LoaderService, private themeService: ThemeService) {

  }
  ngOnInit() {
    this.themeService.isLightTheme$.subscribe(value => {
      this.isDarkMode = !value;
    });
  }
  email: string = '';
  password: string = '';
  onLogin() {

    if (!this.email || !this.password) {
      this.toaster.error('Please fill in all required fields.');
      return
    }
    this.loading = true
    this.loader.show();
    this.authService.logIn({ email: this.email, password: this.password }).subscribe({
      next: (response: any) => {
        this.loading = false;

        if (!response.data.preAuthToken) {
          this.toaster.success('Login successful!');
          let userId = this.encryptionService.encrypt(response.data.userId)
          localStorage.setItem('userId', userId);
          localStorage.setItem('token', response.data.accessToken);

          localStorage.setItem('refreshToken', response.data.refreshToken);
          // this.router.navigate(['/panel/dashboard']);
          this.router.navigate(['/panel/dashboard']);

        } else {
          let preAuthToken = this.encryptionService.encrypt(response.data.preAuthToken)
          this.toaster.success('A verification code has been sent to your email.');
          this.router.navigate(['/verify-otp', preAuthToken]);

        }
        this.loader.hide();

      },
      error: (error) => {
        this.loading = false;

        this.toaster.error(error.error.message || 'Login failed. Please try again.');
        this.loader.hide();
      }
    });

  }

  loading = false;

  showPassword = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
