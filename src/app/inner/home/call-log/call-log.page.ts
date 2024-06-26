import { Component, OnInit } from '@angular/core';
import { ModalController, Platform, PopoverController } from '@ionic/angular';

// import { RecurringFollowupComponent } from '../recurring-followup/recurring-followup.component';
import { GotoViewCustomerDetailsCallCustomerComponent } from '../goto-view-customer-details-call-customer/goto-view-customer-details-call-customer.component';
import { environment } from '../../../../environments/environment';
import { AllocationEmittersService } from '../../../service/allocation-emitters.service';
import { ApiService } from '../../../service/api/api.service';
import { BaseServiceService } from '../../../service/base-service.service';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';

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
  counsellor_ids: any;
  totalNumberOfRecords: any;
  callLogCards: any = [];
  placeholderText = 'Search By Name/Phone'
  counselor: any = [];
  endDate:any;
  startDate:any;
  callLogForm:FormGroup
  dateFilter: boolean = false;
  minEndDate: any; 
  dateForm:FormGroup;
  dateFiltered: boolean = false;
  constructor(
    private allocate: AllocationEmittersService,
    private popoverController: PopoverController,
    private baseService:BaseServiceService,
    private api:ApiService,
    private datepipe:DatePipe,
    private fb:FormBuilder
  ) {
    this.user_role = localStorage.getItem('user_role')?.toUpperCase()
    this.user_id = localStorage.getItem('user_id')
  }
  initForm(){
    this.dateForm = this.fb.group({
      startDate:['',Validators.required],
      endDate:['',Validators.required]
    })
  }
  ngOnInit() {
    this.initForm()
    this.getFilterByStatus()
    this.allocate.searchBar.subscribe((res) => {
      if (res === true) {
        this.searchBar = true;
      } else {
        this.searchBar = false;
      }
    });
    let query:any;
  
    this.allocate.callLogStatus.subscribe((res:any)=>{
      if(res.length >0){
        query = `?counsellor_id=${this.user_id}&status=${res}`
        this.getCallLogs(query)
      }else{
        query = `?counsellor_id=${this.user_id}`
        this.getCallLogs(query)
      }
    },((error:any)=>{
      this.api.showToast(error.error.message)
    }))
    // query = `?counsellor_id=${this.user_id}`
    // this.getCallLogs(query)
    this.getCounselor()
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
    this.endDate = event.target['value'];
  }
  onSubmit() {
    let query;
    if(this.dateForm.invalid){
      this.dateForm.markAllAsTouched()
      this.api.showToast('Select start date and end date')
    }else{
      let sdate = this.datepipe.transform(this.dateForm.value.startDate, 'yyyy-MM-dd');
      let edate = this.datepipe.transform(this.dateForm.value.endDate, 'yyyy-MM-dd');
      query = `?counsellor_id=${this.user_id}&from_date=${sdate}&to_date=${edate}`;
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
          this.api.showToast(error.error.message);
        }
      );
  }
  getCounselor() {
    this.baseService
      .getData(`${environment._user}/?role_name=counsellor`)
      .subscribe(
        (res: any) => {
          if (res.results) {
            this.counselor = res.results;
          }
        },
        (error: any) => {
          this.api.showToast(error.error.message);
        }
      );
  }
  handleRefresh(event:any) {
    setTimeout(() => {
      this.callLogCards = []
      this.data = []
      this.dateForm.reset()
      this.allocate.callLogStatus.next('')
      let query = `?counsellor_id=${this.user_id}&page=1&page_size=10`
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
       this.callLogCards = res.results;
       this.data = new MatTableDataSource<any>(this.callLogCards);
       this.totalNumberOfRecords = res.total_no_of_record
       //this.filterByStatus = this.getUniqueCallStatus(this.data);
      }
    },((error:any)=>{
      this.api.showToast(error?.error.message)
    }))
  }
  
  onEmit(event:any){
    if(event){
    this.counsellor_ids = event
      let params:any;
      if(this.user_role == 'SUPERADMIN' || this.user_role == 'SUPER_ADMIN' || this.user_role == 'ADMIN'){
         params = `page=1&page_size=10`
      }else{
         params = `?counsellor_id=${this.user_id}&page=1&page_size=10&counsellor_ids=${event}`
      }
      this.getCallLogs(params)
    } 

  }
  
  onPageChange(event: any, dataSource: MatTableDataSource<any>, type?: any) {
    if (event) {
      this.currentPage = event.pageIndex + 1;
      this.pageSize = event.pageSize;
    }
  
    let query: string = `?page=${this.currentPage}&page_size=${event.pageSize}`;
  
    if (this.searchTerm) {
      query += `&key=${this.searchTerm}`;
    } else if (this.counsellor_ids) {
      this.onEmit(this.counsellor_ids);
      return;
    }else if(this.dateFilter){
      this.onSubmit()
      return;
    }else {
      this.allocate.callLogStatus.subscribe(
        (res: any) => {
          if (res) {
            query += `&status=${res}`;
          }
        },
        (error: any) => {
          this.api.showToast(error.error.message);
        }
      );
    }
  
    this.getCallLogs(query);
  }
  
  searchTermChanged(event: any) {
    this.searchTerm = event
    let query: any;
    query = `?counsellor_id=${this.user_id}&page=1&page_size=10&key=${event}`;
    
    this.allocate.callLogStatus.subscribe(
      (res: any) => {
        if (res.length >0) {
          query += `&status=${res}`;
        }
      },
      (error: any) => {
        this.api.showToast(error.error.message);
      }
    );
    if(this.dateFiltered){
      let sdate = this.datepipe.transform(this.dateForm.value.startDate, 'yyyy-MM-dd');
      let edate = this.datepipe.transform(this.dateForm.value.endDate, 'yyyy-MM-dd');
      query +=`&from_date=${sdate}&to_date=${edate}`
    }
    this.getCallLogs(query);
  }
}
