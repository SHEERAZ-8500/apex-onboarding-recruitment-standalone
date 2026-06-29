import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import {
  CNIC_PATTERN,
  PHONE_PATTERN,
  ProfileData,
  UpdateProfilePayload,
} from '../profile-interface/profile.model';
import { ProfileService } from '../profile-interface/profile.service';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile-edit.html',
  styleUrls: ['./profile-edit.scss'],
})
export class ProfileEdit implements OnInit {
  /** Current profile values to pre-fill the form. */
  @Input() profile: ProfileData | null = null;

  /** Emitted after a successful save, with the fresh profile. */
  @Output() saved = new EventEmitter<ProfileData>();

  /** Emitted when the user cancels editing. */
  @Output() cancelled = new EventEmitter<void>();

  form!: FormGroup;
  saving = false;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private profileService: ProfileService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      phoneNumber: [
        this.profile?.phoneNumber ?? '',
        [Validators.pattern(PHONE_PATTERN)],
      ],
      address: [this.profile?.address ?? '', [Validators.maxLength(255)]],
      cnic: [this.profile?.cnic ?? '', [Validators.pattern(CNIC_PATTERN)]],
    });
  }

  get phoneNumber() {
    return this.form.get('phoneNumber');
  }
  get address() {
    return this.form.get('address');
  }
  get cnic() {
    return this.form.get('cnic');
  }

  /** Auto-formats raw CNIC digits into 5-7-1 groups as the user types. */
  onCnicInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '').slice(0, 13);
    let formatted = digits;
    if (digits.length > 5 && digits.length <= 12) {
      formatted = `${digits.slice(0, 5)}-${digits.slice(5)}`;
    } else if (digits.length > 12) {
      formatted = `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`;
    }
    this.cnic?.setValue(formatted, { emitEvent: false });
  }

  submit(): void {
    if (this.form.invalid || this.saving) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage = null;
    this.saving = true;

    const raw = this.form.value;
    const payload: UpdateProfilePayload = {};
    if (raw.phoneNumber) payload.phoneNumber = raw.phoneNumber;
    if (raw.address) payload.address = raw.address;
    if (raw.cnic) payload.cnic = raw.cnic;

    this.profileService
      .updateProfile(payload)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe({
        next: (res) => this.saved.emit(res.data),
        error: (err) => {
          this.errorMessage =
            err?.error?.message ?? 'Profile update nahi ho saka. Dobara try karein.';
        },
      });
  }

  cancel(): void {
    this.cancelled.emit();
  }
}
