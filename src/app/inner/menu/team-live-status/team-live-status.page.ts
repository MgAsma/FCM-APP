import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { environment } from '../../../../environments/environment';
import { AllocationEmittersService } from '../../../service/allocation-emitters.service';
import { ApiService } from '../../../service/api/api.service';
import { BaseServiceService } from '../../../service/base-service.service';
import { MatTableDataSource } from '@angular/material/table';
import { AddLeadEmitterService } from '../../../service/add-lead-emitter.service';


@Component({
  selector: 'app-team-live-status',
  templateUrl: './team-live-status.page.html',
  styleUrls: ['./team-live-status.page.scss'],
})
export class TeamLiveStatusPage implements OnInit {
  searchBar: boolean = false;
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
  counsellor_ids: any = [];
  pageSize: any = 10;
  user_id: string;
  statusFilter: boolean = false;
  searchTerm: any;
  defaultData: boolean = false;
  constructor(
    private allocate:AllocationEmittersService,
    private modalController:ModalController,
    private api:ApiService,
    private baseService:BaseServiceService,
    private addEmit:AddLeadEmitterService
    ) { 
    this.user_id=sessionStorage.getItem('user_id')
    this.user_role=sessionStorage.getItem('user_role')?.toUpperCase()
  }

  
  getStatus(){
    this.baseService.getData(environment.tls_counsellor).subscribe((res:any)=>{
      if(res){
        this.filterByStatus = res.data
      }
    },(error:any)=>{
      this.api.showError(error.error.message)
    })
  }
   ngOnInit() {
    this.getStatus()
    this.getCounselor()
    this.allocate.searchBar.subscribe((res)=>{
      if(res === true){
        this.searchBar = true
      }else{
        this.searchBar = false
      }
    })
    let query:any;
    this.addEmit.tlsCounsellor.subscribe((res) => {
      if(res.length > 0){
        this.counsellor_ids = res
      }
    })
    this.allocate.tlsStatus.subscribe((res:any)=>{
      query = `page=1&page_size=10`
      if(res.length>0){
        this.statusFilter = true
        query += `&status_id=${res}`
      }if(this.counsellor_ids.length >0){
         query =`&counsellor_ids=${this.counsellor_ids}`
        }
        this.getLiveStatus(query)
    },((error:any)=>{
      this.api.showToast(error.error.message)
    }))
   
    
  }
  goBack(){
    window.history.back();
  }
  onPageChange(event: any, dataSource: MatTableDataSource<any>,type?:any) {
    let query:any;
    if(event){
      this.currentPage = event.pageIndex + 1;
      query = `page=${this.currentPage}&page_size=${event.pageSize}`
    } 
   
    if(this.statusFilter){
     this.allocate.tlsStatus.subscribe((res:any)=>{
      if(res.length>0){
        this.statusFilter = true
        query += `&status_id=${res}`
       
      }
    })
    }
     if (this.counsellor_ids.length >0) {
      query += `&counsellor_ids=${this.counsellor_ids}`
    }
    if(this.searchTerm){
      query += `&key=${this.searchTerm}`
    }
    this.getLiveStatus(query)
  }
  getCounselor(){
    this.baseService.getData(`${environment._user}/?role_name=counsellor`).subscribe((res:any)=>{
     if(res.results){    
       this.counselor = res.results 
     }
    },((error:any)=>{
     this.api.showError(error.error.message)
     
    }))
   
   }
   onEmit(event:any){ 
    let query: any;
    if (event) {
       this.counsellor_ids = event;
      this.addEmit.tlsCounsellor.next(event)
      query = `page=1&page_size=10&counsellor_ids=${this.counsellor_ids}`;
  
    if(this.statusFilter){
      this.allocate.tlsStatus.subscribe((res:any)=>{
       if(res.length>0){
         this.statusFilter = true
         query += `&status_id=${res}`
        
       }
     })
     }
     if(this.searchTerm){
       query += `&key=${this.searchTerm}`
     }
     this.getLiveStatus(query)
    }
  }
  
  handleRefresh(event:any) {
    setTimeout(() => {
      // Any calls to load data go here
      this.followupDetails = [];
      this.data = [];
      this.allocate.tlsStatus.next('')
      this.addEmit.tlsCounsellor.next([])
      this.allocate.searchBar.next(false)
      let query = `page=1&page_size=10`
      this.getLiveStatus(query)
      event.target.complete();
    }, 2000);
  }
  
  getLiveStatus(params:any){
    let query = this.user_role == 'COUNSELLOR' ? `?counsellor_ids=${this.user_id}&${params}`:`?${params}`
      this.api.getTeamLiveStatus(query).subscribe(
        (resp:any)=>{
          this.followupDetails=resp.results
          this.data = new MatTableDataSource<any>(this.followupDetails);
          this.totalNumberOfRecords = resp.total_no_of_record
        },
        (error:any)=>{
          this.api.showError(error?.error.message)
        }
      )
   
  }
 
  searchTermChanged(event:any) {
    let query:any;
    query = `key=${event}&page=1&page_size=10`
    this.searchTerm = event
    if(this.statusFilter){
      this.allocate.tlsStatus.subscribe((res:any)=>{
       if(res.length>0){
         query += `&status_id=${res}`
       }
     })
     }
    if (this.counsellor_ids.length >0) {
       query += `&counsellor_ids=${this.counsellor_ids}`
     }
     this.getLiveStatus(query)
  }

}




