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
  constructor(
    private allocate: AllocationEmittersService,
    private modalController: ModalController,
    private popoverController: PopoverController,
    private baseService:BaseServiceService,
    private api:ApiService,
    private datepipe:DatePipe
  ) {
    this.user_role = localStorage.getItem('user_role')?.toUpperCase()
    this.user_id = localStorage.getItem('user_id')
  }
  
  ngOnInit() {
    this.getFilterByStatus()
    this.allocate.searchBar.subscribe((res) => {
      if (res === true) {
        this.searchBar = true;
      } else {
        this.searchBar = false;
      }
    });
    let query:any;
  
    this.allocate.filterStatus.subscribe((res:any)=>{
      if(res){
        query = `?counsellor_id=${this.user_id}&status=${res}`
        this.getCallLogs(query)
      }
    },((error:any)=>{
      this.api.showToast(error.error.message)
    }))
    query = `?counsellor_id=${this.user_id}`
    this.getCallLogs(query)
    this.getCounselor()
  }
  onStartDateChange(event: CustomEvent) {
    console.log(event)
    this.startDate = event.detail.value;
  }

  onEndDateChange(event: CustomEvent) {
    this.endDate = event.detail.value;
  }
  onSubmit() {
    let query;
  
    if (this.startDate && this.endDate) {
      let sdate = this.datepipe.transform(this.startDate, 'yyyy-MM-dd');
      let edate = this.datepipe.transform(this.endDate, 'yyyy-MM-dd');
      query = `?counsellor_id=${this.user_id}&from_date=${sdate}&to_date=${edate}`;
    } else {
      // If startDate is not set, set it to the current date
      this.startDate = new Date();
      let sdate = this.datepipe.transform(this.startDate, 'yyyy-MM-dd');
  
      // If endDate is not set, set it to the current date
      this.endDate = new Date();
      let edate = this.datepipe.transform(this.endDate, 'yyyy-MM-dd');
  
      query = `?counsellor_id=${this.user_id}&from_date=${sdate}&to_date=${edate}`;
    }
  
    this.getCallLogs(query);
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
      let query = `?page=1&page_size=10`
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
  // getUniqueCallStatus(results: any[]): string[] {
  //   const uniqueCallStatus = results
  //     .map(result => result.call_status)
  //     .filter((value, index, self) => self.indexOf(value) === index);

  //   return uniqueCallStatus;
  // }
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
  // onPageChange(event: any, dataSource: MatTableDataSource<any>, type?: any) {
  //   let query: any;
  //   if (event) {
  //     this.currentPage = event.pageIndex + 1;
  //     this.pageSize = event.pageSize;
  //     query = `?page=${this.currentPage}&page_size=${event.pageSize}`;
  //     this.getCallLogs(query);
  //   }
  //    else if(this.searchTerm){
  //       query = `?page=${this.currentPage}&page_size=${event.pageSize}&key=${this.searchTerm}`;
  //       this.getCallLogs(query);
  //     }else if(this.counsellor_ids){
  //       this.onEmit(this.counsellor_ids)
  //     }else{
  //       this.allocate.filterStatus.subscribe(
  //         (res: any) => {
  //           if (res) {
  //             query = `?page=${this.currentPage}&page_size=${event.pageSize}&status=${res}`;
  //             this.getCallLogs(query);
  //           }
  //         },
  //         (error: any) => {
  //           this.api.showToast(error.error.message);
  //         }
  //       );
  //      }
      
  // }
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
    } else {
      this.allocate.filterStatus.subscribe(
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
    if (event) {
      query = `?counsellor_id&page=1&page_size=10&key=${event}`;
    } else {
      query = `?counsellor_id&page=1&page_size=10`;
    }
    this.getCallLogs(query);
  }
}
