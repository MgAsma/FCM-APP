import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';

import { App as CapacitorApp } from '@capacitor/app';
import { Storage } from '@capacitor/storage';
import { ApiService } from '../../../service/api/api.service';
import { OnBreakComponent } from '../../../shared-modules/on-break/on-break.component';

@Component({
  selector: 'app-start-break',
  templateUrl: './start-break.component.html',
  styleUrls: ['./start-break.component.scss'],
})
export class StartBreakComponent  implements OnInit {

  breakForm!:FormGroup;
  id:any;
  lastLoginDate:any;

  constructor(private popoverController:PopoverController,private api:ApiService,private _fb:FormBuilder,private router:Router) { }

  ngOnInit(): void {
    this.id=localStorage.getItem('user_id')
    this.lastLoginDate=localStorage.getItem('lastLoginDate')
    this.initForm()
  }
  initForm(){
    this.breakForm = this._fb.group({
      user:['' ,[Validators.required]],
      status:['' ,[Validators.required]],

    })
  }
  close(){
    this.popoverController.dismiss();
    }
    break(){
      this.breakForm.patchValue({user:this.id})
      this.breakForm.patchValue({status:1})

      console.log(this.breakForm.value);
      
      if(this.breakForm.invalid){
        console.log("Invalid");	
      }
      else{
        this.api.showLoading()
        this.api.break(this.breakForm.value).subscribe(
        (resp:any)=>{
          this.api.loaderDismiss()
          this.close()
          Storage.set({ key: 'break', value: 'on_break' });
          this.openOnBreak()
          this.api.showToast('Break started Successfully!')
  
        },
        (error:any)=>{
          this.api.loaderDismiss()
          this.api.showToast(error.error.message)
         
        }
        )
      }
      }
      async openOnBreak(){
        const popover = await this.popoverController.create({
               component: OnBreakComponent ,
               translucent: true,
               backdropDismiss: false,
              
         }
        );
        return await popover.present();
        }
}

