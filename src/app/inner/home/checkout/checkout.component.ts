import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { ApiService } from '../../../service/api/api.service';
import { AddLeadEmitterService } from '../../../service/add-lead-emitter.service';


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
    private _addLeadEmitter:AddLeadEmitterService) { }

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
}
