import { Component, OnInit } from '@angular/core';
import { ModalController, Platform, PopoverController } from '@ionic/angular';

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
  resetAll: boolean = false;
  status: any;
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
  ) {
    this.user_role = localStorage.getItem('user_role')?.toUpperCase()
    this.user_id = localStorage.getItem('user_id')
    let today = new Date()
    this.maxStartDate = this.datepipe.transform(today,'YYYY-MM-dd')
    
    this.getFilterByStatus();
    this.getCOUNSELLOR();
    this.initForm()

    this.platform.ready().then(() => {
      this.callLog
        .hasReadPermission()
        .then((hasPermission) => {
          if (!hasPermission) {
            this.callLog
              .requestReadPermission()
              .then((results) => {})
              .catch((e) =>{

              }
                // alert(' requestReadPermission ' + JSON.stringify(e))
              );
          } else {
          }
        })
        .catch((e) =>{
          // alert(' hasReadPermission ' + JSON.stringify(e)
        })
    });
  }
  
  
  ngOnInit() {
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
      this.api.showError(error?.error.message);
    }));
      
    // Subscribe to the callLogCounsellor event
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
     
    // Reset query
    let query = (this.user_role == 'COUNSELLOR' || this.user_role == 'COUNSELOR') ?
      `?counsellor_ids=${this.user_id}&page=1&page_size=10` :
      '?page=1&page_size=10';
    
      // Add date filter to query if applicable
    // if (this.dateFilter && !this.dateForm.invalid) {
    //   this.sdate = this.datepipe.transform(this.dateForm.value.startDate, 'yyyy-MM-dd');
    //   this.edate = this.datepipe.transform(this.dateForm.value.endDate, 'yyyy-MM-dd');
    //   query += `&from_date=${this.sdate}&to_date=${this.edate}`;
    // }
    // Add status filter to query if applicable
    if (this.statusFilter) {
      query += `&status=${this.status}`;
    }
  
    // Add counsellor IDs filter to query if applicable
    if (this.counsellor_ids.length > 0) {
      query += `&counsellor_ids=${this.counsellor_ids}`;
    }
  
   
   alert(this.sdate)
   alert(!this.dateForm.invalid )
    // Call API with updated query
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
    });
    // Setup search bar subscription
    this.setupSearchBarSubscription();
  }
  
 
  initForm(){
    this.dateForm = this.fb.group({
     startDate:['',Validators.required],
     endDate:['',Validators.required]
    })
  }
   setupSearchBarSubscription() {
    this.allocate.searchBar.subscribe((res) => {
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
    if(this.dateForm.invalid){
      this.dateForm.markAllAsTouched()
      this.api.showError('Select start date and end date')
    }else{
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
        this.sdate = this.datepipe.transform(this.dateForm.value.startDate, 'yyyy-MM-dd');
        this.edate = this.datepipe.transform(this.dateForm.value.endDate, 'yyyy-MM-dd');
     
        // Reset query
      let query = this.user_role == 'COUNSELLOR' || this.user_role == 'COUNSELOR' ?  `?counsellor_ids=${this.user_id}&from_date=${this.sdate}&to_date=${this.edate}&page=1&page_size=10`
      :`?from_date=${this.sdate}&to_date=${this.edate}&page=1&page_size=10`;
    
      // Add status filter to query if applicable
      if (this.statusFilter) {
        query += `&status=${this.status}`;
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
        
      });
     
    //   query = this.user_role == 'COUNSELLOR' || this.user_role == 'COUNSELOR' ?  `?counsellor_ids=${this.user_id}&from_date=${this.sdate}&to_date=${this.edate}&page=1&page_size=10`
    //   :`?from_date=${this.sdate}&to_date=${this.edate}&page=1&page_size=10`;
    //   this.dateFilter = true
    //   this.dateFiltered = true
    //   this.callLogCards = [];
    //   this.data = [];
    //   this.totalNumberOfRecords = [];
    //   this.baseService.getData(`${environment.call_logs}${query}`).subscribe((res: any) => {
    //     if (res) {
    //       this.callLogCards = res.results;
    //       this.data = new MatTableDataSource<any>(this.callLogCards);
    //       this.totalNumberOfRecords = res.total_no_of_record;
    //     }
    //   }, ((error: any) => {
    //     this.api.showError(error?.error.message);
    //   }));
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
    setTimeout(() => {
      this.resetAll = true;
      this.callLogCards = []
      this.data = []
      this.totalNumberOfRecords = []
      this.addEmiter.filterStatus.next(true)
      this.statusFilter = false;
      this.allocate.callLogStatus.next([])
      this.addEmiter.callLogCounsellor.next([])
      this.dateForm.reset()
      this.initForm();
      this.sdate = '';
      this.edate = '';
      this.dateFilter = false
      this.allocate.searchBar.next(false)
      this.counsellor_ids = []
      let query = this.user_role == 'COUNSELLOR' || this.user_role == 'COUNSELOR' ? `?counsellor_ids=${this.user_id}&page=1&page_size=10`:`?page=1&page_size=10`
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
      event.target.complete();
    },100);
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
      });
    return await popover.present();
  }
  getCallLogs(query:any){
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
      if(this.sdate != null && this.edate != null){
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
     
    if(this.sdate != null && this.edate != null){
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
    this.getCallLogs(query);
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
    if(this.sdate != null && this.edate != null){
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
}
