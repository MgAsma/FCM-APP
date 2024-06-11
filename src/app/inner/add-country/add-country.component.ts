import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonServiceService } from '../../service/common-service.service';
import { ApiService } from '../../service/api/api.service';
import { PopoverController } from '@ionic/angular';


@Component({
  selector: 'app-add-country',
  templateUrl: './add-country.component.html',
  styleUrls: ['./add-country.component.scss'],
})
export class AddCountryComponent implements OnInit {
addCountryForm!:FormGroup;
  constructor( private fb:FormBuilder,
              private _commonService:CommonServiceService,
              private api:ApiService,
              private popoverController:PopoverController
  ) { }

  ngOnInit() {
    this.initForm()
  }
 initForm(){
  this.addCountryForm = this.fb.group({

    name:['',[Validators.required,Validators.pattern(this._commonService.namePattern)]]
  })
 }
 get f() {
  return this.addCountryForm.controls;
}
submit(){
  if(this.addCountryForm.invalid){
   this.addCountryForm.markAllAsTouched();
   this.api.showError('Please select any one country');
  }
  else{
    this.api.postCountry(this.addCountryForm.value).subscribe(
      (resp:any)=>{
        this.addCountryForm.reset()
        this.popoverController.dismiss('COUNTRY')
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
