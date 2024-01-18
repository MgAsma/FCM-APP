import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { environment } from '../../../../environments/environment';
import { AllocationEmittersService } from '../../../service/allocation-emitters.service';
import { ApiService } from '../../../service/api/api.service';
import { BaseServiceService } from '../../../service/base-service.service';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-team-live-status',
  templateUrl: './team-live-status.page.html',
  styleUrls: ['./team-live-status.page.scss'],
})
export class TeamLiveStatusPage implements OnInit {
  searchBar: boolean = false;
  id:any
  followupDetails:any=[]
  placeholderText="Search by Name/Status"
  leadCards: any;
  totalNumberOfRecords: any;
  currentPage: any = 1;
  counselor: any = [];
  filteredData: any = [];
  private _inputData: any;
  data:any=[];
  arr:any=[
      {status:"Counsellor",
       leadName:"Ajay Kumar",
       date:"1hr 23mins",
       contactedBy:"Logged out",
       color:"green",
       icon1:"log-out",
       icon2:"radio-button-on",
      }
      ]
  filterByStatus: any;
  user_role: any;
  counsellor_ids: any;
  pageSize: any = 10;
  constructor(
    private allocate:AllocationEmittersService,
    private modalController:ModalController,
    private api:ApiService,
    private baseService:BaseServiceService,
    ) { 
    this.id=localStorage.getItem('user_id')
    this.user_role=localStorage.getItem('user_role')?.toLocaleUpperCase()
  }

  
  getStatus(){
    this.baseService.getData(environment.tls_counsellor).subscribe((res:any)=>{
      if(res){
        this.filterByStatus = res.data
      }
    },(error:any)=>{
      this.api.showToast(error.error.message)
    })
  }
  ngOnInit() {
    this.getStatus()
    this.allocate.searchBar.subscribe((res)=>{
      if(res === true){
        this.searchBar = true
      }else{
        this.searchBar = false
      }
    })
    let query:any;
    this.allocate.filterStatus.subscribe((res:any)=>{
      if(res){
        query = `status_id=${res}`
        //query = `page=1&page_size=10&status_id=${res}`
        this.getLiveStatus(query)
      }
    },((error:any)=>{
      this.api.showToast(error.error.error.message)
    }))
    // query = `page=1&page_size=10`
    query = ``
    this.getLiveStatus(query)
    this.getCounselor()
   
  }
  goBack(){
    window.history.back();
  }
  onPageChange(event: any, dataSource: MatTableDataSource<any>,type?:any) {
    if(event){
      this.currentPage = event.pageIndex + 1;
        let query:any;
         query = `&page=${this.currentPage}&page_size=${event.pageSize}`
         this.getLiveStatus(query)
    } 

  }
  getCounselor(){
    this.baseService.getData(`${environment._user}/?role_name=counsellor`).subscribe((res:any)=>{
     if(res.results){    
       this.counselor = res.results 
     }
    },((error:any)=>{
     this.api.showToast(error.error.message)
     
    }))
   
   }
   onEmit(event:any){
    if (event) {
      let query: any;
      this.counsellor_ids = event;
      query = `page=${this.currentPage}&page_size=${this.pageSize}&counsellor_id=${event}`;
      this.getLiveStatus(query)
    }

  }
  
  handleRefresh(event:any) {
    setTimeout(() => {
      // Any calls to load data go here
      this.followupDetails = [];
      this.data = [];
      let query = `page=1&page_size=10`
      this.getLiveStatus(query)
      event.target.complete();
    }, 2000);
  }
  getLiveStatus(query:any){
    if(this.user_role == 'SUPERADMIN' || this.user_role == 'SUPER_ADMIN' || this.user_role == 'ADMIN' ){
      this.api.getTeamLiveStatus(`?${query}`).subscribe(
        (resp:any)=>{
          this.followupDetails=resp.results
          this.data = new MatTableDataSource<any>(this.followupDetails);
          console.log(this.data.data,"DATA")
          this.totalNumberOfRecords = resp.total_no_of_record
        },
        (error:any)=>{
          this.api.showError(error?.error.message)
        }
      )
    }else{
      this.api.getTeamLiveStatus(`?counsellor_id=${this.id}&${query}`).subscribe(
        (resp:any)=>{
          this.followupDetails=resp.results
          this.data = new MatTableDataSource<any>(this.followupDetails);
          console.log(this.data.data,"DATA")
          this.totalNumberOfRecords = resp.total_no_of_record
        },
        (error:any)=>{
          this.api.showError(error?.error.message)
        }
      )
    }
   
  }
  searchTermChanged(event:any) {
    let query:any;
    if(event){
      query = `key=${event}`
     }
     this.getLiveStatus(query)
  }

}




