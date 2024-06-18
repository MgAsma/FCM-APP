import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AlertController, Platform, PopoverController } from "@ionic/angular";

import { CallLog, CallLogObject } from "@ionic-native/call-log/ngx";
import { CallNumber } from "@ionic-native/call-number/ngx";
import { AllocationEmittersService } from "../../service/allocation-emitters.service";
import { BaseServiceService } from "../../service/base-service.service";
import { ApiService } from "../../service/api/api.service";
import { environment } from "../../../environments/environment";
import { AndroidPermissions } from "@ionic-native/android-permissions/ngx";
import {
  NativeSettings,
  AndroidSettings,
  IOSSettings,
} from "capacitor-native-settings";
import { CallPermissionsService } from "../../service/api/call-permissions.service";

@Component({
  selector: "app-goto-view-customer-details-call-customer",
  templateUrl: "./goto-view-customer-details-call-customer.component.html",
  styleUrls: ["./goto-view-customer-details-call-customer.component.scss"],
})
export class GotoViewCustomerDetailsCallCustomerComponent implements OnInit {
  @Input() data: any;
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
    private router: Router,
    private popoverController: PopoverController,
    private allocate: AllocationEmittersService,
    private callNumber: CallNumber,
    private _baseService: BaseServiceService,
    private api: ApiService,
    private callLog: CallLog,
    private platform: Platform,
    private androidPermissions: AndroidPermissions,
    private alertController: AlertController,
    private callPermissionService: CallPermissionsService
  ) {
    this.counsellor_id = localStorage.getItem("user_id");
    this.callPermissionService.callLogsCallBackFunction =
      this.getContacktAndPostHistory.bind(this);
    setTimeout(() => {
      this.callPermissionService?.initiateCallStatus(
        this.getContacktAndPostHistory.bind(this)
      );
      // console.log("callstatus should call");
    }, 1000);
  }
  ngOnChanges() {}

  ngOnInit() {
    this.callPermissionService.initiateCallStatus(
      this.getContacktAndPostHistory.bind(this)
    );

    this.allocate.callhistoryList.subscribe((res: any) => {
      if (res) {
        this.selectedDetails = res;
      }
    });
  }
  close() {
    this.popoverController.dismiss();
  }
  goToDetails() {
    this.allocate.logMemberDetails.next(this.data);
    this.close();

    this.router.navigate(["/inner/customer-details"]);
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
        // console.log(JSON.stringify(results[0]), "latest call log");
        this.callDuration = results[0].duration;
        const calculateTime = Number(results[0].date) - Number(this.calledTime);
        // console.log(calculateTime,"calculateTime");

        // console.log(JSON.stringify(this.callDuration), "latest call duration");
        if (this.callDuration > 0) {
          this.callStatus = 1;
        } else {
          this.callStatus = 3;
        }

        // console.log(
        //   JSON.stringify(results),
        //   "call log responseeeeeeeeeeeeeeeee"
        // );
        this.recordsFoundText = JSON.stringify(results);
        // console.log(this.recordsFoundText, "this.recordsFoundText");
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

  getContacktAndPostHistory() {
    this.getContacts("type", "2", "==");
  }

  async initializeCall(event) {
    const phoneStateResult = await this.androidPermissions.checkPermission(
      this.androidPermissions.PERMISSION.READ_PHONE_STATE
    );

    const readCallLogs = await this.androidPermissions.checkPermission(
      this.androidPermissions.PERMISSION.READ_CALL_LOG
    );

    const readContacts = await this.androidPermissions.checkPermission(
      this.androidPermissions.PERMISSION.READ_CONTACTS
    );

    if (
      !phoneStateResult.hasPermission ||
      !readContacts.hasPermission ||
      !readCallLogs.hasPermission
    ) {
      let message: any =
        "This app requires the following permissions to function properly ";
      if (!phoneStateResult.hasPermission) {
        message += " Make Phone Calls";
      }
      if (!readContacts.hasPermission) {
        message += " Read Phone Contacts";
      }
      if (!readCallLogs.hasPermission) {
        message += " Access Call Logs";
      }
      message += "Would you like to grant these permissions?";
      const confirmation = await this.warn(message);

      if (!confirmation) {
        return;
      }

      return;
    }
    if (this.callPermissionService.isCallInitiationCalled === false) {
      this.api.showToast("Please restart your application!", 5000);
      return;
    }

    // console.log(event);
    this.leadId = event.lead_id;
    this.leadPhoneNumber = event.phone_number;
    this.callStartTime = new Date();
    // console.log(this.callStartTime, 'time');
    let data = {
      user: this.counsellor_id,
      status: 3,
    };
    this.postTLStatus(data);
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
      // console.log(error);
    }

    // let data2 = {
    //   user: this.counsellor_id,
    //   status: 6,
    // };
    // this._baseService
    //   .postData(`${environment.counsellor_status}`, data2)
    //   .subscribe(
    //     (res: any) => {
    //       if (res) {
    //         // this.api.showToast(res.message)
    //       }
    //     },
    //     (error: any) => {
    //       this.api.showToast(error?.error?.message);
    //     }
    //   );
  }

  postTLStatus(data) {
    this._baseService
      .postData(`${environment.counsellor_status}`, data)
      .subscribe(
        (res: any) => {
          if (res) {
            // this.api.showError(res.message);
          }
        },
        (error: any) => {
          this.api.showError(error?.error?.message);
        }
      );
  }

  postCallHistory() {
    let data = {
      lead_id: this.leadId,
      phone_number: this.leadPhoneNumber,
      call_status: this.callStatus,
      counsellor: this.counsellor_id,
      call_start_time: this.callStartTime,
    };
    this.api.sendingCallHistory(data).subscribe(
      (res: any) => {
        // console.log(res, "sending call history in call-logs page");

        let tlsData = {
          user: this.counsellor_id,
          status: 3,
        };
        this.postTLStatus(tlsData);
      },
      (error: any) => {
        // this.api.showToast(error.error.message);
      }
    );
  }

  async warn(message) {
    return new Promise(async (resolve) => {
      const confirm = await this.alertController.create({
        header: "Permissions Required",
        message: message,
        // message: 'This app requires the following permission to function properly: Make Phone Calls \n\n Would you like to grant these permissions?',
        buttons: [
          {
            text: "Cancel",
            role: "cancel",
            handler: () => {
              return resolve(false);
            },
          },
          {
            text: "OK",
            handler: () => {
              NativeSettings.open({
                optionAndroid: AndroidSettings.ApplicationDetails,
                optionIOS: IOSSettings.App,
              });
              return resolve(true);
            },
          },
        ],
      });

      await confirm.present();
    });
  }
}
