import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { LeadrecurringFollowupComponent } from '../leadrecurring-followup/leadrecurring-followup.component';
import { AllocationEmittersService } from '../../service/allocation-emitters.service';


@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss'],
})
export class CustomerDetailsComponent  implements OnInit {
  data: any;
 
  constructor(
    private modalController:ModalController,
    private allocate:AllocationEmittersService
  ) { }
  
  ngOnInit() {
    this.allocate.logMemberDetails.subscribe((res:any)=>{
      if(res){
        this.data = res
      }
    })
    //console.log(this.data,"DETAILS PAGE")
  }
  goBack(){
    window.history.back();
  }
 
  async recurringFollowup() {
    const modal = await this.modalController.create({
      component: LeadrecurringFollowupComponent, // Replace with your modal content page
      componentProps: {
        // You can pass data to the modal using componentProps
        key: 'value'
      }
    });
    return await modal.present();
  }
  async openAddLead() {
    const modal = await this.modalController.create({
      component: "", // Replace with your modal content page
      componentProps: {
        // You can pass data to the modal using componentProps
        key: 'value'
      }
    });
    return await modal.present();
  }
}
