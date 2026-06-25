import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { LoaderService } from '../../../core/services/management-services/loader.service';
import { InventoryService } from '../i-units-service';

type PropertyType = 'APARTMENT' | 'OFFICE';

@Component({
  selector: 'app-create-unit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './create-unit.html',
  styleUrl: './create-unit.scss',
})
export class CreateUnit {
  // Form fields
  unitNumber = '';
  floorNumber: number | null = null;
  propertyType: PropertyType | '' = '';
  areaSqft: number | null = null;
  totalPrice: number | null = null;
  bookingAmount: number | null = null;
  description = '';

  // Component states
  publicId: string | null = null;
  isEditMode = false;
  formSubmitted = false;
  disabled = false;

  // Custom dropdown
  propertyTypes: PropertyType[] = ['APARTMENT', 'OFFICE'];
  isPropertyTypeOpen = false;

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
      this.loadUnitById(this.publicId);
    }
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

  // ================= Submit =================

  submitUnit(): void {
    this.formSubmitted = true;

    if (!this.isFormValid()) {
      this.toastr.error('Please fill all required fields correctly');
      return;
    }

    if (this.isEditMode) {
      this.updateUnit();
    } else {
      this.createUnit();
    }
  }

  // ================= Create =================

  createUnit(): void {
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

    this.inventoryService.createUnit(payload).subscribe({
      next: (response: any) => {
        this.loader.hide();
        this.disabled = false;

        this.toastr.success(
          response?.message || 'Unit created successfully',
          'Success',
        );

        setTimeout(() => {
          this.router.navigate(['/panel/inventory/view-units']);
        }, 1200);
      },

      error: (error: any) => {
        this.loader.hide();
        this.disabled = false;

        this.toastr.error(
          error?.error?.message || 'Unable to create unit',
          'Error',
        );
      },
    });
  }

  // ================= Get Single Unit =================

  loadUnitById(publicId: string): void {
    this.loader.show();

    this.inventoryService.getUnitById(publicId).subscribe({
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
      },

      error: (error: any) => {
        this.loader.hide();

        this.toastr.error(
          error?.error?.message || 'Unable to load unit details',
          'Error',
        );

        this.router.navigate(['/panel/inventory/view-units']);
      },
    });
  }

  // ================= Update =================

  updateUnit(): void {
    if (!this.publicId) return;

    /*
      PATCH API hai, isliye sirf changed / required fields bhej sakte hain.
      Filhal complete valid form payload bhej rahe hain.
    */
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

    this.inventoryService.updateUnit(this.publicId, payload).subscribe({
      next: (response: any) => {
        this.loader.hide();
        this.disabled = false;

        this.toastr.success(
          response?.message || 'Unit updated successfully',
          'Success',
        );

        setTimeout(() => {
          this.router.navigate(['/panel/inventory/view-units']);
        }, 1200);
      },

      error: (error: any) => {
        this.loader.hide();
        this.disabled = false;

        this.toastr.error(
          error?.error?.message || 'Unable to update unit',
          'Error',
        );
      },
    });
  }

  // ================= Cancel =================

  cancel(): void {
    this.router.navigate(['/panel/inventory/view-units']);
  }
}