import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform, PopoverController } from '@ionic/angular';
import { AllocationEmittersService } from '../../../service/allocation-emitters.service';
import { environment } from '../../../../environments/environment';
import { BaseServiceService } from '../../../service/base-service.service';
import { ApiService } from '../../../service/api/api.service';
import { CallLog,CallLogObject } from '@ionic-native/call-log/ngx';
import { CallNumber } from '@ionic-native/call-number/ngx';

@Component({
  selector: 'app-goto-view-customer-details-call-customer',
  templateUrl: './goto-view-customer-details-call-customer.component.html',
  styleUrls: ['./goto-view-customer-details-call-customer.component.scss'],
})
export class GotoViewCustomerDetailsCallCustomerComponent  implements OnInit {
  selectedDetails: any = [];
  user_id: any;
  leadId: any;
  leadPhoneNumber: string;
  recordsFoundText: string;
  callStatus: number;
  callDuration: any;
  listTyle: string;
  filters: CallLogObject[];
  recordsFound: any;
  counsellor_id: any;
  constructor(
    private router:Router,
    private popoverController:PopoverController,
    private allocate:AllocationEmittersService,
    private callNumber:CallNumber,
    private _baseService:BaseServiceService,
    private api:ApiService,
    private callLog:CallLog,
    private platform: Platform
    ) { 
      this.counsellor_id = localStorage.getItem('user_id');
      
    }

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
  getContacts(name: any, value: any, operator: any) {
    if (value == '1') {
      this.listTyle = 'Incoming Calls from yesterday';
    } else if (value == '2') {
      this.listTyle = 'Ougoing Calls from yesterday';
    } else if (value == '5') {
      this.listTyle = 'Rejected Calls from yesterday';
    }

    //Getting Yesterday Time
    var today = new Date();
    var yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    var fromTime = yesterday.getTime();

    this.filters = [
      {
        name: name,
        value: value,
        operator: operator,
      },
      {
        name: 'date',
        value: fromTime.toString(),
        operator: '>=',
      },
    ];

    this.callLog
      .getCallLog(this.filters)
      .then((results) => {
        for (const log of results) {
          this.callDuration = log.duration;
          console.log('Call Log:', this.callDuration);
          if (this.callDuration > 0) {
            this.callStatus = 2;
          } else {
            this.callStatus = 3;
          }
        }

        console.log(
          JSON.stringify(results),
          'call log responseeeeeeeeeeeeeeeee'
        );
        this.recordsFoundText = JSON.stringify(results);
        console.log(this.recordsFoundText, 'this.recordsFoundText');
        this.recordsFound = results; //JSON.stringify(results);
      })
      .catch((e) => alert(' LOG ' + JSON.stringify(e)));
  }
  callInitiated:boolean=false;
  callStartTime!: Date;

  
  initializeCall(event) {
    console.log(event)
    this.leadId = event.lead_id;
    this.leadPhoneNumber = event.phone_number;
    this.callStartTime = new Date();
    // console.log(this.callStartTime, 'time');
     let data = {
      user:this.counsellor_id,
      status:3
    }
    this._baseService.postData(`${environment.counsellor_status}`,data).subscribe((res:any)=>{
      if(res){
        this.api.showToast(res.message)  
      }
    },((error:any)=>{
      this.api.showToast(error?.error?.message)
    }))
    this.callNumber
      .callNumber(event.phone_number, true)
      .then(() => {
        this.callInitiated = true;
        //console.log('Dialer Launched!');
        setTimeout(() => {
          this.getContacts('type', '2', '==');
          this.getContacts('type', '5', '==');
        }, 10000);
        setTimeout(() => {
          this.postCallHistory();
        }, 30000);
      })
      .catch(() => {
        console.log('Error launching dialer');
      });
       let data2 = {
        user:this.counsellor_id,
        status:6
      }
      this._baseService.postData(`${environment.counsellor_status}`,data2).subscribe((res:any)=>{
        if(res){
          this.api.showToast(res.message)  
        }
      },((error:any)=>{
        this.api.showToast(error?.error?.message)
      }))
  }
  postCallHistory() {
    let data = {
      lead_id: this.leadId,
      phone_number: this.leadPhoneNumber,
      call_status: this.callStatus,
      counsellor: this.counsellor_id,
      call_start_time: this.callStartTime,
    };
    this.api.sendingCallHistory(data).subscribe((res: any) => {
      //console.log(res, 'sending call history');
    },(error:any)=>{
      this.api.showToast(error.error.message);
    });
  }
}
