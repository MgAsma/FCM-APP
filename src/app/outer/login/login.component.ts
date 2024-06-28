import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { jwtDecode } from "jwt-decode";
import { DatePipe } from '@angular/common';
import { CommonServiceService } from '../../service/common-service.service';
import { ApiService } from '../../service/api/api.service';
import { NavController } from '@ionic/angular';
import { BaseServiceService } from '../../service/base-service.service';
import { Storage } from "@capacitor/storage";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent  implements OnInit {

  hidePassword = true;
  loginForm!:FormGroup;
  decodedToken:any = ''

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
  constructor(
  private _fb:FormBuilder,
	private router:Router,
  private api:ApiService,
  private datePipe: DatePipe,
  private commonService:CommonServiceService,
  private navCtrl:NavController,
  private baseService:BaseServiceService
  
  ){}
 
  ngOnInit(): void {
    this.initForm()
    this.decodedToken = ''
  }
  initForm(){
    this.loginForm = this._fb.group({
      email_or_phone: ['', [Validators.required, this.emailOrPhoneValidator]],
      password:['',[Validators.required,this.noSpaceValidator]],
      device_type:['',[Validators.required]]
    })
  }
  emailOrPhoneValidator(control: AbstractControl): { [key: string]: any } | null {
    const value = control.value;
  
    // Regular expression for email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
    // Regular expression for 10-digit phone number format
    const phoneRegex = /^\d{10}$/;
  
    if (!value) {
      return null; // If value is empty, don't perform validation
    }
  
    // Check if value matches email format
    if (emailRegex.test(value)) {
      return null; // Value is a valid email address
    }
  
    // Check if value matches 10-digit phone number format
    if (phoneRegex.test(value)) {
      return null; // Value is a valid phone number
    }
  
    // If neither email nor phone number format matches, return combined error object
    return { 'invalidEmailOrPhone': true };
  }
  
  
  
  get f() {
    return this.loginForm.controls;
  }
  // get mobileNumber() {
  //   return this.loginForm.get('email_or_phone');
  // }

  // get password() {
  //   return this.loginForm.get('password');
  // }
  // Custom validator function
   noSpaceValidator = (control) => {
    const hasSpace = (control.value || '').includes(' ');
    return hasSpace ? { 'space': true } : null;
  };
  login(){
    this.loginForm.patchValue({device_type:"mobile"})
		if(this.loginForm.invalid){
			this.loginForm.markAllAsTouched()
      this.decodedToken = ''
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
          this.decodedToken = ''
          this.api.showSuccess(resp.message)
          const formattedDate :any = this.datePipe.transform(currentDate, 'yyyy-MM-ddTHH:mm:ss.SSSZ');
          localStorage.setItem('lastLoginDate', formattedDate);
          localStorage.setItem('token',resp.token.token)
          let appVersion = '1.0.31'
          localStorage.setItem('appVersion',appVersion);
          localStorage.setItem('device_token',resp.device_token)
          localStorage.setItem('counsellor_ids',resp.counsellor_ids);
          
          this.decodedToken = jwtDecode(resp.token.token)
        
          localStorage.setItem('user_role',this.decodedToken.user_role)
          localStorage.setItem('user_id',this.decodedToken.user_id)
          localStorage.setItem('username',this.decodedToken.username)

          this.loginForm.reset()
          
         this.navCtrl.navigateForward(['/inner'])
          this.api.showSuccess(resp.message)
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
