import { Component, Input, OnInit } from '@angular/core';
import { SortingCard, sortingCards } from '../../../shared-modules/sample-data';
import { ModalController } from '@ionic/angular';
import { AddLeadEmitterService } from '../../../service/add-lead-emitter.service';
import { AllocationEmittersService } from '../../../service/allocation-emitters.service';
import { ApiService } from '../../../service/api/api.service';
import { BaseServiceService } from '../../../service/base-service.service';

@Component({
  selector: 'app-customer-filter',
  templateUrl: './customer-filter.component.html',
  styleUrls: ['./customer-filter.component.scss'],
})
export class CustomerFilterComponent implements OnInit {
  @Input()data:any;
  sortingCards: SortingCard[] = sortingCards;
  
  selectedStatus: any = [] ;
  submitted: boolean = false;
 
  constructor(
    private modalController:ModalController,
    private _baseService:BaseServiceService,
    private api : ApiService,
    private customerEmit:AllocationEmittersService,
    ) { }

  ngOnInit() {
    this.customerEmit.customerStatus.subscribe((res: any) => {
      this.selectedStatus = [];
      this.data.forEach((chip: any) => {
        chip.selected = false;
      });
    
      if (res.length > 0 && this.data.length > 0) {
        res.forEach((status: any) => {
          const matchingChip = this.data.find((chip: any) => chip.id === status);
          if (matchingChip) {
            matchingChip.selected = true;
            this.selectedStatus.push(status);
          
          }
        });
      }
    });
    
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
    this.customerEmit.customerStatus.next(this.selectedStatus)
    // this.modalController.dismiss();
  }
  closeModel(){
    let selectedStatus = [];
    this.customerEmit.customerStatus.subscribe((res: any) => {
      
      this.data.forEach((chip: any) => {
        chip.selected = false;
      });
    
      if (res.length > 0 && this.data.length > 0) {
        selectedStatus = res
      }
    });
    this.modalController.dismiss(selectedStatus)
  }
  onSubmit(){
    if(this.selectedStatus.length >0){
      this.submitted = true
      this.customerEmit.customerStatus.next(this.selectedStatus)
      this.modalController.dismiss();
    }else{
      this.api.showError('Please select at least one status')
    }
  }
}
