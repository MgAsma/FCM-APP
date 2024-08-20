import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { BaseServiceService } from './base-service.service';
import { environment } from '../../environments/environment';
import { AddLeadEmitterService } from './add-lead-emitter.service';
import { AllocationEmittersService } from './allocation-emitters.service';
import { ApiService } from './api/api.service';
import { IdleDetectionService } from './idle-detection.service';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivateChildGuard implements CanActivateChild {
  newDeviceToken: string;
  isLoggedIn: boolean = false;
  id: any;
  private subscriptions: Subscription = new Subscription();
  currentUrl: any;
  
  constructor(
    private _router: Router,
    private baseService: BaseServiceService,
    private idleDetectionService:IdleDetectionService,
    private router:Router,
    private allocation:AllocationEmittersService,
    private addEmit:AddLeadEmitterService,
    private api:ApiService
     ) {}
   
  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    this.isLoggedIn = localStorage.getItem('token') !== null;
    const device_token = localStorage.getItem('device_token')
    const user_id = localStorage.getItem('user_id')
    
      if(this.isLoggedIn){
        this.baseService.getData(`${environment.device_token}${user_id}/`).subscribe((res:any)=>{
          if(res){
           this.newDeviceToken = res.result[0].device_token
           if(this.newDeviceToken != device_token){
            localStorage.clear()
             this._router.navigate(['/outer']);
            return false;
          }else{
            this.idleDetectionService.userActivity.subscribe(isActive => {
              // const storedDate = Storage.get({key:'break'})
              const storedDate = localStorage.getItem('storedDate')
              //console.log(storedDate)
            if (this.router.url !== '/outer/login' && !isActive && storedDate == null) {
              this.addEmit.isToken.next('')
              this.logOut()
            }else{
             
              this.idleDetectionService.resetTimer();
            }
             });
            const userActivity$ = this.idleDetectionService.userActivity;
        
              this.subscriptions.add(
              userActivity$.subscribe((isActive) => {
                if (isActive && this.currentUrl !== undefined) {
                  
                  this.idleDetectionService.resetTimer();
                }else{
                  this.idleDetectionService.checkIdleTimeout();
                }
              })
            );
          }
         //  console.log(this.newDeviceToken === device_token,"TOKEN")
          }
        })
      }
      if (!this.isLoggedIn) {
        this._router.navigate(['/outer']);
        return false;
      }
    
    
  
    return true;
  }
  logOut() {
    this.id = localStorage.getItem('user_id')
    let data = {
      user_id: this.id,
      logged_in_from: "mobile",
    };

    this.api.logout(data).subscribe(
      (resp: any) => {
        if(resp){
        this.clearState()
        this.api.showSuccess(resp.message);
        this.router.navigate(["../outer/login"]);
        setTimeout(() => {
          localStorage.clear();
        }, 2000);
        
        }
      },
      (error: any) => {
        this.api.showError(error.error.message);
      }
    );
  }
  clearState(){
    this.allocation.searchBar.next(false) 
    this.allocation.customerSearchBar.next(false) 
    this.allocation.callLogSearchBar.next(false) 
    this.allocation.tlsSearchBar.next(false) 
    this.allocation.allocationStatus.next([])
    this.allocation.callLogStatus.next([])
    this.allocation.tlsStatus.next([])
    this.allocation.callhistoryList.next([])
    this.allocation.logMemberDetails.next('')
    this.allocation.customerStatus.next('')

    this.addEmit.leadFilter.next('')
    this.addEmit.leadFilterIcon.next('')
    this.addEmit.filterStatus.next(false)
    this.addEmit.selectedCounsellor.next([])
    this.addEmit.callLogCounsellor.next([])
    this.addEmit.tlsCounsellor.next([])
    this.addEmit.customerCounsellor.next([])
    
  }
}


