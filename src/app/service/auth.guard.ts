import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, Subscription, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BaseServiceService } from './base-service.service';
import { environment } from '../../environments/environment';
import { IdleDetectionService } from './idle-detection.service';
import { AllocationEmittersService } from './allocation-emitters.service';
import { AddLeadEmitterService } from './add-lead-emitter.service';
import { ApiService } from './api/api.service';

@Injectable({
  providedIn: 'root'
})
export class ActivateGuard implements CanActivate {
  private subscriptions: Subscription = new Subscription();
  id: string;
  currentUrl: any;
  isLoggedIn:any
  constructor(
    private _router: Router,
    private baseService: BaseServiceService,
    private idleDetectionService:IdleDetectionService,
    private router:Router,
    private allocation:AllocationEmittersService,
    private addEmit:AddLeadEmitterService,
    private api:ApiService
  ) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    this.isLoggedIn = localStorage.getItem('token') !==null;
   
    const device_token = localStorage.getItem('device_token');
    const user_id = localStorage.getItem('user_id');
    
      if (this.isLoggedIn) {
          this.idleDetectionService.userActivity.subscribe(isActive => {
          if (this.router.url !== '/outer/login' && !isActive) {
            this.addEmit.isToken.next('')
            this.logOut()

          }else{
            // this.router.navigate([this.router.url])
            this.idleDetectionService.resetTimer();
          }
        
      });
     const userActivity$ = this.idleDetectionService.userActivity;
 
       this.subscriptions.add(
       userActivity$.subscribe((isActive) => {
         if (isActive && this.currentUrl !== undefined) {
           this.idleDetectionService.resetTimer();
         }
       })
     );
      return this.baseService.getData(`${environment.device_token}${user_id}/`).pipe(
        map((res: any) => {
          if (res && res.device_token !== device_token) {
            localStorage.clear();
            this._router.navigate(['/outer']);
            return false;
          }
          return true;
        }),
        catchError(() => {
         this._router.navigate(['/outer']);
          return of(false);
        })
      );
    } 
    else {
      this._router.navigate(['/outer']);
      return of(false);
    }
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
    this.allocation.searchBar.unsubscribe() 
    this.allocation.customerSearchBar.unsubscribe() 
    this.allocation.callLogSearchBar.unsubscribe() 
    this.allocation.tlsSearchBar.unsubscribe() 
    this.allocation.allocationStatus.unsubscribe()
    this.allocation.callLogStatus.unsubscribe()
    this.allocation.tlsStatus.unsubscribe()
    this.allocation.callhistoryList.unsubscribe()
    this.allocation.logMemberDetails.unsubscribe()
    this.allocation.customerStatus.unsubscribe()

    this.addEmit.leadFilter.unsubscribe()
    this.addEmit.leadFilterIcon.unsubscribe()
    this.addEmit.filterStatus.unsubscribe()
    this.addEmit.selectedCounsellor.unsubscribe()
    this.addEmit.callLogCounsellor.unsubscribe()
    this.addEmit.tlsCounsellor.unsubscribe()
    this.addEmit.customerCounsellor.unsubscribe()
    
  }
}
