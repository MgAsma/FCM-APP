import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PopoverController } from '@ionic/angular';
import { ApiService } from '../../service/api/api.service';
import { CommonServiceService } from '../../service/common-service.service';

@Component({
  selector: 'app-add-city',
  templateUrl: './add-city.component.html',
  styleUrls: ['./add-city.component.scss'],
})
export class AddCityComponent implements  OnInit {
  @Input()data:any;
  addForm!:FormGroup;
  allState: any = [];
  state_id: any;
  constructor( private fb:FormBuilder,
              private _commonService:CommonServiceService,
              private api:ApiService,
              private popoverController:PopoverController
  ) { }

  ngOnInit() {
    this.state_id = this.data
    this.getState()
    this.initForm();
  }
 initForm(){
  this.addForm = this.fb.group({
    name:['',[Validators.required,Validators.pattern(this._commonService.namePattern)]],
    state_id:[this.state_id,[Validators.required]],
  })
 }
 get f() {
  return this.addForm.controls;
}
getState(){
  this.api.getAllState().subscribe(
    (resp:any)=>{
      this.allState=resp.results
    },
    (error:any)=>{

    }
    
  )
}
submit(){
  if(this.addForm.invalid){
    this.addForm.markAllAsTouched();
  }
  else{
    this.api.postCity(this.addForm.value).subscribe(
      (resp:any)=>{
        this.popoverController.dismiss('CITY')
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
