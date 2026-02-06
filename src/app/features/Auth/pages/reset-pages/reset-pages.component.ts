import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../service/auth.service';
import { EncryptionService } from '../../../../core/services/management-services/encryption.service';
import { ThemeService } from '../../../../core/services/management-services/Theme.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgOtpInputModule } from 'ng-otp-input';

@Component({
  selector: 'app-reset-pages',
  standalone: true,
  imports: [CommonModule, FormsModule,NgOtpInputModule],
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
  token: string | null = ''
  otpConfig = {
    length: 6,
    allowNumbersOnly: true,
    inputClass: 'otp-input',
    containerClass: 'otp-input-wrapper'
  };
  invitePassword = false
  otp: string = '';

  constructor(
    private themeService: ThemeService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService,
    private encryptionService: EncryptionService
  ) { }

  ngOnInit() {
    // Subscribe to theme changes
    this.themeService.isLightTheme$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isLight => {
        this.isLightTheme = isLight;
      });

    // Check route to determine view
    this.route.url.pipe(takeUntil(this.destroy$)).subscribe(segments => {
      const path = segments[0]?.path;
      if (path === 'otp-reset') {
        this.currentView = 'otp';
      } else if (path === 'password' || path === 'invite') {
        this.currentView = 'create-password';
        if (path === 'invite') {
          this.invitePassword = true;
        }
        this.route.queryParamMap.subscribe(params => {
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
    console.log('OTP Changed:', otp);
  }

  verifyOtp() {
    if (this.currentView === 'verify-otp') {
      let preAuthToken = this.encryptionService.decrypt(this.token || '');
      this.authService.verifyOtp({ preAuthToken: preAuthToken, otp: this.otp }).subscribe({
        next: (response: any) => {

          let data = response.body.data
          this.toastr.success('OTP verified successfully!');
          this.toastr.success('Login successful!');
          let userId = this.encryptionService.encrypt(data.userId)
          localStorage.setItem('userId', userId);
          localStorage.setItem('token', data.accessToken);
          let deviceId = this.encryptionService.encrypt(response.headers.get('x-device-id') || '');
          localStorage.setItem('deviceId', deviceId);
          localStorage.setItem('refreshToken', data.refreshToken);
          this.router.navigate(['/panel/dashboard']);
        },
        error: (error) => {
          this.toastr.error(error.error.message || 'OTP verification failed. Please try again.');
        }
      });
      return;
    }
    if (this.otp.length === 5) {
      console.log('Verifying OTP:', this.otp);
      // Add your verification logic here
    } else {
      console.log('Please enter complete OTP');
    }
  }

  resendOtp() {
    let preAuthToken = this.encryptionService.decrypt(this.token || '');
    this.authService.resendOtp(preAuthToken).subscribe({
      next: (response: any) => {
        this.toastr.success('OTP resent successfully Please check your email.');
      },
      error: (error) => {
        this.toastr.error(error.error.message || 'Failed to resend OTP. Please try again.');
      }
    });
  }

  sendResetEmail() {
    if (!this.email) {
      this.toastr.error('Please enter your email address.');
      return;
    }
    if (this.email) {
      this.authService.resetPasswordByEmail({ email: this.email }).subscribe({
        next: (response: any) => {
          this.toastr.success('Verification code sent to your email.');
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.toastr.error(error.error.message || 'Failed to send verification code. Please try again.');
        }
      });
    } else {
      console.log('Please enter email');
    }
  }

  createNewPassword() {
    if (!this.password) {
      console.log('Please enter password');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.toastr.error('Passwords do not match.');
      return;
    }

    if (this.password.length < 8) {
      this.toastr.error('Password must be at least 8 characters long.');
      return;
    }

    if (this.invitePassword) {
      this.authService.inviteComplete({ inviteToken: this.token, newPassword: this.password }).subscribe({
        next: (response: any) => {
          this.toastr.success('Invitation completed successfully. You can now log in with your new password.');
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.toastr.error(error.error.message || 'Failed to complete invitation. Please try again.');
        }
      });
    } else {
      this.authService.createNewPassword({ resetSessionToken: this.token, newPassword: this.password }).subscribe({
        next: (response: any) => {
          this.toastr.success('Password reset successfully. You can now log in with your new password.');
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.toastr.error(error.error.message || 'Failed to reset password. Please try again.');
        }
      });
    }
  }
}
