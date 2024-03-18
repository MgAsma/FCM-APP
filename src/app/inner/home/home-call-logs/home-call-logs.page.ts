import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { CallLog } from '@ionic-native/call-log/ngx';
import { PopoverController, Platform } from '@ionic/angular';
import { environment } from '../../../../environments/environment';
import { AllocationEmittersService } from '../../../service/allocation-emitters.service';
import { ApiService } from '../../../service/api/api.service';
import { BaseServiceService } from '../../../service/base-service.service';
import { GotoViewCustomerDetailsCallCustomerComponent } from '../../../shared-modules/goto-view-customer-details-call-customer/goto-view-customer-details-call-customer.component';
import { AddLeadEmitterService } from '../../../service/add-lead-emitter.service';

@Component({
  selector: 'app-home-call-logs',
  templateUrl: './home-call-logs.page.html',
  styleUrls: ['./home-call-logs.page.scss'],
})
export class HomeCallLogsPage implements OnInit {
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
    this.user_role = sessionStorage.getItem('user_role')?.toUpperCase()
    this.user_id = sessionStorage.getItem('user_id')
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
    this.addEmiter.callLogCounsellor.subscribe((res) => {
      if(res.length > 0){
        this.counsellor_ids = res
      }
    })
    let query = this.user_role == 'COUNSELLOR' || this.user_role == 'COUNSELOR'? `?counsellor_ids=${this.user_id}&page=1&page_size=10 `
    :'?page=1&page_size=10';
    this.allocate.callLogStatus.subscribe(
      (res: any) => {
        if(res.length >0){
          this.statusFilter = true;
          query +=`&status=${res}`
        }if(this.counsellor_ids.length >0){
          query +=`&counsellor_ids=${this.counsellor_ids}`
        }
        this.callLogCards = []
        this.data = []  
        this.baseService.getData(`${environment.call_logs}${query}`).subscribe((res:any)=>{
          if(res){
            debugger;
           this.callLogCards = res.results;
           this.data = new MatTableDataSource<any>(this.callLogCards);
           this.totalNumberOfRecords = res.total_no_of_record 
          }
        },((error:any)=>{
          this.api.showError(error?.error.message)
        }))
      }
    );
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
      console.log(event,event)
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
    let query;
    if(this.dateForm.invalid){
      this.dateForm.markAllAsTouched()
      this.api.showWarning('Select start date and end date')
    }else{
      this.sdate = this.datepipe.transform(this.dateForm.value.startDate, 'yyyy-MM-dd');
      this.edate = this.datepipe.transform(this.dateForm.value.endDate, 'yyyy-MM-dd');
      query = this.user_role == 'COUNSELLOR' || this.user_role == 'COUNSELOR' ?  `?counsellor_ids=${this.user_id}&from_date=${this.sdate}&to_date=${this.edate}`
      :`?from_date=${this.sdate}&to_date=${this.edate}&page=${this.currentPage}&page_size=${this.pageSize}`;
      this.dateFilter = true
      this.getCallLogs(query);
      this.dateFiltered = true

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
      .getData(`${environment._user}/?role_name=counsellor`)
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
      this.callLogCards = []
      this.data = []
     
      this.addEmiter.filterStatus.next(true)
      this.allocate.callLogStatus.next([])
      this.addEmiter.callLogCounsellor.next([])
      this.dateForm.reset()
      this.allocate.searchBar.next(false)
      let query = this.user_role == 'COUNSELLOR' || this.user_role == 'COUNSELOR' ? `?counsellor_ids=${this.user_id}&page=1&page_size=10`:`?page=1&page_size=10`
      this.getCallLogs(query)
      event.target.complete();
    }, 2000);
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
     
    if(this.dateFilter){
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
    if(this.dateFilter){
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
