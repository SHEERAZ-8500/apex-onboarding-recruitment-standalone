export class InterviewSchedulingDto {
  candidate: string = '';
  interviewer_user: string = '';
  interview_date: Date | null = null;
  start_time: string = '';
  location: string = '';
  meeting_url: string = '';
  interview_status: string = 'SCHEDULED';
  remarks: string = '';
  is_active: boolean = true;

  constructor(init?: Partial<InterviewSchedulingDto>) {
    Object.assign(this, init);
  }
}

export class InterviewDto {
  publicId!: string;
  code!: string;
  candidatePublicId!: string;
  interviewerUserPublicId!: string;
  interviewDate!: string;
  startTime!: string;
  interviewStatus!: string;
  location!: string;
  meetingUrl!: string;
  remarks!: string;

  constructor(init?: Partial<InterviewDto>) {
    if (init) {
      Object.assign(this, init);
    }
  }
}

export class InterviewFeedbackDto {
  result!: string;
  remarks!: string;

  constructor(data?: Partial<InterviewFeedbackDto>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
