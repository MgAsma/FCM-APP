import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { IonModal, ModalController, AlertController } from '@ionic/angular';
import { AllocationEmittersService } from '../../../service/allocation-emitters.service';
import { CallPermissionsService } from '../../../service/api/call-permissions.service';
import { SortingCard, sortingCards, arrayOfObjects } from '../../../shared-modules/sample-data';
import { ToolbarCustomerComponent } from '../../allocations/toolbar-customer/toolbar-customer.component';
import { FilterComponent } from '../../home/filter/filter.component';

@Component({
  selector: 'app-customer-toolbar-top',
  templateUrl: './customer-toolbar-top.component.html',
  styleUrls: ['./customer-toolbar-top.component.scss'],
})
export class CustomerToolbarTopComponent implements OnInit {
  searchBar = false
  @ViewChild('modal')modal!:IonModal
  @Input()data:any = [];
  @Input()statusList:any=[]
  sortingCards: SortingCard[] = sortingCards;
  arrayOfObjects = arrayOfObjects
  @Output()people = new EventEmitter();
  user_role: string;
  constructor(private allocate:AllocationEmittersService,private modalController:ModalController) {
    this.user_role= localStorage.getItem('user_role').toLowerCase()
   }

  ngOnInit() {}
  enableSearchOption(){
   this.allocate.customerSearchBar.next(true)
  }
  toggleSelection(card: SortingCard): void {
    card.selected = !card.selected;
  }
  toggleChipSelection(item: any) {
    item.selected = !item.selected;
  }
  selectedColumn: string = 'Selected Users'; // By default, 'Selected Users' is selected

  selectColumn(column: string) {
    this.selectedColumn = column;
  }

  async openModal() {
    const modal = await this.modalController.create({
      component: ToolbarCustomerComponent, 
      componentProps: {
        key: 'value',
        data:this.data
      }
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        let uniqueArray = Array.from(new Set(dataReturned.data));
        this.people.emit(uniqueArray) 
      }

    });
  
    return await modal.present();
  }
  async openFilter() {
    const modal = await this.modalController.create({
      component: FilterComponent, 
      componentProps: {
        key: 'value',
        data:this.statusList
      }
    });
    return await modal.present();
   
  }

  isToggled:boolean=false;

  

}
