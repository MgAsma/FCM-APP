import { Component, OnInit } from '@angular/core';
import { ModalController, Platform, PopoverController } from '@ionic/angular';

import { RecurringFollowupComponent } from '../recurring-followup/recurring-followup.component';
import { GotoViewCustomerDetailsCallCustomerComponent } from '../goto-view-customer-details-call-customer/goto-view-customer-details-call-customer.component';
import { environment } from '../../../../environments/environment';
import { AllocationEmittersService } from '../../../service/allocation-emitters.service';
import { ApiService } from '../../../service/api/api.service';
import { BaseServiceService } from '../../../service/base-service.service';
import { MatTableDataSource } from '@angular/material/table';

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
  currentPage: any;
  pageSize: any;
  searchTerm: any;
  counsellor_ids: any;
  constructor(
    private allocate: AllocationEmittersService,
    private modalController: ModalController,
    private popoverController: PopoverController,
    private baseService:BaseServiceService,
    private api:ApiService
  ) {
    this.user_role = localStorage.getItem('user_role')?.toUpperCase()
    this.user_id = localStorage.getItem('user_id')
  }

  ngOnInit() {
   
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
  }
 
  handleRefresh(event:any) {
    setTimeout(() => {
      // this.leadCards = []
      this.data = []
      let query = `?page=1&page_size=10`
      this.getCallLogs(query)
      event.target.complete();
    }, 2000);
  }
  goBack() {
    window.history.back();
  }
  async openGotoCallOrDetails() {
    const popover = await this.popoverController.create({
      component: GotoViewCustomerDetailsCallCustomerComponent,
      translucent: true,
      backdropDismiss: false,
    });
    return await popover.present();
  }
  getCallLogs(query:any){
    this.baseService.getData(`${environment.call_logs}/${query}`).subscribe((res:any)=>{
      if(res){
        this.data = res.results;
        this.filterByStatus = this.getUniqueCallStatus(this.data);
      }
    },((error:any)=>{
      this.api.showToast(error?.error.message)
    }))
  }
  getUniqueCallStatus(results: any[]): string[] {
    const uniqueCallStatus = results
      .map(result => result.call_status)
      .filter((value, index, self) => self.indexOf(value) === index);

    return uniqueCallStatus;
  }
  onEmit(event:any){
    if(event){
    this.counsellor_ids = event
      let params:any;
      if(this.user_role == 'SUPERADMIN' || this.user_role == 'SUPER_ADMIN' || this.user_role == 'ADMIN'){
         params = `page=1&page_size=10`
      }else{
         params = `?counsellor_id=${this.user_id}&page=1&page_size=10&status=${event}`
      }
      this.getCallLogs(params)
    } 

  }
  onPageChange(event: any, dataSource: MatTableDataSource<any>, type?: any) {
    if (event) {
      this.currentPage = event.pageIndex + 1;
      this.pageSize = event.pageSize;
      let query: any;
      if(this.searchTerm){
        query = `?page=${this.currentPage}&page_size=${event.pageSize}&key=${this.searchTerm}`;
        this.getCallLogs(query);
      }else{
       if(this.counsellor_ids){
        this.onEmit(this.counsellor_ids)

       }else{
        this.allocate.filterStatus.subscribe(
          (res: any) => {
            if (res) {
              query = `?page=${this.currentPage}&page_size=${event.pageSize}&status_id=${res}`;
              this.getCallLogs(query);
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
}
