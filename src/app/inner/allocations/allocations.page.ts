import { Component, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';

import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { environment } from '../../../environments/environment';
import { AllocationEmittersService } from '../../service/allocation-emitters.service';
import { ApiService } from '../../service/api/api.service';
import { BaseServiceService } from '../../service/base-service.service';
import { CallLog, CallLogObject } from '@ionic-native/call-log/ngx';
import { AddLeadEmitterService } from '../../service/add-lead-emitter.service';
import { EditLeadPage } from '../edit-lead/edit-lead.page';
@Component({
  selector: "app-allocations",
  templateUrl: "./allocations.page.html",
  styleUrls: ["./allocations.page.scss"],
})
export class AllocationsPage implements OnInit{
  searchBar: boolean = false;
  placeholderText = "Search by Name/Status";
  data: any = [];
  leadCards: any;
  totalNumberOfRecords: any;
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
  
  
    constructor(
      private allocate: AllocationEmittersService,
      private api: ApiService,
      private _baseService: BaseServiceService,
      private callNumber: CallNumber,
      private callLog: CallLog,
      private platform: Platform,
      private _addLeadEmitter:AddLeadEmitterService,
      private modalController:ModalController
    ) {
      this.superadmin_or_admin = localStorage.getItem('superadmin_or_admin')
     
      this.counsellor_id = localStorage.getItem('user_id');
      
      }

      getContacts(name: any, value: any, operator: any) {
        if (value == '1') {
          this.listTyle = 'Incoming Calls from yesterday';
        } else if (value == '2') {
          this.listTyle = 'Ougoing Calls from yesterday';
        } else if (value == '5') {
          this.listTyle = 'Rejected Calls from yesterday';
        }
    
       // Getting Yesterday Time
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
            name: 'date',
            value: fromTime.toString(),
            operator: '>=',
          },
        ];
    
        this.callLog.getCallLog(this.filters).then((results) => {
            for (const log of results) {
              this.callDuration = log.duration;
              //console.log('Call Log:', this.callDuration);
              if (this.callDuration > 0) {
                this.currentStatus = 2;
              } else {
                this.currentStatus = 5;
              }
            
            }
    
           
            this.recordsFoundText = JSON.stringify(results);
            this.recordsFound = results; //JSON.stringify(results);
          })
         
          // .catch((e) => alert(' LOG ' + JSON.stringify(e)));
      }
      
     callContact(number: string, id: any) {
      this.leadId = id;
      this.leadPhoneNumber = number;
      this.callStartTime = new Date();
      
      // console.log(this.callStartTime, 'time');
      let data = {
        user:this.user_id,
        status:3
      }
     this.postTLStatus(data);
      this.callNumber.callNumber(number, true)
         this.callInitiated = true;
         // console.log('Dialer Launched!');
          setTimeout(() => {
            this.getContacts('type', '2', '==');
            this.getContacts('type', '5', '==');
          }, 10000);
          setTimeout(() => {
            this.postCallHistory();
          }, 30000);
          
      }

      postTLStatus(data){
        this._baseService.postData(`${environment.counsellor_status}`,data).subscribe((res:any)=>{
          if(res){
            console.log(res.message)  
          }
        },((error:any)=>{
          this.api.showToast(error?.error?.message)
        }))
      }

      postCallHistory() {
        let data = {
          lead_id: this.leadId,
          phone_number: this.leadPhoneNumber,
          call_status: this.currentStatus,
          counsellor: this.counsellor_id,
          call_start_time: this.callStartTime,
        };
        this.api.sendingCallHistory(data).subscribe((res: any) => {
          if(res){
            let data2 = {
              user:this.user_id,
              status:3
            }
            this.postTLStatus(data2)
          }
        // console.log(res, 'sending call history');
        },(error:any)=>{
          this.api.showToast(error.error.message);
        });
      
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
    this.user_id = localStorage.getItem("user_id");

    this.getStatus();
    this.allocate.searchBar.subscribe((res) => {
      if (res === true) {
        this.searchBar = true;
      } else {
        this.searchBar = false;
      }
    });
    let query: any;
    this.allocate.allocationStatus.subscribe(
      (res: any) => {
        if (res.length >0) {
          query = `status=${res}`;
          this.getLeadlist(query);
        }else{
          query = `page=1&page_size=10`;
          this.getLeadlist(query);
        }
      },
      (error: any) => {
        this.api.showToast(error.error.message);
      }
    );
    this._addLeadEmitter.triggerGet$.subscribe(() => {
      query = `page=1&page_size=10`;
      this.getLeadlist(query);
    });
    // query = `page=1&page_size=10`;
    // this.getLeadlist(query);
    this.getCounselor();
  }
  handleRefresh(event: any) {
    setTimeout(() => {
      this.leadCards = [];
      this.data = [];
      this.allocate.allocationStatus.next('')
      let query = `?page=1&page_size=10`;
      this.getLeadlist(query);
      event.target.complete();
    }, 2000);
  }

  getLeadlist(query:any){
    let baseQuery = ''
    let user_role = localStorage.getItem('user_role').toUpperCase()
    if(user_role == 'SUPERADMIN' || user_role == 'SUPER ADMIN'){
      baseQuery = `/?${query}`
    }else{
      baseQuery = `?counsellor_id=${this.user_id}&${query}`
    }
   this._baseService.getData(`${environment.lead_list}${baseQuery}`).subscribe((res: any) => {
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
        this.allocate.allocationStatus.subscribe(
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
    
    let query: string = `page=${this.currentPage}&page_size=${this.pageSize}&key=${this.searchTerm}`;
   
      this.allocate.allocationStatus.subscribe(
        (res: any) => {
          if (res) {
            query += `&status=${res}`;
          }
        },
        (error: any) => {
          this.api.showToast(error.error.message);
        }
      );
    
    this.getLeadlist(query);
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
