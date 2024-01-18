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
  superadmin_or_admin: string;

  constructor(
    private allocate: AllocationEmittersService,
    private api: ApiService,
    private _baseService: BaseServiceService,
    private callNumber: CallNumber,
    ) {
      this.superadmin_or_admin = localStorage.getItem('superadmin_or_admin')
      console.log(this.superadmin_or_admin,"ADMIN")
    }


  callInitiated:boolean=false;
  callStartTime!: Date;
  callContact(number: string,id:any) {
    this.callStartTime = new Date();
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
      let isoString = this.callStartTime.toISOString();
      let formattedDate = isoString.replace('Z', '+05:30');
      // console.log(formattedDate);
      let callLogs = {
        lead_id: id,
        phone_number: number,
        call_status: 3,
        counsellor: this.user_id,
        call_start_time: formattedDate
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
          query = `&status=${res}`;
          this.getLeadlist(query);
        }
      },
      (error: any) => {
        this.api.showToast(error.error.message);
      }
    );

    query = `page=1&page_size=10`;
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
   this._baseService.getData(`${environment.lead_list}?user_id=${this.user_id}&super_admin=${this.superadmin_or_admin}&${query}`).subscribe((res: any) => {
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
  
      let query: string = `page=${this.currentPage}&page_size=${event.pageSize}`;
  
      if (this.searchTerm) {
        query += `key=${this.searchTerm}`;
      } else if (this.counsellor_ids) {
        this.onEmit(this.counsellor_ids);
        return; // Exit the function after emitting counsellor_ids
      } else {
        this.allocate.filterStatus.subscribe(
          (res: any) => {
            if (res) {
              query += `status=${res}`;
            }
          },
          (error: any) => {
            this.api.showToast(error.error.message);
          }
        );
      }
  
      this.getLeadlist(query);
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
      query = `page=${this.currentPage}&page_size=${this.pageSize}&counsellor_ids=${event}`;
      this.getLeadlist(query);
    }
  }

  searchTermChanged(event: any) {
    this.searchTerm = event
    let query: any;
    if (event) {
      query = `page=1&page_size=10&key=${event}`;
    } else {
      query = `page=1&page_size=10`;
    }
    this.getLeadlist(query);
  }
}
