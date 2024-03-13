import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AllocationEmittersService } from '../../../service/allocation-emitters.service';
import { environment } from '../../../../environments/environment';
import { ApiService } from '../../../service/api/api.service';
import { BaseServiceService } from '../../../service/base-service.service';


@Component({
  selector: 'app-follow-ups',
  templateUrl: './follow-ups.component.html',
  styleUrls: ['./follow-ups.component.scss'],
})
export class FollowUpsComponent  implements OnInit {
  searchBar: boolean = false;
  id:any
  followupDetails:any=[]
  placeholderText="Search by Name/Status"
  leadCards: any;
  totalNumberOfRecords: any;
  currentPage: any;
  counselor: any = [];
  filteredData: any = [];
  private _inputData: any;
  data:any=[]

  constructor(private allocate:AllocationEmittersService,private modalController:ModalController,private api:ApiService,  private baseService:BaseServiceService,) { 
    this.id=sessionStorage.getItem('user_id')
  }



  ngOnInit() {
    this.allocate.searchBar.subscribe((res)=>{
      if(res === true){
        this.searchBar = true
      }else{
        this.searchBar = false
      }
    })
    let query:any;
    query = `&page=1&page_size=10`
    this.getFollowupList(query)
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
         this.getFollowupList(query)
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
    if(event){
     let query:any;
      query = `&page=1&page_size=10&counsellor_id=${event}`
      this.getFollowupList(query)
    } 

  }
  
  handleRefresh(event:any) {
    setTimeout(() => {
      // Any calls to load data go here
      event.target.complete();
    }, 2000);
  }
  getFollowupList(query:any){
    this.api.getFollowupListById(this.id,query).subscribe(
      (resp:any)=>{
        console.log(resp);
        this.followupDetails=resp.result[0]
        this.data = new MatTableDataSource<any>(this.followupDetails);
        this.totalNumberOfRecords = resp.total_no_of_record
        
      },
      (err:any)=>{

      }
    )
  }
  searchTermChanged(event:any) {
    let query:any;
    if(event){
      query = `&page=1&page_size=10&key=${event}`
     }else{
      query = `&page=1&page_size=10`
     }
     this.getFollowupList(query)
  }
}

