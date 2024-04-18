import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform, PopoverController } from '@ionic/angular';

import { CallLog,CallLogObject } from '@ionic-native/call-log/ngx';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { AllocationEmittersService } from '../../service/allocation-emitters.service';
import { BaseServiceService } from '../../service/base-service.service';
import { ApiService } from '../../service/api/api.service';
import { environment } from '../../../environments/environment';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { NativeSettings, AndroidSettings, IOSSettings } from 'capacitor-native-settings';
declare var PhoneCallTrap: any;

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
  isPhoneHalfHook: boolean = false;
  isPhoneIdle: boolean = false;
  constructor(
    private router:Router,
    private popoverController:PopoverController,
    private allocate:AllocationEmittersService,
    private callNumber:CallNumber,
    private _baseService:BaseServiceService,
    private api:ApiService,
    private callLog:CallLog,
    private platform: Platform,
    private androidPermissions:AndroidPermissions
    ) { 
      this.counsellor_id = localStorage.getItem('user_id');


      // this.platform.ready().then(() => {
      //   this.callLog
      //     .hasReadPermission()
      //     .then((hasPermission) => {
      //       if (!hasPermission) {
      //         this.callLog
      //           .requestReadPermission()
      //           .then((results) => {
      //             // this.getContacts("type", "2", "==");
      //           })
      //           .catch((e) =>{
      //             // alert(" requestReadPermission " + JSON.stringify(e))
      //           }
                  
      //           );
      //       } else {
      //         // this.getContacts("type", "5", "==");
      //       }
      //     })
      //     .catch((e) => {
      //       // alert(" hasReadPermission " + JSON.stringify(e))

      //     });
      // });
      
    }






    async phoneStatePermission() {
      try {
        const phoneStateResult = await this.androidPermissions.checkPermission(
          this.androidPermissions.PERMISSION.READ_PHONE_STATE
        );
        if (!phoneStateResult.hasPermission) {
          const res = await this.androidPermissions.requestPermission(
            this.androidPermissions.PERMISSION.READ_PHONE_STATE
          );
  
          if (!res.hasPermission) {
          //  this.diagnostic.switchToSettings();
          this.api.showWarning('Permission is Required')
          }
        }
      } catch (error) {
        console.log('Error!', error);
      }
    }
  
    async callLogPermission() {
      try {
        const callLogResult = await this.androidPermissions.requestPermissions(
          this.androidPermissions.PERMISSION.READ_CALL_LOG
        );
        if (!callLogResult.hasPermission) {
          const { hasPermission } =
            await this.androidPermissions.requestPermission(
              this.androidPermissions.PERMISSION.READ_CALL_LOG
            );
  
          if (!hasPermission) {
          //  this.diagnostic.switchToSettings();
          this.api.showWarning('Permission is Required')
          }
        }
      } catch (error) {
        console.log('Error!', error);
      }
    }
  
    async checkPermissions() {
      try {
        await this.phoneStatePermission();
        await this.callLogPermission();
      } catch (error) {
        console.log('Error!', error);
      }
    }

  ngOnInit() {
    this.isPhoneHalfHook = false;
    this.isPhoneIdle = false;
    this.initiateCallStatus();
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
    if (value == "1") {
      this.listTyle = "Incoming Calls from yesterday";
    } else if (value == "2") {
      this.listTyle = "Ougoing Calls from yesterday";
    } else if (value == "5") {
      this.listTyle = "Rejected Calls from yesterday";
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
        name: "date",
        value: fromTime.toString(),
        operator: ">=",
      },
    ];

    this.callLog
      .getCallLog(this.filters)
      .then((results) => {
        console.log(JSON.stringify(results[0]), "latest call log");
        this.callDuration = results[0].duration;
        const calculateTime=Number(results[0].date)-Number(this.calledTime)
        console.log(calculateTime,"calculateTime");
        
        console.log(JSON.stringify(this.callDuration), "latest call duration");
        if (this.callDuration > 0) {
          this.callStatus = 1;
        } else {
          this.callStatus = 3;
        }

        console.log(
          JSON.stringify(results),
          "call log responseeeeeeeeeeeeeeeee"
        );
        this.recordsFoundText = JSON.stringify(results);
        console.log(this.recordsFoundText, "this.recordsFoundText");
        this.recordsFound = results; //JSON.stringify(results);

        if (calculateTime > 0) {
          this.postCallHistory();
        }
      })
      .catch((e) => {
        // alert(' LOG ' + JSON.stringify(e))
      });
  }
  callInitiated: boolean = false;
  callStartTime!: Date;
  calledTime: any;

  private initiateCallStatus() {
    const that = this;
    console.log(PhoneCallTrap, "PhoneCallTrap");

    PhoneCallTrap?.onCall(function (state: string) {
      console.log("CHANGE STATE: " + state);
      // alert(state);

      switch (state) {
        case "RINGING":
          break;
        case "OFFHOOK":
          that.isPhoneHalfHook = true;
          break;
        case "IDLE":
          that.isPhoneIdle = true;
          if (that.isPhoneHalfHook == true) {
            setTimeout(()=>{
              that.getContacktAndPostHistory()
            },2000)

          }
          that.isPhoneHalfHook = false;
          break;
      }
    });
  }

  getContacktAndPostHistory() {
    this.getContacts("type", "2", "==");
  }




async  initializeCall(event) {
    const hasPermission=await

    this.callLog
        .hasReadPermission()
        if (!hasPermission) {
          NativeSettings.open({
            optionAndroid: AndroidSettings.ApplicationDetails, 
            optionIOS: IOSSettings.App
          })
          
          this.api.showWarning('Permission is Required!')
          
          
          this.callLog
            .requestReadPermission()
            .then((results) => {
              // this.getContacts("type", "2", "==");
            })}

    console.log(event);
    this.leadId = event.lead_id;
    this.leadPhoneNumber = event.phone_number;
    this.callStartTime = new Date();
    console.log(this.callStartTime, 'time');
    let data = {
      user: this.counsellor_id,
      status: 3,
    };
    this._baseService
      .postData(`${environment.counsellor_status}`, data)
      .subscribe(
        (res: any) => {
          if (res) {
            // this.api.showToast(res.message)
          }
        },
        (error: any) => {
          this.api.showToast(error?.error?.message);
        }
      );
      this.calledTime = new Date().getTime();

    try {
      setTimeout(async () => {
        // this.calledTime=0;
        
        this.callStartTime = new Date();
        await this.callNumber.callNumber(event.phone_number, true);

        const that = this;
        this.callInitiated = true;

        // this.initiateCallStatus();
      }, 100);
    } catch (error) {
      console.log(error);
    }

    let data2 = {
      user: this.counsellor_id,
      status: 6,
    };
    this._baseService
      .postData(`${environment.counsellor_status}`, data2)
      .subscribe(
        (res: any) => {
          if (res) {
            // this.api.showToast(res.message)
          }
        },
        (error: any) => {
          this.api.showToast(error?.error?.message);
        }
      );
  }

  
  // initializeCall(event) {
  //   //console.log(event)
  //   this.leadId = event.lead_id;
  //   this.leadPhoneNumber = event.phone_number;
  //   this.callStartTime = new Date();
  //   // //console.log(this.callStartTime, 'time');
  //    let data = {
  //     user:this.counsellor_id,
  //     status:3
  //   }
  //   this._baseService.postData(`${environment.counsellor_status}`,data).subscribe((res:any)=>{
  //     if(res){
  //       // this.api.showToast(res.message)  
  //     }
  //   },((error:any)=>{
  //     // this.api.showToast(error?.error?.message)
  //   }))
  //   this.callNumber
  //     .callNumber(event.phone_number, true)
  //     .then(() => {
  //       this.callInitiated = true;
  //       ////console.log('Dialer Launched!');
  //       // setTimeout(() => {
  //       //   this.getContacts('type', '2', '==');
  //       //   // this.getContacts('type', '5', '==');
  //       // }, 10000);
  //       // setTimeout(() => {
  //       //   this.postCallHistory();
  //       // }, 40000);

  //       setTimeout(() => {
  //         this.getContacts("type", "2", "==");
  //         // this.getContacts("type", "5", "==");
  //       }, 70000);
  //       setTimeout(() => {
  //         this.postCallHistory();
  //       }, 90000);
  //     })
  //     .catch(() => {
  //       //console.log('Error launching dialer');
  //     });
  //      let data2 = {
  //       user:this.counsellor_id,
  //       status:6
  //     }
  //     this._baseService.postData(`${environment.counsellor_status}`,data2).subscribe((res:any)=>{
  //       if(res){
  //         // this.api.showToast(res.message)  
  //       }
  //     },((error:any)=>{
  //       //this.api.showToast(error?.error?.message)
  //     }))
  // }
  postCallHistory() {
    let data = {
      lead_id: this.leadId,
      phone_number: this.leadPhoneNumber,
      call_status: this.callStatus,
      counsellor: this.counsellor_id,
      call_start_time: this.callStartTime,
    };
    this.api.sendingCallHistory(data).subscribe((res: any) => {
      ////console.log(res, 'sending call history');
    },(error:any)=>{
      // this.api.showToast(error.error.message);
    });
  }
}
