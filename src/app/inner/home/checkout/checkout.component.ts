import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { ApiService } from '../../../service/api/api.service';
import { AddLeadEmitterService } from '../../../service/add-lead-emitter.service';
import { AllocationEmittersService } from '../../../service/allocation-emitters.service';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent  implements OnInit {
  logoutForm!:FormGroup;
  id:any;

  constructor(
    private popoverController:PopoverController,
    private api:ApiService,
    private _fb:FormBuilder,
    private router:Router,
    private addEmit:AddLeadEmitterService,
    private allocation:AllocationEmittersService) { }

  ngOnInit(): void {
    this.popoverController.dismiss();
    this.id=localStorage.getItem('user_id')
    this.initForm()
  }
  initForm(){
    this.logoutForm = this._fb.group({
      user_id:['' ,[Validators.required]],
      logged_in_from:['' ,[Validators.required]],
      
    })
  }
  close(){
    this.popoverController.dismiss();
    }
    logout(){
      this.logoutForm.patchValue({user_id:this.id})
      this.logoutForm.patchValue({logged_in_from:"mobile"})
      if(this.logoutForm.invalid){
        this.api.showSuccess('User Id Required')
      }
      else{
        this.logOut()
      }
      }
      logOut(){
        this.api.showLoading()
        this.api.logout(this.logoutForm.value).subscribe(
        (resp:any)=>{
          if(resp){
          this.clearState()
          localStorage.clear()
          this.logoutForm.reset()
          this.close()
          this.api.showSuccess(resp.message)
          this.router.navigate(['../outer'])
          localStorage.clear()
          
          this.api.loaderDismiss()
          }
        },
        (error:any)=>{
          this.api.loaderDismiss()
          this.api.showError(error.error.message)
          // localStorage.clear()
          // // localStorage.clear()
          // this.router.navigate(['../outer'])
        }
        )
      }
      clearState(){
        this.allocation.searchBar.next(false) 
        this.allocation.customerSearchBar.next(false) 
        this.allocation.callLogSearchBar.next(false) 
        this.allocation.tlsSearchBar.next(false) 
        this.allocation.allocationStatus.next([])
        this.allocation.callLogStatus.next([])
        this.allocation.tlsStatus.next('')
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
