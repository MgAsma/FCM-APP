import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddLeadEmitterService } from '../../../service/add-lead-emitter.service';
import { ApiService } from '../../../service/api/api.service';
// import { userData } from '../shared-modules/sample-data';
// import { BaseServiceService } from '../service/base-service.service';
// import { environment } from 'src/environments/environment';
// import { ApiService } from '../service/api/api.service';
@Component({
  selector: 'app-toolbar-customer',
  templateUrl: './toolbar-customer.component.html',
  styleUrls: ['./toolbar-customer.component.scss'],
})
export class ToolbarCustomerComponent  implements OnInit {
  count = 0;
  placeholderText="Search by Name"
  counselor: any = [];
  term:any;
  filteredData: any = [];
  private _inputData: any;
  selectedCounselorIds: any = [];
 
  submitted: boolean = false;
  searchTerm: any;
  
  constructor(
    private modalController:ModalController,
    private addEmit:AddLeadEmitterService,
    private api:ApiService) { 
      
    }
    @Input()set data(data: any) {
      this.filteredData = data; // Assigning input data to private variable
      if(data.length>0){
        this.filteredData.forEach(element => {
          element.selected = false
        });
      }
      this._inputData = data;
    }
   
  ngOnInit() {
   
    this.addEmit.customerCounsellor.subscribe((res:any)=>{
      this.selectedCounselorIds = [];
      this.filteredData.forEach((chip: any) => {
        chip.selected = false;
      });
    
      if (res.length > 0 && this.filteredData.length > 0) {
        res.forEach((status: any) => {
          const matchingChip = this.filteredData.find((chip: any) => chip.id === status);
          if (matchingChip) {
            matchingChip.selected = true;
            this.selectedCounselorIds.push(status);
          }
        });
      }
    })
  }
  resetModal() {
  this.selectedCounselorIds = []
  this.addEmit.customerCounsellor.next([])
    this.filteredData.forEach((chip: any) => {
      chip.selected = false;
    });
   
  }
  // itemClicked(item: any) {
  //   this.selectedCounselorIds.push(item.id)
  //   this.filteredData.forEach((chip: any,i) => {
  //     if(chip.id == this.selectedCounselorIds[i]){
  //       chip.selected = true
  //     }else{
  //       chip.selected = false
  //     }
      
  //   });
  
  // }
  itemClicked(item: any) {
    const index = this.filteredData.findIndex((chip: any) => chip.id === item.id);
  
    if (index !== -1) {
      // Toggle the selected property of the clicked item
      this.filteredData[index].selected = !this.filteredData[index].selected;
  
      if (this.filteredData[index].selected) {
        // If the item is selected, add its id to the array
        if (!this.selectedCounselorIds.includes(item.id)) {
          this.selectedCounselorIds.push(item.id);
        }
      } else {
        // If the item is deselected, remove its id from the array
        this.selectedCounselorIds = this.selectedCounselorIds.filter(id => id !== item.id);
      }
    }
  }
  
  
  onSubmit(){
    if(this.selectedCounselorIds.length > 0){
      this.submitted = true
      this.modalController.dismiss(this.selectedCounselorIds);
      this.addEmit.customerCounsellor.next(this.selectedCounselorIds)
    }else{
      this.api.showError('Please select at least one counselor')
    }
  }
  handleRefresh(event: any) {
    setTimeout(() => {
      this.addEmit.customerCounsellor.subscribe((res:any)=>{
        this.selectedCounselorIds = [];
        this.filteredData.forEach((chip: any) => {
          chip.selected = false;
        });
      })
      this.searchTerm = ''
      this.searchTermChanged(this.searchTerm)
      event.target.complete();
    }, 2000);
  }
 // Filter function to update the displayed list based on search term
 updateFilteredData(event:any) {
  if (event === '') {
    this.filteredData = this._inputData; 
  } else {
    this.filteredData = this._inputData.filter((item:any) =>
      item.first_name.toLowerCase().includes(event.toLowerCase())
    );
  }
}

// This function will be called when the search term changes
searchTermChanged(event:any) {
   // Remove trailing spaces from the search term
  this.searchTerm = event.trim();
   this.updateFilteredData(this.searchTerm);
}
getSelectedListLength(): number {
  return this.selectedCounselorIds.length;
}
closePopup(){
  let selectedIds = [];
  this.addEmit.customerCounsellor.subscribe((res:any)=>{
    this.filteredData.forEach((chip: any) => {
      chip.selected = false;
    });
  
    if (res.length > 0 && this.filteredData.length > 0) {
     selectedIds = res;
    }
  })
  this.modalController.dismiss(selectedIds)
}
}
