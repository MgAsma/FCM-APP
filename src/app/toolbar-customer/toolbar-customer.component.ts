import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
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
  constructor(
    private modalController:ModalController) { 
      
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
   
  ngOnInit() {}
  closeModal(event:any) {
    if(event){
      this.selectedCounselorIds = []
      this.modalController.dismiss();
    }  
  }
  itemClicked(item: any) {
   this.selectedCounselorIds.push(item.id)
  }
  onSubmit(){
    this.modalController.dismiss(this.selectedCounselorIds);
    this.selectedCounselorIds = []
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
  this.updateFilteredData(event);
}
getSelectedListLength(): number {
  return this.filteredData.filter(item => item.selected).length;
}
}
