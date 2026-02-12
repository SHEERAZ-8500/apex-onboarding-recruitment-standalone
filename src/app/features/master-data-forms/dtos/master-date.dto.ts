export class PayPeriodDto {
 

    status: string = '';
  code: string = '';
  payPeriodName: string = '';
  fromDate: string = '';
  toDate: string = '';
  remarks: string = '';


  constructor(init?: Partial<PayPeriodDto>) {
    if (init) {
      Object.assign(this, init);
    }
  }
}

export class ShiftDto {

    status: string = '';
  shiftCode: string = '';
  shiftName: string = '';
  remarks: string = '';

  constructor(init?: Partial<ShiftDto>) {
    if (init) {
      Object.assign(this, init);
    }
  }
}


export class WorkScheduleDto {
    
  shift: string = '';
  payPeriod: string = '';
  remarks: string = '';           

  constructor(init?: Partial<WorkScheduleDto>) {  
    if (init) {     
      Object.assign(this, init);
    }
  }
}

export class LeavesApplicationDto {
 ID: string = ''  ;
  employeeName: string = '';
  leaveType: string = '';
  fromDate: string = '';
  toDate: string = '';
  reason: string = '';
  leaveMode: string = '';
  applicationDate: string = '';
 attachment: string = '';
 pendingLeaves: string = '';
 submittedby: string = '';
 noOFLeavesApplied: string = '';


  constructor(init?: Partial<LeavesApplicationDto>) {
    if (init) {
      Object.assign(this, init);
    } 
  }
}

export class LeavesMasterDataDto {
  status: string = '';
  code: string = '';
  leaveName: string = '';
  totalLeaves: string = '';
  encashable: string = '';
  carryForward: string = '';
  remarks: string = '';
  maxLeavesInMonth: string = '';
  constructor(init?: Partial<LeavesMasterDataDto>) {
    if (init) {
      Object.assign(this, init);
    } 
  }
}