import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CustomerToolbarCounsellorComponent } from '../customer-toolbar-counsellor/customer-toolbar-counsellor.component';
import { CustomerFilterComponent } from '../customer-filter/customer-filter.component';
import { AllocationEmittersService } from '../../../service/allocation-emitters.service';
import { IonModal, ModalController } from '@ionic/angular';
import { SortingCard, sortingCards, arrayOfObjects } from '../../../shared-modules/sample-data';

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
   this.allocate.searchBar.next(true)
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
      component: CustomerToolbarCounsellorComponent, 
      componentProps: {
        key: 'value',
        data:this.data
      }
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        let uniqueArray = Array.from(new Set(dataReturned.data));
        // //console.log('Modal data:', uniqueArray);
        this.people.emit(uniqueArray) 
      }

    });
  
    return await modal.present();
  }
  async openFilter() {
    const modal = await this.modalController.create({
      component: CustomerFilterComponent, 
      componentProps: {
        key: 'value',
        data:this.statusList
      }
    });
    return await modal.present();
   
  }
}
