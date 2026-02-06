import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../../../../core/services/apis/api.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
@Component({
  selector: 'app-build-table',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './build-table.component.html',
  styleUrl: './build-table.component.scss'
})
export class BuildTableComponent {

  schemaForm: FormGroup;

  constructor(private fb: FormBuilder, private apiService: ApiService, private toastrService: ToastrService,private loader: LoaderService,private location: Location) {
    this.schemaForm = this.fb.group({
      tableName: [''],
      displayName: [''],
      companyId: 'dd',
      columns: this.fb.array([]),

      relationships: this.fb.array([])
    });
    this.addColumn(); // Initialize with one column
    this.addRelationship(); // Initialize with one relationship

  }

  // getters
  get columns() {
    return this.schemaForm.get('columns') as FormArray;
  }

  get relationships() {
    return this.schemaForm.get('relationships') as FormArray;
  }

  // add column
  addColumn() {
    this.columns.push(
      this.fb.group({
        columnName: [''],
        displayLabel: [''],
        dataType: ['STRING'],
        length: [],
        precision: [],
        scale: [],
        nullable: [true],
        primaryKey: [false],
        unique: [false],
        indexed: [false],
        defaultValue: ['']
      })
    );
  }

  removeColumn(i: number) {
    this.columns.removeAt(i);
  }

  // add relationship
  addRelationship() {
    this.relationships.push(
      this.fb.group({
        sourceTableName: [''],
        sourceColumnName: [''],
        targetTableName: [''],
        targetColumnName: [''],
        relationType: ['ONE_TO_MANY'],
        onDelete: [''],
        onUpdate: ['']
      })
    );
  }

  removeRelationship(i: number) {
    this.relationships.removeAt(i);
  }

  // submit form
  submitForm() {
    const formValue = this.schemaForm.value;
    console.log(formValue);

    const hasEmptyField = Object.keys(formValue).some(key => {
      const value = formValue[key];

      if (Array.isArray(value)) {

        return value.some(item => Object.values(item).some(v => v === '' || v === null || v === undefined));
      } else {
        return value === '' || value === null || value === undefined;
      }
    });

    if (hasEmptyField) {
      console.log('Form has empty fields!');
      this.toastrService.error('Please fill all the fields before submitting the form.');
      return;
    }
    this.loader.show();
    this.schemaForm.get('companyId')?.setValue(''); 
    this.apiService.createTable(this.schemaForm.value).subscribe(response => {
      console.log('Table created successfully', response);
      this.toastrService.success('Table created successfully');
      this.loader.hide();
      this.location.back();
    }, error => {
      console.error('Error creating table', error);
      this.loader.hide();
    });
  }


  checkSpace(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;


    if (input.value.includes(' ')) {
      this.toastrService.error('Spaces are not allowed in Table Name');
      input.value = input.value.replace(/\s/g, '');


      this.schemaForm.get('tableName')?.setValue(input.value);
    }
  }
}
