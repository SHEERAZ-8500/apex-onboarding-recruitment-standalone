import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EncryptionService } from '../management-services/encryption.service';

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  constructor(private http: HttpClient, private encryptionService: EncryptionService) { }


  // auth apis 
  logIn(userCredentials: any) {
    let devicefromStorage = localStorage.getItem('deviceId') || '';
    let deviceId = '';
    if (devicefromStorage) {
      deviceId = this.encryptionService.decrypt(devicefromStorage);
    }

    const headers = new HttpHeaders({
      'X-Device-Id': deviceId || ''
    });
    return this.http.post('auth/login', userCredentials, { headers });
  }
  // In ApiService
  logout() {

    return this.http.post('auth/logout', {});
  }

  refreshToken(refreshToken: any) {
    return this.http.post('auth/refresh', { refreshToken });
  }
  verifyOtp(otp: any) {
    return this.http.post('auth/otp/verify', otp, { observe: 'response' });
  }
  resendOtp(preAuthToken: any) {
    return this.http.post('auth/otp/resend', { preAuthToken });
  }
  verifyInvitMemberAddNewPassword(data: any) {
    return this.http.post('auth/invite/complete', data);
  }

  resetPasswordByEmail(data: any) {
    return this.http.post('auth/password/forgot', data);
  }
  createNewPassword(data: any) {
    return this.http.post('auth/password/reset', data);
  }
  inviteComplete(data: any) {
    return this.http.post('auth/invite/complete', data);
  }



  // admin
  createNewUser(data: any) {
    return this.http.post('admin/users', data);
  }
  getAllRolls() {
    return this.http.get(`admin/roles`);
  }
  getUserRolePermissions(publicId: any) {
    return this.http.get(`admin/roles/${publicId}`);
  }

  // create new form
  createNewForm(data: any) {
    return this.http.post('admin/forms', data);
  }

  activateForm(formCode: string, status: boolean) {
    return this.http.patch(`admin/forms/${formCode}/activation?active=${status}`, {});
  }


  // roles
  getUserAllroles() {
    return this.http.get(`admin/roles`);
  }
  createNewRole(data: any) {
    return this.http.post('admin/roles', data);
  }


  // req lookup creations
  createJobTitle(data: any) {
    return this.http.post('job-titles', data);
  }
  createEmployeeCategories(data: any) {
    return this.http.post('employee-categories', data);
  }
  createDepartment(data: any) {
    return this.http.post('departments', data);
  }
  createBranch(data: any) {
    return this.http.post('branches', data);
  }
  createLookupEnum(data: any) {
    return this.http.post('admin/lookups/enums', data);
  }
  getAllLookupEnums() {
    return this.http.get(`admin/lookups/enums`);
  }
  getLookupEnumByCode(code: any) {
    return this.http.get(`admin/lookups/enums/${code}`);
  }
  getLokupTableByCode(code: any) {
    return this.http.get(`admin/lookups/tables/${code}/values`);
  }
  getLokupTableByCodeWithFormType(code: any) {
    return this.http.get(`forms/${code}/submissions`);
  }
  // tables

  createNewColumnInIndependentTable(rowComponentCode: string, data: any) {
    return this.http.patch(`admin/row-tables/${rowComponentCode}/columns`, data)
  }


  createNewColumnInLookupTable(lookupName: string, data: any) {
    return this.http.patch(`admin/lookups/tables/${lookupName}/columns`, data)
  }

  // enmus
  addNewEnum(enumComponentCode: string, data: any) {
    return this.http.patch(`admin/lookups/enums/${enumComponentCode}/values`, data);
  }
  createLookUpTable(data: any) {
    return this.http.post('admin/lookups/tables', data);
  }
  createRowInLookUpTable(componentCode: any, data: any) {
    return this.http.post(`admin/lookups/tables/${componentCode}/values`, data);
  }
  createRowInTable(data: any) {
    return this.http.post(`api/admin/row-tables`, data);
  }
  getAllLookUpTables() {
    return this.http.get(`admin/lookups/tables`);
  }
  getAllIndependentTables() {
    return this.http.get(`admin/row-tables?filter=ALL`);
  }
  createIndependentTable(data: any) {
    return this.http.post('admin/row-tables', data);
  }
  // forms apis
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
  getAllUser() {
    return this.http.get('admin/users');
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
  getAllTables(companyId: any) {
    return this.http.get(`v1/md/tables`,
      //   {
      //   params: { companyId: companyId }
      // }
    );
  }
  createTable(tableSchema: any) {
    return this.http.post(`v1/md/tables`, tableSchema);
  }

  getAllCandidates(status = 'INTERVIEWED', page = 0, size = 10) {
    return this.http.get(`recruitment/candidates?status=${status}&page=${page}&size=${size}`);
  }
  saveCandidateScreening(candidatePublicId: string, data: any) {
    return this.http.post(`recruitment/candidates/${candidatePublicId}/decision`, data);
  }
  canididateShortlist(data: any) {
    return this.http.post(`recruitment/candidates/shortlist`, data);
  }
  interviewFeedback(interviewPublicId: string, data: any) {
    return this.http.post(`recruitment/interviews/${interviewPublicId}/feedback`, data);
  }
  getSelectedCandidatesInterview(publicIds: string[]) {
    return this.http.get(`recruitment/candidates/${publicIds}/interviews?status=SCHEDULED&page=0&size=90`);
  }
  getAlljobsRequisiton(page = 0, size = 10) {
    return this.http.get(`recruitment/job-requisitions?isActive=true&page=${page}&size=${size}`);
  }
  getAllCandidatesTables(page = 0, size = 20,candidatePublicId = '') {
    return this.http.get(`recruitment/candidates/records?isActive=true&page=${page}&size=${size}&candidatePublicId=${candidatePublicId}`);
  }
  getAllInterviewTables(page = 0, size = 20,candidatePublicId = '') {
    return this.http.get(`recruitment/interviews/records?isActive=true&page=${page}&size=${size}&candidatePublicId=${candidatePublicId}`);
  }
  getAllLookupValuesInTable(lookupName: string, page = 0, size = 50) {
    return this.http.get(`admin/lookups/tables/${lookupName}/values?page=${page}&size=${size}`);
  }
  getAllEnumValuesInTable(enumComponentCode: string, page = 0, size = 50) {
    return this.http.get(`admin/lookups/enums/${enumComponentCode}?page=${page}&size=${size}`);
  }
  getAllTabsValuesInTable(rowComponentCode: string, page = 0, size = 50) {
    return this.http.get(
      `admin/row-tables/${rowComponentCode}?filter=ACTIVE&page=${page}&size=${size}`
    );
  }
  editLookupTableRow(lookupName: string, publicId: string, data: any) {
    return this.http.patch(`admin/lookups/tables/${lookupName}/values/${publicId}`, data);
  }
  deletValueInFromTbale(formCode: string, code: string,status:string) {
    return this.http.patch(`forms/${formCode}/${code}/${status}`,{});
  }

  
}