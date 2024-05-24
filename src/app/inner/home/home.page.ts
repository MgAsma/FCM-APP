import { AfterViewInit, Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { CheckoutComponent } from './checkout/checkout.component';
import { StartBreakComponent } from './start-break/start-break.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit,AfterViewInit {
userName:any = ''
  user_role: string;
  constructor(private popoverController:PopoverController) {
  }
  ngAfterViewInit(): void {
    this.userName=localStorage.getItem('username')
    this.user_role=localStorage.getItem('user_role')
  }

  ngOnInit() {
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
