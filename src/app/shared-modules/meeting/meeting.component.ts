import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { Storage } from '@capacitor/storage';
import { DatePipe } from '@angular/common';
import { timer, Subject } from 'rxjs';
import { map, takeUntil, takeWhile } from 'rxjs/operators';
import { ApiService } from '../../service/api/api.service';
import { BaseServiceService } from '../../service/base-service.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-meeting',
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.scss'],
})
export class MeetingComponent implements OnInit {
  meetingForm!: FormGroup;
  id: any;
  lastLoginDate: any;

  breakTime:any;
  isLoggedIn: boolean;
  device_token: string;
  user_id: string;
  newDeviceToken: any;
  
  constructor(
    private popoverController: PopoverController,
    private api: ApiService,
    private _fb: FormBuilder,
    private router: Router,
    private datePipe: DatePipe,
    private baseService:BaseServiceService
  ) {}

  ngOnInit() {
    
    this.id = localStorage.getItem('user_id');
    this.initForm();
    this.breakTime=localStorage.getItem('storedDate')
    this.isLoggedIn = localStorage.getItem('token') !== null;
    this.device_token = localStorage.getItem('device_token')
    this.user_id = localStorage.getItem('user_id')
  }
  initForm() {
    this.meetingForm = this._fb.group({
      user: ['', [Validators.required]],
      status: ['', [Validators.required]],
    });
  }
  close() {
    this.popoverController.dismiss();
  }
  break() {
    this.meetingForm.patchValue({ user: this.id });
    this.meetingForm.patchValue({ status: 7 });
    let deviceToken = localStorage.getItem('device_token')
    ////console.log(this.meetingForm.value);

    if (this.meetingForm.invalid) {
      //console.log('Invalid');
    } else {
     
        this.baseService.getData(`${environment.device_token}${this.user_id}/`).subscribe((res:any)=>{
          if(res){
           // console.log(res.result[0].device_token,this.device_token)
           this.newDeviceToken = res.result[0].device_token
           if(this.newDeviceToken !== this.device_token){
            localStorage.clear()
            
            this.router.navigate(['/outer']);
            
            this.close();
           }else{
        this.api.break(this.meetingForm.value).subscribe(
          (resp: any) => {
            this.close();
            Storage.remove({ key: 'meeting' });
            localStorage.removeItem('storedDate')
            this.api.showToast('Meeting Ended Successfully!');
          },
          (error: any) => {
            this.api.showToast(error.error.message);
          }
        );
      }
      }
    
      
    }
      )
  }}
}
