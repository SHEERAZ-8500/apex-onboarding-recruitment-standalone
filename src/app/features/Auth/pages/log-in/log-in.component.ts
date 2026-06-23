import { Component } from '@angular/core';

import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [ LoaderService],
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
 
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
 
  onSubmit(): void {
    if (!this.email || !this.password) {
      return;
    }
    this.isSubmitting = true;
    // TODO: wire up to real auth service
    setTimeout(() => {
      this.isSubmitting = false;
    }, 1200);
  }
 
  continueWithGoogle(): void {
    // TODO: wire up Google OAuth flow
  }
}
