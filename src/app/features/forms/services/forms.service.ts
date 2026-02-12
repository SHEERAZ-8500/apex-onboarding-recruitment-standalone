import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormsService {
  constructor(private http: HttpClient) { }

  // Forms APIs
  createNewForm(data: any) {
    return this.http.post('admin/forms', data);
  }

  activateForm(formCode: string, status: boolean) {
    return this.http.patch(`admin/forms/${formCode}/activation?active=${status}`, {});
  }

  getFormByFormCode(formCode: any) {
    return this.http.get(`forms/${formCode}`);
  }

  manageFieldsVisibility(formCode: any, status: any, data: any) {
    return this.http.patch(`admin/forms/${formCode}/fields/${data}/${status}`, {});
  }

  saveFormData(formCode: any, data: any) {
    return this.http.post(`forms/${formCode}`, data);
  }

  updateFormData(formCode: any, code: any, data: any) {
    return this.http.patch(`forms/${formCode}/${code}`, data);
  }

  getUserAllForms() {
    return this.http.get(`forms`);
  }

  createNewUDF(formCode: any, data: any) {
    return this.http.post(`admin/forms/${formCode}/fields/basic`, data);
  }

  getFormById(id: any, filter: any = 'ALL') {
    return this.http.get(`forms/${id}?filter=${filter}`);
  }

  createNewUDDLookupTable(formCode: any, data: any) {
    return this.http.post(`admin/forms/${formCode}/link/lookup-table`, data);
  }

  createNewUDDLookupEnum(formCode: any, data: any) {
    return this.http.post(`admin/forms/${formCode}/link/lookup-enum`, data);
  }

  createNewUDDIndependentTable(formCode: any, data: any) {
    return this.http.post(`admin/forms/${formCode}/link/row-table`, data);
  }

  saveFormDefinition(formDefinition: any) {
    return this.http.post('v1/forms/definitions', formDefinition);
  }

  getFormAllDefinition() {
    return this.http.get(`v1/forms/definitions`);
  }

  getFormDefinitionById(id: any) {
    return this.http.get(`v1/forms/definitions/${id}`);
  }

  updateFormDefinitionById(id: any, formDefinition: any) {
    return this.http.put(`v1/forms/definitions/${id}`, formDefinition);
  }

  saveUserFormData(formDefinitionPublicId: any, userFormData: any) {
    return this.http.post(`v1/forms/submissions/${formDefinitionPublicId}`, userFormData);
  }

  getUserFormData(publicId: any) {
    return this.http.get(`v1/forms/submissions/${publicId}`);
  }

  updateUserFormData(publicId: any, userFormData: any) {
    return this.http.put(`v1/forms/submissions/${publicId}`, userFormData);
  }

  getAllFormSubmissionsById(formDefinitionPublicId: string) {
    return this.http.get(`v1/forms/submissions`, {
      params: { formDefinitionPublicId: formDefinitionPublicId }
    });
  }

  deletValueInFromTbale(formCode: string, code: string, status: string) {
    return this.http.patch(`forms/${formCode}/${code}/${status}`, {});
  }

  getLokupTableByCode(code: any) {
    return this.http.get(`admin/lookups/tables/${code}/values`);
  }
  getLokupTableByCodeWithFormType(code: any) {
    return this.http.get(`forms/${code}/submissions`);
  }
}
