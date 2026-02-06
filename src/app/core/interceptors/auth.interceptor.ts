import { inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { ApiService } from '../services/apis/api.service';
import { EncryptionService } from '../services/management-services/encryption.service';

function closeAllModals() {
  // Find all open modals
  const modals = document.querySelectorAll('.modal.show');

  if (modals.length === 0) return; // no modal → exit

  // Close all modals
  modals.forEach((modal) => {
    const el = modal as HTMLElement;
    el.classList.remove('show');
    el.style.display = 'none';
  });

  // Remove backdrops
  const backdrops = document.querySelectorAll('.modal-backdrop');
  backdrops.forEach((backdrop) => {
    const el = backdrop as HTMLElement;
    el.remove();
  });

  // Remove modal-open class from body
  document.body.classList.remove('modal-open');
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
}

function handleActionCode(code: string, message: string, toastr: ToastrService, router: Router) {
  switch (code) {
    case 'VAL400':
      toastr.warning('Please check your input and try again.', 'Invalid Data');
      break;

    case 'BAD400':
      toastr.error('Something is wrong with the request.', 'Bad Request');
      break;

    case 'ATH401':
      toastr.error('Your session has expired. Please log in again.', 'Session Expired');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('deviceId');
      if (router.url !== '/') {
        closeAllModals();
        router.navigate(['/']);
      }
      break;

    case 'FOR403':
      toastr.warning('You do not have permission to perform this action.', 'Access Denied');
      break;

    case 'NFD404':
      toastr.info('The requested item could not be found.', 'Not Found');
      break;

    case 'DUP409':
      toastr.warning('This record already exists.', 'Duplicate Entry');
      break;

    case 'TOO_MANY_429':
      toastr.error('Too many attempts! Please slow down.', 'Rate Limit Exceeded');
      break;

    case 'SRV503':
      toastr.error('Server is temporarily unavailable. Please try again later.', 'Service Unavailable');
      break;

    case 'SRV504':
      toastr.error('Server took too long to respond. Try again later.', 'Timeout');
      break;

    case 'NFA568':
      toastr.warning('You do not have enough balance to continue.', 'Insufficient Balance');
      break;

    case 'SRV500':
      toastr.error('Something went wrong on the server.', 'Server Error');
      break;

    case 'ERR':
    default:
      toastr.error(message || 'An unexpected error occurred.', 'Error');
      break;
  }
}

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const toastr = inject(ToastrService);
  const router = inject(Router);
  const apiService = inject(ApiService);
  const encryptionService = inject(EncryptionService);

  const token = localStorage.getItem('token');
  let clonedReq = req;

  // Auto attach token to every request
  if (token) {
    clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
      url: req.url.startsWith('http') ? req.url : `${environment.apiBaseUrl}${req.url}` // auto prepend base URL
    });
  } else {
    // if no token, still add base URL
    clonedReq = req.clone({
      url: req.url.startsWith('http') ? req.url : `${environment.apiBaseUrl}${req.url}`
    });
  }

  return next(clonedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      
      if (error.error?.errors?.[0]?.code === "UNAUTHORIZED") {
        
        let refreshToken = localStorage.getItem('refreshToken');
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('deviceId');
        
        if (refreshToken) {
          apiService.refreshToken(refreshToken).subscribe({
            next: (response: any) => {
              localStorage.setItem('token', response.data.accessToken);
              localStorage.setItem('refreshToken', response.data.refreshToken);
              let userId = encryptionService.encrypt(response.data.userId);
              localStorage.setItem('userId', userId);
              // location.reload();
            },
            error: () => {
              toastr.error('Session expired. Please login again.', 'Unauthorized');
              if (router.url !== '/') {
                closeAllModals();
                router.navigate(['/']);
              }
            }
          });
        } else {
          toastr.error('Session expired. Please login again.', 'Unauthorized');
          if (router.url !== '/') {
            closeAllModals();
            router.navigate(['/']);
          }
        }
      } else {
        handleActionCode(error.error?.actionCode, error.error?.message, toastr, router);
      }

      return throwError(() => error);
    })
  );
};
