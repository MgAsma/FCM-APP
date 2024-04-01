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
import { ModalController, Platform } from "@ionic/angular";

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
@Component({
  selector: "app-allocations",
  templateUrl: "./allocations.page.html",
  styleUrls: ["./allocations.page.scss"],
})
export class AllocationsPage implements AfterViewInit  {
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
  counsellor_id: any;

  currentStatus: any;
  callInitiated: boolean = false;
  callStartTime!: Date;
  user_role: string;
  statusFilter: boolean = false;
  // allPaginator: any;
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  pageIndex: number;

  constructor(
    private allocate: AllocationEmittersService,
    private api: ApiService,
    private _baseService: BaseServiceService,
    private callNumber: CallNumber,
    private callLog: CallLog,
    private platform: Platform,
    private _addLeadEmitter: AddLeadEmitterService,
    private modalController:ModalController
  ) {
    this.user_role = localStorage.getItem('user_role')?.toUpperCase()

    this.counsellor_id = localStorage.getItem("user_id");

    this.platform.ready().then(() => {
      this.callLog
        .hasReadPermission()
        .then((hasPermission) => {
          if (!hasPermission) {
            this.callLog
              .requestReadPermission()
              .then((results) => {
                // this.getContacts("type", "2", "==");
              })
              .catch((e) =>{
                // alert(" requestReadPermission " + JSON.stringify(e))
              }
               
              );
          } else {
            // this.getContacts("type", "5", "==");
          }
        })
        .catch((e) => {
          // alert(" hasReadPermission " + JSON.stringify(e))
        }
        );
    });
  }

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
        //console.log(JSON.stringify(results[0]),"latest call log")
        this.callDuration=results[0].duration;
        //console.log(JSON.stringify(this.callDuration),"latest call duration")
        if (this.callDuration > 0) {
              this.currentStatus = 1;
            } else {
              this.currentStatus = 3;
            }
          

        

        //console.log(
        //   JSON.stringify(results),
        //   'call log responseeeeeeeeeeeeeeeee'
        // );
        this.recordsFoundText = JSON.stringify(results);
        this.recordsFound = results; //JSON.stringify(results);
      })
      .catch((e) => {
        // alert(" LOG " + JSON.stringify(e))
      });
  }

  

  callContact(number: string, id: any) {
    this.leadId = id;
    this.leadPhoneNumber = number;
    this.callStartTime = new Date();
    let data = {
      user: this.user_id,
      status: 3,
    };
    this.postTLStatus(data);
    this.callNumber.callNumber(number, true);
    this.callInitiated = true;
    // await this.getContacts('type','2','==');
    // await this.getContacts('type','5','==');
    // await this.postCallHistory();

    setTimeout(() => {
      this.getContacts("type", "2", "==");
      // this.getContacts("type", "5", "==");
    }, 70000);
    setTimeout(() => {
      this.postCallHistory();
    }, 90000);
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
      counsellor: this.counsellor_id,
      call_start_time: this.callStartTime,
    };
    this.api.sendingCallHistory(data).subscribe(
      (res: any) => {
        //console.log(res, "sending call history");
        let tlsData = {
          user: this.user_id,
          status: 3
        };
        this.postTLStatus(tlsData)
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
 
  ngAfterViewInit() {
    this.pageIndex = 0
    this.user_id = localStorage.getItem('user_id')
    this.getStatus();
    this.allocate.searchBar.subscribe((res) => {
      if (res === true) {
        this.searchBar = true;
      } else {
        this.searchBar = false;
      }
    });
    
    let query: any;
    this._addLeadEmitter.selectedCounsellor.subscribe((res) => {
      if(res){
        this.counsellor_ids = res
      } 
    });
    
    this.allocate.allocationStatus.subscribe(
      (res: any) => {
      query = this.user_role == 'COUNSELLOR' || this.user_role == 'COUNSELOR' ? `?counsellor_id=${this.user_id}&page=1&page_size=10`:`?page=1&page_size=10`
        if (res.length >0) {
          this.statusFilter = true
          query += `&status=${res}`;
        }
        if(this.counsellor_ids.length > 0){
          query += `&counsellor_id=${this.counsellor_ids}`;
        }
        this.leadCards = []
        this.data = []
        this._baseService.getData(`${environment.lead_list}${query}`).subscribe((res: any) => {
          if (res.results) {
            this.leadCards = res.results;
            this.data = new MatTableDataSource<any>(this.leadCards);
            this.totalNumberOfRecords = res.total_no_of_record
          }
        }, (error: any) => {
          this.api.showError(error.error.message);
        });
        
      },
      (error: any) => {
        this.api.showError(error.error.message);
      }
    );
   
    this._addLeadEmitter.triggerGet$.subscribe((res:any) => {
        let query = this.user_role == 'COUNSELLOR' || this.user_role == 'COUNSELOR' ? `?counsellor_id=${this.user_id}&page=1&page_size=10`:`?page=1&page_size=10`
        this.leadCards = [];
        this.data = [];
        this.totalNumberOfRecords = []
        this._baseService.getData(`${environment.lead_list}${query}`).subscribe((res: any) => {
          if (res.results) {
         
            this.leadCards = res.results;
            this.data = new MatTableDataSource<any>(this.leadCards);
            this.totalNumberOfRecords = res.total_no_of_record
          }
        }, (error: any) => {
          this.api.showError(error.error.message);
        });
     });

    this.getCounselor();
   
  }
 
  handleRefresh(event: any) {
    setTimeout(() => {
      this.leadCards = [];
      this.data = [];
      this.totalNumberOfRecords = 0
      this.allocate.allocationStatus.next('')
      this._addLeadEmitter.selectedCounsellor.next([])
      this.statusFilter = false;
      this.allocate.searchBar.next(false)
      let query = this.user_role == 'COUNSELLOR' || this.user_role == 'COUNSELOR' ? `?counsellor_id=${this.user_id}&page=1&page_size=10`:`?page=1&page_size=10`
      this.getLeadlist(query);
      event.target.complete();
    }, 2000);
  }
 
  getLeadlist(query:any){
   
   this._baseService.getData(`${environment.lead_list}${query}`).subscribe((res: any) => {
     if (res.results) {
      this.leadCards = [];
      this.data = [];
      this.totalNumberOfRecords = []
       this.leadCards = res.results;
       this.data = new MatTableDataSource<any>(this.leadCards);
       this.totalNumberOfRecords = res.total_no_of_record
     }
   }, (error: any) => {
     this.api.showError(error.error.message);
   });
   
  }
  
  onPageChange(event: any, dataSource: MatTableDataSource<any>, type?: any) {
    if (event) {
      this.currentPage = event.pageIndex + 1;
      this.pageSize = event.pageSize;
    }
   
    let query: string =   this.user_role == 'COUNSELLOR' || this.user_role == 'COUNSELOR'? `?counsellor_id=${this.user_id}&page=${this.currentPage}&page_size=${event.pageSize}`:
    `?page=${this.currentPage}&page_size=${this.pageSize}`
    if (this.searchTerm) {
      query += `&key=${this.searchTerm}`;
    }
     
    
    if(this.statusFilter){
      this.allocate.allocationStatus.subscribe(
       (res: any) => {
         if (res) {
           query += `&status=${res}`;
         }
       },
       (error: any) => {
         this.api.showError(error.error.message);
       }
     );
    }
     if (this.counsellor_ids.length >0) {
      query += `&counsellor_id=${this.counsellor_ids}`
    }
     
      this._baseService.getData(`${environment.lead_list}${query}`).subscribe((res: any) => {
        if (res.results) {
          this.leadCards = res.results;
          this.data = new MatTableDataSource<any>(this.leadCards);
          this.totalNumberOfRecords = res.total_no_of_record
        }
      }, (error: any) => {
        this.api.showError(error.error.message);
      });
      
  }
  

  getCounselor() {
    this._baseService
      .getData(`${environment._user}?role_name=counsellor`)
      .subscribe(
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
    
    if(event){
      this.counsellor_ids = event
      this._addLeadEmitter.selectedCounsellor.next(event)
        let params = this.user_role == 'COUNSELLOR' || this.user_role == 'COUNSELOR'? 
        `?counsellor_id=${this.user_id}&page=1&page_size=10&counsellor_id=${event}`:
        `?page=1&page_size=10&counsellor_id=${event}`
        if(this.statusFilter){
          this.allocate.allocationStatus.subscribe(
           (res: any) => {
             if (res) {
              params += `&status=${res}`;
             }
           },
           (error: any) => {
             this.api.showError(error.error.message);
           }
         );
        }
        this.leadCards = []
        this.data = []
        this.totalNumberOfRecords = []
        this._baseService.getData(`${environment.lead_list}${params}`).subscribe((res: any) => {
          if (res.results) {
            this.leadCards = res.results;
            this.data = new MatTableDataSource<any>(this.leadCards);
            this.totalNumberOfRecords = res.total_no_of_record
          }
        }, (error: any) => {
          this.api.showError(error.error.message);
        });
      } 
  }

  searchTermChanged(event: any) {
    this.searchTerm = event
    this.leadCards = []
    this.data = []
    let query = this.user_role == 'COUNSELLOR' || this.user_role == 'COUNSELOR' ? `?counsellor_id=${this.user_id}&page=1&page_size=10&key=${event}`:
    `?page=1&page_size=10&key=${event}`
    if(this.statusFilter){
     this.allocate.callLogStatus.subscribe(
      (res: any) => {
        if (res) {
          query += `&status=${res}`;
        }
      }
    );
    }
   
    if(this.statusFilter){
      this.allocate.allocationStatus.subscribe(
       (res: any) => {
         if (res) {
           query += `&status=${res}`;
         }
       }
     );
    }
     if (this.counsellor_ids.length >0) {
      query += `&counsellor_id=${this.counsellor_ids}`
    }
    this._baseService.getData(`${environment.lead_list}${query}`).subscribe((res: any) => {
      if (res.results) {
        this.leadCards = res.results;
        this.data = new MatTableDataSource<any>(this.leadCards);
        this.totalNumberOfRecords = res.total_no_of_record
      }
    }, (error: any) => {
      this.api.showError(error.error.message);
    });
  }

  async editLead(allocate) {
    const modal = await this.modalController.create({
      component: EditLeadPage, // Replace with your modal content page
      componentProps: {
        // You can pass data to the modal using componentProps
        key: 'value',
        data:allocate
      }
    });
    return await modal.present();
  }
 
}
