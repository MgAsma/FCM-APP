import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SortingCard, sortingCards } from '../../../shared-modules/sample-data';
import { BaseServiceService } from '../../../service/base-service.service';
import { ApiService } from '../../../service/api/api.service';
import { AllocationEmittersService } from '../../../service/allocation-emitters.service';



@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent  implements OnInit {
  @Input()data:any;
  sortingCards: SortingCard[] = sortingCards;
  
  selectedStatus: any = [] ;
  constructor(
    private modalController:ModalController,
    private _baseService:BaseServiceService,
    private api : ApiService,
    private allocationEmit:AllocationEmittersService) { }

  ngOnInit() {
    this.allocationEmit.allocationStatus.subscribe((res:any)=>{
      if(res.length == 0){
        this.selectedStatus = []
        this.data.forEach((chip:any) => {
          chip.selected = false;
        });
      }else{
        this.data.forEach((chip:any) => {
          if (chip.id == this.selectedStatus) {
            chip.selected = true;
          }
        });
      }
    },((error:any)=>{
      this.api.showToast(error.error.message)
    }))

  }
  toggleSelection(card: SortingCard): void {
    card.selected = !card.selected;
  }
  // toggleChipSelection(item: any) {
  //   let id:any = []
  //   this.data.forEach((chip:any) => {
  //     if (chip !== item) {
  //       chip.selected = false;
  //     }
  //   });

  //   // Toggle the 'selected' property of the clicked chip
  //   item.selected = !item.selected;
  //   id.push(item.id)
  //   if(item.id){
  //     this.selectedStatus = id
  //   }
    
  // }
  toggleChipSelection(item: any) {
    // Toggle the 'selected' property of the clicked chip
    item.selected = !item.selected;
  
    // Update the selectedStatus array based on the selected items
    this.selectedStatus = this.data.filter(chip => chip.selected).map(selectedChip => selectedChip.id);
    
  }
  
  selectedColumn: string = 'Selected Users'; // By default, 'Selected Users' is selected

  selectColumn(column: string) {
    this.selectedColumn = column;
  }
  reset() {
    this.data.forEach(chip => chip.selected = false);
    this.selectedStatus = [];
    this.allocationEmit.allocationStatus.next(this.selectedStatus)
    // this.modalController.dismiss();
  }
  closeModel(){
    this.modalController.dismiss();
  }
  onSubmit(){
    this.allocationEmit.allocationStatus.next(this.selectedStatus)
    this.modalController.dismiss();
  }
}
