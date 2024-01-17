import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { environment } from '../../../environments/environment';
import { ApiService } from '../../service/api/api.service';
import { BaseServiceService } from '../../service/base-service.service';
import { CommonServiceService } from '../../service/common-service.service';


@Component({
  selector: 'app-add-lead',
  templateUrl: './add-lead.page.html',
  styleUrls: ['./add-lead.page.scss'],
})
export class AddLeadPage implements OnInit {
  addNewLead!: FormGroup;
 
  countryOptions:any = [];
  stateOptions:any = [];
  cityOptions:any = [];
  newChannelOptions:any = [];
  channels:any = [];
  sources:any = [];
  priorities:any = [];
  departmentOptions:any = [];
  courseOptions:any = [];
  yearOfPassingOptions:any = [];
  campaignOptions:any = [];
  mediumOptions:any = [];
  levelOfProgramOptions:any = [];
  subStatus: any = [];
  referredTo:any = [];
  stat_us:any= [];
  time:any = ['Morning', 'Afternoon', 'Evening', 'Night', 'Other'];
  seasons:any = [];
  @Output() addLead = new EventEmitter()
  userId:any;
  constructor(
    private fb: FormBuilder,
    private _baseService:BaseServiceService,
    private api:ApiService,
    private _commonService:CommonServiceService,
    private _datePipe:DatePipe,
   private modalController:ModalController
   ) {
      
    }

  ngOnInit(): void {
    this.userId = localStorage.getItem('user_id')
    this.getCountry();
    this.getState();
    this.getChannel();
    this.getSource();
    this.getCity();
    this.getCampign();
    this.getNewChannel();
    this.getDepartment();
    this.getCourse();
    //this.getLocation();
    this.getMedium();
    this.getLevelOfProgram();
    this.getPriority();
    this.getStatus();
    this.getSubStatus();
    this.getSeason();
    this.getCounselor()
    this.initForm()
   }
  get f() {
    return this.addNewLead.controls;
  }
 initForm(){
  this.addNewLead = this.fb.group({
    firstName: ['', [Validators.required,Validators.pattern(this._commonService.namePattern)]],
    lastName: ['',[Validators.pattern(this._commonService.namePattern)]],
    email: ['', [ Validators.required,Validators.email]],
    mobile: ['', [ Validators.required,Validators.pattern(this._commonService.mobilePattern)]],
    dateOfBirth:['',[]],
    highestQualification: [''],
    callTime:[''],
    campaignName: [''],
    season: [''],
    channel: [''],
    source: [''],
    priority: [''],
    referredTo: [''],
    status:[''],
    subStatus:[''],
    department: [''],
    course: [''],
    location: [''],
    yearOfPassing: [''],
    primaryNumber:['',[Validators.pattern(this._commonService.mobilePattern)]],
    fathersNumber:['',[Validators.pattern(this._commonService.mobilePattern)]],
    mothersNumber:['',[Validators.pattern(this._commonService.mobilePattern)]],
    alternateNumber:['',[Validators.pattern(this._commonService.mobilePattern)]],
    primaryEmail:['',[Validators.email]],
    alternateEmail:['',[Validators.email]],
    fathersEmail:['',[Validators.email]],
    mothersEmail:['',[Validators.email]],
    countryId: [''],
    state: [''],
    cityName: [''],
    newChannel: [''],
    campaign: [''],
    medium: [''],
    levelOfProgram: [''],
  });
 }
 
  
  getCountry(){
    this.api.getAllCountry().subscribe((res:any)=>{
      if(res.results){
      this.countryOptions = res.results
      }
    },(error:any)=>{
       this.api.showToast(error?.error?.message)
      
    })
  }
  getState(){
    this.api.getAllState().subscribe((res:any)=>{
      if(res.results){
        this.stateOptions = res.results
      }
    },(error:any)=>{
       this.api.showToast(error?.error?.message)
      
    })
  }
  getChannel(){
    this.api.getAllChannel().subscribe((resp:any)=>{
      if(resp.results){
        this.channels= resp.results;
      }
      else{
        this.api.showToast('ERROR')
      }  
    },(error:any)=>{
       this.api.showToast(error?.error?.message)
      
    }

    )
  }
  getSource(){
    this.api.getAllSource().subscribe((res:any)=>{
     if(res.results){
      this.sources = res.results
     }
     else{
      this.api.showToast('ERROR')
     }
    },(error:any)=>{
       this.api.showToast(error?.error?.message)
      
    })
  }
  getCity(){
    this.api.getAllCity().subscribe((res:any)=>{
      if(res.results){
        this.cityOptions = res.results;
      }
      else{
        this.api.showToast('ERROR')
       }
      },(error:any)=>{
         this.api.showToast(error?.error?.message)
        
      })
  }
  getCampign(){
    this.api.getAllCampign().subscribe((res:any)=>{
      if(res.results){
        this.campaignOptions = res.results;
      }
      else{
        this.api.showToast('ERROR')
       }
      },(error:any)=>{
         this.api.showToast(error?.error?.message)
        
      })
  }
  getNewChannel(){
    this.api.getAllNewChannel().subscribe((res:any)=>{
      if(res.results){
        this.newChannelOptions = res.results;
      }
      else{
        this.api.showToast('ERROR')
       }
      },(error:any)=>{
         this.api.showToast(error?.error?.message)
        
      })
  }
  getDepartment(){
    this.api.getAllDepartment().subscribe((res:any)=>{
      if(res.results){
        this.departmentOptions = res.results;
      }
      else{
        this.api.showToast('ERROR')
       }
      },(error:any)=>{
         this.api.showToast(error?.error?.message)
        
      })
  }
  getCourse(){
    this.api.getAllCourse().subscribe((res:any)=>{
      if(res.results){
        this.courseOptions = res.results;
      }
      else{
        this.api.showToast('ERROR')
       }
      },(error:any)=>{
         this.api.showToast(error?.error?.message)
        
      })
    
  }
  getMedium(){
    this.api.getAllMedium().subscribe((res:any)=>{
      if(res.results){
        this.mediumOptions = res.results
      } else{
        this.api.showToast('ERROR')
       }
      },(error:any)=>{
         this.api.showToast(error?.error?.message)
    })
  }
  getLevelOfProgram(){
    this.api.getAllLevelOfProgram().subscribe((res:any)=>{
      if(res.results){
        this.levelOfProgramOptions = res.results 
      } else{
        this.api.showToast('ERROR')
       }
      },(error:any)=>{
         this.api.showToast(error?.error?.message)
    })
  }
  getPriority(){
    this._baseService.getData(environment.lead_priority).subscribe((res:any)=>{
        if(res.results){
          this.priorities = res.results
        } else{
          this.api.showToast('ERROR')
         }
        },(error:any)=>{
           this.api.showToast(error?.error?.message)
      })
  }
  getStatus(){
   this._baseService.getData(`${environment.lead_status}`).subscribe((res:any)=>{
    if(res.results){
      this.stat_us = res.results;
    }
   },(error:any)=>{
     this.api.showToast(error?.error?.message)
   })
  }
  getSubStatus(){
    this._baseService.getData(`${environment.lead_subStatus}`).subscribe((res:any)=>{
      if(res.results){
        this.subStatus = res.results;
      }
     },(error:any)=>{
       this.api.showToast(error?.error?.message)
     })
  }
  getSeason(){
    this._baseService.getData(environment.lead_season).subscribe((res:any)=>{
      if(res.results){
        this.seasons = res.results
      } else{
        this.api.showToast('ERROR')
       }
      },(error:any)=>{
         this.api.showToast(error?.error?.message)
    })
  }
  getCounselor(){
    this._baseService.getData(`${environment._user}/?role_name=counsellor`).subscribe((res:any)=>{
      if(res.results){
      this.referredTo = res.results
      }
    },((error:any)=>{
       this.api.showToast(error?.error?.message)
    }))
  }
  
  clearSelectField(fieldName: string) {
      this.addNewLead.get(fieldName)?.reset();
  }
  onSubmit(){
    
  let f = this.addNewLead.value;
  let data: any = {
    user_data: {
      first_name: f.firstName,
      last_name: f.lastName,
      email: f.email,
      mobile_number: f.mobile,
      role: 5,
    },
    created_by:this.userId,
    updated_by:this.userId,
    higest_qualification: f.highestQualification || undefined,
    campaign_name: f.campaignName || undefined,
    season_id:f.season || undefined,
    channel_id:f.channel || undefined,
    source_id:f.source || undefined,
    priority_id:f.priority || undefined,
    refered_to_id:f.referredTo || undefined,
    lead_list_status_id:f.status || undefined,
    lead_list_substatus_id:f.subStatus || undefined,
    department_id:f.department || undefined,
    date_of_birth:this._datePipe.transform(f.dateOfBirth,'YYYY-MM-dd')|| undefined,
    course_id:f.course || undefined,
    location: f.location || undefined,
    year_of_passing:f.yearOfPassing || undefined,
    best_time_to_call:f.callTime || undefined,
    country_id:f.countryId || undefined,
    state_id:f.state || undefined,
    city_id:f.cityName || undefined,
    role_id:5,
    new_channel_id:f.newChannel || undefined,
    campaign_id:f.campaign || undefined,
    medium_id:f.medium || undefined,
    level_of_program_id:f.levelOfProgram || undefined,
    status:f.status || undefined,
    lead_contact: {
      alternate_phone_number: f.alternateNumber || undefined,
      primary_phone_number: f.primaryNumber || undefined,
      father_phone_number: f.fathersNumber || undefined,
      mother_phone_number: f.mothersNumber || undefined,
      alternate_email: f.alternateEmail || undefined,
      primary_email: f.primaryEmail || undefined,
      father_email: f.fathersEmail || undefined,
      mother_email: f.mothersEmail || undefined,
    },
  };

data = JSON.parse(JSON.stringify(data));
    if(this.addNewLead.invalid){
      this.addNewLead.markAllAsTouched()
    }
    else{
      this._baseService.postData(environment.lead_list,data).subscribe((res:any)=>{
        if(res){
          this.addLead.emit('ADD')
          this.api.showToast(res.message)
          this.initForm()
        }
        else{
          this.api.showToast("ERROR !")
        }
      },((error:any)=>{
        this.api.showToast(error?.error?.message)
      }))
    }
  }
  step = 0;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }
  close(){
    this.modalController.dismiss()
  }
  closeModal(){
    this.modalController.dismiss()
  }
}

