import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { environment } from '../../../environments/environment';
import { ApiService } from '../../service/api/api.service';
import { BaseServiceService } from '../../service/base-service.service';


@Component({
  selector: 'app-rec-followup-list',
  templateUrl: './rec-followup-list.page.html',
  styleUrls: ['./rec-followup-list.page.scss'],
})
export class RecFollowupListPage implements OnInit {
  followupList:any = []
  constructor(
    private modalController:ModalController,
    private _baseService:BaseServiceService,
    private api:ApiService
    ) { }

  ngOnInit() {
    this.getRecFollowupList()
  }

  close(){
    this.modalController.dismiss()
  }
  getRecFollowupList(){
    this._baseService.getData(environment.rec_follow_up).subscribe((res:any)=>{
      if(res){
        this.followupList = res.result
      }
    },((error:any)=>{
      this.api.showToast(error.error.error.message)
    }))
  }
  handleRefresh(event:any){
    setTimeout(() => {
      this.followupList = []
     this.getRecFollowupList()
      event.target.complete();
    }, 2000);
  }
}
