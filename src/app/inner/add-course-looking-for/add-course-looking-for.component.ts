import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../service/api/api.service';
import { FormBuilder, Validators } from '@angular/forms';
import { CommonServiceService } from '../../service/common-service.service';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-add-course-looking-for',
  templateUrl: './add-course-looking-for.component.html',
  styleUrls: ['./add-course-looking-for.component.scss'],
})
export class AddCourseLookingForComponent implements OnInit {
  addForm: any;

  constructor(
    private _fb:FormBuilder,
    private api:ApiService,
    private _commonService:CommonServiceService,
    private popoverController:PopoverController
    ) { }

  ngOnInit() {
    this.initForm()
  }

  initForm(){
    this.addForm = this._fb.group({
      course_name:['',[Validators.required,Validators.pattern(this._commonService.namePattern)]],
    })
  }
  submit(){
    if(this.addForm.invalid){
     this.addForm.markAllAsTouched()
    }
    else{
      this.api.postCourse(this.addForm.value).subscribe(
        (resp:any)=>{
          this.popoverController.dismiss('COURSE')
          this.api.showSuccess(this.api.toTitleCase(resp.message))
        },
        (error:any)=>{
          //console.log(error);
           this.api.showError(this.api.toTitleCase(error.error.message))
        }
      )
    }

  }
  get f() {
    return this.addForm.controls;
  }
  close(){
    this.popoverController.dismiss()
  }
}
