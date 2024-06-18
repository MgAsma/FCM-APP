import {
  AfterViewInit,
  Component,
  DoCheck,
  HostListener,
  NgZone,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { AlertController, ModalController, Platform } from "@ionic/angular";

import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { CallNumber } from "@ionic-native/call-number/ngx";
import { environment } from "../../../environments/environment";
import { AllocationEmittersService } from "../../service/allocation-emitters.service";
import { ApiService } from "../../service/api/api.service";
import { BaseServiceService } from "../../service/base-service.service";
import { CallLog, CallLogObject } from "@ionic-native/call-log/ngx";
import { AddLeadEmitterService } from "../../service/add-lead-emitter.service";
import { EditLeadPage } from "../edit-lead/edit-lead.page";
import { AndroidPermissions } from "@ionic-native/android-permissions/ngx";
import {
  NativeSettings,
  AndroidSettings,
  IOSSettings,
} from "capacitor-native-settings";
import { Router } from "@angular/router";
import { App as CapacitorApp } from "@capacitor/app";
import { CallPermissionsService } from "../../service/api/call-permissions.service";
import { Location } from "@angular/common";
// declare var PhoneCallTrap: any;
@Component({
  selector: "app-allocations",
  templateUrl: "./allocations.page.html",
  styleUrls: ["./allocations.page.scss"],
})
export class AllocationsPage implements OnInit {
  searchBar: boolean = false;
  placeholderText = "Search by Name";
  data: any = [];
  leadCards: any;
  totalNumberOfRecords: any = 0;
  currentPage: any = 1;
  counselor: any = [];
  filteredData: any = [];
  filterByStatus: any = [];
  showError: boolean = false;
  searchTerm: any;

  filters: CallLogObject[];
  recordsFound: any;
  recordsFoundText: string;
  listTyle: string;
  pageSize: any = 10;
  counsellor_ids: any = [];
  user_id: string;
  superadmin_or_admin: string;
  // callStatus: number;
  callDuration: number;
  leadId: any;
  leadPhoneNumber: any;
  // counsellor_id: any;

  currentStatus: any;
  callInitiated: boolean = false;
  callStartTime!: Date;
  user_role: string;
  statusFilter: boolean = false;
  selectedFilter = [];
  phoneNumbers: any = [];
  isToggledEnabled: boolean = false;
  leadData: any;

  // allPaginator: any;
  @ViewChild("paginator", { static: true }) paginator: MatPaginator;
  pageIndex: number;
  selectedLead: any;
  refresh: any = false;
  cancelCloseEditRes: any;
  resCounsellors: any = [];
  triggerGet: boolean = false;
  selectedFilter_ids: any = [];
  selectedCounsellor: boolean = false;
  startingIndex: any = 0;
  currentIndex: any = 0;
  contains: any;
  initialIndex = 0;
  presentIndex = 0;
  // closeEditRes:any;

  constructor(
    private allocate: AllocationEmittersService,
    private api: ApiService,
    private _baseService: BaseServiceService,
    private callNumber: CallNumber,
    private callLog: CallLog,
    private platform: Platform,
    private _addLeadEmitter: AddLeadEmitterService,
    private modalController: ModalController,
    private androidPermissions: AndroidPermissions,
    private alertController: AlertController,
    private router: Router,
    private callPermissionService: CallPermissionsService,
    private location: Location
  ) {
    this.user_role = localStorage.getItem("user_role")?.toUpperCase();

    this.user_id = localStorage.getItem("user_id");
    this.resCounsellors = localStorage.getItem("counsellor_ids");
    this.afterUpdatinggetPhoneNumbers();

    setTimeout(() => {
      this.callPermissionService?.initiateCallStatus(
        this.getContacktAndPostHistory.bind(this)
      );
      this.callPermissionService.allocationscallBackFunction =
        this.getContacktAndPostHistory.bind(this);
    }, 1000);

    this.callPermissionService?.isToggleddataSubject.subscribe((res: any) => {
      this.isToggledEnabled = res;

      // this.startingIndex = 0;
      // this.currentIndex = 0;
      // this.initialIndex = 0;
      // this.presentIndex = 0;

      if (res == true) {
        // console.log(this.afterUpadtingPhoneNumbers, this.contains, "before if");

        this.contains = this.callPermissionService.getCalledNumber();

        // console.log(
        //   this.afterUpadtingPhoneNumbers,
        //   this.contains,
        //   "before loop"
        // );
        // let res=(this.contains))
        // console.log(this.contains, "this.contains");

        if (
          this.afterUpadtingPhoneNumbers.some(
            (num) => JSON.stringify(num) === this.contains
          ) &&
          this.isToggledEnabled == true
        ) {
          // console.log(this.afterUpadtingPhoneNumbers,  "after if");
          // console.log(
          //   this.afterUpadtingPhoneNumbers,
          //   this.contains,
          //   "after loop"
          // );
          // console.log(this.initialIndex, "before the call");

          // this.initialIndex + 1;
          this.initialIndex = this.callPermissionService.getIndex() + 1;
          // console.log(this.initialIndex, "after the call");

          this.presentIndex = this.initialIndex;
          this.allocateItem = this.data.data[this.initialIndex];
          this.callPermissionService.setIndex(this.initialIndex);

          this.callContact(
            this.afterUpadtingPhoneNumbers[this.initialIndex],
            this.allocateItem.user_data.id,
            this.allocateItem,
            this.initialIndex
          );
        } else {
          this.allocateItem = this.data.data[this.presentIndex];
          this.callPermissionService.setIndex(this.presentIndex);

          this.callContact(
            this.afterUpadtingPhoneNumbers[this.presentIndex],
            this.allocateItem.user_data.id,
            this.allocateItem,
            this.presentIndex
          );
        }
      }
    });
  }
  allocateItem: any;
  notUpdatingStatus: any;
  ngOnInit() {
    this.checkPermissions();
    //refreshing phonenumbers array,after updating the allocation status

    // this.callPermissionService.closeCancelEditLeadPagedataSubject.subscribe(
    //   (res: any) => {
    //     this.cancelCloseEditRes = res;
    //     if (this.isToggledEnabled == true) {
    //       if (
    //         this.cancelCloseEditRes == "close" ||
    //         this.cancelCloseEditRes == "cancel"
    //       ) {
    //         console.log(res, "closed edit form");
    //         return;
    //       } else {
    //         console.log(res, "submitted");

    //       }
    //     }
    //   }
    // );

    this.callPermissionService.getStatus().subscribe((res: any) => {
      if (res && res.submit == "submit" && this.isToggledEnabled == true) {
        if (res.statusValue == 9 && res.submit === "submit") {
          setTimeout(() => {
            this.currentIndex = this.callPermissionService.getIndex() + 1;
            this.startingIndex = this.currentIndex;
            this.allocateItem = this.data.data[this.currentIndex];
            this.callPermissionService.setIndex(this.currentIndex);

            this.recursiveCall(
              this.afterUpadtingPhoneNumbers[this.currentIndex],
              this.allocateItem.user_data.id,
              this.allocateItem,
              this.currentIndex
            );
            this.getContacktAndPostHistory();
          }, 5000);
        } else {
          this.afterUpdatinggetPhoneNumbers();

          setTimeout(() => {
            {
              this.startingIndex = this.callPermissionService.getIndex();
              this.allocateItem = this.data.data[this.startingIndex];
              this.callPermissionService.setIndex(this.startingIndex);
              this.recursiveCall(
                this.afterUpadtingPhoneNumbers[this.startingIndex],
                this.allocateItem.user_data.id,
                this.allocateItem,
                this.startingIndex
              );
              this.getContacktAndPostHistory();
            }
          }, 5000);
        }
      } else {
        return;
      }
    });

    // this.initiateCallStatus();

    this.pageIndex = 0;
    this.user_id = localStorage.getItem("user_id");
    this.getStatus();
    this.allocate.searchBar.subscribe((res) => {
      if (res === true) {
        this.searchBar = true;
      } else {
        this.searchBar = false;
      }
    });

    this.getCounselor();
  }

  resetFilters() {
    this.totalNumberOfRecords = 0;
    this.allocate.allocationStatus.next([]);
    this._addLeadEmitter.selectedCounsellor.next([]);
    this.counsellor_ids = [];
    this.statusFilter = false;
    this.searchTerm = "";
    this.allocate.searchBar.next(false);
    this.leadCards = [];
    this.data = [];
  }

  calledPhoneNumbers: any = [];
  calledPhoneNumbersArray: any = [];
  getContacts(name, value, operator) {
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
        // console.log(JSON.stringify(results), "latest call log in allocations");
        // this.calledPhoneNumbers = results[0];
        this.callPermissionService.setCalledNumber(
          JSON.stringify(results[0].number)
        );

        // console.log(this.calledPhoneNumbers, " this.calledPhoneNumbersArray");

        const calculateTime = Number(results[0].date) - Number(this.calledTime);
        // console.log(calculateTime, "calculate time in allocations");

        this.callDuration = results[0].duration;
        if (this.callDuration > 0) {
          this.currentStatus = 1;
        } else {
          this.currentStatus = 3;
        }

        this.recordsFoundText = JSON.stringify(results);
        this.recordsFound = results; //JSON.stringify(results);

        if (calculateTime > 0) {
          this.postCallHistory();
        }
      })
      .catch((e) => {
        // alert(" LOG " + JSON.stringify(e))
      });
  }

  isCallInitiationCalled: boolean = false;

  calledTime: any;

  getContacktAndPostHistory() {
    if (this.router.url.includes("allocations")) {
      this.getContacts("type", "2", "==");
    }
  }

  leadItem: any;
  lead_id: any;

  async callContact(number: string, id: any, item, index: any) {
    const phoneStateResult = await this.androidPermissions.checkPermission(
      this.androidPermissions.PERMISSION.READ_PHONE_STATE
    );

    const readContacts = await this.androidPermissions.checkPermission(
      this.androidPermissions.PERMISSION.READ_CONTACTS
    );

    const readCallLogs = await this.androidPermissions.checkPermission(
      this.androidPermissions.PERMISSION.READ_CALL_LOG
    );

    if (
      !phoneStateResult.hasPermission ||
      !readContacts.hasPermission ||
      !readCallLogs.hasPermission
    ) {
      let message: any =
        "This app requires the following permissions to function properly ";
      if (!phoneStateResult.hasPermission) {
        message += " Make Phone Calls ";
        this.callPermissionService.isToggleddataSubject.next(false);
      }
      if (!readContacts.hasPermission) {
        message += " Read Phone Contacts ";
        this.callPermissionService.isToggleddataSubject.next(false);
      }
      if (!readCallLogs.hasPermission) {
        message += " Access Call Logs ";
        this.callPermissionService.isToggleddataSubject.next(false);
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

    this.recursiveCall(number, id, item, index);
  }

  phoneNumberIndex: any;
  recursiveCall(number: string, id: any, item, index: any) {
    console.log(number, id, item, index, "item in recursive");
    if (index >= this.phoneNumbers.length) {
      return;
    } else {
      this.leadItem = item;
      this.lead_id = id;

      try {
        this.leadId = id;
        this.leadPhoneNumber = number;
        this.callStartTime = new Date();
        this.selectedLead = item;
        // console.log( this.callStartTime," this.callStartTime");

        let data = {
          user: this.user_id,
          status: 3,
        };

        this.postTLStatus(data);
        this.calledTime = new Date().getTime();
        // console.log(this.calledTime,"this.calledTime in allocation ");

        setTimeout(async () => {
          this.callStartTime = new Date();
          await this.callNumber.callNumber(number, true);

          const that = this;
          this.callInitiated = true;

          this.editLead(this.selectedLead);
          // this.initiateCallStatus();
        }, 100);
      } catch (error) {
        // console.log(error);
      }
    }
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
      call_status: this.currentStatus,
      counsellor: this.user_id,
      call_start_time: this.callStartTime,
    };
    this.api.sendingCallHistory(data).subscribe(
      (res: any) => {
        // alert("sending call history is called afetr call made in customer")
        // console.log(res, "sending call history in alloactions");
        let tlsData = {
          user: this.user_id,
          status: 3,
        };
        this.postTLStatus(tlsData);
      },
      (error: any) => {
        this.api.showError(error.error.message);
      }
    );
  }

  getStatus() {
    this._baseService.getData(environment.lead_status).subscribe(
      (res: any) => {
        if (res) {
          this.filterByStatus = res.results;
        }
      },
      (error: any) => {
        this.api.showError(error.error.message);
      }
    );
  }
  viewInit() {
    this._addLeadEmitter.triggerGet$.subscribe((res: any) => {
      this.triggerGet = true;
      this.getEmitters();
    });
    this.getAllocationWithFilters();
  }
  ionViewWillEnter() {
    this.viewInit();
  }

  getAllAllocation() {
    let query = "";
    const counsellorRoles = ["COUNSELLOR", "COUNSELOR"];
    const superAdminRoles = ["SUPERADMIN", "SUPER ADMIN"];
    const adminRoles = ["ADMIN"];
    if (counsellorRoles.includes(this.user_role)) {
      query = `?counsellor_id=${this.user_id}&user_type=allocation&page=1&page_size=10`;
    } else if (superAdminRoles.includes(this.user_role)) {
      query = `?user_type=allocation&page=1&page_size=10`;
    } else if (adminRoles.includes(this.user_role)) {
      if (this.resCounsellors !== "") {
        query = `?admin_id=${this.user_id}&counsellor_id=${this.resCounsellors}&user_type=allocation&page=1&page_size=10`;
      } else {
        query = `?admin_id=${this.user_id}&user_type=allocation&page=1&page_size=10`;
      }
    }
    this.leadCards = [];
    this.data = [];
    this._baseService.getData(`${environment.lead_list}${query}`).subscribe(
      (res: any) => {
        if (res.results) {
          this.leadCards = res.results.data;
          this.allocateItem = res.results.data[0];
          this.data = new MatTableDataSource<any>(this.leadCards);
          this.totalNumberOfRecords = res.total_no_of_record;
        }
      },
      (error: any) => {
        this.api.showError(error.error.message);
      }
    );
  }

  getEmitters() {
    if (this.triggerGet) {
      let query: string;
      const counsellorRoles = ["COUNSELLOR", "COUNSELOR"];
      const superAdminRoles = ["SUPERADMIN", "SUPER ADMIN"];
      const adminRoles = ["ADMIN"];

      // Base query setup
      query = `?user_type=allocation&page=${this.currentPage}&page_size=${this.pageSize}`;

      if (counsellorRoles.includes(this.user_role)) {
        query += `&counsellor_id=${this.user_id}`;
      } else if (adminRoles.includes(this.user_role)) {
        if (this.counsellor_ids.length > 0) {
          // Admin filtering by counsellor
          query += `&admin_id=${this.user_id}&counsellor_id=${this.counsellor_ids}`;
        } else {
          if (this.resCounsellors !== "") {
            query += `&admin_id=${this.user_id}&counsellor_id=${this.resCounsellors}`;
          } else {
            query += `&admin_id=${this.user_id}`;
          }
          // Admin not filtering by counsellor
        }
      }
      // Add additional filters
      if (this.statusFilter) {
        query += `&status=${this.selectedFilter}`;
      }
      if (
        !adminRoles.includes(this.user_role) &&
        this.counsellor_ids.length > 0
      ) {
        // For roles other than admin, when filtering by counsellor
        query += `&counsellor_id=${this.counsellor_ids}`;
      }
      if (this.searchTerm) {
        query += `&key=${this.searchTerm}`;
      }

      // API call
      this._baseService
        .getData(`${environment.lead_list}${query}`)
        .subscribe((res: any) => {
          if (res.results) {
            this.leadCards = res.results.data;
            this.allocateItem = res.results.data[0];
            this.data = new MatTableDataSource<any>(this.leadCards);
            this.totalNumberOfRecords = res.total_no_of_record;
          }
        });
    }
  }

  getAllocationWithFilters() {
    this._addLeadEmitter.selectedCounsellor.subscribe((res) => {
      if (res) {
        this.counsellor_ids = res;
      }
    });

    this.allocate.allocationStatus.subscribe((res: any) => {
      if (res.length > 0) {
        this.statusFilter = true;
      } else {
        this.statusFilter = false;
      }

      if (res.length > 0 || this.counsellor_ids.length > 0) {
        this.selectedFilter = res;

        let query: string;
        const counsellorRoles = ["COUNSELLOR", "COUNSELOR"];
        const superAdminRoles = ["SUPERADMIN", "SUPER ADMIN"];
        const adminRoles = ["ADMIN"];

        // Base query setup
        query = `?user_type=allocation&page=1&page_size=10`;

        if (counsellorRoles.includes(this.user_role)) {
          query += `&counsellor_id=${this.user_id}`;
        } else if (adminRoles.includes(this.user_role)) {
          if (res.length > 0 && this.counsellor_ids.length === 0) {
            query += `&admin_id=${this.user_id}&status=${res}&counsellor_id=${this.resCounsellors}  `;
          }
          if (res.length > 0 && this.counsellor_ids.length > 0) {
            query += `&status=${res}&counsellor_id=${this.counsellor_ids}`;
          }
          if (res.length === 0 && this.counsellor_ids.length > 0) {
            query += `&counsellor_id=${this.counsellor_ids} `;
          }
          if (res.length === 0 && this.counsellor_ids.length === 0) {
            query += `&admin_id=${this.user_id}&counsellor_id=${this.resCounsellors} `;
          }
        }

        // Add status filter
        if (!adminRoles.includes(this.user_role) && res.length > 0) {
          query += `&status=${res}`;
        }
        // For roles other than admin, add counsellor filter if filtering by counsellor
        if (
          !adminRoles.includes(this.user_role) &&
          this.counsellor_ids.length > 0
        ) {
          query += `&counsellor_id=${this.counsellor_ids}`;
        }
      } else {
        this.statusFilter = false;
        this.counsellor_ids = [];
        this.getAllAllocation();
      }
    });
  }
  afterUpadtingPhoneNumbers: any;
  query = "";
  afterUpdatinggetPhoneNumbers() {
    this.query = `?user_type=allocation&page=${this.currentPage}&page_size=${this.pageSize}`;
    if (this.user_role === "Admin" || this.user_role === "ADMIN") {
      this.query += `&admin_id=${this.user_id}&counsellor_id=${this.resCounsellors} `;
    } else if (
      this.user_role === "counsellor" ||
      this.user_role === "COUNSELLOR"
    ) {
      this.query += `&counsellor_id=${this.user_id}`;
    } else {
      this.query = `?user_type=allocation&page=${this.currentPage}&page_size=${this.pageSize}`;
    }

    this._baseService
      .getData(`${environment.lead_list}${this.query}`)
      .subscribe((res: any) => {
        this.leadData = res.results.data;
        // console.log(res.results.data, "res.results.data");

        if (this.leadData?.length > 0) {
          this.phoneNumbers = this.leadData
            ?.filter((ele: any) => ele.user_data?.mobile_number)
            .map((ele: any) => ele.user_data?.mobile_number);
          // console.log(this.phoneNumbers, "initial phone numbers");

          this.afterUpadtingPhoneNumbers = [...this.phoneNumbers];
        }
      });
    // this.callPermissionService
    //   .getAllocationsPhoneNumbers()
    //   .subscribe((res: any) => {
    //     this.leadData = res.results.data;
    //     console.log(res.results.data,"res.results.data");

    //     if (this.leadData?.length > 0) {
    //       this.phoneNumbers = this.leadData
    //         ?.filter((ele: any) => ele.user_data?.mobile_number)
    //         .map((ele: any) => ele.user_data?.mobile_number);
    //       console.log(this.phoneNumbers, "initial phone numbers");

    //       this.afterUpadtingPhoneNumbers = [...this.phoneNumbers];
    //       // console.log(
    //       //   this.afterUpadtingPhoneNumbers,
    //       //   "this.afterUpadtingPhoneNumbers"
    //       // );
    //     }
    //     // console.log(res, "resssssssss");
    //   });
  }

  handleRefresh(event: any) {
    if (event && event.target) {
      this.refresh = true;
      // this.afterUpdatinggetPhoneNumbers();
      // setTimeout(() => {
      this.totalNumberOfRecords = 0;
      this.allocate.allocationStatus.next([]);
      this._addLeadEmitter.selectedCounsellor.next([]);
      this.counsellor_ids = [];
      this.statusFilter = false;
      this.searchTerm = "";
      this.allocate.searchBar.next(false);
      this.leadCards = [];
      this.data = [];
      this.getAllAllocation();
      this.location.isCurrentPathEqualTo("/inner/allocations");
      event.target.complete();
      this.callPermissionService.setCalledNumber("");
      // },100);
    } else {
      this.refresh = false;
    }
  }

  onPageChange(event: any, dataSource: MatTableDataSource<any>, type?: any) {
    if (event) {
      this.currentPage = event.pageIndex + 1;
      this.pageSize = event.pageSize;
    }

    let query: string;
    const counsellorRoles = ["COUNSELLOR", "COUNSELOR"];
    const superAdminRoles = ["SUPERADMIN", "SUPER ADMIN"];
    const adminRoles = ["ADMIN"];

    // Base query setup
    query = `?user_type=allocation&page=${this.currentPage}&page_size=${event.pageSize}`;

    if (counsellorRoles.includes(this.user_role)) {
      query += `&counsellor_id=${this.user_id}`;
    } else if (adminRoles.includes(this.user_role)) {
      this.allocate.allocationStatus.subscribe((res: any) => {
        if (res) {
          // Add status filter
          if (res.length > 0 && this.counsellor_ids.length === 0) {
            query += `&admin_id=${this.user_id}&status=${res}&counsellor_id=${this.resCounsellors}  `;
          }
          if (res.length > 0 && this.counsellor_ids.length > 0) {
            query += `&status=${res}&counsellor_id=${this.counsellor_ids}`;
          }
          if (res.length === 0 && this.counsellor_ids.length > 0) {
            query += `&counsellor_id=${this.counsellor_ids} `;
          }
          if (res.length === 0 && this.counsellor_ids.length === 0) {
            query += `&admin_id=${this.user_id}&counsellor_id=${this.resCounsellors} `;
          }
        }
      });
    }
    // Add search term filter
    if (this.searchTerm) {
      query += `&key=${this.searchTerm}`;
    }

    // Add status filter
    if (!adminRoles.includes(this.user_role) && this.statusFilter) {
      this.allocate.allocationStatus.subscribe((res: any) => {
        if (res) {
          query += `&status=${res}`;
        }
      });
    }

    // For roles other than admin, add counsellor filter if filtering by counsellor
    if (
      !adminRoles.includes(this.user_role) &&
      this.counsellor_ids.length > 0
    ) {
      query += `&counsellor_id=${this.counsellor_ids}`;
    }

    // API call
    this._baseService.getData(`${environment.lead_list}${query}`).subscribe(
      (res: any) => {
        if (res.results) {
          this.leadCards = res.results.data;
          this.allocateItem = res.results.data[0];
          this.data = new MatTableDataSource<any>(this.leadCards);
          this.totalNumberOfRecords = res.total_no_of_record;
        }
      },
      (error: any) => {
        this.api.showError(error.error.message);
      }
    );
  }

  getCounselor() {
    let query =
      this.user_role === "COUNSELLOR" ||
      this.user_role === "COUNSELOR" ||
      this.user_role === "ADMIN"
        ? `?user_id=${this.user_id}`
        : ``;
    this._baseService.getData(`${environment._user}${query}`).subscribe(
      (res: any) => {
        if (res.results) {
          this.counselor = res.results;
        }
      },
      (error: any) => {
        this.api.showError(error.error.message);
      }
    );
  }

  onEmit(event: any) {
    if (event) {
      let params: string;
      const counsellorRoles = ["COUNSELLOR", "COUNSELOR"];
      const superAdminRoles = ["SUPERADMIN", "SUPER ADMIN"];
      const adminRoles = ["ADMIN"];

      // Base query setup
      params = `?user_type=allocation&page=1&page_size=10`;

      // Role-specific query parameters
      if (counsellorRoles.includes(this.user_role)) {
        params += `&counsellor_id=${this.user_id}`;
      } else if (superAdminRoles.includes(this.user_role)) {
        // Superadmin case already covered by base query
      } else if (adminRoles.includes(this.user_role)) {
        this.allocate.allocationStatus.subscribe((res: any) => {
          // Add status filter
          if (res.length > 0 && this.counsellor_ids.length === 0) {
            params += `&admin_id=${this.user_id}&status=${res}&counsellor_id=${this.resCounsellors} `;
          }
          if (res.length > 0 && this.counsellor_ids.length > 0) {
            params += `&status=${res}&counsellor_id=${this.counsellor_ids}`;
          }
          if (res.length === 0 && this.counsellor_ids.length > 0) {
            params += `&counsellor_id=${this.counsellor_ids} `;
          }
          if (res.length === 0 && this.counsellor_ids.length === 0) {
            params += `&admin_id=${this.user_id}&counsellor_id=${this.resCounsellors} `;
          }
        });
      }
      // Add status filter
      if (!adminRoles.includes(this.user_role) && this.statusFilter) {
        this.allocate.allocationStatus.subscribe((res: any) => {
          if (res) {
            params += `&status=${res}`;
          }
        });
      }

      // Add counsellor filter for non-admin roles
      if (
        !adminRoles.includes(this.user_role) &&
        this.counsellor_ids.length > 0
      ) {
        params += `&counsellor_id=${this.counsellor_ids}`;
      }

      // Add search term filter
      if (this.searchTerm) {
        params += `&key=${this.searchTerm}`;
      }

      // Clear previous data
      this.leadCards = [];
      this.data = [];
      this.totalNumberOfRecords = [];

      // API call
      this._baseService.getData(`${environment.lead_list}${params}`).subscribe(
        (res: any) => {
          if (res.results) {
            this.leadCards = res.results.data;

            this.data = new MatTableDataSource<any>(this.leadCards);
            this.totalNumberOfRecords = res.total_no_of_record;
          }
        },
        (error: any) => {
          this.api.showError(error.error.message);
        }
      );
    }
  }

  searchTermChanged(event: any) {
    if (event) {
      this.searchTerm = event;
      this.leadCards = [];
      this.data = [];

      let query: string;
      const counsellorRoles = ["COUNSELLOR", "COUNSELOR"];
      const superAdminRoles = ["SUPERADMIN", "SUPER ADMIN"];
      const adminRoles = ["ADMIN"];

      // Base query setup
      query = `?user_type=allocation&page=1&page_size=10&key=${event}`;

      // Role-specific query parameters
      if (counsellorRoles.includes(this.user_role)) {
        query += `&counsellor_id=${this.user_id}`;
      } else if (superAdminRoles.includes(this.user_role)) {
        // Superadmin case already covered by base query
      } else if (adminRoles.includes(this.user_role)) {
        this.allocate.allocationStatus.subscribe((res: any) => {
          // Add status filter
          if (res.length > 0 && this.counsellor_ids.length === 0) {
            query += `&admin_id=${this.user_id}&status=${res}&counsellor_id=${this.resCounsellors}  `;
          }
          if (res.length > 0 && this.counsellor_ids.length > 0) {
            query += `&status=${res}&counsellor_id=${this.counsellor_ids}`;
          }
          if (res.length === 0 && this.counsellor_ids.length > 0) {
            query += `&counsellor_id=${this.counsellor_ids} `;
          }
          if (res.length === 0 && this.counsellor_ids.length === 0) {
            query += `&admin_id=${this.user_id}&counsellor_id=${this.resCounsellors} `;
          }
        });
      }

      // Add counsellor filter for non-admin roles if filtering by counsellor
      if (
        !adminRoles.includes(this.user_role) &&
        this.counsellor_ids.length > 0
      ) {
        query += `&counsellor_id=${this.counsellor_ids}`;
      }
      // Add status filter
      if (!adminRoles.includes(this.user_role) && this.statusFilter === true) {
        this.allocate.allocationStatus.subscribe((res: any) => {
          if (res.length > 0) {
            query += `&status=${res}`;
          }
        });
      }

      // API call
      this._baseService.getData(`${environment.lead_list}${query}`).subscribe(
        (res: any) => {
          if (res.results) {
            this.leadCards = res.results.data;

            this.data = new MatTableDataSource<any>(this.leadCards);
            this.totalNumberOfRecords = res.total_no_of_record;
          }
        },
        (error: any) => {
          this.api.showError(error.error.message);
        }
      );
    } else {
      this.searchTerm = event;
      this.leadCards = [];
      this.data = [];

      let query: string;
      const counsellorRoles = ["COUNSELLOR", "COUNSELOR"];
      const superAdminRoles = ["SUPERADMIN", "SUPER ADMIN"];
      const adminRoles = ["ADMIN"];

      // Base query setup
      query = `?user_type=allocation&page=1&page_size=10`;

      // Role-specific query parameters
      if (counsellorRoles.includes(this.user_role)) {
        query += `&counsellor_id=${this.user_id}`;
      } else if (superAdminRoles.includes(this.user_role)) {
        // Superadmin case already covered by base query
      } else if (adminRoles.includes(this.user_role)) {
        this.allocate.allocationStatus.subscribe((res: any) => {
          // Add status filter
          if (res.length > 0 && this.counsellor_ids.length === 0) {
            query += `&admin_id=${this.user_id}&status=${res}&counsellor_id=${this.resCounsellors}  `;
          }
          if (res.length > 0 && this.counsellor_ids.length > 0) {
            query += `&status=${res}&counsellor_id=${this.counsellor_ids}`;
          }
          if (res.length === 0 && this.counsellor_ids.length > 0) {
            query += `&counsellor_id=${this.counsellor_ids} `;
          }
          if (res.length === 0 && this.counsellor_ids.length === 0) {
            query += `&admin_id=${this.user_id}&counsellor_id=${this.resCounsellors} `;
          }
        });
      }

      // Add counsellor filter for non-admin roles if filtering by counsellor
      if (
        !adminRoles.includes(this.user_role) &&
        this.counsellor_ids.length > 0
      ) {
        query += `&counsellor_id=${this.counsellor_ids}`;
      }
      // Add status filter
      if (!adminRoles.includes(this.user_role) && this.statusFilter === true) {
        this.allocate.allocationStatus.subscribe((res: any) => {
          if (res.length > 0) {
            query += `&status=${res}`;
          }
        });
      }

      // API call
      this._baseService.getData(`${environment.lead_list}${query}`).subscribe(
        (res: any) => {
          if (res.results) {
            this.leadCards = res.results.data;
            this.data = new MatTableDataSource<any>(this.leadCards);
            this.totalNumberOfRecords = res.total_no_of_record;
          }
        },
        (error: any) => {
          this.api.showError(error.error.message);
        }
      );
    }
  }

  async editLead(allocate) {
    const modal = await this.modalController.create({
      component: EditLeadPage, // Replace with your modal content page
      componentProps: {
        // You can pass data to the modal using componentProps
        key: "value",
        data: allocate,
      },
    });

    return await modal.present();
  }

  async warn(message) {
    return new Promise(async (resolve) => {
      const confirm = await this.alertController.create({
        header: "Permissions Required",
        backdropDismiss: false,
        message: message,
        buttons: [
          {
            text: "Cancel",
            role: "cancel",
            handler: () => {
              this.callPermissionService.isToggleddataSubject.next(false);
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

  async checkPermissions() {
    try {
      const phoneStateResult = await this.androidPermissions.requestPermissions(
        [
          this.androidPermissions.PERMISSION.READ_CONTACTS,
          this.androidPermissions.PERMISSION.READ_PHONE_STATE,
          this.androidPermissions.PERMISSION.READ_CALL_LOG,
        ]
      );
    } catch (error) {
      //console.log("Error!", error);
    }
  }
}
