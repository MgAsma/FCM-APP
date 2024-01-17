import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { LeadrecurringFollowupComponent } from '../leadrecurring-followup/leadrecurring-followup.component';


@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss'],
})
export class CustomerDetailsComponent  implements OnInit {

  constructor(private modalController:ModalController) { }

  ngOnInit() {}
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
