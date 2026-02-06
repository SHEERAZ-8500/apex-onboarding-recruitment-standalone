import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RequisitionLookupDto } from '../dtos/requisition-lookup.dto';
import { ApiService } from '../../../core/services/apis/api.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../core/services/management-services/loader.service';

@Component({
  selector: 'app-create-job-title',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-job-title.component.html',
  styleUrl: './create-job-title.component.scss',
})
export class CreateJobTitleComponent implements OnInit {
  formTitle: string = 'Job Title';
  formData = new RequisitionLookupDto();
  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private toaster: ToastrService,
    private loader: LoaderService,
    private router: Router
  ) { }

  ngOnInit() {
    const currentPath = this.route.snapshot.routeConfig?.path;
    if (currentPath === 'create-employee-category') {
      this.formTitle = 'Employee Category';
    }
    if (currentPath === 'create-job-title') {
      this.formTitle = 'Job Title';
    }
    if (currentPath === 'create-department') {
      this.formTitle = 'Department';
    }

    if (currentPath === 'create-branch') {
      this.formTitle = 'Branch';
    }
  }

  onSubmit() {
    if (this.formTitle === 'Job Title') {
      if (
        !this.formData.name ||
        !this.formData.code ||
        !this.formData.emailAddress
      ) {
        this.toaster.error('Please Fill required fileds');
        return;
      }
      this.loader.show();
      this.apiService.createJobTitle(this.formData).subscribe(
        (response: any) => {
          this.toaster.success('Job Title Created Successfully');
          this.loader.hide();
        },
        (error) => {
          this.toaster.error(error.message || 'Error');
          this.loader.hide();
        }
      );
    }
    if (this.formTitle === 'Employee Category') {
      if (
        !this.formData.name ||
        !this.formData.code ||
        !this.formData.emailAddress
      ) {
        this.toaster.error('Please Fill required fileds');
        return;
      }
      this.loader.show();
      this.apiService.createEmployeeCategories(this.formData).subscribe(
        (response: any) => {
          this.toaster.success('Employee Category Created Successfully');
          this.loader.hide();
        },
        (error) => {
          this.toaster.error(error.message || 'Error');

          this.loader.hide();
        }
      );
    }
    if (this.formTitle === 'Department') {
      if (
        !this.formData.name ||
        !this.formData.code ||
        !this.formData.emailAddress
      ) {
        this.toaster.error('Please Fill required fileds');
        return;
      }
      this.loader.show();
      this.apiService.createDepartment(this.formData).subscribe(
        (response: any) => {
          this.toaster.success('Department Created Successfully');
          this.loader.hide();
        },
        (error) => {
          this.toaster.error(error.message || 'Error');
          this.loader.hide();
        }
      );
    }
    if (this.formTitle === 'Branch') {
      if (
        !this.formData.name ||
        !this.formData.code ||
        !this.formData.emailAddress
      ) {
        this.toaster.error('Please Fill required fileds');
        return;
      }
      this.loader.show();
      this.apiService.createBranch(this.formData).subscribe(
        (response: any) => {
          this.toaster.success('Branch Created Successfully');
          this.loader.hide();
        },
        (error) => {
          this.toaster.error(error.message || 'Error');

          this.loader.hide();
        }
      );
    }
  }
  onReset() {
    this.formData = new RequisitionLookupDto();
  }

    cancel() {
    this.router.navigate(['/panel']); 
  }
}
