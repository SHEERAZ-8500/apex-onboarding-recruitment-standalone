import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class PermissionService {
      permissionModules = [
    {
      key: 'ADMINISTRATION',
      name: 'Administration',
      permissions: [
        { code: 'ADMINISTRATION_ASSIGN_PERMISSIONS', label: 'Assign Permissions' },
        { code: 'ADMINISTRATION_DEPARTMENTS', label: 'Departments' },
        { code: 'ADMINISTRATION_DOCUMENT_APPROVAL', label: 'Document Approval' },
        { code: 'ADMINISTRATION_APPROVAL_HIERARCHY', label: 'Approval Hierarchy' },
        { code: 'ADMINISTRATION_COMPANY_DETAIL', label: 'Company Detail' },
        { code: 'ADMINISTRATION_PROJECTS', label: 'Projects' },
        { code: 'ADMINISTRATION_TASKS', label: 'Tasks' },
        { code: 'ADMINISTRATION_CUSTOMERS', label: 'Customers' },
        { code: 'ADMINISTRATION_DEDUCTIONS', label: 'Deductions' },
        { code: 'ADMINISTRATION_EMAIL_TEMPLATE', label: 'Email Template' },
        { code: 'ADMINISTRATION_ADDITION', label: 'Addition' },
        { code: 'ADMINISTRATION_MEDICAL_INSURANCE', label: 'Medical Insurance' },
        { code: 'ADMINISTRATION_ACCOMMODATION', label: 'Accommodation' },
        { code: 'ADMINISTRATION_PAY_ELEMENT', label: 'Pay Element' },
        { code: 'ADMINISTRATION_SHIFTS', label: 'Shifts' },
        { code: 'ADMINISTRATION_LEAVES', label: 'Leaves' },
        { code: 'ADMINISTRATION_LOAN', label: 'Loan' },
        { code: 'ADMINISTRATION_HIERARCHY', label: 'Hierarchy' },
        { code: 'ADMINISTRATION_EMP_COSTS', label: 'Employee Costs' },
        { code: 'ADMINISTRATION_GOSIID', label: 'GOSI ID' },
        { code: 'ADMINISTRATION_EMP_CATEGORY', label: 'Employee Category' },
        { code: 'ADMINISTRATION_EMPLOYEES_MASTER', label: 'Employees Master' },
        { code: 'ADMINISTRATION_FORMS', label: 'Forms' },
        { code: 'ADMINISTRATION_JOB_DESCRIPTION', label: 'Job Description' },
        { code: 'ADMINISTRATION_DESIGNATION', label: 'Designation' },
        { code: 'ADMINISTRATION_COST_CENTERS', label: 'Cost Centers' },
        { code: 'ADMINISTRATION_LOCATIONS', label: 'Locations' },
        { code: 'ADMINISTRATION_QUALIFICATION', label: 'Qualification' },
        { code: 'ADMINISTRATION_SKILLS', label: 'Skills' },
        { code: 'ADMINISTRATION_ROLES', label: 'Roles' },
        { code: 'ADMINISTRATION_ROLES_VIEW', label: 'View Roles' },
        { code: 'ADMINISTRATION_ROLES_MANAGE', label: 'Manage Roles' }
      ]
    },
    {
      key: 'PAYROLL',
      name: 'Payroll',
      permissions: [
        { code: 'PAYROLL_PAYROLL_PROCESS', label: 'Payroll Process' },
        { code: 'PAYROLL_DEPARTMENT_CHANGE', label: 'Department Change' },
        { code: 'PAYROLL_LEAVE_APPLICATION', label: 'Leave Application' },
        { code: 'PAYROLL_LOAN_APPLICATION', label: 'Loan Application' },
        { code: 'PAYROLL_INCREMENT_ARREAR', label: 'Increment Arrear' },
        { code: 'PAYROLL_RESIGNATION_TERMINATION', label: 'Resignation Termination' },
        { code: 'PAYROLL_SALARY_DISBURSEMENT', label: 'Salary Disbursement' },
        { code: 'PAYROLL_LEAVE_SALARY', label: 'Leave Salary' },
        { code: 'PAYROLL_EMPLOYEE_SALARY', label: 'Employee Salary' },
        { code: 'PAYROLL_GRATUITY', label: 'Gratuity' }
      ]
    },
    {
      key: 'RECRUITMENT',
      name: 'Recruitment',
      permissions: [
        { code: 'RECRUITMENT_OUTSOURCE_CONTRACT', label: 'Outsource Contract' },
        { code: 'RECRUITMENT_JOINING', label: 'Joining' },
        { code: 'RECRUITMENT_MOBILIZATION', label: 'Mobilization' },
        { code: 'RECRUITMENT_CONTRACT', label: 'Contract' },
        { code: 'RECRUITMENT_OFFER_LETTER', label: 'Offer Letter' },
        { code: 'RECRUITMENT_INTERVIEW_REPORT', label: 'Interview Report' },
        { code: 'RECRUITMENT_INTERVIEWS_RESULT', label: 'Interview Result' },
        { code: 'RECRUITMENT_INTERVIEW_SCHEDULING', label: 'Interview Scheduling' },
        { code: 'RECRUITMENT_SCREENING', label: 'Screening' },
        { code: 'RECRUITMENT_CANDIDATE_MASTER_DATA', label: 'Candidate Master Data' },
        { code: 'RECRUITMENT_MAN_POWER_REQUISITION', label: 'Man Power Requisition' },
        { code: 'RECRUITMENT_SELECTION', label: 'Selection' }
      ]
    },
    {
      key: 'REPORTS',
      name: 'Reports',
      permissions: [
        { code: 'REPORTS_DOCUMENT_EXPIRY', label: 'Document Expiry' },
        { code: 'REPORTS_EMPLOYEES_LIST', label: 'Employees List' },
        { code: 'REPORTS_EMPLOYEE_PROFILE', label: 'Employee Profile' },
        { code: 'REPORTS_PAYROLL_REPORT', label: 'Payroll Report' },
        { code: 'REPORTS_ATTENDANCE', label: 'Attendance' },
        { code: 'REPORTS_SALARY_SLIP', label: 'Salary Slip' },
        { code: 'REPORTS_SALARY_SHEET', label: 'Salary Sheet' },
        { code: 'REPORTS_LEAVE_BALANCE', label: 'Leave Balance' }
      ]
    },
    {
      key: 'TRANSACTION',
      name: 'Transaction',
      permissions: [
        { code: 'TRANSACTION_DAILY_TIMESHEET', label: 'Daily Timesheet' },
        { code: 'TRANSACTION_SHIFT_GROUP', label: 'Shift Group' },
        { code: 'TRANSACTION_MONTHLY_ATTENDANCE', label: 'Monthly Attendance' }
      ]
    },
    {
      key: 'ESS',
      name: 'ESS',
      permissions: [
        { code: 'ESS_LOAN_INSTALLMENTS_DETAILS', label: 'Loan Installments Details' },
        { code: 'ESS_PERFORMANCE_APPRAISALS', label: 'Performance Appraisals' },
        { code: 'ESS_EMPLOYEE_BALANCE_REPORT', label: 'Employee Balance Report' },
        { code: 'ESS_LOCATION_SITE_CHANGE', label: 'Location Site Change' },
        { code: 'ESS_INVOICING_OUTSOURCED', label: 'Invoicing Outsourced' },
        { code: 'ESS_OPEN_VACANCIES_REPORT', label: 'Open Vacancies Report' },
        { code: 'ESS_TRAINING_REPORT', label: 'Training Report' }
      ]
    }
  ];
}