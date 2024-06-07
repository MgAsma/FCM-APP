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
import { NativeSettings, AndroidSettings, IOSSettings } from 'capacitor-native-settings';
import { Router } from "@angular/router";
import { App as CapacitorApp } from '@capacitor/app';
import { CallPermissionsService } from "../../service/api/call-permissions.service";
import { templateSettings } from "cypress/types/lodash";
import { Location } from "@angular/common";

@Component({
  selector: 'app-customers',
  templateUrl: './customers.page.html',
  styleUrls: ['./customers.page.scss'],
})
export class CustomersPage implements  OnInit {
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


  currentStatus: any;
  callInitiated: boolean = false;
  callStartTime!: Date;
  user_role: string;
  statusFilter: boolean = false;
 
  // allPaginator: any;
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  pageIndex: number;
  selectedLead: any;
  refresh: boolean = false;
  resCounsellors:any = [];
  triggerGet: boolean = false;
  selectedCounsellor: any = false;

  constructor(
    private _customer: AllocationEmittersService,
    private api: ApiService,
    private _baseService: BaseServiceService,
    private callNumber: CallNumber,
    private callLog: CallLog,
    private platform: Platform,
    private _counsellorEmitter: AddLeadEmitterService,
    private modalController:ModalController,
    private androidPermissions: AndroidPermissions,
    private alertController:AlertController,
    private router:Router,
    private callPermissionService:CallPermissionsService,
    private location :Location

  ) {
    this.user_role = localStorage.getItem('user_role')?.toUpperCase()

    this.user_id = localStorage.getItem("user_id");
    this.resCounsellors = localStorage.getItem("counsellor_ids")
    setTimeout(() => {  
      this.callPermissionService?.initiateCallStatus(this.getContacktAndPostHistory.bind(this));

    }, 1000);
  }

  ngOnInit(){
   
    this.pageIndex = 0
    this.user_id = localStorage.getItem('user_id')
    this.getStatus();
    this._customer.customerSearchBar.subscribe((res) => {
      if (res === true) {
        this.searchBar = true;
      } else {
        this.searchBar = false;
      }
    });
    this.getCounselor();
    
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
        console.log(JSON.stringify(results[0]), "latest call log in customers");
        const calculateTime=Number(results[0].date)-Number(this.calledTime)
       console.log(calculateTime,"calulatedTime in customers");
        
        this.callDuration = results[0].duration;
        //console.log(JSON.stringify(this.callDuration), "latest call duration");
        if (this.callDuration > 0) {
          this.currentStatus = 1;
        } else {
          this.currentStatus = 3;
        }

        
        this.recordsFoundText = JSON.stringify(results);
        this.recordsFound = results; //JSON.stringify(results);


        if(calculateTime>0){
          this.postCallHistory();
        }
        
      })
      .catch((e) => {
        // alert(" LOG " + JSON.stringify(e))
      });
  }

  isCallInitiationCalled:boolean=false;
  calledTime:any;

  getContacktAndPostHistory() {
    this.getContacts("type", "2", "==");

  }

  async callContact(number: string, id: any,item, index: any) {

    const phoneStateResult= await this.androidPermissions.checkPermission(
      this.androidPermissions.PERMISSION.READ_PHONE_STATE
    );
  
      const readContacts = await this.androidPermissions.checkPermission(
        this.androidPermissions.PERMISSION.READ_CONTACTS
      );
      

      const readCallLogs= await this.androidPermissions.checkPermission(
        this.androidPermissions.PERMISSION.READ_CALL_LOG
      );
      
   
    if(!phoneStateResult.hasPermission||!readContacts.hasPermission||!readCallLogs.hasPermission){
     let  message:any='This app requires the following permissions to function properly '
      if(!phoneStateResult.hasPermission){
      message+=' Make Phone Calls'
      }
      if(!readContacts.hasPermission){
        message+=' Read Phone Contacts'
      }
      if(!readCallLogs.hasPermission){
        message+=' Access Call Logs'
      }
      message+='Would you like to grant these permissions?'
       const confirmation = await this.warn(message);
          
            if (!confirmation) {
              return;
          }
       
      return

    }
    if(this.callPermissionService.isCallInitiationCalled===false)
    {
    this.api.showToast('Please restart your application!',5000);
    return
    }

    
    try {
      this.leadId = id;
      this.leadPhoneNumber = number;
      this.callStartTime = new Date();
      this.selectedLead = item
     // console.log( this.callStartTime," this.callStartTime");
      
      let data = {
        user: this.user_id,
        status: 3,
      };

      this.postTLStatus(data);
      this.calledTime=new Date().getTime();
     // console.log(this.calledTime,"this.calledTime in allocation ");
      
      setTimeout(async () => {
    
        this.callStartTime = new Date();
        await this.callNumber.callNumber(number, true);
        
        const that = this;
        this.callInitiated = true;
        
        this.editLead(this.selectedLead)
        // this.initiateCallStatus();
      }, 100);
    } catch (error) {
     // console.log(error);
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
        console.log(res,"sending call history in customers");
        
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
  ionViewWillEnter(){
    this.viewInit()
  }
  
  viewInit(){
    
  
    this._counsellorEmitter.triggerGet$.subscribe((res: any) => {
      this.triggerGet = true
      this.getEmitters()
    })
    
      this.getCustomersWithFilters()
   
  }
  
  
  getEmitters() {
    if (this.triggerGet) {
     
      let query: string;
      const counsellorRoles = ["COUNSELLOR", "COUNSELOR"];
      const superAdminRoles = ["SUPERADMIN", "SUPER ADMIN"];
      const adminRoles = ["ADMIN"];

      // Base query setup
      query = `?user_type=customers&page=${this.currentPage}&page_size=${this.pageSize}`;

      if (counsellorRoles.includes(this.user_role)) {
        query += `&counsellor_id=${this.user_id}`;
      } else if (adminRoles.includes(this.user_role)) {
        if (this.counsellor_ids.length > 0) {
          // Admin filtering by counsellor
          query += `&admin_id=${this.user_id}&counsellor_id=${this.counsellor_ids}`;
        } else {
              // Admin not filtering by counsellor
          if(this.resCounsellors !== ''){
            query += `&admin_id=${this.user_id}&counsellor_id=${this.resCounsellors}`;
          }else{
            query += `&admin_id=${this.user_id}`;
          }
        }
      }

      // Add additional filters
      if (this.statusFilter) {
        query += `&status=${this.statusFilter}`;
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
           
            this.data = new MatTableDataSource<any>(this.leadCards);
            this.totalNumberOfRecords = res.total_no_of_record;
          }
        });
    }
  }
  
  
  getCustomersWithFilters() {
  
      let query: string;
      const counsellorRoles = ['COUNSELLOR', 'COUNSELOR'];
      const superAdminRoles = ['SUPERADMIN', 'SUPER ADMIN'];
      const adminRoles = ['ADMIN'];
    
      this._counsellorEmitter.customerCounsellor.subscribe((res) => {
        if (res) {
          this.counsellor_ids = res;
        }
      });
    
      this._customer.customerStatus.subscribe(
        (res: any) => {
          if(res.length > 0 ){
            this.statusFilter = true;
          }else{
            this.statusFilter = false;
          }
         if(res.length > 0 || this.counsellor_ids.length > 0){
        // Base query setup
        query = `?user_type=customers&page=1&page_size=10`;

        if (counsellorRoles.includes(this.user_role)) {
          query += `&counsellor_id=${this.user_id}`;
        } else if (adminRoles.includes(this.user_role)) {
          
             // Add status filter
             if(res.length > 0 && this.counsellor_ids.length === 0){
              query += `&admin_id=${this.user_id}&status=${res}&counsellor_id=${this.resCounsellors} `;
            }
            if(res.length > 0 && this.counsellor_ids.length > 0){
              query += `&status=${res}&counsellor_id=${this.counsellor_ids}`
            }if(res.length === 0 && this.counsellor_ids.length > 0){
              query += `&counsellor_id=${this.counsellor_ids} `
            }
            if(res.length === 0 && this.counsellor_ids.length === 0){
              query += `&admin_id=${this.user_id}&counsellor_id=${this.resCounsellors} `
            }
          
              
            
        }

       // Add status filter
      if ( !adminRoles.includes(this.user_role) && res.length > 0 ) {
        query += `&status=${res}`;
      }
      

        // For roles other than admin, add counsellor filter if filtering by counsellor
        if (
          !adminRoles.includes(this.user_role) &&
          this.counsellor_ids.length > 0
        ) {
          query += `&counsellor_id=${this.counsellor_ids}`;
        }

        // Add search term filter
        if (this.searchTerm) {
          query += `&key=${this.searchTerm}`;
        }
            this.leadCards = [];
            this.data = [];
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
          }else{
            this.statusFilter = false;
            this.counsellor_ids = []
            this.getAllCustomers()
          }
        }
        );
      
    
  }
 
  
  getAllCustomers(){
    let query:string;

    const counsellorRoles = ['COUNSELLOR', 'COUNSELOR'];
    const superAdminRoles = ['SUPERADMIN', 'SUPER ADMIN'];
    const adminRoles = ['ADMIN'];

    if (counsellorRoles.includes(this.user_role)) {
      query = `?counsellor_id=${this.user_id}&user_type=customers&page=1&page_size=10`;
    } else if (superAdminRoles.includes(this.user_role)) {
      query = `?user_type=customers&page=1&page_size=10`;
    } else if (adminRoles.includes(this.user_role)) {
      query = `?admin_id=${this.user_id}&user_type=customers&page=1&page_size=10`;
      if(this.resCounsellors !== ''){
        query +=`&counsellor_id=${this.resCounsellors}`
      }
    } 
    this.leadCards = [];
    this.data = [];

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
  resetFilters(){
    this.refresh = true
      this.leadCards = [];
      this.data = [];
      this.totalNumberOfRecords = 0
      this._customer.customerStatus.next('')
      this._counsellorEmitter.customerCounsellor.next([])
      this.counsellor_ids = []
      this.statusFilter = false;
      this.searchTerm = '';
      this._customer.customerSearchBar.next(false)
     
  }
  handleRefresh(event: any) {
    if (event && event.target) {
      this.refresh = true
      // setTimeout(() => {
        
        this.refresh = true
        this.leadCards = [];
        this.data = [];
        this.totalNumberOfRecords = 0
        this._customer.customerStatus.next('')
        this._counsellorEmitter.customerCounsellor.next([])
        this.counsellor_ids = []
        this.selectedCounsellor = false
        this.statusFilter = false;
        this.searchTerm = '';
        this._customer.customerSearchBar.next(false)
       this.getAllCustomers()
       
       this.location.isCurrentPathEqualTo('/inner/customers')
        event.target.complete();
      // }, 2000);
    }else{
      this.refresh = false
    }
  }
 
  
  
  onPageChange(event: any, dataSource: MatTableDataSource<any>, type?: any) {
    if (event) {
      this.currentPage = event.pageIndex + 1;
      this.pageSize = event.pageSize;
  

    let query: string;
    const counsellorRoles = ["COUNSELLOR", "COUNSELOR"];
    const superAdminRoles = ["SUPERADMIN", "SUPER ADMIN"];
    const adminRoles = ["ADMIN"];

    // Base query setup
    query = `?user_type=customers&page=${this.currentPage}&page_size=${event.pageSize}`;

    if (counsellorRoles.includes(this.user_role)) {
      query += `&counsellor_id=${this.user_id}`;
    } else if (adminRoles.includes(this.user_role)) {
      this._customer.customerStatus.subscribe(
        (res: any) => {
        // Add status filter
        if(res.length > 0 && this.counsellor_ids.length === 0){
          query += `&admin_id=${this.user_id}&status=${res}&counsellor_id=${this.resCounsellors} `;
        }
        if(res.length > 0 && this.counsellor_ids.length > 0){
          query += `&status=${res}&counsellor_id=${this.counsellor_ids}`
        }if(res.length === 0 && this.counsellor_ids.length > 0){
          query += `&counsellor_id=${this.counsellor_ids} `
        }
        if(res.length === 0 && this.counsellor_ids.length === 0){
          query += `&admin_id=${this.user_id}&counsellor_id=${this.resCounsellors} `
        }
      }

      );
    } 

    // Add search term filter
    if (this.searchTerm) {
      query += `&key=${this.searchTerm}`;
    }

    // Add status filter
   if (!adminRoles.includes(this.user_role) && this.statusFilter === true) {
      this._customer.customerStatus.subscribe(
        (res: any) => {
          if (res) {
            query += `&status=${res}`;
          }
        }
      );
    }

    // For roles other than admin, add counsellor filter if filtering by counsellor
    if (
      !adminRoles.includes(this.user_role) &&
      this.counsellor_ids.length > 0
    ) {
      query += `&counsellor_id=${this.counsellor_ids}`;
    }
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
 
  
  

  getCounselor() {
    let query = this.user_role === "COUNSELLOR" || this.user_role === "COUNSELOR"  || this.user_role === "ADMIN"  ?`?user_id=${this.user_id}` : ``
    this._baseService
      .getData(`${environment._user}${query}`)
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
      let params: string;
      const counsellorRoles = ["COUNSELLOR", "COUNSELOR"];
      const superAdminRoles = ["SUPERADMIN", "SUPER ADMIN"];
      const adminRoles = ["ADMIN"];

      // Base query setup
      params = `?user_type=customers&page=1&page_size=10`;

      // Role-specific query parameters
      if (counsellorRoles.includes(this.user_role)) {
        params += `&counsellor_id=${this.user_id}`;
      } else if (superAdminRoles.includes(this.user_role)) {
        // Superadmin case already covered by base query
      } else if (adminRoles.includes(this.user_role)) {
        this._customer.customerStatus.subscribe(
          (res: any) => {
           
          // Add status filter
          if(res.length > 0 && this.counsellor_ids.length === 0){
            params += `&admin_id=${this.user_id}&status=${res}&counsellor_id=${this.resCounsellors} `;
          }
          if(res.length > 0 && this.counsellor_ids.length > 0){
            params += `&status=${res}&counsellor_id=${this.counsellor_ids}`
          }if(res.length === 0 && this.counsellor_ids.length > 0){
            params += `&counsellor_id=${this.counsellor_ids} `
          }
          if(res.length === 0 && this.counsellor_ids.length === 0){
            params += `&admin_id=${this.user_id}&counsellor_id=${this.resCounsellors} `
          }
        }
      
        );
      
      } 

     if (!adminRoles.includes(this.user_role) && this.statusFilter) {
        this._customer.customerStatus.subscribe(
          (res: any) => {
            if (res) {
              params += `&status=${res}`;
            }
          }
        );
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

   
  
      this.leadCards = [];
      this.data = [];
      this.totalNumberOfRecords = [];
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
    if(event){
    this.searchTerm = event;
    this.leadCards = [];
    this.data = [];
  
    let query: string;
    const counsellorRoles = ['COUNSELLOR', 'COUNSELOR'];
    const superAdminRoles = ['SUPERADMIN', 'SUPER ADMIN'];
    const adminRoles = ['ADMIN'];
  
    
  // Base query setup
  query = `?user_type=customers&page=1&page_size=10&key=${event}`;

  // Role-specific query parameters
  if (counsellorRoles.includes(this.user_role)) {
    query += `&counsellor_id=${this.user_id}`;
  } else if (superAdminRoles.includes(this.user_role)) {
    // Superadmin case already covered by base query
  } else if (adminRoles.includes(this.user_role)) {
    
    this._customer.customerStatus.subscribe(
      (res: any) => {
      
     // Add status filter
     if(res.length > 0 && this.counsellor_ids.length === 0){
      query += `&admin_id=${this.user_id}&status=${res}&counsellor_id=${this.resCounsellors} `;
    }
    else if(res.length > 0 && this.counsellor_ids.length > 0){
      query += `&status=${res}&counsellor_id=${this.counsellor_ids}`
    }else if(res.length === 0 && this.counsellor_ids.length > 0){
      query += `&counsellor_id=${this.counsellor_ids} `
    }
    else if(res.length === 0 && this.counsellor_ids.length === 0){
      query += `&admin_id=${this.user_id}&counsellor_id=${this.resCounsellors} `
    }
  }
  );
  } 

   // Add counsellor filter for non-admin roles if filtering by counsellor
   if (
    !adminRoles.includes(this.user_role) &&
    this.counsellor_ids.length > 0
  ) {
    query += `&counsellor_id=${this.counsellor_ids}`;
  }
    if (!adminRoles.includes(this.user_role) && this.statusFilter === true) {
      this._customer.customerStatus.subscribe(
        (res: any) => {
          if (res.length >0) {
            query += `&status=${res}`;
          }
        }
      );
    }
   
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
  }else{
    this.searchTerm = event;
    this.leadCards = [];
    this.data = [];
  
    let query: string;
    const counsellorRoles = ['COUNSELLOR', 'COUNSELOR'];
    const superAdminRoles = ['SUPERADMIN', 'SUPER ADMIN'];
    const adminRoles = ['ADMIN'];
  
    
  // Base query setup
  query = `?user_type=customers&page=1&page_size=10`;

  // Role-specific query parameters
  if (counsellorRoles.includes(this.user_role)) {
    query += `&counsellor_id=${this.user_id}`;
  } else if (superAdminRoles.includes(this.user_role)) {
    // Superadmin case already covered by base query
  } else if (adminRoles.includes(this.user_role)) {
    this._customer.customerStatus.subscribe(
      (res: any) => {
     // Add status filter
     if(res.length > 0 && this.counsellor_ids.length === 0){
      query += `&admin_id=${this.user_id}&status=${res}&counsellor_id=${this.resCounsellors} `;
    }
    else if(res.length > 0 && this.counsellor_ids.length > 0){
      query += `&status=${res}&counsellor_id=${this.counsellor_ids}`
    }else if(res.length === 0 && this.counsellor_ids.length > 0){
      query += `&counsellor_id=${this.counsellor_ids} `
    }
    else if(res.length === 0 && this.counsellor_ids.length === 0){
      query += `&admin_id=${this.user_id}&counsellor_id=${this.resCounsellors} `
    }
  }
  );
    
  } 

   // Add counsellor filter for non-admin roles if filtering by counsellor
   if (
    !adminRoles.includes(this.user_role) &&
    this.counsellor_ids.length > 0
  ) {
    query += `&counsellor_id=${this.counsellor_ids}`;
  }
    if (!adminRoles.includes(this.user_role) && this.statusFilter === true) {
      this._customer.customerStatus.subscribe(
        (res: any) => {
          if (res.length >0) {
            query += `&status=${res}`;
          }
        }
      );
    }
   
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
  
 
  

  async editLead(_customer) {
    const modal = await this.modalController.create({
      component: EditLeadPage, 
      componentProps: {
        key: 'value',
        data:_customer
      }
    });
    return await modal.present();
  }


  async warn(message) {
    return new Promise(async (resolve) => {
      const confirm = await this.alertController.create({
      header: 'Permissions Required',
    
      message: message,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              return resolve(false);
            },
          },
          {
            text: 'OK',
            handler: () => {
              NativeSettings.open({
                    optionAndroid: AndroidSettings.ApplicationDetails, 
                    optionIOS: IOSSettings.App
                  })
              return resolve(true);
            },
          },
        ],
      });

      await confirm.present();
    });
  }

}
