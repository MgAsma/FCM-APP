import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { Router } from '@angular/router';
import { RecFollowupListPage } from '../../shared-modules/rec-followup-list/rec-followup-list.page';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  constructor(private modalController:ModalController,private router:Router ) { }

  ngOnInit() {
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
        console.log('Modal data:', dataReturned.data);
      }

    });
  
    return await modal.present();
  }
  goTo(data:any){
    this.router.navigate([`/inner/home/${data}`])
  }
}
