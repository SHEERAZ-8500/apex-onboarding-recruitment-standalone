import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class TemplateDataService {

    constructor() { }

    // Employee Form Template with Tabs
    getEmployeeFormTemplate() {
        return {
            components: [
                // Basic Information Section
                {
                    type: 'panel',
                    title: 'Basic Information',
                    collapsible: false,
                    key: 'basicInfoPanel',
                    components: [
                        {
                            type: 'columns',
                            columns: [
                                {
                                    components: [
                                        {
                                            type: 'textfield',
                                            key: 'code',
                                            label: 'Code',
                                            placeholder: 'Employee Code',
                                            input: true,
                                            validate: {
                                                required: true
                                            }
                                        }
                                    ],
                                    width: 4
                                },
                                {
                                    components: [
                                        {
                                            type: 'textfield',
                                            key: 'legacyCode',
                                            label: 'Legacy Code',
                                            placeholder: 'Legacy Code',
                                            input: true
                                        }
                                    ],
                                    width: 4
                                },
                                {
                                    components: [
                                        {
                                            type: 'textfield',
                                            key: 'name',
                                            label: 'Name',
                                            placeholder: 'Enter Name',
                                            input: true,
                                            validate: {
                                                required: true
                                            }
                                        }
                                    ],
                                    width: 4
                                }
                            ]
                        },
                        {
                            type: 'columns',
                            columns: [
                                {
                                    components: [
                                        {
                                            type: 'textfield',
                                            key: 'fatherName',
                                            label: 'Father Name',
                                            placeholder: 'Enter Father Name',
                                            input: true
                                        }
                                    ],
                                    width: 4
                                },
                                {
                                    components: [
                                        {
                                            type: 'select',
                                            key: 'employeeCategory',
                                            label: 'Employee Category',
                                            placeholder: 'Category',
                                            input: true,
                                            data: {
                                                values: [
                                                    { label: 'Permanent', value: 'permanent' },
                                                    { label: 'Contract', value: 'contract' },
                                                    { label: 'Temporary', value: 'temporary' }
                                                ]
                                            },
                                            validate: {
                                                required: true
                                            }
                                        }
                                    ],
                                    width: 4
                                },
                                {
                                    components: [
                                        {
                                            type: 'select',
                                            key: 'gender',
                                            label: 'Gender',
                                            placeholder: 'Gender',
                                            input: true,
                                            data: {
                                                values: [
                                                    { label: 'Male', value: 'male' },
                                                    { label: 'Female', value: 'female' },
                                                    { label: 'Other', value: 'other' }
                                                ]
                                            },
                                            validate: {
                                                required: true
                                            }
                                        }
                                    ],
                                    width: 4
                                }
                            ]
                        },
                        {
                            type: 'columns',
                            columns: [
                                {
                                    components: [
                                        {
                                            type: 'select',
                                            key: 'jobTitle',
                                            label: 'Select Job Title',
                                            placeholder: 'Job Title',
                                            input: true,
                                            data: {
                                                values: [
                                                    { label: 'Manager', value: 'manager' },
                                                    { label: 'Senior Developer', value: 'senior_developer' },
                                                    { label: 'Junior Developer', value: 'junior_developer' },
                                                    { label: 'HR Executive', value: 'hr_executive' }
                                                ]
                                            },
                                            validate: {
                                                required: true
                                            }
                                        }
                                    ],
                                    width: 4
                                },
                                {
                                    components: [
                                        {
                                            type: 'select',
                                            key: 'company',
                                            label: 'Select Company',
                                            placeholder: 'Company',
                                            input: true,
                                            data: {
                                                values: [
                                                    { label: 'APEX Innovation', value: 'apex_innovation' },
                                                    { label: 'Tech Corp', value: 'tech_corp' }
                                                ]
                                            },
                                            validate: {
                                                required: true
                                            }
                                        }
                                    ],
                                    width: 4
                                },
                                {
                                    components: [],
                                    width: 4
                                }
                            ]
                        }
                    ]
                },

                // Additional Information Section
                {
                    type: 'panel',
                    title: 'Additional Information',
                    collapsible: true,
                    collapsed: false,
                    key: 'additionalInfoPanel',
                    components: [
                        {
                            type: 'columns',
                            columns: [
                                {
                                    components: [
                                        {
                                            type: 'select',
                                            key: 'manager',
                                            label: 'Manager',
                                            placeholder: 'Manager',
                                            input: true,
                                            data: {
                                                values: []
                                            }
                                        }
                                    ],
                                    width: 4
                                },
                                {
                                    components: [
                                        {
                                            type: 'select',
                                            key: 'department',
                                            label: 'Select Department',
                                            placeholder: 'Department',
                                            input: true,
                                            data: {
                                                values: [
                                                    { label: 'IT', value: 'it' },
                                                    { label: 'HR', value: 'hr' },
                                                    { label: 'Finance', value: 'finance' },
                                                    { label: 'Operations', value: 'operations' }
                                                ]
                                            },
                                            validate: {
                                                required: true
                                            }
                                        }
                                    ],
                                    width: 4
                                },
                                {
                                    components: [
                                        {
                                            type: 'datetime',
                                            key: 'dateOfBirth',
                                            label: 'Date of birth',
                                            placeholder: 'mm/dd/yyyy',
                                            input: true,
                                            format: 'MM/dd/yyyy',
                                            enableDate: true,
                                            enableTime: false
                                        }
                                    ],
                                    width: 4
                                }
                            ]
                        },
                        {
                            type: 'columns',
                            columns: [
                                {
                                    components: [
                                        {
                                            type: 'select',
                                            key: 'nationality',
                                            label: 'Nationality',
                                            placeholder: 'Nationality',
                                            input: true,
                                            data: {
                                                values: [
                                                    { label: 'Pakistani', value: 'pakistani' },
                                                    { label: 'Indian', value: 'indian' },
                                                    { label: 'American', value: 'american' }
                                                ]
                                            },
                                            validate: {
                                                required: true
                                            }
                                        }
                                    ],
                                    width: 4
                                },
                                {
                                    components: [
                                        {
                                            type: 'textfield',
                                            key: 'mobileNumber',
                                            label: 'Mobile Number',
                                            placeholder: '092321654894',
                                            input: true,
                                            inputMask: '999999999999'
                                        }
                                    ],
                                    width: 4
                                },
                                {
                                    components: [
                                        {
                                            type: 'email',
                                            key: 'emailAddress',
                                            label: 'Email address',
                                            placeholder: 'email@email.com',
                                            input: true
                                        }
                                    ],
                                    width: 4
                                }
                            ]
                        },
                        {
                            type: 'columns',
                            columns: [
                                {
                                    components: [
                                        {
                                            type: 'datetime',
                                            key: 'dateOfJoining',
                                            label: 'Date of Joining',
                                            placeholder: 'mm/dd/yyyy',
                                            input: true,
                                            format: 'MM/dd/yyyy',
                                            enableDate: true,
                                            enableTime: false,
                                            validate: {
                                                required: true
                                            }
                                        }
                                    ],
                                    width: 4
                                },
                                {
                                    components: [
                                        {
                                            type: 'textfield',
                                            key: 'homeAddress',
                                            label: 'Home Address',
                                            placeholder: 'Home Address',
                                            input: true
                                        }
                                    ],
                                    width: 4
                                },
                                {
                                    components: [
                                        {
                                            type: 'select',
                                            key: 'bloodGroup',
                                            label: 'Blood Group',
                                            placeholder: 'Blood Group',
                                            input: true,
                                            data: {
                                                values: [
                                                    { label: 'A+', value: 'a_positive' },
                                                    { label: 'A-', value: 'a_negative' },
                                                    { label: 'B+', value: 'b_positive' },
                                                    { label: 'B-', value: 'b_negative' },
                                                    { label: 'O+', value: 'o_positive' },
                                                    { label: 'O-', value: 'o_negative' },
                                                    { label: 'AB+', value: 'ab_positive' },
                                                    { label: 'AB-', value: 'ab_negative' }
                                                ]
                                            }
                                        }
                                    ],
                                    width: 4
                                }
                            ]
                        },
                        {
                            type: 'columns',
                            columns: [
                                {
                                    components: [
                                        {
                                            type: 'textfield',
                                            key: 'sponsor',
                                            label: 'Sponsor',
                                            placeholder: 'AZ Engineers and Partners llc',
                                            input: true
                                        }
                                    ],
                                    width: 4
                                },
                                {
                                    components: [
                                        {
                                            type: 'textfield',
                                            key: 'contractNo',
                                            label: 'Contract No',
                                            placeholder: 'Contract No',
                                            input: true
                                        }
                                    ],
                                    width: 4
                                },
                                {
                                    components: [
                                        {
                                            type: 'select',
                                            key: 'employeeGrade',
                                            label: 'Select Employee Grade',
                                            placeholder: 'Employee Grade',
                                            input: true,
                                            data: {
                                                values: [
                                                    { label: 'Grade A', value: 'grade_a' },
                                                    { label: 'Grade B', value: 'grade_b' },
                                                    { label: 'Grade C', value: 'grade_c' }
                                                ]
                                            },
                                            validate: {
                                                required: true
                                            }
                                        }
                                    ],
                                    width: 4
                                }
                            ]
                        },
                        {
                            type: 'columns',
                            columns: [
                                {
                                    components: [
                                        {
                                            type: 'select',
                                            key: 'religion',
                                            label: 'Religion',
                                            placeholder: 'Religion',
                                            input: true,
                                            data: {
                                                values: [
                                                    { label: 'Islam', value: 'islam' },
                                                    { label: 'Christianity', value: 'christianity' },
                                                    { label: 'Hinduism', value: 'hinduism' },
                                                    { label: 'Other', value: 'other' }
                                                ]
                                            }
                                        }
                                    ],
                                    width: 4
                                },
                                {
                                    components: [
                                        {
                                            type: 'select',
                                            key: 'maritalStatus',
                                            label: 'Marital Status',
                                            placeholder: 'Marital Status',
                                            input: true,
                                            data: {
                                                values: [
                                                    { label: 'Single', value: 'single' },
                                                    { label: 'Married', value: 'married' },
                                                    { label: 'Divorced', value: 'divorced' }
                                                ]
                                            }
                                        }
                                    ],
                                    width: 4
                                },
                                {
                                    components: [
                                        {
                                            type: 'textfield',
                                            key: 'medicalInsuranceNo',
                                            label: 'Medical Insurance No.',
                                            placeholder: 'Medical Insurance No.',
                                            input: true
                                        }
                                    ],
                                    width: 4
                                }
                            ]
                        },
                        {
                            type: 'columns',
                            columns: [
                                {
                                    components: [
                                        {
                                            type: 'textfield',
                                            key: 'emergencyContact',
                                            label: 'Emergency Contact',
                                            placeholder: '092321123145',
                                            input: true,
                                            inputMask: '999999999999'
                                        }
                                    ],
                                    width: 4
                                },
                                {
                                    components: [
                                        {
                                            type: 'select',
                                            key: 'visaType',
                                            label: 'Visa Type',
                                            placeholder: 'VisaType',
                                            input: true,
                                            data: {
                                                values: [
                                                    { label: 'Work Visa', value: 'work_visa' },
                                                    { label: 'Business Visa', value: 'business_visa' },
                                                    { label: 'Visit Visa', value: 'visit_visa' }
                                                ]
                                            }
                                        }
                                    ],
                                    width: 4
                                },
                                {
                                    components: [
                                        {
                                            type: 'textfield',
                                            key: 'visaIqamaId',
                                            label: 'Visa/Iqama/ID',
                                            placeholder: 'Visa/Iqama/ID',
                                            input: true
                                        }
                                    ],
                                    width: 4
                                }
                            ]
                        },
                        {
                            type: 'columns',
                            columns: [
                                {
                                    components: [
                                        {
                                            type: 'datetime',
                                            key: 'visaIqamaExpiryDate',
                                            label: 'Visa/Iqama/ID Expiry Date',
                                            placeholder: 'mm/dd/yyyy',
                                            input: true,
                                            format: 'MM/dd/yyyy',
                                            enableDate: true,
                                            enableTime: false
                                        }
                                    ],
                                    width: 4
                                },
                                {
                                    components: [
                                        {
                                            type: 'textfield',
                                            key: 'bankName',
                                            label: 'Bank Name',
                                            placeholder: 'Enter Bank Name',
                                            input: true
                                        }
                                    ],
                                    width: 4
                                },
                                {
                                    components: [
                                        {
                                            type: 'textfield',
                                            key: 'accountNumber',
                                            label: 'Account Number',
                                            placeholder: 'Enter Account Number',
                                            input: true
                                        }
                                    ],
                                    width: 4
                                }
                            ]
                        },
                        {
                            type: 'columns',
                            columns: [
                                {
                                    components: [
                                        {
                                            type: 'textarea',
                                            key: 'remarks',
                                            label: 'Remarks',
                                            placeholder: 'Enter Remarks',
                                            input: true,
                                            rows: 3
                                        }
                                    ],
                                    width: 4
                                },
                                {
                                    components: [
                                        {
                                            type: 'select',
                                            key: 'currentStatus',
                                            label: 'Current Status',
                                            placeholder: 'Current Status',
                                            input: true,
                                            data: {
                                                values: [
                                                    { label: 'Active', value: 'active' },
                                                    { label: 'Inactive', value: 'inactive' },
                                                    { label: 'On Leave', value: 'on_leave' }
                                                ]
                                            }
                                        }
                                    ],
                                    width: 4
                                },
                                {
                                    components: [
                                        {
                                            type: 'select',
                                            key: 'project',
                                            label: 'Select Project',
                                            placeholder: 'Project',
                                            input: true,
                                            data: {
                                                values: [
                                                    { label: 'Project A', value: 'project_a' },
                                                    { label: 'Project B', value: 'project_b' }
                                                ]
                                            },
                                            validate: {
                                                required: true
                                            }
                                        }
                                    ],
                                    width: 4
                                }
                            ]
                        },
                        {
                            type: 'columns',
                            columns: [
                                {
                                    components: [
                                        {
                                            type: 'datetime',
                                            key: 'lastIncrementDate',
                                            label: 'Last Increment Date',
                                            placeholder: 'mm/dd/yyyy',
                                            input: true,
                                            format: 'MM/dd/yyyy',
                                            enableDate: true,
                                            enableTime: false
                                        }
                                    ],
                                    width: 4
                                },
                                {
                                    components: [
                                        {
                                            type: 'number',
                                            key: 'lastIncrementAmount',
                                            label: 'Last Increment Amount',
                                            placeholder: 'Last Increment Amount',
                                            input: true
                                        }
                                    ],
                                    width: 4
                                },
                                {
                                    components: [
                                        {
                                            type: 'select',
                                            key: 'paymentMethod',
                                            label: 'Payment Method',
                                            placeholder: 'Payment Method',
                                            input: true,
                                            data: {
                                                values: [
                                                    { label: 'Bank Transfer', value: 'bank_transfer' },
                                                    { label: 'Cash', value: 'cash' },
                                                    { label: 'Cheque', value: 'cheque' }
                                                ]
                                            }
                                        }
                                    ],
                                    width: 4
                                }
                            ]
                        },
                        {
                            type: 'columns',
                            columns: [
                                {
                                    components: [
                                        {
                                            type: 'select',
                                            key: 'disability',
                                            label: 'Disability',
                                            placeholder: 'Disability',
                                            input: true,
                                            multiple: true,
                                            data: {
                                                values: [
                                                    { label: 'None', value: 'none' },
                                                    { label: 'Physical', value: 'physical' },
                                                    { label: 'Visual', value: 'visual' },
                                                    { label: 'Hearing', value: 'hearing' }
                                                ]
                                            }
                                        }
                                    ],
                                    width: 4
                                },
                                {
                                    components: [
                                        {
                                            type: 'select',
                                            key: 'employeeType',
                                            label: 'Employee Type',
                                            placeholder: 'Employee Type',
                                            input: true,
                                            multiple: true,
                                            data: {
                                                values: [
                                                    { label: 'Full Time', value: 'full_time' },
                                                    { label: 'Part Time', value: 'part_time' },
                                                    { label: 'Remote', value: 'remote' }
                                                ]
                                            }
                                        }
                                    ],
                                    width: 4
                                },
                                {
                                    components: [
                                        {
                                            type: 'textfield',
                                            key: 'buildingNumber',
                                            label: 'Building Number',
                                            placeholder: 'Building Number',
                                            input: true
                                        }
                                    ],
                                    width: 4
                                }
                            ]
                        },
                        {
                            type: 'columns',
                            columns: [
                                {
                                    components: [
                                        {
                                            type: 'textfield',
                                            key: 'streetName',
                                            label: 'Street Name',
                                            placeholder: 'Street Name',
                                            input: true
                                        }
                                    ],
                                    width: 4
                                },
                                {
                                    components: [
                                        {
                                            type: 'textfield',
                                            key: 'districtName',
                                            label: 'District Name',
                                            placeholder: 'District Name',
                                            input: true
                                        }
                                    ],
                                    width: 4
                                },
                                {
                                    components: [
                                        {
                                            type: 'select',
                                            key: 'country',
                                            label: 'Country',
                                            placeholder: 'Country',
                                            input: true,
                                            data: {
                                                values: [
                                                    { label: 'Pakistan', value: 'pakistan' },
                                                    { label: 'India', value: 'india' },
                                                    { label: 'USA', value: 'usa' },
                                                    { label: 'UK', value: 'uk' }
                                                ]
                                            }
                                        }
                                    ],
                                    width: 4
                                }
                            ]
                        },
                        {
                            type: 'columns',
                            columns: [
                                {
                                    components: [
                                        {
                                            type: 'select',
                                            key: 'city',
                                            label: 'City',
                                            placeholder: 'City',
                                            input: true,
                                            data: {
                                                values: [
                                                    { label: 'Karachi', value: 'karachi' },
                                                    { label: 'Lahore', value: 'lahore' },
                                                    { label: 'Islamabad', value: 'islamabad' }
                                                ]
                                            }
                                        }
                                    ],
                                    width: 4
                                },
                                {
                                    components: [
                                        {
                                            type: 'select',
                                            key: 'countryCode',
                                            label: 'Country Code',
                                            placeholder: 'CountryCode',
                                            input: true,
                                            data: {
                                                values: [
                                                    { label: '+92 (Pakistan)', value: '+92' },
                                                    { label: '+91 (India)', value: '+91' },
                                                    { label: '+1 (USA)', value: '+1' }
                                                ]
                                            }
                                        }
                                    ],
                                    width: 4
                                },
                                {
                                    components: [],
                                    width: 4
                                }
                            ]
                        }
                    ]
                },

                // Tabs Section
                {
                    type: 'tabs',
                    key: 'employeeTabs',
                    components: [
                        // Tab 1: Employee Cost Info
                        {
                            type: 'panel',
                            label: 'Employee Cost Info',
                            key: 'employeeCostInfoTab',
                            components: this.getEmployeeCostInfoTemplate().components
                        },
                        // Tab 2: Employee ID Info
                        {
                            type: 'panel',
                            label: 'Employee ID Info',
                            key: 'employeeIdInfoTab',
                            components: this.getEmployeeIdInfoTemplate().components
                        },
                        // Tab 3: Employee Leave Info
                        {
                            type: 'panel',
                            label: 'Employee Leave Info',
                            key: 'employeeLeaveInfoTab',
                            components: this.getEmployeeLeaveInfoTemplate().components
                        },
                        // Tab 4: Employee Salary Info
                        {
                            type: 'panel',
                            label: 'Employee Salary Info',
                            key: 'employeeSalaryInfoTab',
                            components: this.getEmployeeSalaryInfoTemplate().components
                        },
                        // Tab 5: Qualification
                        {
                            type: 'panel',
                            label: 'Qualification',
                            key: 'qualificationTab',
                            components: this.getQualificationTemplate().components
                        },
                        // Tab 6: Skills
                        {
                            type: 'panel',
                            label: 'Skills',
                            key: 'skillsTab',
                            components: this.getSkillsTemplate().components
                        },
                        // Tab 7: Trainings
                        {
                            type: 'panel',
                            label: 'Trainings',
                            key: 'trainingsTab',
                            components: this.getTrainingsTemplate().components
                        },
                        // Tab 8: Experience
                        {
                            type: 'panel',
                            label: 'Experience',
                            key: 'experienceTab',
                            components: this.getExperienceTemplate().components
                        },
                        // Tab 9: Family Detail
                        {
                            type: 'panel',
                            label: 'Family Detail',
                            key: 'familyDetailTab',
                            components: this.getFamilyDetailTemplate().components
                        },
                        // Tab 10: Employee Belongings
                        {
                            type: 'panel',
                            label: 'Employee Belongings',
                            key: 'employeeBelongingsTab',
                            components: this.getEmployeeBelongingsTemplate().components
                        },
                        // Tab 11: Pre Requisite
                        {
                            type: 'panel',
                            label: 'Pre Requisite',
                            key: 'preRequisiteTab',
                            components: this.getPreRequisiteTemplate().components
                        }
                    ]
                }
            ]
        };
    }

    // Employee Cost Info Tab
    getEmployeeCostInfoTemplate() {
        return {
            components: [
                {
                    type: 'columns',
                    columns: [
                        {
                            components: [{
                                type: 'select',
                                key: 'costCode',
                                label: 'Cost Code',
                                placeholder: 'Cost Code',
                                input: true,
                                data: {
                                    values: []
                                }
                            }],
                            width: 4
                        },
                        {
                            components: [{
                                type: 'textfield',
                                key: 'costName',
                                label: 'Cost Name',
                                placeholder: 'Enter Cost Name',
                                input: true
                            }],
                            width: 4
                        },
                        {
                            components: [{
                                type: 'textfield',
                                key: 'fixed',
                                label: 'Fixed',
                                placeholder: 'Enter Fixed',
                                input: true
                            }],
                            width: 4
                        }
                    ]
                },
                {
                    type: 'columns',
                    columns: [
                        {
                            components: [{
                                type: 'number',
                                key: 'amount',
                                label: 'Amount',
                                placeholder: 'Enter Amount',
                                input: true
                            }],
                            width: 4
                        },
                        {
                            components: [{
                                type: 'select',
                                key: 'basis',
                                label: 'Basis',
                                placeholder: 'Basis',
                                input: true,
                                data: {
                                    values: []
                                }
                            }],
                            width: 4
                        },
                        {
                            components: [{
                                type: 'number',
                                key: 'percentage',
                                label: '%Age',
                                placeholder: 'Enter Percentage',
                                input: true,
                                validate: {
                                    required: true
                                }
                            }],
                            width: 4
                        }
                    ]
                },
                {
                    type: 'columns',
                    columns: [
                        {
                            components: [{
                                type: 'select',
                                key: 'paidToEmployee',
                                label: 'Paid to Employee',
                                placeholder: 'Paid to Employee',
                                input: true,
                                data: {
                                    values: []
                                },
                                validate: {
                                    required: true
                                }
                            }],
                            width: 4
                        }
                    ]
                }
            ]
        };
    }

    // Employee ID Info Tab
    getEmployeeIdInfoTemplate() {
        return {
            components: [
                {
                    type: 'columns',
                    columns: [
                        {
                            components: [{
                                type: 'select',
                                key: 'idType',
                                label: 'ID Type',
                                placeholder: 'ID Type',
                                input: true,
                                data: {
                                    values: [
                                        { label: 'Passport', value: 'passport' },
                                        { label: 'National ID', value: 'national_id' },
                                        { label: 'Driving License', value: 'driving_license' }
                                    ]
                                }
                            }],
                            width: 4
                        },
                        {
                            components: [{
                                type: 'textfield',
                                key: 'idNumber',
                                label: 'ID Number',
                                placeholder: 'Enter ID Number',
                                input: true
                            }],
                            width: 4
                        },
                        {
                            components: [{
                                type: 'select',
                                key: 'placeOfIssue',
                                label: 'Place of issue',
                                placeholder: 'Place of issue',
                                input: true,
                                data: {
                                    values: []
                                }
                            }],
                            width: 4
                        }
                    ]
                },
                {
                    type: 'columns',
                    columns: [
                        {
                            components: [{
                                type: 'datetime',
                                key: 'dateOfIssue',
                                label: 'Date of Issue',
                                placeholder: 'mm/dd/yyyy',
                                input: true,
                                format: 'MM/dd/yyyy',
                                enableDate: true,
                                enableTime: false
                            }],
                            width: 4
                        },
                        {
                            components: [{
                                type: 'datetime',
                                key: 'expiryDate',
                                label: 'Expiry Date',
                                placeholder: 'mm/dd/yyyy',
                                input: true,
                                format: 'MM/dd/yyyy',
                                enableDate: true,
                                enableTime: false
                            }],
                            width: 4
                        },
                        {
                            components: [{
                                type: 'textarea',
                                key: 'remarks',
                                label: 'Remarks',
                                placeholder: 'Enter Remarks',
                                input: true,
                                rows: 3
                            }],
                            width: 4
                        }
                    ]
                },
                {
                    type: 'columns',
                    columns: [
                        {
                            components: [{
                                type: 'file',
                                key: 'attachment',
                                label: 'Attachment',
                                input: true,
                                storage: 'base64'
                            }],
                            width: 4
                        }
                    ]
                }
            ]
        };
    }

    // Employee Leave Info Tab
    getEmployeeLeaveInfoTemplate() {
        return {
            components: [
                {
                    type: 'columns',
                    columns: [
                        {
                            components: [{
                                type: 'select',
                                key: 'leaveCode',
                                label: 'Leave Code',
                                placeholder: 'Leave Code',
                                input: true,
                                data: {
                                    values: [
                                        { label: 'Annual Leave', value: 'annual' },
                                        { label: 'Sick Leave', value: 'sick' },
                                        { label: 'Casual Leave', value: 'casual' }
                                    ]
                                }
                            }],
                            width: 4
                        },
                        {
                            components: [{
                                type: 'textfield',
                                key: 'leaveName',
                                label: 'Leave Name',
                                placeholder: 'Enter LeaveName',
                                input: true
                            }],
                            width: 4
                        },
                        {
                            components: [{
                                type: 'textfield',
                                key: 'leaveType',
                                label: 'Leave Type',
                                placeholder: 'Enter LeaveType',
                                input: true
                            }],
                            width: 4
                        }
                    ]
                },
                {
                    type: 'columns',
                    columns: [
                        {
                            components: [{
                                type: 'number',
                                key: 'totalLeaveInYear',
                                label: 'Total Leave in Year',
                                placeholder: 'Enter Total Leave Year',
                                input: true
                            }],
                            width: 4
                        },
                        {
                            components: [{
                                type: 'number',
                                key: 'leaveBalance',
                                label: 'Leave Balance',
                                placeholder: '0',
                                input: true,
                                defaultValue: 0
                            }],
                            width: 4
                        },
                        {
                            components: [{
                                type: 'checkbox',
                                key: 'carryForward',
                                label: 'Carry Forward',
                                input: true
                            }],
                            width: 4
                        }
                    ]
                },
                {
                    type: 'columns',
                    columns: [
                        {
                            components: [{
                                type: 'number',
                                key: 'alreadyTaken',
                                label: 'Already Taken',
                                placeholder: 'Enter AlreadyTaken',
                                input: true
                            }],
                            width: 4
                        }
                    ]
                }
            ]
        };
    }

    // Employee Salary Info Tab
    getEmployeeSalaryInfoTemplate() {
        return {
            components: [
                {
                    type: 'columns',
                    columns: [
                        {
                            components: [{
                                type: 'select',
                                key: 'payelementCode',
                                label: 'Payelement Code',
                                placeholder: 'Payelement Code',
                                input: true,
                                data: {
                                    values: []
                                }
                            }],
                            width: 4
                        },
                        {
                            components: [{
                                type: 'textfield',
                                key: 'payelementName',
                                label: 'Payelement Name',
                                placeholder: 'Enter Payelement Name',
                                input: true
                            }],
                            width: 4
                        },
                        {
                            components: [{
                                type: 'datetime',
                                key: 'effectiveDate',
                                label: 'Effective Date',
                                placeholder: 'mm/dd/yyyy',
                                input: true,
                                format: 'MM/dd/yyyy',
                                enableDate: true,
                                enableTime: false
                            }],
                            width: 4
                        }
                    ]
                },
                {
                    type: 'columns',
                    columns: [
                        {
                            components: [{
                                type: 'select',
                                key: 'paymentFrequency',
                                label: 'Payment Frequency',
                                placeholder: 'Payment Frequency',
                                input: true,
                                data: {
                                    values: [
                                        { label: 'Monthly', value: 'monthly' },
                                        { label: 'Bi-Weekly', value: 'bi_weekly' },
                                        { label: 'Weekly', value: 'weekly' }
                                    ]
                                }
                            }],
                            width: 4
                        },
                        {
                            components: [{
                                type: 'select',
                                key: 'type',
                                label: 'Type',
                                placeholder: 'Type',
                                input: true,
                                data: {
                                    values: [
                                        { label: 'Salary', value: 'salary' },
                                        { label: 'Allowance', value: 'allowance' },
                                        { label: 'Bonus', value: 'bonus' }
                                    ]
                                }
                            }],
                            width: 4
                        },
                        {
                            components: [{
                                type: 'number',
                                key: 'amount',
                                label: 'Amount',
                                placeholder: 'Amount',
                                input: true
                            }],
                            width: 4
                        }
                    ]
                }
            ]
        };
    }

    // Qualification Tab
    getQualificationTemplate() {
        return {
            components: [
                {
                    type: 'columns',
                    columns: [
                        {
                            components: [{
                                type: 'select',
                                key: 'code',
                                label: 'Code',
                                placeholder: 'Code',
                                input: true,
                                data: {
                                    values: [
                                        { label: 'BSc', value: 'bsc' },
                                        { label: 'MSc', value: 'msc' },
                                        { label: 'PhD', value: 'phd' },
                                        { label: 'Diploma', value: 'diploma' }
                                    ]
                                }
                            }],
                            width: 4
                        },
                        {
                            components: [{
                                type: 'textfield',
                                key: 'qualificationName',
                                label: 'Qualification Name',
                                placeholder: 'Enter Qualification Name',
                                input: true
                            }],
                            width: 4
                        },
                        {
                            components: [{
                                type: 'textfield',
                                key: 'major',
                                label: 'Major',
                                placeholder: 'Enter Major',
                                input: true
                            }],
                            width: 4
                        }
                    ]
                },
                {
                    type: 'columns',
                    columns: [
                        {
                            components: [{
                                type: 'datetime',
                                key: 'fromDate',
                                label: 'From Date',
                                placeholder: 'mm/dd/yyyy',
                                input: true,
                                format: 'MM/dd/yyyy',
                                enableDate: true,
                                enableTime: false
                            }],
                            width: 4
                        },
                        {
                            components: [{
                                type: 'datetime',
                                key: 'toDate',
                                label: 'To Date',
                                placeholder: 'mm/dd/yyyy',
                                input: true,
                                format: 'MM/dd/yyyy',
                                enableDate: true,
                                enableTime: false
                            }],
                            width: 4
                        },
                        {
                            components: [{
                                type: 'textfield',
                                key: 'passingYear',
                                label: 'Passing Year',
                                placeholder: 'Enter Passing Year',
                                input: true
                            }],
                            width: 4
                        }
                    ]
                },
                {
                    type: 'columns',
                    columns: [
                        {
                            components: [{
                                type: 'textfield',
                                key: 'grade',
                                label: 'Grade',
                                placeholder: 'Enter Grade',
                                input: true
                            }],
                            width: 4
                        },
                        {
                            components: [{
                                type: 'textfield',
                                key: 'institute',
                                label: 'Institute',
                                placeholder: 'Enter Institute',
                                input: true
                            }],
                            width: 4
                        }
                    ]
                }
            ]
        };
    }

    // Skills Tab
    getSkillsTemplate() {
        return {
            components: [
                {
                    type: 'columns',
                    columns: [
                        {
                            components: [{
                                type: 'select',
                                key: 'code',
                                label: 'Code',
                                placeholder: 'Code',
                                input: true,
                                data: {
                                    values: [
                                        { label: 'TECH001', value: 'tech001' },
                                        { label: 'TECH002', value: 'tech002' },
                                        { label: 'SOFT001', value: 'soft001' }
                                    ]
                                }
                            }],
                            width: 4
                        },
                        {
                            components: [{
                                type: 'textfield',
                                key: 'name',
                                label: 'Name',
                                placeholder: 'Enter Skill Name',
                                input: true
                            }],
                            width: 4
                        },
                        {
                            components: [{
                                type: 'textarea',
                                key: 'remarks',
                                label: 'Remarks',
                                placeholder: 'Enter Remarks',
                                input: true,
                                rows: 3
                            }],
                            width: 4
                        }
                    ]
                },
                {
                    type: 'columns',
                    columns: [
                        {
                            components: [{
                                type: 'select',
                                key: 'skillLevel',
                                label: 'Skill Level',
                                placeholder: 'Skill Level',
                                input: true,
                                data: {
                                    values: [
                                        { label: 'Beginner', value: 'beginner' },
                                        { label: 'Intermediate', value: 'intermediate' },
                                        { label: 'Advanced', value: 'advanced' },
                                        { label: 'Expert', value: 'expert' }
                                    ]
                                }
                            }],
                            width: 4
                        }
                    ]
                }
            ]
        };
    }

    // Trainings Tab
    getTrainingsTemplate() {
        return {
            components: [
                {
                    type: 'columns',
                    columns: [
                        {
                            components: [{
                                type: 'select',
                                key: 'code',
                                label: 'Code',
                                placeholder: 'Code',
                                input: true,
                                data: {
                                    values: []
                                }
                            }],
                            width: 4
                        },
                        {
                            components: [{
                                type: 'textfield',
                                key: 'name',
                                label: 'Name',
                                placeholder: 'Enter Training Name',
                                input: true
                            }],
                            width: 4
                        },
                        {
                            components: [{
                                type: 'textarea',
                                key: 'remarks',
                                label: 'Remarks',
                                placeholder: 'Enter Remarks',
                                input: true,
                                rows: 3
                            }],
                            width: 4
                        }
                    ]
                }
            ]
        };
    }

    // Experience Tab
    getExperienceTemplate() {
        return {
            components: [
                {
                    type: 'columns',
                    columns: [
                        {
                            components: [{
                                type: 'select',
                                key: 'code',
                                label: 'Code',
                                placeholder: 'Code',
                                input: true,
                                data: {
                                    values: []
                                }
                            }],
                            width: 4
                        },
                        {
                            components: [{
                                type: 'textfield',
                                key: 'name',
                                label: 'Name',
                                placeholder: 'Enter Company Name',
                                input: true
                            }],
                            width: 4
                        },
                        {
                            components: [{
                                type: 'textarea',
                                key: 'remarks',
                                label: 'Remarks',
                                placeholder: 'Enter Remarks',
                                input: true,
                                rows: 3
                            }],
                            width: 4
                        }
                    ]
                }
            ]
        };
    }

    // Family Detail Tab
    getFamilyDetailTemplate() {
        return {
            components: [
                {
                    type: 'columns',
                    columns: [
                        {
                            components: [{
                                type: 'select',
                                key: 'code',
                                label: 'Code',
                                placeholder: 'Code',
                                input: true,
                                data: {
                                    values: []
                                }
                            }],
                            width: 4
                        },
                        {
                            components: [{
                                type: 'textfield',
                                key: 'name',
                                label: 'Name',
                                placeholder: 'Enter Name',
                                input: true
                            }],
                            width: 4
                        },
                        {
                            components: [{
                                type: 'textarea',
                                key: 'remarks',
                                label: 'Remarks',
                                placeholder: 'Enter Remarks',
                                input: true,
                                rows: 3
                            }],
                            width: 4
                        }
                    ]
                }
            ]
        };
    }

    // Employee Belongings Tab
    getEmployeeBelongingsTemplate() {
        return {
            components: [
                {
                    type: 'columns',
                    columns: [
                        {
                            components: [{
                                type: 'select',
                                key: 'code',
                                label: 'Code',
                                placeholder: 'Code',
                                input: true,
                                data: {
                                    values: []
                                }
                            }],
                            width: 4
                        },
                        {
                            components: [{
                                type: 'textfield',
                                key: 'name',
                                label: 'Name',
                                placeholder: 'Enter Item Name',
                                input: true
                            }],
                            width: 4
                        },
                        {
                            components: [{
                                type: 'textarea',
                                key: 'remarks',
                                label: 'Remarks',
                                placeholder: 'Enter Remarks',
                                input: true,
                                rows: 3
                            }],
                            width: 4
                        }
                    ]
                }
            ]
        };
    }

    // Pre Requisite Tab
    getPreRequisiteTemplate() {
        return {
            components: [
                {
                    type: 'columns',
                    columns: [
                        {
                            components: [{
                                type: 'select',
                                key: 'code',
                                label: 'Code',
                                placeholder: 'Code',
                                input: true,
                                data: {
                                    values: []
                                }
                            }],
                            width: 4
                        },
                        {
                            components: [{
                                type: 'textfield',
                                key: 'name',
                                label: 'Name',
                                placeholder: 'Enter Name',
                                input: true
                            }],
                            width: 4
                        },
                        {
                            components: [{
                                type: 'textarea',
                                key: 'remarks',
                                label: 'Remarks',
                                placeholder: 'Enter Remarks',
                                input: true,
                                rows: 3
                            }],
                            width: 4
                        }
                    ]
                }
            ]
        };
    }
}
