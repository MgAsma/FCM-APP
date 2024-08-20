import { Component, OnInit, ViewChild } from "@angular/core";
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
import { CallPermissionsService } from "../../service/api/call-permissions.service";
import { Location } from "@angular/common";
import { NgxIndexedDBService } from "ngx-indexed-db";
import { lastValueFrom } from "rxjs";

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
  autoDialer: boolean;
  lastestCallData = [];
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
    private location: Location,
    private dbService: NgxIndexedDBService
  ) {

    // setTimeout(() => {
    //   this.callPermissionService?.initiateCallStatus(
    //     this.getContacktAndPostHistory.bind(this)
    //   );
    //   this.callPermissionService.allocationscallBackFunction =
    //     this.getContacktAndPostHistory.bind(this);
    // }, 1000);

    // this.callPermissionService?.isToggleddataSubject.subscribe(
    //   async (res: any) => {
    //     this.isToggledEnabled = res;

    //     if (res == true) {
    //       let result: any = await this.getLocalStorageValue();

    //       if ( result && this.afterUpadtingPhoneNumbers.some((num) => JSON.stringify(num) === result.lastDialedNumber) &&
    //         this.isToggledEnabled == true
    //       ) {
    //         if (
    //           result.index.currentIndex > this.afterUpadtingPhoneNumbers.length
    //         ) {
    //           this.api.showWarning("You have completed all the numbers");
    //           this.callPermissionService.isToggleddataSubject.next(false);

    //           return;
    //         }
    //         this.initialIndex = this.callPermissionService.getIndex() + 1;

    //         if (result.index.currentIndex == 0 ) {
    //           this.initialIndex = result.index.initialIndex + 1;
    //         } else if(this.pageIndex >1){
    //           this.initialIndex = 0
    //         }else {
    //           this.initialIndex = result.index.currentIndex + 1;
    //         }


    //         // console.log(this.initialIndex, "ii after increment");

    //         this.presentIndex = this.initialIndex;
    //         this.allocateItem = this.data.data[this.initialIndex];

    //        this.setDataToLocalStorage();

    //         this.callContact(
    //           this.afterUpadtingPhoneNumbers[this.initialIndex],
    //           this.allocateItem.user_data.id,
    //           this.allocateItem,
    //           this.initialIndex
    //         );

    //       }
    //        else {
    //         this.allocateItem = this.data.data[this.presentIndex];

    //         this.setDataToLocalStorage();

    //         this.callContact(
    //           this.afterUpadtingPhoneNumbers[this.presentIndex],
    //           this.allocateItem.user_data.id,
    //           this.allocateItem,
    //           this.presentIndex
    //         );
    //       }
    //     }
    //   }
    // );
  }
  allocateItem: any;
  notUpdatingStatus: any;
  calledContacts = {};

  checkPermissions() {
    return this.androidPermissions.requestPermissions([
      this.androidPermissions.PERMISSION.READ_CONTACTS,
      this.androidPermissions.PERMISSION.READ_PHONE_STATE,
      this.androidPermissions.PERMISSION.READ_CALL_LOG,
    ]).then(permission => permission.hasPermission)
      .catch(err => console.error(err))
  }

  async ngOnInit() {
   

    this.pageIndex = 0;
    this.user_id = localStorage.getItem("user_id");
    this.getStatus();

    // Handle search bar toggle
    this.allocate.searchBar.subscribe((res) => {
        this.searchBar = res === true;
    });
}

async startCalling() {
  const contacts = this.data.filteredData;

  // Skip if all contacts are already called
  if (this.currentIndex >= contacts.length) {
      this.api.showWarning("You have completed all the numbers");
      this.callPermissionService.isToggleddataSubject.next(false);
      this.calledContacts = {};
        // Disable toggle after completing all calls
      return;
  }

  const contact = contacts[this.currentIndex]['user_data'];
  const number = contact.mobile_number;
  const id = contact.id;

  // Skip contacts that are already called
  if (this.calledContacts[id]) {
      console.log('Skipping already called contact:', number);
      this.currentIndex++;  // Move to the next index
      await this.startCalling(); // Recursive call to process the next contact
      return;
  }

  try {
      // Make the call
      await this.makeCall(number, id, contacts[this.currentIndex]);
      this.calledContacts[id] = true;  // Mark the contact as called
      this.currentIndex++;  // Move to the next index
  } catch (error) {
      console.error("Error while calling:", error);
  }

  // Pause between calls to avoid overlap
  await this.sleep(1000);  // Add delay if needed between calls
}



async startInitialCall() {
  const firstContact = this.data.filteredData[0]['user_data'];

  // If the first contact has already been called, skip it
  if (this.calledContacts[firstContact.id]) {
      console.log('First contact already called:', firstContact.mobile_number);
      return;
  }

  try {
      // Make the first call
      if(this.data.filteredData[0]){
        await this.makeCall(firstContact.mobile_number, firstContact.id, this.data.filteredData[0]);
        this.calledContacts[firstContact.id] = true;  // Mark the first contact as called
      }
      
  } catch (error) {
      console.error("Error during initial call:", error);
  }

  // Add a small delay if needed
  await this.sleep(1000);
}

  // async getLocalStorageValue() {
  //   let data = await lastValueFrom(this.dbService.getAll("people"));
  //   let result = data?.find((item: any) => item.userId == this.user_id);
  //   return result;
  // }

  getContacts(name, value, operator) {
     this.editLead(this.selectedLead)
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
      .then(async (results) => {

      
        const calculateTime = Number(results[0].date) - Number(this.calledTime);

        this.callDuration = results[0].duration;
        if (this.callDuration > 0) {
          this.currentStatus = 1;
        } else {
          this.currentStatus = 3;
        }

        this.recordsFoundText = JSON.stringify(results);
        this.recordsFound = results; //JSON.stringify(results);

        if (calculateTime > 0) {
          await this.postCallHistory(); 
        } else {
          //  if(this.autoDialer){
          let data = {
            user: this.user_id,
            status: 3,
          };

           await this.postTLStatus(data);
          // await this.editLead(this.selectedLead)

          // }
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

  async callContact(number: string, id: any, item) {
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

    this.makeCall(number, id, item);
  }

  async makeCall(number: string, id: any, item,) {
    this.leadItem = item;
    this.lead_id = id;

    try {
      this.leadId = id;
      this.leadPhoneNumber = number;
      this.callStartTime = new Date();
      this.selectedLead = item;

      const userStatus = {
        user: this.user_id,
        status: 3,
      };
      await this.postTLStatus(userStatus);
      this.calledTime = new Date().getTime();
      await this.sleep(1000);
      this.callStartTime = new Date();
      await this.callNumber.callNumber(number, true);
      this.callInitiated = true;
    } catch (error) {
      console.error(error)
    }
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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

   async postCallHistory() {
    let tlsData = {
      user: this.user_id,
      status: 3,
    };
    await this.postTLStatus(tlsData);
    let data = {
      lead_id: this.leadId,
      phone_number: this.leadPhoneNumber,
      call_status: this.currentStatus,
      counsellor: this.user_id,
      call_start_time: this.callStartTime,
    };
    this.api.sendingCallHistory(data).subscribe(async(res: any) => {
      if(res){
        //console.log(res)
      }
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
    setTimeout(() => {
      this.callPermissionService?.initiateCallStatus(
        this.getContacktAndPostHistory.bind(this)
      );
     this.callPermissionService.allocationscallBackFunction = this.getContacktAndPostHistory.bind(this);
    }, 
    1000);

    // this.callPermissionService?.isToggleddataSubject.subscribe(
    //   async (res: any) => {
    //     this.isToggledEnabled = res;
    //     console.log("ALL DATA--->", this.data?.filteredData)

    //     if (this.isToggledEnabled) {

    //       if (this.data?.filteredData?.every(item => this.calledContacts[item['user_data'].id])) {
    //         this.api.showWarning("You have completed all the numbers");
    //       }
    //       else {
    //         // Call the contacts in order
    //         for(let contact of this.data.filteredData){
    //           if(contact['user_data']?.mobile_number){
    //             try {
    //               this.callContact(
    //                 contact['user_data'].mobile_number,
    //                 contact['user_data'].id,
    //                 contact
    //               );
                 
    //             } catch (error) {
    //               console.error(error)
    //             }

    //             this.calledContacts[contact['user_data'].id] = true
    //           }
              
    //         }
    //         console.log("ALL DONE", this.calledContacts)
    //       }
    //     }

    
    // );
    this.checkPermissions();
    this.callPermissionService?.isToggleddataSubject.subscribe(
        async (res: any) => {
            this.isToggledEnabled = res;
            this.currentIndex = 1;
            if (this.isToggledEnabled) {
                this.isToggledEnabled = true;
                 // Start the first call
                 await this.startInitialCall();
               
                // Subscribe to the status changes and check for form submission
                this.callPermissionService.getStatus().subscribe(async (statusRes: any) => {
                    if (statusRes && this.isToggledEnabled === true) {
                        if (statusRes.submit === "submit" ) {
                            // Proceed to the next call only if form is submitted
                            await this.startCalling();
                       }
                    }
                });
                this.callPermissionService.closeCancelEditLeadPagedataSubject.subscribe(async(cancel:any)=>{
                  if (cancel && this.isToggledEnabled === true) {
                    if (cancel === "close" ) {
                        // Proceed to the next call only if form is cancel and enabled the auto dialer.
                        await this.startCalling();
                   }
                }
                })
            }
        }
    );
   
  }
  async ionViewWillEnter() {
    this.user_role = localStorage.getItem("user_role")?.toUpperCase();
    this.user_id = localStorage.getItem("user_id");
    this.resCounsellors = localStorage.getItem("counsellor_ids");
    if (this.user_id) {
      this.getCounselor();
      this.getAllocationWithFilters();
      this.viewInit();
    }
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
          // console.log(res.results, "res.results  ");

          // Add call dialed status
          this.leadCards = res.results.data.map(i => ({ ...i, callDialed: i.callDialed || false }));
          this.leadData = this.leadCards
          this.allocateItem = this.leadCards[0];
          this.data = new MatTableDataSource<any>(this.leadCards);
          console.log("LOG:: MatData--->", this.data)
          this.totalNumberOfRecords = res.total_no_of_record;
          if (this.leadData?.length > 0) {
            this.phoneNumbers = this.leadData
              ?.filter((ele: any) => ele.user_data?.mobile_number)
              .map((ele: any) => ele.user_data?.mobile_number);
            //console.log(this.phoneNumbers, "initial phone numbers");

            this.afterUpadtingPhoneNumbers = [...this.phoneNumbers];
          }
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
            this.leadCards = res.results.data.map(i => ({ ...i, callDialed: i.callDialed || false }));;
            this.leadData = res.results.data;
            this.allocateItem = res.results.data[0];
            this.data = new MatTableDataSource<any>(this.leadCards);
            this.totalNumberOfRecords = res.total_no_of_record;
          }
        });
    }
  }

  async getAllocationWithFilters() {
    if (!this.refresh) {
      this._addLeadEmitter.selectedCounsellor.subscribe((res) => {
        if (res.length > 0) {
          this.counsellor_ids = res;
        } else {
          this.counsellor_ids = [];
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
          // API call
          // if(!this.refresh){
          this._baseService
            .getData(`${environment.lead_list}${query}`)
            .subscribe(
              (res: any) => {
                if (res.results) {
                  this.leadCards = res.results.data.map(i => ({ ...i, callDialed: i.callDialed || false }));;
                  this.leadData = res.results.data;
                  // this.allocateItem = res.results.data[0];
                  this.data = new MatTableDataSource<any>(this.leadCards);
                  this.totalNumberOfRecords = res.total_no_of_record;
                  if (this.leadData?.length > 0) {
                    this.phoneNumbers = this.leadData
                      ?.filter((ele: any) => ele.user_data?.mobile_number)
                      .map((ele: any) => ele.user_data?.mobile_number);
                    //console.log(this.phoneNumbers, "initial phone numbers");

                    this.afterUpadtingPhoneNumbers = [...this.phoneNumbers];
                  }
                }
              },
              (error: any) => {
                this.api.showError(error.error.message);
              }
            );
          //}
        } else {
          this.statusFilter = false;
          this.counsellor_ids = [];
          this.getAllAllocation();
        }
      });
    }
    // }else{
    //   this.statusFilter = false;
    //   this.counsellor_ids = [];
    //   this.getAllAllocation();
    // }
  }
  afterUpadtingPhoneNumbers: any;
 

  query = "";

  

  async handleRefresh(event: any) {
    if (event && event.target) {
      this.refresh = true;
      await this._addLeadEmitter.selectedCounsellor.next([]);
      await this.allocate.allocationStatus.next([]);
      await this.allocate.searchBar.next(false);
      // await this.callPermissionService?.isToggleddataSubject.next(false)
      this.counsellor_ids = [];
      this.searchTerm = "";
      this.statusFilter = false;
      event.target.complete();
    }
  }

  async onPageChange(event: any, dataSource: MatTableDataSource<any>, type?: any) {
    if (event) {
      // await this.callPermissionService?.isToggleddataSubject.next(false)
      this.currentPage = event.pageIndex + 1;
      this.pageSize = event.pageSize;

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
            this.leadCards = res.results.data.map(i => ({ ...i, callDialed: i.callDialed || false }));;
            this.leadData = res.results.data;
            this.allocateItem = res.results.data[0];
            this.data = new MatTableDataSource<any>(this.leadCards);
            this.totalNumberOfRecords = res.total_no_of_record;
            if (this.leadData?.length > 0) {
              this.phoneNumbers = this.leadData
                ?.filter((ele: any) => ele.user_data?.mobile_number)
                .map((ele: any) => ele.user_data?.mobile_number);
              //console.log(this.phoneNumbers, "initial phone numbers");

              this.afterUpadtingPhoneNumbers = [...this.phoneNumbers];
            }
          }
        },
        (error: any) => {
          this.api.showError(error.error.message);
        }
      );
    }
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
            this.leadCards = res.results.data.map(i => ({ ...i, callDialed: i.callDialed || false }));;
            this.leadData = res.results.data;

            this.data = new MatTableDataSource<any>(this.leadCards);
            this.totalNumberOfRecords = res.total_no_of_record;
            if (this.leadData?.length > 0) {
              this.phoneNumbers = this.leadData
                ?.filter((ele: any) => ele.user_data?.mobile_number)
                .map((ele: any) => ele.user_data?.mobile_number);
              //console.log(this.phoneNumbers, "initial phone numbers");

              this.afterUpadtingPhoneNumbers = [...this.phoneNumbers];
            }
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
            this.leadCards = res.results.data.map(i => ({ ...i, callDialed: i.callDialed || false }));;
            this.leadData = res.results.data;

            this.data = new MatTableDataSource<any>(this.leadCards);
            this.totalNumberOfRecords = res.total_no_of_record;
            if (this.leadData?.length > 0) {
              this.phoneNumbers = this.leadData
                ?.filter((ele: any) => ele.user_data?.mobile_number)
                .map((ele: any) => ele.user_data?.mobile_number);
              //console.log(this.phoneNumbers, "initial phone numbers");

              this.afterUpadtingPhoneNumbers = [...this.phoneNumbers];
            }
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
            this.leadCards = res.results.data.map(i => ({ ...i, callDialed: i.callDialed || false }));;
            this.leadData = res.results.data;
            this.data = new MatTableDataSource<any>(this.leadCards);
            this.totalNumberOfRecords = res.total_no_of_record;
            if (this.leadData?.length > 0) {
              this.phoneNumbers = this.leadData
                ?.filter((ele: any) => ele.user_data?.mobile_number)
                .map((ele: any) => ele.user_data?.mobile_number);
              //console.log(this.phoneNumbers, "initial phone numbers");

              this.afterUpadtingPhoneNumbers = [...this.phoneNumbers];
            }
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
  ionViewWillLeave() {
    this._addLeadEmitter.autoDialer.next(false)
  }
}
