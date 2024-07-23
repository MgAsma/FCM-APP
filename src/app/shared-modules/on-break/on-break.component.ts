import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { PopoverController } from "@ionic/angular";
import { Storage } from "@capacitor/storage";
import { DatePipe } from "@angular/common";
import { timer, Subject } from "rxjs";
import { map, takeUntil, takeWhile } from "rxjs/operators";
import { ApiService } from "../../service/api/api.service";
import { CallPermissionsService } from "../../service/api/call-permissions.service";
import { BaseServiceService } from "../../service/base-service.service";
import { environment } from "../../../environments/environment";
@Component({
  selector: "app-on-break",
  templateUrl: "./on-break.component.html",
  styleUrls: ["./on-break.component.scss"],
})
export class OnBreakComponent implements OnInit {
  breakForm!: FormGroup;
  id: any;
  lastLoginDate: any;
  breakTime: any;
  isLoggedIn: boolean;
  newDeviceToken: any;
  device_token: string;
  user_id: string;

  constructor(
    private popoverController: PopoverController,
    private api: ApiService,
    private _fb: FormBuilder,
    private router: Router,
    private datePipe: DatePipe,
    private callPermissionService: CallPermissionsService,
    private baseService:BaseServiceService
  ) {
    // this.breakTime=this.callPermissionService.getBreakTime();
    this.breakTime = localStorage.getItem("storedDate");
    //console.log(this.breakTime,"breaktime");
  }

  ngOnInit() {
    
    this.id = localStorage.getItem("user_id");
    this.initForm();
    this.isLoggedIn = localStorage.getItem('token') !== null;
    this.device_token = localStorage.getItem('device_token')
    this.user_id = localStorage.getItem('user_id')
    
     
  }
  initForm() {
    this.breakForm = this._fb.group({
      user: ["", [Validators.required]],
      status: ["", [Validators.required]],
    });
  }
  close() {
    this.popoverController.dismiss();
  }
  break() {
    this.breakForm.patchValue({ user: this.id });
    this.breakForm.patchValue({ status: 1 });
    let deviceToken = localStorage.getItem('device_token')
    //console.log(this.breakForm.value);

    if (this.breakForm.invalid) {
      //console.log('Invalid');
    } else {
      if(this.isLoggedIn){
        // this.api.showLoading();
      
        this.baseService.getData(`${environment.device_token}${this.user_id}/`).subscribe((res:any)=>{
          if(res){
           this.newDeviceToken = res.result[0].device_token
           if(this.newDeviceToken != this.device_token){
            localStorage.clear()
             this.router.navigate(['/outer']);
             this.close();
           }else{
            this.api.break(this.breakForm.value).subscribe(
              (resp: any) => {
                // this.api.loaderDismiss();
                this.close();
                Storage.remove({ key: "break" });
                localStorage.removeItem("storedDate");
                this.api.showToast("Break Ended Successfully!");
              },
              (error: any) => {
                // this.api.loaderDismiss();
                this.api.showToast(error.error.message);
              }
            );
           }
          }
           })
      }
      
    
    }
  }
}
