import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CreateFormDto } from '../../dtos/create-form.dto';
import { FormsService } from '../../services/forms.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../core/services/management-services/loader.service';


@Component({
  selector: 'app-create-new-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-new-form.component.html',
  styleUrl: './create-new-form.component.scss'
})
export class CreateNewFormComponent {

  formData = new CreateFormDto();
  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private formsService: FormsService,
    private toaster: ToastrService,
    private loader: LoaderService
  ) { }


    onSubmit() {
  if (!this.formData.name || !this.formData.code) {
    this.toaster.error('Please fill required fields');
    return;
  }

  this.loader.show();

  this.formsService.createNewForm(this.formData).subscribe(
    (response: any) => {
      this.toaster.success('Form Created Successfully');
      this.loader.hide();
      this.location.back();
    },
    (error) => {
      this.toaster.error(error.message || 'Error');
      this.loader.hide();
    }
  );
}

  
    onReset() {
      this.formData = new CreateFormDto();
    }

}
