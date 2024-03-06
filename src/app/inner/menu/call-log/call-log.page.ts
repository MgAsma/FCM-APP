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
  constructor(
    private allocate: AllocationEmittersService,
    private popoverController: PopoverController,
    private baseService:BaseServiceService,
    private api:ApiService,
    private datepipe:DatePipe,
    private callLog: CallLog,
    private platform: Platform,
  ) {
    this.user_role = localStorage.getItem('user_role')?.toUpperCase()
    this.user_id = localStorage.getItem('user_id')


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
    this.setupSearchBarSubscription();
    this.setupCallLogStatusSubscription();
    this.initializeCallLogs();
    this.getCounselor();
    this.getFilterByStatus();
  }
  
  private setupSearchBarSubscription() {
    this.allocate.searchBar.subscribe((res) => {
      this.searchBar = res === true;
    });
  }
  
  private setupCallLogStatusSubscription() {
    this.allocate.callLogStatus.subscribe(
      (res: any) => {
        this.handleCallLogStatus(res);
      },
      (error: any) => {
        this.api.showToast(error.error.message);
      }
    );
  }
  
  private handleCallLogStatus(status: any) {
    const query = this.user_role == 'COUNSELOR' ? `?counsellor_id=${this.user_id}${status ? `&status=${status}` : ''}` :`${status ? `?status=${status}` : ''}`;
    this.getCallLogs(query);
  }
  
  private initializeCallLogs() {
    const query = this.user_role == 'COUNSELOR' ? `?counsellor_id=${this.user_id} `:'';
    this.getCallLogs(query);
  }
  //**********************************************************/
  
  onStartDateChange(event: CustomEvent) {
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
    this.dateFilter = true
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
      let query = this.user_role == 'COUNSELOR' ? `?counsellor_id=${this.user_id}&page=1&page_size=10`:`?page=1&page_size=10`
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
      console.log(res,"call log response")
      if(res){ 
       this.callLogCards = res.results;
       this.data = new MatTableDataSource<any>(this.callLogCards);
       this.totalNumberOfRecords = res.total_no_of_record
      }
    },((error:any)=>{
      this.api.showToast(error?.error.message)
    }))
  }
  
  onEmit(event:any){
    if(event){
    this.counsellor_ids = event
     
      let params = this.user_role == 'COUNSELOR' ? 
      `?counsellor_id=${this.user_id}&page=1&page_size=10&counsellor_ids=${event}`:
      `?page=1&page_size=10`
      this.getCallLogs(params)
    } 

  }
  
  onPageChange(event: any, dataSource: MatTableDataSource<any>, type?: any) {
    if (event) {
      this.currentPage = event.pageIndex + 1;
      this.pageSize = event.pageSize;
    }
  
    let query: string =   this.user_role == 'COUNSELOR' ? `?counsellor_id=${this.user_id}&page=${this.currentPage}&page_size=${event.pageSize}`:
    `?page=${this.currentPage}&page_size=${event.pageSize}`
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
    let query = this.user_role == 'COUNSELOR' ? `?counsellor_id=${this.user_id}&page=1&page_size=10&key=${event}`:
    `?page=1&page_size=10&key=${event}`
    this.getCallLogs(query);
  }
}
