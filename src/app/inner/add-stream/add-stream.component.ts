import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../service/api/api.service';
import { BaseServiceService } from '../../service/base-service.service';
import { CommonServiceService } from '../../service/common-service.service';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-add-stream',
  templateUrl: './add-stream.component.html',
  styleUrls: ['./add-stream.component.scss'],
})
export class AddStreamComponent implements OnInit {
  addForm: any;
 

  constructor(  private _fb:FormBuilder,
    private api:ApiService,
    private baseService:BaseServiceService,
    private _commonService:CommonServiceService,
    private popoverController:PopoverController,
  ) { }

  ngOnInit() {
    this.initForm()
  }
  initForm(){
    this.addForm = this._fb.group({
      stream_name:['',[Validators.required,Validators.pattern(this._commonService.namePattern)]],
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
      this.baseService.postData(`${environment.studying_stream}`,this.addForm.value).subscribe(
        (resp:any)=>{
          this.popoverController.dismiss("STREAM")
          this.api.showSuccess(this.api.toTitleCase(resp.message))
        },
        (error:any)=>{
           this.api.showError(this.api.toTitleCase(error.error.message))
        }
      )
    }

  }
close(){
  this.popoverController.dismiss()
}


}
