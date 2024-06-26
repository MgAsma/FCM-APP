import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { jwtDecode } from "jwt-decode";
import { DatePipe } from '@angular/common';
import { CommonServiceService } from '../../service/common-service.service';
import { ApiService } from '../../service/api/api.service';

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
  private commonService:CommonServiceService
  
  ){}
 
  ngOnInit(): void {
    this.initForm()
  }
  initForm(){
    this.loginForm = this._fb.group({
      mobile_number:['' ,[Validators.required,Validators.pattern(this.commonService.mobilePattern)]],
      password:['',[Validators.required]],
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
          console.log(resp,"RESP")
          const currentDate = new Date();
          const formattedDate :any = this.datePipe.transform(currentDate, 'yyyy-MM-ddTHH:mm:ss.SSSZ');
          localStorage.setItem('lastLoginDate', formattedDate);
          localStorage.setItem('token',resp.token.token)
          
          const decodedToken:any = jwtDecode(resp.token.token);
          localStorage.setItem('user_id',decodedToken.user_id)
          localStorage.setItem('user_role',decodedToken.user_role)
          localStorage.setItem('superadmin_or_admin',resp.superadmin_or_admin)
          localStorage.setItem('username',decodedToken.username)
          this.api.loaderDismiss()
          this.loginForm.reset()
          this.router.navigate(['../inner'])
          this.api.showToast(resp.message)
        }
      
			},
			(error:any)=>{
        this.api.loaderDismiss()
        this.api.showToast(error.error.message)
			}
		  )
		}
	  }
   
}
