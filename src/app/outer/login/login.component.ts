import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { jwtDecode } from "jwt-decode";
import { DatePipe } from '@angular/common';
import { CommonServiceService } from '../../service/common-service.service';
import { ApiService } from '../../service/api/api.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent  implements OnInit {

  hidePassword = true;
  loginForm!:FormGroup;


  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
  constructor(
  private _fb:FormBuilder,
	private router:Router,
  private api:ApiService,
  private datePipe: DatePipe,
  private commonService:CommonServiceService,
  private navCtrl:NavController
  
  ){}
 
  ngOnInit(): void {
    this.initForm()
  }
  initForm(){
    this.loginForm = this._fb.group({
      mobile_number:['' ,[Validators.required,Validators.pattern(this.commonService.mobilePattern)]],
      password:['',[Validators.required,this.noSpaceValidator]],
      device_type:['',[Validators.required]]
    })
  }
  get f() {
    return this.loginForm.controls;
  }
  get mobileNumber() {
    return this.loginForm.get('mobile_number');
  }

  get password() {
    return this.loginForm.get('password');
  }
  // Custom validator function
   noSpaceValidator = (control) => {
    const hasSpace = (control.value || '').includes(' ');
    return hasSpace ? { 'space': true } : null;
  };
  login(){
    this.loginForm.patchValue({device_type:"mobile"})
		if(this.loginForm.invalid){
			this.loginForm.markAllAsTouched()
		}
		else{
      this.api.showLoading()
		  this.api.login(this.loginForm.value).subscribe(
			(resp:any)=>{
        if(resp){
          localStorage.clear()
          //console.log(resp,"RESP")
          const currentDate = new Date();
          // window.location.reload();
          this.api.showSuccess(resp.message)
          const formattedDate :any = this.datePipe.transform(currentDate, 'yyyy-MM-ddTHH:mm:ss.SSSZ');
          localStorage.setItem('lastLoginDate', formattedDate);
          localStorage.setItem('token',resp.token.token)
         
          let decodedToken:any = ''
          localStorage.setItem('device_token',resp.device_token)
          decodedToken = jwtDecode(resp.token.token);
          localStorage.setItem('user_role',decodedToken.user_role)
          localStorage.setItem('user_id',decodedToken.user_id)
          localStorage.setItem('username',decodedToken.username)
          // localStorage.setItem('device_token',decodedToken.device_token)
          this.loginForm.reset()
          
          this.navCtrl.navigateForward(['/inner'])
          this.api.showSuccess(resp.message)
          window.location.reload()
          this.api.loaderDismiss()
        }
      
			},
			(error:any)=>{
        this.api.loaderDismiss()
        this.api.showError(error.error.message)
       // this.api.showToast(error.error.error.message)
			}
		  )
		}
    
	  }
   
}
