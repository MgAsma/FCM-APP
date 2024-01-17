import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { sortingCards, SortingCard,arrayOfObjects } from '../sample-data';
import { AllocationEmittersService } from '../../service/allocation-emitters.service';
import { ApiService } from '../../service/api/api.service';
import { BaseServiceService } from '../../service/base-service.service';


@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent  implements OnInit {
  @Input()data:any;
  sortingCards: SortingCard[] = sortingCards;
  
  selectedStatus: any ;
  constructor(
    private modalController:ModalController,
    private _baseService:BaseServiceService,
    private api : ApiService,
    private allocationEmit:AllocationEmittersService) { }

  ngOnInit() {
    console.log(this.data,'DATA')
  }
  toggleSelection(card: SortingCard): void {
    card.selected = !card.selected;
  }
  toggleChipSelection(item: any) {
    let id:any = []
    this.data.forEach((chip:any) => {
      if (chip !== item) {
        chip.selected = false;
      }
    });

    // Toggle the 'selected' property of the clicked chip
    item.selected = !item.selected;
    id.push(item.id)
    if(item.id){
      this.selectedStatus = item.id
    }
    
  }
 
  selectedColumn: string = 'Selected Users'; // By default, 'Selected Users' is selected

  selectColumn(column: string) {
    this.selectedColumn = column;
  }
  closeModal() {
    this.allocationEmit.filterStatus.next(this.selectedStatus)
    this.selectedStatus = '';
    // console.log(this.allocationEmit.filterStatus,this.selectedStatus)
    this.modalController.dismiss();
  }
  
}
