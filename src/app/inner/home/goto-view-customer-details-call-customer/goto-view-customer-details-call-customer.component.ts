import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-goto-view-customer-details-call-customer',
  templateUrl: './goto-view-customer-details-call-customer.component.html',
  styleUrls: ['./goto-view-customer-details-call-customer.component.scss'],
})
export class GotoViewCustomerDetailsCallCustomerComponent  implements OnInit {

  constructor(private router:Router,private popoverController:PopoverController) { }

  ngOnInit() {}
  close(){
    this.popoverController.dismiss();
    }
  goToDetails(){
    this.close();
    this.router.navigate(['/inner/customer-details'])
  }
}
