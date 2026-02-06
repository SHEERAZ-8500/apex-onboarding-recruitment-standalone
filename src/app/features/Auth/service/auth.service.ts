import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EncryptionService } from '../../../core/services/management-services/encryption.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient, private encryptionService: EncryptionService) { }

  // Auth APIs
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
}
