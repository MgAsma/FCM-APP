import { Component, OnInit } from '@angular/core';
import { Routes } from '@angular/router';
import { ModalController, Platform, PopoverController } from '@ionic/angular';
import { AddLeadPage } from './add-lead/add-lead.page';
import { App as CapacitorApp } from '@capacitor/app';
import { Storage } from '@capacitor/storage';
import { OnBreakComponent } from '../shared-modules/on-break/on-break.component';
import { MeetingComponent } from '../shared-modules/meeting/meeting.component';
@Component({
  selector: 'app-inner',
  templateUrl: './inner.page.html',
  styleUrls: ['./inner.page.scss'],
})
export class InnerPage implements OnInit {
   
  showFooter = true
  appPages= [
    {
      title: 'Home',
      url: '/inner/home',
      icon: 'home'
    },
    {
      title: 'Allocation',
      url: 'allocations',
      icon: 'information-circle'
    },
    {
      title: 'Customers',
      url: '/inner/customers',
      icon: 'people'
    },
    {
      title: 'Menu',
      url: '/inner/menu',
      icon: 'menu'
    },
  ];
  
  constructor(private modalController:ModalController,private platform: Platform,private popoverController:PopoverController) {
    this.initializeApp();

   }

  ngOnInit() {
  }
  
  async openAddLead() {
    const modal = await this.modalController.create({
      component: AddLeadPage, // Replace with your modal content page
      componentProps: {
        // You can pass data to the modal using componentProps
        key: 'value'
      }
    });
    return await modal.present();
  }
  async initializeApp() {
    await this.platform.ready();
    const breakState = await Storage.get({ key: 'break' });
    const meetingState = await Storage.get({ key: 'meeting' });
        
    if (breakState.value==="on_break" ) {
      this.openOnBreak()
    }
    else{
      if (meetingState.value==="in_meeting" ) {
        this.openMeeting()
      }

    }
  }
  async openOnBreak(){
    const popover = await this.popoverController.create({
           component: OnBreakComponent ,
           translucent: true,
           backdropDismiss: false,
          
     }
    );
    return await popover.present();
    }
    async openMeeting(){
      const popover = await this.popoverController.create({
             component: MeetingComponent ,
             translucent: true,
             backdropDismiss: false,
       }
      );
      return await popover.present();
      }
          
}
