import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseServiceService } from '../base-service.service';

@Injectable()
export class BasicAuthInterceptor implements HttpInterceptor {
    constructor(private baseService: BaseServiceService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let token = sessionStorage.getItem('token');
        const loginUrl = 'https://fcmdev.thestorywallcafe.com/api/user-login/';

        // Ensure token availability
        if (!token) {
          //console.error('Token not available.');
            // Handle this scenario based on your app's logic, e.g., redirect to login.
        }

        if (request.url === loginUrl) {
            request = request.clone({
               // setHeaders: {
                    // "Content-Type": "application/x-www-form-urlencoded; charset=utf-8", 
                    // 'Accept': 'application/json, text/plain',
                    // "cache-control": "no-cache", 
                    // "Access-Control-Allow-Origin": "*", 
                    // "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token, Accept, Authorization, X-Request-With, Access-Control-Request-Method, Access-Control-Request-Headers",
                    // "Access-Control-Allow-Credentials" : "true",
                    // "Access-Control-Allow-Methods" : "GET, POST, DELETE, PUT, OPTIONS, TRACE, PATCH, CONNECT",
                    //  'Content-Type': 'application/json',

                   //  'Access-Control-Allow-Origin':'*',
                    // 'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
               // }
            });
        } else {
            // For other requests, including authenticated ones, add the Authorization header
            request = request.clone({
                setHeaders: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json',

                }
            });
        }

        return next.handle(request);
    }
}
