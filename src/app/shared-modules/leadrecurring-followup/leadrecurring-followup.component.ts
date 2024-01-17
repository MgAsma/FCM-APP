import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { environment } from '../../../environments/environment';
import { ApiService } from '../../service/api/api.service';
import { BaseServiceService } from '../../service/base-service.service';
import { CommonServiceService } from '../../service/common-service.service';


@Component({
  selector: 'app-leadrecurring-followup',
  templateUrl: './leadrecurring-followup.component.html',
  styleUrls: ['./leadrecurring-followup.component.scss'],
})
export class LeadrecurringFollowupComponent  implements OnInit {
 recurringForm!:FormGroup;
 date = new Date()
  constructor(
    private modalController:ModalController,
    private fb:FormBuilder,
    private commonService:CommonServiceService,
    private baseService:BaseServiceService,
    private api:ApiService,
    private datePipe:DatePipe
    ) { }

  ngOnInit() {
    this.initForm()
  }
  initForm(){
    this.recurringForm = this.fb.group({
      recurringPeriod:['',[Validators.required]],
      note:['']
    })
  }
  closeModal() {
    this.modalController.dismiss();
  }
  get f() {
    return this.recurringForm.controls;
   }
   createRecurringFollowUp(){
    if(this.recurringForm.invalid){
      this.api.showToast('Invalid Form')
      this.recurringForm.markAllAsTouched()
    }else{
      let formData = this.recurringForm.value
      let data = {
        no_of_days: formData.recurringPeriod,
        user_id:30,
        start_date:this.datePipe.transform(this.date,"YYYY-MM-dd'T'HH:mm:ss"),
        notes:formData.note
      }
      this.baseService.postData(`${environment.rec_follow_up}`,data).subscribe((res:any)=>{
        if(res){
          this.api.showToast('Recurring followup created successfully')
          this.closeModal()
        }
      },
      ((error:any)=>{
        this.api.showToast(error.error.error.message)
      }))
    }
    
   }
}
