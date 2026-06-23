import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


interface RegisterModel {
  firstName: string;
  lastName: string;
  contactNumber: string;
  cnicNumber: string;
  city: string;
  area: string;
  address: string;
  age: number | null;
  fatherName: string;
  motherName: string;
  education: string;
}

@Component({
  selector: 'app-registration-page',
  imports: [CommonModule,FormsModule],
  templateUrl: './registration-page.html',
  styleUrl: './registration-page.scss',
})
export class RegistrationPage {
   currentStep = 1;
  maxStepReached = 1; // breadcrumbs can only jump to a step already reached
  isSubmitting = false;
 
  model: RegisterModel = {
    firstName: '',
    lastName: '',
    contactNumber: '',
    cnicNumber: '',
    city: '',
    area: '',
    address: '',
    age: null,
    fatherName: '',
    motherName: '',
    education: ''
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
 
  // ---- Step navigation -------------------------------------------------
 
  goToStep(step: number): void {
    // Only allow jumping to a step the user has already reached,
    // so people can't skip ahead without filling earlier fields.
    if (step <= this.maxStepReached) {
      this.currentStep = step;
    }
  }
 
  goNext(): void {
    if (this.currentStep < 3) {
      this.currentStep++;
      this.maxStepReached = Math.max(this.maxStepReached, this.currentStep);
    }
  }
 
  goBack(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }
 
  // ---- Submit ------------------------------------------------------------
 
  onRegister(): void {
    this.isSubmitting = true;
    // TODO: wire up to real registration API
    setTimeout(() => {
      this.isSubmitting = false;
      // e.g. navigate to login or dashboard on success
    }, 1200);
  }

}
