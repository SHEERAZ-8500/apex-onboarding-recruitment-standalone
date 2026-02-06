import { Component, HostListener } from '@angular/core';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { AdminService } from '../../services/admin.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-new-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-new-user.component.html',
  styleUrl: './create-new-user.component.scss'
})
export class CreateNewUserComponent {
  email: string = '';
  firstName: string = '';
  lastName: string = '';
  roleCode: string = '';
  phoneNumber: string = '';
  address: string = '';
  roles: any[] = []
  disabled: boolean = false;
  isDropdownOpen: boolean = false;
  selectedRole: string = '';
  constructor(private loader: LoaderService, private adminService: AdminService, private toastr: ToastrService,private router: Router) {
    this.loader.show()
    this.adminService.getAllRolls().subscribe({
      next: (response: any) => {
        this.loader.hide()
        this.roles = response.data
      },
      error: (error) => {
        this.loader.hide()
        // console.error('Error creating user', error);
      }
    });


  }


  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectRole(role: any, event: Event) {

    event.stopPropagation();
    this.selectedRole = role.name;
    this.roleCode = role.code;
    this.isDropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event) {
    this.isDropdownOpen = false;
  }
  createUser() {
    if (!this.email || !this.firstName || !this.lastName || !this.roleCode) {
      this.toastr.error('Please fill in all required fields');
      return
    }
    let payload = {
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      roleCode: this.roleCode,
      phoneNumber: this.phoneNumber,
      address: this.address
    }
    this.loader.show();
    this.disabled = true;
    this.adminService.createNewUser(payload).subscribe({
      next: (response) => {
        this.loader.hide();
        this.toastr.success('User created successfully', 'Success');
        this.email = '';
        this.firstName = '';
        this.lastName = '';
        this.roleCode = '';
        this.phoneNumber = '';
        this.address = '';
        this.selectedRole = '';
        this.disabled = false;
        this.router.navigate(['/panel/admin/view-all-users']);
      },
      error: (error) => {
        this.loader.hide();
        this.disabled = false;
        this.toastr.error(error.error.message || 'Failed to create user. Please try again.', 'Error');
      }
    });
  }

   cancel() {
    this.router.navigate(['/panel/admin/view-all-users']); 
  }
}
