import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { ApiService } from '../../../service/api/api.service';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent  implements OnInit {
  logoutForm!:FormGroup;
  id:any;

  constructor(private popoverController:PopoverController,private api:ApiService,private _fb:FormBuilder,private router:Router) { }

  ngOnInit(): void {
    this.id=sessionStorage.getItem('user_id')
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
        console.log("Invalid");	
        this.router.navigate(['../outer'])
      }
      else{
        this.api.showLoading()
        this.api.logout(this.logoutForm.value).subscribe(
        (resp:any)=>{
          this.logoutForm.reset()
          this.api.loaderDismiss()
          this.close()
          sessionStorage.clear()
 
          this.router.navigate(['../outer'])
          this.api.showToast(resp.message)
  
        },
        (error:any)=>{
          this.api.loaderDismiss()
          this.api.showToast(error.error.message)
          sessionStorage.clear()
          this.router.navigate(['../outer'])
        }
        )
      }
      }
}
