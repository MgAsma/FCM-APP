import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';


import { AlertController, IonModal, ModalController } from '@ionic/angular';
import { SortingCard, arrayOfObjects, sortingCards } from '../../../shared-modules/sample-data';
import { AllocationEmittersService } from '../../../service/allocation-emitters.service';
import { FilterComponent } from '../filter/filter.component';
import { ToolbarCustomerComponent } from '../toolbar-customer/toolbar-customer.component';
import { CallPermissionsService } from '../../../service/api/call-permissions.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';


@Component({
  selector: 'app-toolbar-top',
  templateUrl: './toolbar-top.component.html',
  styleUrls: ['./toolbar-top.component.scss'],
})
export class ToolbarTopComponent  implements OnInit {
  searchBar = false
  @ViewChild('modal')modal!:IonModal
  @Input()data:any = [];
  @Input()statusList:any=[]
  sortingCards: SortingCard[] = sortingCards;
  arrayOfObjects = arrayOfObjects
  @Output()people = new EventEmitter();
  user_role: string;
  constructor(private allocate:AllocationEmittersService,private modalController:ModalController,private callPermissionService:CallPermissionsService,private alertController:AlertController) {
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

  isToggled:boolean=false;

  
evValue:boolean;
  setValue1(event: MatSlideToggleChange){
    let prevVal=this.isToggled;
    this.enbaleAutoDiallingWarning(prevVal);
    this.isToggled=event.source.checked;
    console.log(event);
    
    console.log(this.evValue);
    
    
    
 
  }


  
  
  


  async enbaleAutoDiallingWarning(ischecked:any) {
    return new Promise(async (resolve) => {
      const confirm = await this.alertController.create({
      header: 'Begin Auto Dialler',
    
      message: this.isToggled? 'Do you want to disable Auto Dialling ? ':'Do you want to enable Auto Dialling ?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              
             this.isToggled=ischecked;
             this.callPermissionService.dataSubject.next(this.isToggled)
             return resolve(ischecked)
              
            },
          },
          {
            text: 'OK',
            handler: () => {

             this.isToggled=!ischecked;
             this.callPermissionService.dataSubject.next(this.isToggled)
              return resolve(!ischecked);
            },
          },
        ],
      });

      await confirm.present();
    });
  }




}
