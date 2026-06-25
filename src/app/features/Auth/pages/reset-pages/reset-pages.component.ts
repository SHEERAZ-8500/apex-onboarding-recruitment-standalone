import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../service/auth.service';
import { EncryptionService } from '../../../../core/services/management-services/encryption.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgOtpInputModule } from 'ng-otp-input';

@Component({
  selector: 'app-reset-pages',
  standalone: true,
  imports: [CommonModule, FormsModule, NgOtpInputModule, RouterLink],
  templateUrl: './reset-pages.component.html',
  styleUrl: './reset-pages.component.scss'
})
export class ResetPagesComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();
  isLightTheme: boolean = false;
  currentView: 'email' | 'otp' | 'create-password' | 'verify-otp' = 'email';

  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  token: string | null = '';
  otp: string = '';
  invitePassword = false;

  // busy flags — duplicate clicks/requests rokte hain
  isSendingEmail = false;
  isVerifyingOtp = false;
  isResendingOtp = false;
  isSettingPassword = false;

  otpConfig = {
    length: 6,
    allowNumbersOnly: true,
    inputClass: 'otp-input',
    containerClass: 'otp-input-wrapper'
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService,
    private encryptionService: EncryptionService
  ) { }

  ngOnInit() {
    this.route.url.pipe(takeUntil(this.destroy$)).subscribe(segments => {
      const path = segments[0]?.path;
      if (path === 'otp-reset') {
        this.currentView = 'otp';
      } else if (path === 'password' || path === 'invite') {
        this.currentView = 'create-password';
        if (path === 'invite') {
          this.invitePassword = true;
        }
        this.route.queryParamMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
          this.token = params.get('token') || '';
        });
      } else if (path === 'verify-otp') {
        this.currentView = 'verify-otp';
        this.token = this.route.snapshot.paramMap.get('token');
      } else {
        this.currentView = 'email';
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onOtpChange(otp: string) {
    this.otp = otp;
  }

  /** decrypt() exception-safe wrapper — invalid/expired token par crash nahi karega */
  private safeDecrypt(token: string | null): string | null {
    if (!token) return null;
    try {
      return this.encryptionService.decrypt(token);
    } catch {
      return null;
    }
  }

  private isValidEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  verifyOtp() {
    if (this.currentView === 'verify-otp') {
      if (this.isVerifyingOtp) return;

      if (this.otp.length !== this.otpConfig.length) {
        this.toastr.error(`Please enter the complete ${this.otpConfig.length}-digit code.`);
        return;
      }

      const preAuthToken = this.safeDecrypt(this.token);
      if (!preAuthToken) {
        this.toastr.error('This link has expired or is invalid. Please try logging in again.');
        return;
      }

      this.isVerifyingOtp = true;
      this.authService.verifyOtp({ preAuthToken, otp: this.otp }).subscribe({
        next: (response: any) => {
          this.isVerifyingOtp = false;
          const data = response?.body?.data;
          if (!data) {
            this.toastr.error('Unexpected response from server. Please try again.');
            return;
          }
          this.toastr.success('Login successful!');
          const userId = this.encryptionService.encrypt(data.userId);
          localStorage.setItem('userId', userId);
          localStorage.setItem('token', data.accessToken);
          const deviceId = this.encryptionService.encrypt(response.headers?.get('x-device-id') || '');
          localStorage.setItem('deviceId', deviceId);
          localStorage.setItem('refreshToken', data.refreshToken);
          this.router.navigate(['/panel/dashboard']);
        },
        error: () => {
          this.isVerifyingOtp = false;
          // AuthInterceptor already shows the proper toast for this error.
        }
      });
      return;
    }

    // 'otp' view (forgot-password OTP) — wiring iske intezar mein hai, neeche question dekhein
    if (this.otp.length !== this.otpConfig.length) {
      this.toastr.error(`Please enter the complete ${this.otpConfig.length}-digit code.`);
      return;
    }
  }

  resendOtp() {
    if (this.isResendingOtp) return;

    const preAuthToken = this.safeDecrypt(this.token);
    if (!preAuthToken) {
      this.toastr.error('This link has expired or is invalid. Please try logging in again.');
      return;
    }

    this.isResendingOtp = true;
    this.authService.resendOtp(preAuthToken).subscribe({
      next: () => {
        this.isResendingOtp = false;
        this.toastr.success('OTP resent successfully. Please check your email.');
      },
      error: () => {
        this.isResendingOtp = false;
        // AuthInterceptor already shows the proper toast for this error.
      }
    });
  }

  sendResetEmail() {
    if (this.isSendingEmail) return;

    const email = this.email.trim();
    if (!email) {
      this.toastr.error('Please enter your email address.');
      return;
    }
    if (!this.isValidEmail(email)) {
      this.toastr.error('Please enter a valid email address.');
      return;
    }

    this.isSendingEmail = true;
    this.authService.resetPasswordByEmail({ email }).subscribe({
      next: () => {
        this.isSendingEmail = false;
        this.toastr.success('Verification code sent to your email.');
        this.router.navigate(['/']); // see question below
      },
      error: () => {
        this.isSendingEmail = false;
        // AuthInterceptor already shows the proper toast for this error.
      }
    });
  }

  createNewPassword() {
    if (this.isSettingPassword) return;

    if (!this.password || !this.confirmPassword) {
      this.toastr.error('Please fill in both password fields.');
      return;
    }

    if (this.password.length < 8) {
      this.toastr.error('Password must be at least 8 characters long.');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.toastr.error('Passwords do not match.');
      return;
    }

    this.isSettingPassword = true;

    if (this.invitePassword) {
      this.authService.inviteComplete({ inviteToken: this.token, newPassword: this.password }).subscribe({
        next: () => {
          this.isSettingPassword = false;
          this.toastr.success('Invitation completed successfully. You can now log in with your new password.');
          this.router.navigate(['/']);
        },
        error: () => {
          this.isSettingPassword = false;
          // AuthInterceptor already shows the proper toast for this error.
        }
      });
    } else {
      this.authService.createNewPassword({ resetSessionToken: this.token, newPassword: this.password }).subscribe({
        next: () => {
          this.isSettingPassword = false;
          this.toastr.success('Password reset successfully. You can now log in with your new password.');
          this.router.navigate(['/']);
        },
        error: () => {
          this.isSettingPassword = false;
          // AuthInterceptor already shows the proper toast for this error.
        }
      });
    }
  }
}