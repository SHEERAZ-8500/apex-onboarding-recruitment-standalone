// create-unit.ts - Naye imports aur properties add karein

import { CommonModule } from '@angular/common';
import { Component, HostListener, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { LoaderService } from '../../../core/services/management-services/loader.service';
import { InventoryService } from '../i-units-service';

type PropertyType = 'APARTMENT' | 'OFFICE';

interface FileWithPreview {
  file: File;
  name: string;
  size: number;
  previewUrl: string;
}

interface ExistingPhoto {
  publicId: string;
  url: string;
  kind: 'PHOTO' | 'FLOOR_PLAN';
}

@Component({
  selector: 'app-create-unit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './create-unit.html',
  styleUrl: './create-unit.scss',
})
export class CreateUnit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  // Form fields (existing)
  unitNumber = '';
  floorNumber: number | null = null;
  propertyType: PropertyType | '' = '';
  areaSqft: number | null = null;
  totalPrice: number | null = null;
  bookingAmount: number | null = null;
  description = '';

  // Component states (existing)
  publicId: string | null = null;
  isEditMode = false;
  formSubmitted = false;
  disabled = false;

  // Custom dropdown (existing)
  propertyTypes: PropertyType[] = ['APARTMENT', 'OFFICE'];
  isPropertyTypeOpen = false;

  // ===== NAYE: Photo Upload Related =====
  selectedFiles: FileWithPreview[] = [];
  existingPhotos: ExistingPhoto[] = [];
  isDragOver = false;
  isUploading = false;
  photosToDelete: string[] = []; // Public IDs of photos to delete

  constructor(
    private inventoryService: InventoryService,
    private loader: LoaderService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.publicId = this.route.snapshot.paramMap.get('id');

    if (this.publicId) {
      this.isEditMode = true;
      this.loadUnitWithMedia(this.publicId);
    }
  }

  // ================= Load Unit with Media =================

  loadUnitWithMedia(publicId: string): void {
    this.loader.show();

    // Naye API se unit detail + media load karein
    this.inventoryService.getUnitDetail(publicId).subscribe({
      next: (response: any) => {
        this.loader.hide();

        const unit = response?.data || response;

        this.unitNumber = unit?.unitNumber || '';
        this.floorNumber = unit?.floorNumber ?? null;
        this.propertyType = unit?.propertyType || '';
        this.areaSqft = unit?.areaSqft ?? null;
        this.totalPrice = unit?.totalPrice ?? null;
        this.bookingAmount = unit?.bookingAmount ?? null;
        this.description = unit?.description || '';

        // Photos load karein
        if (unit?.photoUrls && unit.photoUrls.length > 0) {
          this.existingPhotos = unit.photoUrls.map((url: string, index: number) => ({
            publicId: `photo-${index}-${Date.now()}`,
            url: url,
            kind: 'PHOTO'
          }));
        }

        // Floor plans load karein (agar chahte hain to)
        if (unit?.floorPlanUrls && unit.floorPlanUrls.length > 0) {
          const floorPlans = unit.floorPlanUrls.map((url: string, index: number) => ({
            publicId: `floorplan-${index}-${Date.now()}`,
            url: url,
            kind: 'FLOOR_PLAN'
          }));
          this.existingPhotos = [...this.existingPhotos, ...floorPlans];
        }
      },

      error: (error: any) => {
        this.loader.hide();
        this.toastr.error(
          error?.error?.message || 'Unable to load unit details',
          'Error',
        );
        this.router.navigate(['/panel/inventory-units/view-units']);
      },
    });
  }

  // ================= File Upload Handlers =================

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.processFiles(input.files);
    }
    input.value = ''; // Reset input so same file can be selected again
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    const files = event.dataTransfer?.files;
    if (files) {
      this.processFiles(files);
    }
  }

  private processFiles(fileList: FileList): void {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];

      // Validation
      if (!allowedTypes.includes(file.type)) {
        this.toastr.warning(`${file.name} is not a supported image format`, 'Warning');
        continue;
      }

      if (file.size > maxSize) {
        this.toastr.warning(`${file.name} exceeds 5MB limit`, 'Warning');
        continue;
      }

      // Add to selected files
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedFiles.push({
          file: file,
          name: file.name,
          size: file.size,
          previewUrl: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  }

  removeSelectedFile(index: number): void {
    const removed = this.selectedFiles.splice(index, 1)[0];
    if (removed.previewUrl) {
      URL.revokeObjectURL(removed.previewUrl);
    }
  }

  removeExistingPhoto(index: number): void {
    const photo = this.existingPhotos[index];
    if (photo.publicId && !photo.publicId.startsWith('photo-') && !photo.publicId.startsWith('floorplan-')) {
      // Real publicId hai to delete queue mein add karein
      this.photosToDelete.push(photo.publicId);
    }
    this.existingPhotos.splice(index, 1);
  }

  // ================= Upload Photos =================

  private async uploadPhotos(unitPublicId: string): Promise<void> {
    if (this.selectedFiles.length === 0) {
      return;
    }

    this.isUploading = true;

    try {
      // Har file ko individually upload karein
      for (const fileItem of this.selectedFiles) {
        await this.inventoryService
          .uploadSingleMedia(unitPublicId, fileItem.file, 'PHOTO')
          .toPromise();
      }

      this.toastr.success(`${this.selectedFiles.length} photo(s) uploaded successfully`);
      this.selectedFiles = [];
    } catch (error: any) {
      this.toastr.error(error?.error?.message || 'Failed to upload photos', 'Error');
    } finally {
      this.isUploading = false;
    }
  }

  private async deletePhotos(unitPublicId: string): Promise<void> {
    if (this.photosToDelete.length === 0) {
      return;
    }

    try {
      for (const publicId of this.photosToDelete) {
        await this.inventoryService
          .deleteUnitMedia(unitPublicId, publicId)
          .toPromise();
      }
      this.toastr.success(`${this.photosToDelete.length} photo(s) deleted`);
      this.photosToDelete = [];
    } catch (error: any) {
      this.toastr.error(error?.error?.message || 'Failed to delete photos', 'Error');
    }
  }

  // ================= Submit =================

  async submitUnit(): Promise<void> {
    this.formSubmitted = true;

    if (!this.isFormValid()) {
      this.toastr.error('Please fill all required fields correctly');
      return;
    }

    if (this.isEditMode) {
      await this.updateUnitWithMedia();
    } else {
      await this.createUnitWithMedia();
    }
  }

  // ================= Create with Media =================

  async createUnitWithMedia(): Promise<void> {
    const payload = {
      unitNumber: this.unitNumber.trim(),
      floorNumber: Number(this.floorNumber),
      propertyType: this.propertyType as PropertyType,
      areaSqft: Number(this.areaSqft),
      totalPrice: Number(this.totalPrice),
      bookingAmount: Number(this.bookingAmount),
      description: this.description.trim(),
    };

    this.disabled = true;
    this.loader.show();

    try {
      // 1. Unit create karein
      const response = await this.inventoryService.createUnit(payload).toPromise();
      const unitPublicId = response?.data?.publicId || response?.publicId;

      if (!unitPublicId) {
        throw new Error('Unit created but no publicId returned');
      }

      // 2. Photos upload karein
      if (this.selectedFiles.length > 0) {
        await this.uploadPhotos(unitPublicId);
      }

      this.loader.hide();
      this.disabled = false;

      this.toastr.success('Unit created successfully with photos', 'Success');

      setTimeout(() => {
        this.router.navigate(['/panel/inventory-units/view-units']);
      }, 1200);

    } catch (error: any) {
      this.loader.hide();
      this.disabled = false;
      this.toastr.error(error?.error?.message || 'Unable to create unit', 'Error');
    }
  }

  // ================= Update with Media =================

  async updateUnitWithMedia(): Promise<void> {
    if (!this.publicId) return;

    const payload = {
      unitNumber: this.unitNumber.trim(),
      floorNumber: Number(this.floorNumber),
      propertyType: this.propertyType as PropertyType,
      areaSqft: Number(this.areaSqft),
      totalPrice: Number(this.totalPrice),
      bookingAmount: Number(this.bookingAmount),
      description: this.description.trim(),
    };

    this.disabled = true;
    this.loader.show();

    try {
      // 1. Unit update karein
      await this.inventoryService.updateUnit(this.publicId, payload).toPromise();

      // 2. Delete marked photos
      await this.deletePhotos(this.publicId);

      // 3. Upload new photos
      await this.uploadPhotos(this.publicId);

      this.loader.hide();
      this.disabled = false;

      this.toastr.success('Unit updated successfully', 'Success');

      setTimeout(() => {
        this.router.navigate(['/panel/inventory-units/view-units']);
      }, 1200);

    } catch (error: any) {
      this.loader.hide();
      this.disabled = false;
      this.toastr.error(error?.error?.message || 'Unable to update unit', 'Error');
    }
  }

  // ================= Validation =================

  isValidPositiveNumber(value: number | null): boolean {
    return value !== null && value !== undefined && value > 0;
  }

  isFormValid(): boolean {
    if (!this.unitNumber.trim()) return false;
    if (this.floorNumber === null || this.floorNumber === undefined) return false;
    if (!this.propertyType) return false;
    if (!this.isValidPositiveNumber(this.areaSqft)) return false;
    if (!this.isValidPositiveNumber(this.totalPrice)) return false;
    if (!this.isValidPositiveNumber(this.bookingAmount)) return false;

    if (
      this.bookingAmount !== null &&
      this.totalPrice !== null &&
      this.bookingAmount > this.totalPrice
    ) {
      return false;
    }

    return true;
  }

  // ================= Dropdown =================

  togglePropertyType(event: Event): void {
    event.stopPropagation();
    this.isPropertyTypeOpen = !this.isPropertyTypeOpen;
  }

  selectPropertyType(type: PropertyType, event: Event): void {
    event.stopPropagation();
    this.propertyType = type;
    this.isPropertyTypeOpen = false;
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.isPropertyTypeOpen = false;
  }

  // ================= Cancel =================

  cancel(): void {
    // Clean up preview URLs
    this.selectedFiles.forEach(f => URL.revokeObjectURL(f.previewUrl));
    this.router.navigate(['/panel/inventory-units/view-units']);
  }
}