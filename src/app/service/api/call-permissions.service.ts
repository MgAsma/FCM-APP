import { HttpClient } from "@angular/common/http";
import { EventEmitter, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Platform } from "@ionic/angular";
import { BehaviorSubject } from "rxjs";
import { environment } from "../../../environments/environment";
declare var PhoneCallTrap: any;

@Injectable({
  providedIn: "root",
})
export class CallPermissionsService {
  isPhoneHalfHook: boolean = false;
  isPhoneIdle: boolean = false;
  isCallInitiationCalled: boolean = false;
  // allocationscallBackFunction:boolean=false;
  // customerCallBackFunction:boolean=false;
  allocationscallBackFunction:any;
  customerCallBackFunction:any;

  constructor(private http: HttpClient,private router:Router) {}

  apiUrl = environment.lead_list;
  getAllocationsPhoneNumbers() {
    return this.http.get(
      `${this.apiUrl}/?user_type=allocation&page=1&page_size=10`
    );
  }
  initiateCallStatus(callBack: any) {
    const that = this;
    //  console.log(that.isCallInitiationCalled, " that.isCallInitiationCalled");
    //  console.log(PhoneCallTrap, " PhoneCallTrap");

    PhoneCallTrap?.onCall(
      function (state: string) {
        that.isCallInitiationCalled = true;
        // console.log("phone call trap called");

        //  console.log("CHANGE STATE: " + state);
        // alert(state);

        switch (state) {
          case "RINGING":
            // alert("Phone is ringing");
            //  console.log("Phone is ringing");
            break;
          case "OFFHOOK":
            that.isPhoneHalfHook = true;

            // alert("Phone is off-hook");
            //  console.log("Phone is off-hook");
            break;

          case "IDLE":
            that.isPhoneIdle = true;

            if (that.isPhoneHalfHook == true) {
              setTimeout(() => {
                if(that.router.url.includes('allocations')){
                  that.allocationscallBackFunction()
                }
                if(that.router.url.includes('customers')){
                  that.customerCallBackFunction()
                }
               
               
                
              }, 2000);
            }
            that.isPhoneHalfHook = false;

            // alert("Phone is idle");
            // console.log("Phone is idle");

            break;
        }
      },
      function (event: any) {
        // console.log(event, "event in calltrap");
      }
    );
  }

  dataUpdated = new EventEmitter<any>(false);
  dataSubject = new BehaviorSubject<any>(false);
  isToggleddataSubject = new BehaviorSubject<any>(false);
  closeCancelEditLeadPagedataSubject = new BehaviorSubject<any>(false);
 notUpdatingStatusSubject = new BehaviorSubject<any>('');

  breakTime: Date;
  setBreakTime(date: Date) {
    this.breakTime = date;
  }

  getBreakTime() {
    return this.breakTime;
  }
  selectedStatusdataSubject = new BehaviorSubject<any>({});
  public data$ = this.selectedStatusdataSubject.asObservable();
  setStatus(data:any){
    this.selectedStatusdataSubject.next(data)

  }
  getStatus(){
    return this.data$;
  }
  
}
