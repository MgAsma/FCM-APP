import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { BaseServiceService } from './base-service.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ActivateChildGuard implements CanActivateChild {
  newDeviceToken: string;
  
  constructor(
    private _router: Router,
    private baseService:BaseServiceService,
     ) {}
   
  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const isLoggedIn: boolean = localStorage.getItem('token') !== null;
    const device_token = localStorage.getItem('device_token')
    const user_id = localStorage.getItem('user_id')
    
      if(isLoggedIn){
        this.baseService.getData(`${environment.device_token}${user_id}/`).subscribe((res:any)=>{
          if(res){
           this.newDeviceToken = res.device_token
           if(this.newDeviceToken != device_token){
            localStorage.clear()
             this._router.navigate(['/outer']);
            return false;
          }
         //  console.log(this.newDeviceToken === device_token,"TOKEN")
          }
        })
      }
      if (!isLoggedIn) {
        this._router.navigate(['/outer']);
        return false;
      }
    
    
  
    return true;
  }
}


