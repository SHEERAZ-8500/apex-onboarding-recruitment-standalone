import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgOtpInputModule } from 'ng-otp-input';

import { AuthService } from '../../service/auth.service';
import { EncryptionService } from '../../../../core/services/management-services/encryption.service';
import { LoaderService } from '../../../../core/services/management-services/loader.service';

interface RegisterModel {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

@Component({
  selector: 'app-registration-page',
  standalone: true,
  imports: [CommonModule, FormsModule, NgOtpInputModule],
  providers: [LoaderService],
  templateUrl: './registration-page.html',
  styleUrl: './registration-page.scss'
})
export class RegistrationPage {
  currentStep = 1;
  maxStepReached = 1;

  isSubmitting = false;
  isVerifyingOtp = false;
  isResendingOtp = false;

  showPassword = false;
  otp = '';

  /**
   * Raw token memory mein rahega.
   * URL ya localStorage mein save karne ki zarurat nahi,
   * kyun ke OTP isi component/page par verify hoga.
   */
  private preAuthToken = '';

  model: RegisterModel = {
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  };

  otpConfig = {
    length: 6,
    allowNumbersOnly: true,
    inputClass: 'otp-input',
    containerClass: 'otp-input-wrapper'
  };

  features = [
    {
      icon: 'building',
      title: 'Prime Location',
      subtitle: 'Iconic Address'
    },
    {
      icon: 'shield',
      title: 'Secure & Reliable',
      subtitle: 'Trusted Platform'
    },
    {
      icon: 'chart',
      title: 'Smart Investment',
      subtitle: 'Higher Returns'
    },
    {
      icon: 'headset',
      title: '24/7 Support',
      subtitle: 'Always Here'
    }
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private loader: LoaderService,
    private encryptionService: EncryptionService
  ) {}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  goToStep(step: number): void {
    if (step <= this.maxStepReached) {
      this.currentStep = step;
    }
  }

  goBack(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  onOtpChange(otp: string): void {
    this.otp = otp;
  }

  /**
   * STEP 1:
   * Register API call
   * Success par preAuthToken milta hai aur OTP step open hota hai.
   */
  createAccount(): void {
    if (this.isSubmitting) return;

    const firstName = this.model.firstName.trim();
    const lastName = this.model.lastName.trim();
    const email = this.model.email.trim().toLowerCase();
    const password = this.model.password;

    if (!firstName || !lastName || !email || !password) {
      this.toastr.error('Please fill in all required fields.');
      return;
    }

    if (!this.isValidEmail(email)) {
      this.toastr.error('Please enter a valid email address.');
      return;
    }

    if (password.length < 8) {
      this.toastr.error('Password must be at least 8 characters long.');
      return;
    }

    this.isSubmitting = true;
    this.loader.show();

    this.authService.register({
      firstName,
      lastName,
      email,
      password
    }).subscribe({
      next: (response: any) => {
        this.isSubmitting = false;
        this.loader.hide();

        const data = response?.data ?? response;
        const token = data?.preAuthToken;

        if (!token) {
          this.toastr.error(
            'Registration started, but verification token was not received.'
          );
          return;
        }

        this.preAuthToken = token;
        this.currentStep = 2;
        this.maxStepReached = 2;
        this.otp = '';

        this.toastr.success(
          'Verification code has been sent to your email address.'
        );
      },
      error: () => {
        this.isSubmitting = false;
        this.loader.hide();
      }
    });
  }

  /**
   * STEP 2:
   * OTP verify API
   * Success par tokens localStorage mein save aur dashboard redirect.
   */
  verifyRegistrationOtp(): void {
    if (this.isVerifyingOtp) return;

    if (!this.preAuthToken) {
      this.toastr.error(
        'Registration session expired. Please register again.'
      );
      this.currentStep = 1;
      return;
    }

    if (this.otp.length !== this.otpConfig.length) {
      this.toastr.error(
        `Please enter the complete ${this.otpConfig.length}-digit code.`
      );
      return;
    }

    this.isVerifyingOtp = true;
    this.loader.show();

    this.authService.verifyRegistrationOtp({
      preAuthToken: this.preAuthToken,
      otp: this.otp
    }).subscribe({
      next: (response: any) => {
        this.isVerifyingOtp = false;
        this.loader.hide();

        const data = response?.body?.data ?? response?.body ?? response?.data;

        if (!data?.accessToken || !data?.refreshToken) {
          this.toastr.error(
            'Verification completed, but login tokens were not received.'
          );
          return;
        }

        /**
         * Login flow jese tokens save ho rahe hain,
         * registration ke baad bhi exactly same storage.
         */
        if (data.userId) {
          const encryptedUserId = this.encryptionService.encrypt(
            String(data.userId)
          );
          localStorage.setItem('userId', encryptedUserId);
        }

        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);

        const deviceId = response?.headers?.get('x-device-id');

        if (deviceId) {
          const encryptedDeviceId = this.encryptionService.encrypt(deviceId);
          localStorage.setItem('deviceId', encryptedDeviceId);
        }

        this.toastr.success(
          'Registration completed successfully. Welcome!'
        );

        this.router.navigate(['/panel/dashboard']);
      },
      error: () => {
        this.isVerifyingOtp = false;
        this.loader.hide();
      }
    });
  }

  resendRegistrationOtp(): void {
    if (this.isResendingOtp) return;

    if (!this.preAuthToken) {
      this.toastr.error(
        'Registration session expired. Please register again.'
      );
      this.currentStep = 1;
      return;
    }

    this.isResendingOtp = true;

    this.authService.resendRegistrationOtp(this.preAuthToken).subscribe({
      next: () => {
        this.isResendingOtp = false;
        this.toastr.success(
          'OTP resent successfully. Please check your email.'
        );
      },
      error: () => {
        this.isResendingOtp = false;
      }
    });
  }

  private isValidEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }
}