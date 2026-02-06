import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SessionService {
    clearStorage() {
        localStorage.removeItem("deviceId")
        localStorage.removeItem("refreshToken")
        localStorage.removeItem("token")
        localStorage.removeItem("userId")
    }


}
