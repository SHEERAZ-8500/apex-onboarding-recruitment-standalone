
import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DynamicFieldsSharingService } from '../../../../core/services/management-services/dynamic-fields-sharing.service';
import {  ShiftDto } from '../../../master-data-forms/dtos/master-date.dto';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { FormsService } from '../../../forms/services/forms.service';
import { PaginationComponent } from '../../../../shared/components/commons/components/pagination/pagination.component';

@Component({
  selector: 'app-shift',
  imports: [CommonModule, FormsModule, RouterModule],
  standalone: true,
  templateUrl: './shift.html',
  styleUrl: './shift.scss',
})
export class Shift {

 shift: ShiftDto = new ShiftDto();
  activeDropdown: string = '';
  backendFieldsMap: Record<string, boolean> = {};
  fieldConfigMap: Record<string, any> = {};
  // Sidebar Tabs Data
  sidebarTabs: any[] = [];
  activeTabId: number = 1;
  statusEnumArray: any[] = [];

weekDays = [
  { name: 'Monday' },
  { name: 'Tuesday' },
  { name: 'Wednesday' },
  { name: 'Thursday' },
  { name: 'Friday' },
  { name: 'Saturday' },
  { name: 'Sunday' }
];


  constructor(
     private router: Router,
     public dynamicFieldsService: DynamicFieldsSharingService,
     private toastr: ToastrService,
     private loader: LoaderService,
     private formsService: FormsService,
     private activatedRoute: ActivatedRoute
   ) { }

    ngOnInit(): void {
         this.dynamicFieldsService.loadDynamicFields('SHIFT', 'USER_DEFINED', [])
          .then(() => {
            // Get tabs from service
            this.sidebarTabs = this.dynamicFieldsService.sidebarTabs;
            this.activeTabId = this.dynamicFieldsService.activeTabId;
            console.log('sidebarTabs:', this.sidebarTabs);
            if (this.sidebarTabs.length > 1) {
              console.log('rowTableField:', this.sidebarTabs[1]?.rowTableField);
            }
            this.loader.hide();
          })
                  .catch((err) => {
            console.error('Error loading dynamic fields:', err);
            this.toastr.error('Failed to load dynamic fields');
            this.loader.hide();
          });
        this.getFormFileds();

      }

        getFormFileds() {
    this.formsService.getFormByFormCode('SHIFT').subscribe({
      next: (res: any) => {
        console.log('Form Fields:', res);

        // safety check
        if (res?.data?.fields && Array.isArray(res.data.fields)) {
          res.data.fields.forEach((field: any) => {
            this.backendFieldsMap[field.fieldCode] = field.active;
            // Store field config including source
            if (field.fieldConfig) {
              this.fieldConfigMap[field.fieldCode] = field.fieldConfig;
            }
          });
        }
      },
      error: (err: any) => {
        console.error('Error fetching form fields:', err);
      }
    });
  }


  isFieldActive(fieldCode: string): boolean {

    return this.backendFieldsMap[fieldCode] !== false;
  }


    @HostListener('document:click', ['$event'])
  closeDropdowns(event: Event) {
    this.activeDropdown = '';
    this.dynamicFieldsService.closeAllDropdowns();
  }

  // Set active tab
  setActiveTab(tabId: number): void {
    this.activeTabId = tabId;
    this.dynamicFieldsService.setActiveTab(tabId);
  }

    // Dropdown toggle
  toggleDropdown(event: Event, dropdownId: string) {
    event.stopPropagation();



    this.activeDropdown = this.activeDropdown === dropdownId ? '' : dropdownId;
  }

 selectOption(field: string, value: any, event: Event) {
    event.stopPropagation();
   
    (this.shift as any)[field] = value.code;
    this.activeDropdown = '';
  }
}
