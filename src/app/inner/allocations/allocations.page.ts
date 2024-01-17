import { Component, HostListener, NgZone, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';

import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { environment } from '../../../environments/environment';
import { AllocationEmittersService } from '../../service/allocation-emitters.service';
import { ApiService } from '../../service/api/api.service';
import { BaseServiceService } from '../../service/base-service.service';
import { CallLog, CallLogObject } from '@ionic-native/call-log/ngx';

@Component({
  selector: 'app-allocations',
  templateUrl: './allocations.page.html',
  styleUrls: ['./allocations.page.scss'],
})
export class AllocationsPage implements OnInit {
  searchBar: boolean = false;
  placeholderText = 'Search by Name/Status';
  data: any = [];
  leadCards: any;
  totalNumberOfRecords: any;
  currentPage: any = 1;
  counselor: any = [];
  filteredData: any = [];
  filterByStatus: any = [];
  showError: boolean = false;
  searchTerm: any;
  callState: any;

  filters: CallLogObject[];
  recordsFound: any;
  recordsFoundText: string;
  listTyle:string;
  pageSize: any = 10;
  counsellor_ids: any;
  user_id: string;

  constructor(
    private allocate: AllocationEmittersService,
    private modalController: ModalController,
    private api: ApiService,
    private _baseService: BaseServiceService,
    private callNumber: CallNumber,
    private platform: Platform,
    private zone: NgZone,
    private callLog: CallLog, 
  ) {
   
    
  }

 // ... existing code ...

 @HostListener('document:onCallStateChanged', ['$event'])
 handleCallStateChanged(event: any) {
   this.zone.run(() => {
      this.callState = event.state;

     if (this.callState === 'RINGING') {
       // Incoming call - You may choose to start recording here if needed
       alert(this.callState)
     } else if (this.callState === 'OFFHOOK') {
       // Call connected - Start recording
       alert(this.callState)
     } else if (this.callState === 'IDLE') {
       // Call ended - Stop recording
       alert(this.callState)
     }
   });
 }
 
 //getContacts() {
//   this.platform.ready().then(() => {
//     this.callLog.hasReadPermission().then(hasPermission => {
//       if (!hasPermission) {
//        //Getting Yesterday Time
//     var today = new Date();
//     var yesterday = new Date(today);
//     //  yesterday.setDate(today.getMinutes());
//     var fromTime = yesterday.getTime();

//     this.filters = [{
//       name: 'type',
//       value: '2',
//       operator: '==',
//     }, {
//       name: "date",
//       value: fromTime.toString(),
//       operator: ">=",
//     }];
    
//  this.callLog.getCallLog(this.filters)
//    .then(results => {
//      this.recordsFoundText = JSON.stringify(results);
//      this.recordsFound = results;
//      this.api.showToast(" LOG " + JSON.stringify(this.recordsFound))
//    })
//    .catch(e => alert(" LOG " + JSON.stringify(e)));
          
//       }else{
//          //Getting Yesterday Time
//     var today = new Date();
//     var yesterday = new Date(today);
//     //  yesterday.setDate(today.getMinutes());
//     var fromTime = yesterday.getTime();

//     this.filters = [{
//       name: 'type',
//       value: '2',
//       operator: '==',
//     }, {
//       name: "date",
//       value: fromTime.toString(),
//       operator: ">=",
//     }];
    
//  this.callLog.getCallLog(this.filters)
//    .then(results => {
//      this.recordsFoundText = JSON.stringify(results);
//      this.recordsFound = results;
//      this.api.showToast(" LOG " + JSON.stringify(this.recordsFound))
//    })
//    .catch(e => alert(" LOG " + JSON.stringify(e)));
//       }
//     })
//       .catch(e => alert(" hasReadPermission " + JSON.stringify(e)));
//   });
  
//  }
  
   callInitiated:boolean=false;
  callStartTime!: Date;
  callContact(number: string,id:any) {
    this.callStartTime = new Date();
    console.log(this.callStartTime, 'time');
    this.callNumber.callNumber(number, true).then(() => {
        this.callInitiated=true;
        let data = {
          user:this.user_id,
          status:3
        }
        this._baseService.postData(`${environment.counsellor_status}`,data).subscribe((res:any)=>{
          if(res){
            this.api.showToast(res.message)  
          }
        },((error:any)=>{
          this.api.showToast(error?.error?.message)
        }))
      })
      .catch(() => {
        this.api.showToast('Error launching dialer');
      });
      let data = {
        user:this.user_id,
        status:6
      }
      this._baseService.postData(`${environment.counsellor_status}`,data).subscribe((res:any)=>{
        if(res){
          this.api.showToast(res.message)  
        }
      },((error:any)=>{
        this.api.showToast(error?.error?.message)
      }))
      let callLogs = {
        lead_id: id,
        phone_number: number,
        call_status: "Answered",
        counsellor: this.user_id,
        call_start_time: this.callStartTime
    }
      this.createCallLog(callLogs)
  }

 createCallLog(callLogs){
  this._baseService.postData(`${environment.call_logs}`,callLogs).subscribe((res:any)=>{
   if(res){
    this.api.showToast(res.message)
   }
  },((error:any)=>{
    this.api.showToast(error.error.message)
  }))
 }
  getStatus() {
    this._baseService.getData(environment.lead_status).subscribe(
      (res: any) => {
        if (res) {
          this.filterByStatus = res.results;
        }
      },
      (error: any) => {
        this.api.showToast(error.error.message);
      }
    );
  }
  ngOnInit() {
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
    this.allocate.filterStatus.subscribe(
      (res: any) => {
        if (res) {
          query = `?status=${res}`;
          this.getLeadlist(query);
        }
      },
      (error: any) => {
        this.api.showToast(error.error.error.message);
      }
    );

    query = `?page=1&page_size=10`;
    this.getLeadlist(query);
    this.getCounselor();
  }
  handleRefresh(event: any) {
    setTimeout(() => {
      this.leadCards = [];
      this.data = [];
      let query = `?page=1&page_size=10`;
      this.getLeadlist(query);
      event.target.complete();
    }, 2000);
  }

  getLeadlist(query:any){  
   this._baseService.getData(`${environment.lead_list}${query}`).subscribe((res: any) => {
     if (res.results) {
      this.leadCards = []
      this.data = []
       this.leadCards = res.results;
       this.data = new MatTableDataSource<any>(this.leadCards);
       this.totalNumberOfRecords = res.total_no_of_record
       
     }
   }, (error: any) => {
     this.api.showToast(error.error.message);
   });
   
  }
  onPageChange(event: any, dataSource: MatTableDataSource<any>, type?: any) {
    if (event) {
      this.currentPage = event.pageIndex + 1;
      this.pageSize = event.pageSize;
      let query: any;
      if(this.searchTerm){
        query = `?page=${this.currentPage}&page_size=${event.pageSize}&key=${this.searchTerm}`;
        this.getLeadlist(query);
      }else{
       if(this.counsellor_ids){
        this.onEmit(this.counsellor_ids)

       }else{
        this.allocate.filterStatus.subscribe(
          (res: any) => {
            if (res) {
              query = `?page=${this.currentPage}&page_size=${event.pageSize}&status=${res}`;
              this.getLeadlist(query);
            }
          },
          (error: any) => {
            this.api.showToast(error.error.message);
          }
        );
       }
       
      }
     
    }
  }

 

  getCounselor() {
    this._baseService
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
  onEmit(event: any) {
    if (event) {
      let query: any;
      this.counsellor_ids = event;
      query = `?page=${this.currentPage}&page_size=${this.pageSize}&counsellor_ids=${event}`;
      this.getLeadlist(query);
    }
  }

  searchTermChanged(event: any) {
    this.searchTerm = event
    let query: any;
    if (event) {
      query = `?page=1&page_size=10&key=${event}`;
    } else {
      query = `?page=1&page_size=10`;
    }
    this.getLeadlist(query);
  }
}
