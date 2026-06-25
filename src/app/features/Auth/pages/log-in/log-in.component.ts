import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { AuthService } from '../../service/auth.service';
import { EncryptionService } from '../../../../core/services/management-services/encryption.service';
import { Auth } from '@angular/fire/auth';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult
} from 'firebase/auth';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  providers: [LoaderService],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss'
})
export class LogInComponent {
  email = '';
  password = '';
  rememberMe = false;
  showPassword = false;
  isSubmitting = false;

  features = [
    { icon: 'building', title: 'Prime Location', subtitle: 'Iconic Address' },
    { icon: 'shield', title: 'Secure & Reliable', subtitle: 'Trusted Platform' },
    { icon: 'chart', title: 'Smart Investment', subtitle: 'Higher Returns' },
    { icon: 'headset', title: '24/7 Support', subtitle: 'Always Here' }
  ];

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private loader: LoaderService,
    private authService: AuthService,
    private encryptionService: EncryptionService,
     private firebaseAuth: Auth
  ) {}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.isSubmitting) return; // double-submit guard

    const email = this.email.trim();

    if (!email || !this.password) {
      this.toastr.error('Please fill in all required fields.');
      return;
    }

    if (!this.isValidEmail(email)) {
      this.toastr.error('Please enter a valid email address.');
      return;
    }

    this.isSubmitting = true;
    this.loader.show();

    this.authService.logIn({ email, password: this.password }).subscribe({
      next: (response: any) => {
        this.isSubmitting = false;
        this.loader.hide();

        const data = response?.data;
        if (!data) {
          this.toastr.error('Unexpected response from server. Please try again.');
          return;
        }

        if (!data.preAuthToken) {
          this.toastr.success('Login successful!');
          const userId = this.encryptionService.encrypt(data.userId);
          localStorage.setItem('userId', userId);
          localStorage.setItem('token', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);
          this.router.navigate(['/panel/dashboard']);
        } else {
          const preAuthToken = this.encryptionService.encrypt(data.preAuthToken);
          this.toastr.success('A verification code has been sent to your email.');
          this.router.navigate(['/verify-otp', preAuthToken]);
        }
      },
      error: () => {
        this.isSubmitting = false;
        this.loader.hide();
        // AuthInterceptor already shows the proper toast for this error.
      }
    });
  }

 async continueWithGoogle(): Promise<void> {
  if (this.isSubmitting) return;

  this.isSubmitting = true;
  this.loader.show();

  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });

    const result = await signInWithPopup(this.firebaseAuth, provider);

    const idToken = await result.user.getIdToken();

    this.authService.googleLogin(idToken).subscribe({
      next: (response: any) => {
        this.isSubmitting = false;
        this.loader.hide();

        const data = response?.data ?? response;

        if (!data?.accessToken || !data?.refreshToken) {
          this.toastr.error('Google login response is invalid.');
          return;
        }

        if (data.userId) {
          localStorage.setItem(
            'userId',
            this.encryptionService.encrypt(data.userId)
          );
        }

        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);

        this.toastr.success('Google login successful!');
        this.router.navigate(['/panel/dashboard']);
      },

      error: () => {
        this.isSubmitting = false;
        this.loader.hide();
      }
    });
  } catch (error: any) {
    this.isSubmitting = false;
    this.loader.hide();

    if (error?.code !== 'auth/popup-closed-by-user') {
      this.toastr.error('Google sign-in could not be completed.');
    }
  }
}

  private isValidEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }
}