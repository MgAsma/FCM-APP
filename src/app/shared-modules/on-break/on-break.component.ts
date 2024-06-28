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
      this.api.showLoading();
      this.api.break(this.breakForm.value).subscribe(
        (resp: any) => {
          this.api.loaderDismiss();
          this.close();
          console.log(resp,"RESPONSE")
          Storage.remove({ key: "break" });
          localStorage.removeItem("storedDate");
          this.api.showToast("Break Ended Successfully!");
          if((resp.device_token && deviceToken) && resp.device_token !== deviceToken){
            localStorage.clear()
            this.router.navigate(['../outer'])
          }
          
        },
        (error: any) => {
          this.api.loaderDismiss();
          this.api.showToast(error.error.message);
        }
      );
    }
  }
}
