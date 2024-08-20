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
import { Storage } from "@capacitor/storage";
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
   
  
    //const storedDate = localStorage.getItem('storedDate');
    
    
      if (this.isLoggedIn) {
        
       //  console.log(Storage.get({ key: 'meeting' }))
          this.idleDetectionService.userActivity.subscribe(isActive => {
            // if(!storedDate){
          if (this.router.url !== '/outer/login' && !isActive ) {
            this.addEmit.isToken.next('')
            this.logOut()
        //  }
          }else{
           
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
