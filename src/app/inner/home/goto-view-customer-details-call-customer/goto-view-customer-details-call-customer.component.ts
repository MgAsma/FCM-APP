import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { AllocationEmittersService } from '../../../service/allocation-emitters.service';
import { environment } from '../../../../environments/environment';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { BaseServiceService } from '../../../service/base-service.service';
import { ApiService } from '../../../service/api/api.service';
@Component({
  selector: 'app-goto-view-customer-details-call-customer',
  templateUrl: './goto-view-customer-details-call-customer.component.html',
  styleUrls: ['./goto-view-customer-details-call-customer.component.scss'],
})
export class GotoViewCustomerDetailsCallCustomerComponent  implements OnInit {
  selectedDetails: any = [];
  user_id: any;

  constructor(
    private router:Router,
    private popoverController:PopoverController,
    private allocate:AllocationEmittersService,
    private callNumber:CallNumber,
    private _baseService:BaseServiceService,
    private api:ApiService
    ) { }

  ngOnInit() {
    this.allocate.callhistoryList.subscribe((res:any)=>{
      if(res){
        this.selectedDetails = res
      }
    })
  }
  close(){
    this.popoverController.dismiss();
    }
  goToDetails(){
    this.close();
    this.router.navigate(['/inner/customer-details'])
  }
  callInitiated:boolean=false;
  callStartTime!: Date;

  initializeCall(event){
    this.callStartTime = new Date();
    console.log(this.callStartTime, 'time');
    this.callNumber.callNumber(event.phone_number, true).then(() => {
        this.callInitiated=true;
        let data = {
          user:this.user_id,
          status:3
        }
        this._baseService.postData(`${environment.counsellor_status}`,data).subscribe((res:any)=>{
          if(res){
            this.api.showToast(res.message)  
          }
        },((error:any)=>{
          this.api.showToast(error?.error?.message)
        }))
      })
      .catch(() => {
        this.api.showToast('Error launching dialer');
      });
      let data = {
        user:this.user_id,
        status:6
      }
      this._baseService.postData(`${environment.counsellor_status}`,data).subscribe((res:any)=>{
        if(res){
          this.api.showToast(res.message)  
        }
      },((error:any)=>{
        this.api.showToast(error?.error?.message)
      }))
      
      let isoString = this.callStartTime.toISOString();
      let formattedDate = isoString.replace('Z', '+05:30');
      console.log(formattedDate);
      let callLogs = {
        lead_id: event.lead_id,
        phone_number: event.phone_number,
        call_status: 3,
        counsellor: this.user_id,
        call_start_time: formattedDate
    }
    this.createCallLog(callLogs)
  }
 
 createCallLog(callLogs){
  this._baseService.postData(`${environment.call_logs}`,callLogs).subscribe((res:any)=>{
   if(res){
    this.api.showToast(res.message)
   }
  },((error:any)=>{
    this.api.showToast(error.error.message)
  }))
 }
}
