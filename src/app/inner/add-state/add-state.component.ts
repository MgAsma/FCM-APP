import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PopoverController } from '@ionic/angular';
import { ApiService } from '../../service/api/api.service';
import { CommonServiceService } from '../../service/common-service.service';

@Component({
  selector: 'app-add-state',
  templateUrl: './add-state.component.html',
  styleUrls: ['./add-state.component.scss'],
})
export class AddStateComponent implements OnChanges,OnInit {
  @Input()data:any;
  addForm!:FormGroup;
  allCountry: any = [];
  country_id: any;
  constructor( private fb:FormBuilder,
              private _commonService:CommonServiceService,
              private api:ApiService,
              private popoverController:PopoverController
  ) { }
 ngOnChanges(){
  this.country_id = this.data
  console.log(this.country_id)
 }
  ngOnInit() {
    this.country_id = this.data
     console.log(this.country_id)
    this.initForm()
  }
 initForm(){
  this.addForm = this.fb.group({

    name:['',[Validators.required,Validators.pattern(this._commonService.namePattern)]],
    country_id:[this.country_id,[Validators.required]],
  })
 }
 get f() {
  return this.addForm.controls;
}

submit(){
  if(this.addForm.invalid){
    this.addForm.markAllAsTouched()
  }
  else{
    this.api.postState(this.addForm.value).subscribe(
      (resp:any)=>{
        this.addForm.reset()
        this.popoverController.dismiss('STATE')
        this.api.showSuccess(this.api.toTitleCase(resp.message))
      },
      (error:any)=>{
        //console.log(error);
         this.api.showError(this.api.toTitleCase(error.error.message))
      }
    )
  }

}
close(){
  this.popoverController.dismiss()
}


}
