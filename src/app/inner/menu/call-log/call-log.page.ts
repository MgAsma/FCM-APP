import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AlertController, ModalController, Platform, PopoverController } from '@ionic/angular';

// import { RecurringFollowupComponent } from '../recurring-followup/recurring-followup.component';

import { environment } from '../../../../environments/environment';
import { AllocationEmittersService } from '../../../service/allocation-emitters.service';
import { ApiService } from '../../../service/api/api.service';
import { BaseServiceService } from '../../../service/base-service.service';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { CallLog } from '@ionic-native/call-log/ngx';
import { GotoViewCustomerDetailsCallCustomerComponent } from '../../../shared-modules/goto-view-customer-details-call-customer/goto-view-customer-details-call-customer.component';
import { AddLeadEmitterService } from '../../../service/add-lead-emitter.service';
import { NativeSettings, AndroidSettings, IOSSettings } from 'capacitor-native-settings';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
@Component({
  selector: 'app-call-log',
  templateUrl: './call-log.page.html',
  styleUrls: ['./call-log.page.scss'],
})
export class CallLogPage implements OnInit {
  searchBar: boolean = false;
  filterByStatus:any = []
  data:any = []
  user_role:any;
  user_id:any;
  currentPage: any = 1;
  pageSize: any = 10;
  searchTerm: any;
  counsellor_ids: any = [];
  totalNumberOfRecords: any;
  callLogCards: any = [];
  placeholderText = 'Search By Name/Phone'
  COUNSELLOR: any = [];
  endDate:any;
  startDate:any;
  callLogForm:FormGroup
  dateFilter: boolean = false;
  minEndDate: any;
  maxStartDate:any;
  dateForm!: FormGroup;
  dateFiltered: boolean = false;
  statusFilter: boolean = false;
  sdate: string;
  edate: string;
  status: any = [];
  refreshAll: boolean = false;
  min: string;
  constructor(
    private allocate: AllocationEmittersService,
    private popoverController: PopoverController,
    private baseService:BaseServiceService,
    private api:ApiService,
    private datepipe:DatePipe,
    private callLog: CallLog,
    private platform: Platform,
    private fb:FormBuilder,
    private addEmiter:AddLeadEmitterService,
    private alertController:AlertController,
    private androidPermissions:AndroidPermissions
  ) {
    this.user_role = localStorage.getItem('user_role')?.toUpperCase()
    this.user_id = localStorage.getItem('user_id')
    let today = new Date()
    this.maxStartDate = this.datepipe.transform(today,'YYYY-MM-dd')
    let minimum = new Date('1900-01-01')
    this.min =  this.datepipe.transform(minimum,'YYYY-MM-dd')
    
    this.getFilterByStatus();
    this.getCOUNSELLOR();
    this.initForm()

   
  }
 
  
  ngOnInit() {
    // this.checkPermissions();

    if(this.refreshAll){
      this.dateForm.reset()
      this.allocate.callLogStatus.next([])
      this.addEmiter.callLogCounsellor.next([])
      this.allocate.callLogStatus.next([])
      this.addEmiter.callLogCounsellor.next([])
      this.status = []
      this.counsellor_ids = []
      let query = (this.user_role == 'COUNSELLOR' || this.user_role == 'COUNSELOR') ?
      `?counsellor_ids=${this.user_id}&page=1&page_size=10` :
      '?page=1&page_size=10';
      this.callLogCards = [];
      this.data = [];
      this.totalNumberOfRecords = [];
      this.baseService.getData(`${environment.call_logs}${query}`).subscribe((res: any) => {
        if (res) {
          this.callLogCards = res.results;
          this.data = new MatTableDataSource<any>(this.callLogCards);
          this.totalNumberOfRecords = res.total_no_of_record;
        }
      }, ((error: any) => {
        this.api.showError(error?.error.message );
      }));
  }else{
    
     // Subscribe to the callLogCounsellor event
    this.addEmiter.callLogCounsellor.subscribe((res) => {
      if (res.length > 0) {
        this.counsellor_ids = res;
      }else{
        this.counsellor_ids = []
      }
    });

    // Subscribe to the callLogStatus event
    this.allocate.callLogStatus.subscribe((res: any) => {
      if(res){
        // Reset query
      let query = (this.user_role == 'COUNSELLOR' || this.user_role == 'COUNSELOR') ?
      `?counsellor_ids=${this.user_id}&page=1&page_size=10` :
      '?page=1&page_size=10';
        if (res.length > 0) {
          this.statusFilter = true;
          this.status = res;
        }else{
          this.statusFilter = false;
          this.status = []
        }
        if (this.statusFilter) {
          query += `&status=${this.status}`;
        }
        // Add date filter to query if applicable
        if (!this.dateForm.invalid && this.dateForm.dirty) {
        this.sdate = this.datepipe.transform(this.dateForm.value.startDate, 'yyyy-MM-dd');
        this.edate = this.datepipe.transform(this.dateForm.value.endDate, 'yyyy-MM-dd');
        query += `&from_date=${this.sdate}&to_date=${this.edate}`;
      }
      // Add status filter to query if applicable
      
    
      // Add counsellor IDs filter to query if applicable
      if (this.counsellor_ids.length > 0) {
        query += `&counsellor_ids=${this.counsellor_ids}`;
      }
    
      this.callLogCards = [];
      this.data = [];
      this.totalNumberOfRecords = [];
      this.baseService.getData(`${environment.call_logs}${query}`).subscribe((res: any) => {
        if (res) {
          this.callLogCards = res.results;
          this.data = new MatTableDataSource<any>(this.callLogCards);
          this.totalNumberOfRecords = res.total_no_of_record;
        }
      }, ((error: any) => {
        this.api.showError(error?.error.message);
      }));
      }else{
        let query = (this.user_role == 'COUNSELLOR' || this.user_role == 'COUNSELOR') ?
        `?counsellor_ids=${this.user_id}&page=1&page_size=10` :
        '?page=1&page_size=10';
        this.callLogCards = [];
        this.data = [];
        this.totalNumberOfRecords = [];
        this.baseService.getData(`${environment.call_logs}${query}`).subscribe((res: any) => {
          if (res) {
            this.callLogCards = res.results;
            this.data = new MatTableDataSource<any>(this.callLogCards);
            this.totalNumberOfRecords = res.total_no_of_record;
          }
        }, ((error: any) => {
          this.api.showError(error?.error.message );
        }));
          
      }
    
    });
    // Setup search bar subscription
    this.setupSearchBarSubscription();
    }
  }
  
 
  initForm(){
    this.dateForm = this.fb.group({
     startDate:['',Validators.required],
     endDate:['',Validators.required]
    })
  }
   setupSearchBarSubscription() {
    this.allocate.callLogSearchBar.subscribe((res) => {
      this.searchBar = res === true
    });
   
  }
  
  
  
  onStartDateChange(event: CustomEvent) {
    if(event){
      //console.log(event,event)
      this.minEndDate = event.target['value'];
      this.dateForm.patchValue({
        endDate:''
      })
    }
    
  }

  onEndDateChange(event: CustomEvent) {
    this.endDate = event.detail.value;
  }
  onSubmit() {
    // let query;
    // if(this.dateForm.invalid && !this.dateForm.dirty){
      if(this.dateForm.invalid){
      this.dateForm.markAllAsTouched()
      this.api.showError('Select start date and end date')
    }else{
      this.dateForm.patchValue({
        startDate:this.dateForm.value.startDate,
        endDate:this.dateForm.value.endDate
      })
      this.sdate = this.datepipe.transform(this.dateForm.value.startDate, 'yyyy-MM-dd');
        this.edate = this.datepipe.transform(this.dateForm.value.endDate, 'yyyy-MM-dd');
     
        // Reset query
      let query = this.user_role == 'COUNSELLOR' || this.user_role == 'COUNSELOR' ?  `?counsellor_ids=${this.user_id}&from_date=${this.sdate}&to_date=${this.edate}&page=1&page_size=10`
      :`?from_date=${this.sdate}&to_date=${this.edate}&page=1&page_size=10`;
      this.addEmiter.callLogCounsellor.subscribe((res) => {
        if (res.length > 0) {
          this.counsellor_ids = res;
         
        }
      });
    
      // Subscribe to the callLogStatus event
      this.allocate.callLogStatus.subscribe((res: any) => {
        if (res.length > 0) {
          this.statusFilter = true;
          this.status = res;
        }
      });
    
      // Add status filter to query if applicable
      if (this.statusFilter) {
        query += `&status=${this.status}`;
      }
      if (this.searchTerm) {
        query += `&key=${this.searchTerm}`;
      }
      // Add counsellor IDs filter to query if applicable
      if (this.counsellor_ids.length > 0) {
        query += `&counsellor_ids=${this.counsellor_ids}`;
      }
    
     
      // Call API with updated query
      this.dateFilter = true;
      this.callLogCards = [];
      this.data = [];
      this.totalNumberOfRecords = [];
      this.baseService.getData(`${environment.call_logs}${query}`).subscribe((res: any) => {
        if (res) {
          this.callLogCards = res.results;
          this.data = new MatTableDataSource<any>(this.callLogCards);
          this.totalNumberOfRecords = res.total_no_of_record;
        }
      }, ((error: any) => {
        this.api.showError(error?.error.message);
      }));
    } 
  }
  
  getFilterByStatus() {
    this.baseService
      .getData(`${environment.call_log_status}`)
      .subscribe(
        (res: any) => {
          if (res) {
           this.filterByStatus = res;
          }
        },
        (error: any) => {
          this.api.showError(error.error.message);
        }
      );
  }
  getCOUNSELLOR() {
    this.baseService
      .getData(`${environment._user}?role_name=counsellor`)
      .subscribe(
        (res: any) => {
          if (res.results) {
            this.COUNSELLOR = res.results;
          }
        },
        (error: any) => {
          this.api.showError(error.error.message);
        }
      );
  }
  handleRefresh(event:any) {
     if(event){
      this.refreshAll = true;
      this.dateForm.reset();
      this.allocate.callLogStatus.next([]);
      this.addEmiter.callLogCounsellor.next([]);
      this.allocate.callLogSearchBar.next(false)
      this.status = []
      this.counsellor_ids = []
      this.searchTerm = '';
      this.ngOnInit();
     }
      
  }
  goBack() {
    window.history.back();
  }
  async openGotoCallOrDetails(event:any) {
    this.allocate.callhistoryList.next(event)
    const popover = await this.popoverController.create({
      component: GotoViewCustomerDetailsCallCustomerComponent,
      translucent: true,
      backdropDismiss: false,
      componentProps: {
        // Pass data to the component
        data: event
      }
      });
      
  
    return await popover.present();
  }
 async getCallLogs(query:any){
    // const readCallLogs= await this.androidPermissions.checkPermission(
    //   this.androidPermissions.PERMISSION.READ_CALL_LOG
    // );
    // // const phoneStateResult= await this.androidPermissions.checkPermission(
    // //   this.androidPermissions.PERMISSION.READ_PHONE_STATE
    // // );
    // const readContacts = await this.androidPermissions.checkPermission(
    //   this.androidPermissions.PERMISSION.READ_CONTACTS
    // );
    // if(!readContacts.hasPermission||!readCallLogs.hasPermission){
    //   let  message:any='This app requires the following permissions to function properly : '
    //   //  if(!phoneStateResult.hasPermission){
    //   //  message+=' Read Phone Contacts'
    //   //  }
    //    if(!readContacts.hasPermission){
    //      message+='/n Read Phone Contacts /n'
    //    }
    //    if(!readCallLogs.hasPermission){
    //      message+='/n Access Call Logs /n'
    //    }
    //    message+='/n Would you like to grant these permissions?'
    //     const confirmation = await this.warn(message);
           
    //          if (!confirmation) {
    //            return;
    //        }
               
 
    //    return
 
    //  }
 
    //       setTimeout(()=>{
            this.baseService.getData(`${environment.call_logs}${query}`).subscribe((res:any)=>{
             // console.log(res,"call log response after given the permission");
              
              if(res){
                this.callLogCards = []
                this.data = []   
               this.callLogCards = res.results;
               this.data = new MatTableDataSource<any>(this.callLogCards);
               this.totalNumberOfRecords = res.total_no_of_record 
              }
            },((error:any)=>{
              this.api.showError(error?.error.message || 'GENREAL')
            }))

      //    },1000)
   
  }
  
  onEmit(event:any){
    if(event){
    this.counsellor_ids = event
    this.addEmiter.callLogCounsellor.next(event)
      let params = this.user_role == 'COUNSELLOR' || this.user_role == 'COUNSELOR'? 
      `?page=1&page_size=10&counsellor_ids=${event}`:
      `?page=1&page_size=10&counsellor_ids=${event}`
      if(this.statusFilter){
        this.allocate.callLogStatus.subscribe(
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
      if(this.dateForm.dirty && !this.dateForm.invalid){
        params += `&from_date=${this.sdate}&to_date=${this.edate}`
      }
      this.callLogCards = []
      this.data = [] 
      this.baseService.getData(`${environment.call_logs}${params}`).subscribe((res:any)=>{
        if(res){ 
         this.callLogCards = res.results;
         this.data = new MatTableDataSource<any>(this.callLogCards);
         this.totalNumberOfRecords = res.total_no_of_record 
        }
      },((error:any)=>{
        this.api.showError(error?.error.message)
      }))
    } 

  }
  
  onPageChange(event: any, dataSource: MatTableDataSource<any>, type?: any) {
    if (event) {
      this.currentPage = event.pageIndex + 1;
      this.pageSize = event.pageSize;
    }
  
    let query: string =   this.user_role == 'COUNSELLOR' || this.user_role == 'COUNSELOR'? `?counsellor_ids=${this.user_id}&page=${this.currentPage}&page_size=${event.pageSize}`:
    `?page=${this.currentPage}&page_size=${event.pageSize}`
    if (this.searchTerm) {
      query += `&key=${this.searchTerm}`;
    }
     
    if(this.dateForm.dirty && !this.dateForm.invalid){
      query += `&from_date=${this.sdate}&to_date=${this.edate}`
    }
    if(this.statusFilter){
      this.allocate.callLogStatus.subscribe(
       (res: any) => {
         if (res.length >0) {
           query += `&status=${res}`;
         }
       },
       (error: any) => {
         this.api.showError(error.error.message);
       }
     );
    }
     if (this.counsellor_ids.length >0) {
      query += `&counsellor_ids=${this.counsellor_ids}`
    }
    this.baseService.getData(`${environment.call_logs}${query}`).subscribe((res:any)=>{
     
      if(res){
        this.callLogCards = []
        this.data = []   
       this.callLogCards = res.results;
       this.data = new MatTableDataSource<any>(this.callLogCards);
       this.totalNumberOfRecords = res.total_no_of_record 
      }
    },((error:any)=>{
      this.api.showError(error?.error.message)
    }))
  }
 
  
  
  searchTermChanged(event: any) {
    this.searchTerm = event
    let query = this.user_role == 'COUNSELLOR' || this.user_role == 'COUNSELOR' ? `?counsellor_ids=${this.user_id}&page=1&page_size=10&key=${event}`:
    `?page=1&page_size=10&key=${event}`
    if(this.statusFilter){
     this.allocate.callLogStatus.subscribe(
      (res: any) => {
        if (res.length >0) {
          query += `&status=${res}`;
        }
      }
    );
    }
    if(this.dateForm.dirty && !this.dateForm.invalid){
      query += `&from_date=${this.sdate}&to_date=${this.edate}`
    }
   
     if (this.counsellor_ids.length >0) {
      query += `&counsellor_ids=${this.counsellor_ids}`
    }
    this.callLogCards = []
    this.data = []  
    this.baseService.getData(`${environment.call_logs}${query}`).subscribe((res:any)=>{
      if(res){  
       this.callLogCards = res.results;
       this.data = new MatTableDataSource<any>(this.callLogCards);
       this.totalNumberOfRecords = res.total_no_of_record 
      }
    },((error:any)=>{
      this.api.showError(error?.error.message)
    }))
  }



 async  warn(message) {
    return new Promise(async (resolve) => {
      const confirm = await this.alertController.create({
      header: 'Permissions Required',
      message:message,
      // message: 'This app requires the following permissions to function properly:\n- Access Call Logs\nWould you like to grant these permissions?',
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