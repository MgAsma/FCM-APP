import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { IonModal, ModalController } from '@ionic/angular';
import { AllocationEmittersService } from '../../../../service/allocation-emitters.service';
import { SortingCard, sortingCards, arrayOfObjects } from '../../../../shared-modules/sample-data';
import { FilterComponent } from '../filter/filter.component';
import { ToolbarCustomerComponent } from '../toolbar-customer/toolbar-customer.component';
import { AddLeadEmitterService } from '../../../../service/add-lead-emitter.service';

@Component({
  selector: 'app-tls-toolbar-top',
  templateUrl: './tls-toolbar-top.component.html',
  styleUrls: ['./tls-toolbar-top.component.scss'],
})
export class TlsToolbarTopComponent implements OnInit {

  searchBar = false
  @ViewChild('modal')modal!:IonModal
  @Input()data:any = [];
  @Input()statusList:any=[]
  sortingCards: SortingCard[] = sortingCards;
  arrayOfObjects = arrayOfObjects
  @Output()people = new EventEmitter();
  user_role: string;
  counsellor_ids: any= [];
  selectedStatus: any = [];
  constructor(
    private allocate:AllocationEmittersService,
    private modalController:ModalController,
    private addEmit:AddLeadEmitterService
    ) { 
      this.user_role = localStorage.getItem('user_role').toLowerCase()
    }

  ngOnInit() {
    this.addEmit.tlsCounsellor.subscribe((res) => {
      if (res.length > 0) {
        this.counsellor_ids = res;
      }else{
        this.counsellor_ids = [];
      }
    });
    this.allocate.tlsStatus.subscribe(
      (res: any) => {
        this.selectedStatus = res
      })
  }
  enableSearchOption(){
   this.allocate.tlsSearchBar.next(true)
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
        // //console.log('Modal data:', uniqueArray);
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

}