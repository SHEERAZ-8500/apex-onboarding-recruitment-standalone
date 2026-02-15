import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OnboardingService {
  constructor(private http: HttpClient) { }

  // Job Requisitions APIs
  getAlljobsRequisiton(page = 0, size = 10) {
    return this.http.get(`recruitment/job-requisitions?isActive=true&page=${page}&size=${size}`);
  }

  // Candidates APIs
  getAllCandidates(status = 'INTERVIEWED', page = 0, size = 90) {
    if (status) {
      return this.http.get(`recruitment/candidates?status=${status}&page=${page}&size=${size}`);
    } else {
      return this.http.get(`recruitment/candidates?page=${page}&size=${size}`);
    }
  }



  getAllCandidatesTables(page = 0, size = 20, candidatePublicId = '') {
    return this.http.get(`recruitment/candidates/records?isActive=true&page=${page}&size=${size}&candidatePublicId=${candidatePublicId}`);
  }

  saveCandidateScreening(candidatePublicId: string, data: any) {
    return this.http.post(`recruitment/candidates/${candidatePublicId}/decision`, data);
  }

  canididateShortlist(data: any) {
    return this.http.post(`recruitment/candidates/shortlist`, data);
  }

  // Interview APIs
  getAllInterviewTables(page = 0, size = 20, candidatePublicId = '') {
    return this.http.get(`recruitment/interviews/records?isActive=true&page=${page}&size=${size}&candidatePublicId=${candidatePublicId}`);
  }

  getSelectedCandidatesInterview(publicIds: string[]) {
    return this.http.get(`recruitment/interviews/records?interviewStatus=SCHEDULED&page=0&size=90&candidatePublicId=${publicIds.join(',')}`);
  }

  interviewFeedback(interviewPublicId: string, data: any) {
    return this.http.post(`recruitment/interviews/${interviewPublicId}/feedback`, data);
  }
}
