import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../service/api/api.service';


@Component({
  selector: 'app-open-followups',
  templateUrl: './open-followups.component.html',
  styleUrls: ['./open-followups.component.scss'],
})
export class OpenFollowupsComponent  implements OnInit {
  id:any;
  followupDetails:any=[]
  constructor(private api:ApiService) { 
    this.id=localStorage.getItem('user_id')
  }

  ngOnInit() {
    this.getFollowupCount()
  }

  getFollowupCount(){
    this.api.getOpenFollowup(this.id).subscribe(
      (resp:any)=>{
        this.followupDetails=resp.results.follow_up_status
      },
      (error:any)=>{
       this.api.showToast(error?.error.message)
      }
    )
  }
}
