import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';

import {
  ALLOWED_AVATAR_TYPES,
  MAX_AVATAR_SIZE_BYTES,
  ProfileData,
} from '../profile-interface/profile.model';
import { ProfileService } from '../profile-interface/profile.service';
import { ProfileEdit } from '../profile-edit/profile-edit';

@Component({
  selector: 'app-profile-view',
  standalone: true,
  imports: [CommonModule, ProfileEdit],
  templateUrl: './my-profile.html',
  styleUrl: './my-profile.scss',
})
export class ProfileView implements OnInit {
  profile: ProfileData | null = null;

  loading = true;
  isEditing = false;

  avatarUploading = false;
  avatarDeleting = false;
  avatarError: string | null = null;

  loadError: string | null = null;

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.fetchProfile();
  }

  fetchProfile(): void {
    this.loading = true;
    this.loadError = null;
    this.profileService
      .getProfile()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res) => (this.profile = res.data),
        error: () => {
          this.loadError = 'Profile load nahi ho saki. Page refresh karke dobara koshish karein.';
        },
      });
  }

  get initials(): string {
    if (!this.profile) return '';
    const first = this.profile.firstName?.[0] ?? '';
    const last = this.profile.lastName?.[0] ?? '';
    return `${first}${last}`.toUpperCase();
  }

  get isProfileComplete(): boolean {
    return !!(this.profile?.phoneNumber && this.profile?.address && this.profile?.cnic);
  }

  startEditing(): void {
    this.isEditing = true;
  }

  onSaved(updated: ProfileData): void {
    this.profile = updated;
    this.isEditing = false;
  }

  onCancelEdit(): void {
    this.isEditing = false;
  }

  onAvatarSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = ''; // allow re-selecting the same file later
    if (!file) return;

    this.avatarError = null;

    if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
      this.avatarError = 'Sirf PNG, JPG, WEBP ya SVG images allowed hain.';
      return;
    }
    if (file.size > MAX_AVATAR_SIZE_BYTES) {
      this.avatarError = 'Image ka size 5MB se zyada nahi hona chahiye.';
      return;
    }

    this.avatarUploading = true;
    this.profileService
      .uploadAvatar(file)
      .pipe(finalize(() => (this.avatarUploading = false)))
      .subscribe({
        next: (res) => (this.profile = res.data),
        error: (err) => {
          this.avatarError = err?.error?.message ?? 'Avatar upload nahi ho saka.';
        },
      });
  }

  deleteAvatar(): void {
    if (!this.profile?.avatarUrl || this.avatarDeleting) return;

    this.avatarError = null;
    this.avatarDeleting = true;
    this.profileService
      .deleteAvatar()
      .pipe(finalize(() => (this.avatarDeleting = false)))
      .subscribe({
        next: (res) => (this.profile = res.data),
        error: (err) => {
          this.avatarError = err?.error?.message ?? 'Avatar delete nahi ho saka.';
        },
      });
  }
}
