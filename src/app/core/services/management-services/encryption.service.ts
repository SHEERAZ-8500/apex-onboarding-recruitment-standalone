import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';


@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  private secretKey = 'apex-employee-management-secret-key'; 

  encrypt(data: any): string {
    const dataString = JSON.stringify(data);
    return CryptoJS.AES.encrypt(dataString, this.secretKey).toString();
  }

  decrypt(cipherText: string): any {
    const bytes = CryptoJS.AES.decrypt(cipherText, this.secretKey);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedData);
  }
}
