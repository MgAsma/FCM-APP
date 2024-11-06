import { Component, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';

import { Router } from '@angular/router';
import { RecFollowupListPage } from '../../shared-modules/rec-followup-list/rec-followup-list.page';
import { CheckoutComponent } from '../home/checkout/checkout.component';
import { StartBreakComponent } from '../home/start-break/start-break.component';
import { CallPermissionsService } from '../../service/api/call-permissions.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  constructor(private modalController:ModalController,private router:Router,private popoverController:PopoverController,private  callPermissionService:CallPermissionsService ) { }

  ngOnInit() {
    if (this.router.url.includes("/inner/menu")) {
      this.callPermissionService.isToggleddataSubject.next(false)
    }
  }
  
  async recurringFollowupList() {
    const modal = await this.modalController.create({
      component: RecFollowupListPage, 
      componentProps: {
        key: 'value',
        data:''
      }
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        //console.log('Modal data:', dataReturned.data);
      }

    });
  
    return await modal.present();
  }
  goTo(data:any){
    this.router.navigate([`/inner/home/${data}`])
  }
  async openCheckout(){
    const popover = await this.popoverController.create({
           component: CheckoutComponent ,
           translucent: true,
           backdropDismiss: false,
          
     }
    );
    return await popover.present();
    }
  async openStartBreak(){
    const popover = await this.popoverController.create({
           component: StartBreakComponent ,
           translucent: true,
           backdropDismiss: false,
          
     }
    );
    return await popover.present();
    }
}
