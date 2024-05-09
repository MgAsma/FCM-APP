import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { environment } from '../../../environments/environment';
import { ApiService } from '../../service/api/api.service';
import { BaseServiceService } from '../../service/base-service.service';
import { CommonServiceService } from '../../service/common-service.service';
import { AddLeadEmitterService } from '../../service/add-lead-emitter.service';


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
  subStatus: any = [];
  referredTo:any = [];
  stat_us:any= [];
  time:any = ['Morning', 'Afternoon', 'Evening', 'Night', 'Other'];
  zone:string[] = ['South','North', 'East', 'West'];
  seasons:any = [];
  @Output() addLead = new EventEmitter()
  
  minDateAdapter: string;
  streamList: any;
  adminList: any = [];
  leadStage: any = [];
  user_id: any;
  showPicker = false;
  dateOfBirth = new Date()
  formatedDate: string;
  type = 'text'
  min:string;
  levelofProgram: any = [];
  dropdownSettings: { singleSelection: boolean; idField: string; textField: string; selectAllText: string; unSelectAllText: string; itemsShowLimit: number; allowSearchFilter: boolean; };
 
  constructor(
    private fb: FormBuilder,
    private _baseService:BaseServiceService,
    private api:ApiService,
    private _commonService:CommonServiceService,
    private _datePipe:DatePipe,
    private modalController:ModalController,
    private _addLeadEmitter:AddLeadEmitterService
   ) {
    let dob = new Date()
    let minimum = new Date('1900-01-01')
    this.minDateAdapter = this._datePipe.transform(dob,'yyyy-MM-dd')
    this.formatedDate = this._datePipe.transform(this.dateOfBirth,'dd/MM/YYYY')
    this.min = this._datePipe.transform(minimum,'yyyy-MM-dd')
    }
  dateChanged(value){
    this.addNewLead.patchValue({
      dateOfBirth:this._datePipe.transform(value,'yyyy-MM-dd')
    })
    this.showPicker = false
  }
  ngOnInit(): void {
    this.user_id = localStorage.getItem('user_id')
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
    this.getCounselor();
    this.getStream();
    this.getCounselledBy();
    this.getLeadStage()
    this.initForm()
    this.dropdownSettings = {
      singleSelection: true,
      idField: "id",
      textField: "name",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      itemsShowLimit: 1,
      allowSearchFilter: true
    };
  }
  get f() {
    return this.addNewLead.controls;
  }
  initForm(){
    this.addNewLead = this.fb.group({
      firstName: ['', [Validators.required,Validators.pattern(this._commonService.namePattern)]],
      mobile: ['', [Validators.required, Validators.pattern(this._commonService.mobilePattern)]],
      alternateNumber:['',[Validators.pattern(this._commonService.mobilePattern)]],
      email: ['', [Validators.required,Validators.pattern(this._commonService.emailPattern)]],
      dateOfBirth:[''],
      state: [''],
      zone:[''],
      cityName: [''],
      pincode:['',Validators.pattern(this._commonService.pincode)],
      countryId:[''],
      referenceName:['',Validators.pattern(this._commonService.namePattern)],
      referencePhoneNumber:['',Validators.pattern(this._commonService.mobilePattern)],
      fatherName:['',Validators.pattern(this._commonService.namePattern)],
      fatherOccupation:['',Validators.pattern(this._commonService.namePattern)],
      fatherPhoneNumber:['',Validators.pattern(this._commonService.mobilePattern)],
      tenthPercentage :['',Validators.pattern(this._commonService.nonNegativeValidator)],
      twelthPercentage :['',Validators.pattern(this._commonService.nonNegativeValidator)],
      degree:['',Validators.pattern(this._commonService.nonNegativeValidator)],
      course:[''],
      otherCourse:[''],
      entranceExam:['',Validators.pattern(this._commonService.namePattern)],
      courseLookingfor:[''],
      preferredCollege1:['',Validators.pattern(this._commonService.namePattern)],
      preferredCollege2:['',Validators.pattern(this._commonService.namePattern)],
      preferredLocation1:['',Validators.pattern(this._commonService.namePattern)],
      preferredLocation2:['',Validators.pattern(this._commonService.namePattern)],
      counsellor:['',[Validators.required]],
      counsellorAdmin:[''],
      leadSource:['',[Validators.required]],
      leadStages:['',[Validators.required]],
      levelOfProgram:[''],
      leadStatus:[''],
      notes:['',Validators.pattern(this._commonService.namePattern)],
      remarks:['',Validators.pattern(this._commonService.namePattern)]
    })
  }
  modifyType(){
    this.type = 'date'
  }
  pincodeLengthValidator(control:FormControl) {
    const value = control.value;

    if (value && value.toString().length !== 6) {
      return { invalidPincodeLength: true };
    }

    return null;
  }
  getStream(){
    this._baseService.getData(`${environment.studying_stream}`).subscribe((resp:any)=>{
    if(resp){
    this.streamList = resp
    } 
    },(error:any)=>{
      ////console.log(error);
      
    }

    )
  }
  
  getCountry(){
    this.api.getAllCountry().subscribe((res:any)=>{
      if(res.results){
        this.countryOptions = res.results.sort((a, b) => a.name.localeCompare(b.name));
      }
    },(error:any)=>{
       this.api.showToast(error?.error?.message)
      
    })
  }
  getState(){
    this.api.getAllState().subscribe((res:any)=>{
      if(res.results){
        this.stateOptions = res.results.sort((a, b) => a.name.localeCompare(b.name));
      }
    },(error:any)=>{
       this.api.showToast(error?.error?.message)
      
    })
  }
  getCity(){
    this.api.getAllCity().subscribe((res:any)=>{
      if(res.results){
        this.cityOptions = res.results.sort((a, b) => a.name.localeCompare(b.name));
      }
      else{
        this.api.showToast('ERROR')
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
      if(res){
        this.courseOptions = res;
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
        this.levelofProgram = res?.results 
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
  getCounselledBy(){
    this._baseService.getData(`${environment._user}?role_name=Admin`).subscribe((res:any)=>{
      if(res.results){
      this.adminList = res.results
      }
    },((error:any)=>{
       this.api.showError(this.api.toTitleCase(error.error.message))
    }))
  }
  getLeadStage(){
    this._baseService.getData(environment.leadStage).subscribe((res:any)=>{
     if(res){
      this.leadStage = res
     }
    },((error:any)=>{
     this.api.showError(error.error.message)
    }))
   }
  clearSelectField(fieldName: string) {
      this.addNewLead.get(fieldName)?.reset();
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
    this._addLeadEmitter.triggerGet();
  }
  closeModal(){
    this.modalController.dismiss()
    this._addLeadEmitter.triggerGet();
  }
  onSubmit(){
    let f = this.addNewLead.value;
    let data:any ={
      first_name: f['firstName'],
      last_name: "",
      email: f['email'] || null,
      mobile_number:f['mobile'],
      date_of_birth:this._datePipe.transform(f['dateOfBirth'],'YYYY-MM-dd') || null,
      alternate_mobile_number:f['alternateNumber'] || null,
      role: 5,
      created_by: this.user_id,
      refered_to: f['counsellor'],
      location:  null,
      pincode: f['pincode'] || null,
      country:f['countryId'],
      state: f['state'],
      city: f['cityName'],
      zone:f['zone'],
      reference_name:f['referenceName'],
      reference_mobile_number:f['referencePhoneNumber'] || null,
      father_name:f['fatherName'],
      father_occupation:f['fatherOccupation'],
      father_mobile_number:f['fatherPhoneNumber'] || null,
      tenth_per: f['tenthPercentage'] || null,
      twelfth_per: f['twelthPercentage'] || null,
      degree_per: f['degree'] || null,
      stream: f["course"],
      others: f["otherCourse"],
      enterance_exam: f["entranceExam"],
      course_looking_for: f["courseLookingfor"],
      level_of_program:f["levelOfProgram"],
      lead_list_status:f['leadStatus'],
      lead_list_substatus: null,
      counselled_by:f['counsellorAdmin'],
      lead_stage: f['leadStages'],
      source: f['leadSource'],
      preferance_college_and_location: 
              {
                preferred_college1: f["preferredCollege1"],
                preferred_college2: f["preferredCollege2"],
                preferred_location1: f["preferredLocation1"],
                preferred_location2: f["preferredLocation2"]
              },
      note_name:f['notes'],
      created_note_remark_by:this.user_id,
      remark_name:f['remarks']
    }
  
     data = JSON.parse(JSON.stringify(data));
     if (this.addNewLead.invalid) {
      let mandatoryFieldsEmpty = false;
      let nonMandatoryFieldsInvalid = false;
    
      // Check if any mandatory fields are empty
      const mandatoryFields = ['firstName', 'mobile', 'email', 'counsellor', 'leadSource', 'leadStages','alternateNumber'];
      mandatoryFields.forEach(field => {
        if (!this.addNewLead.get(field).value) {
          mandatoryFieldsEmpty = true;
          this.addNewLead.markAllAsTouched()
        }
      });
    
      // Check if any non-mandatory fields are invalid
      Object.keys(this.addNewLead.controls).forEach(key => {
        const control = this.addNewLead.get(key);
        if (control.invalid && !mandatoryFields.includes(key)) {
          nonMandatoryFieldsInvalid = true;
          this.addNewLead.markAllAsTouched()
        }
      });
    
      if (mandatoryFieldsEmpty && nonMandatoryFieldsInvalid) {
        this.api.showError("Please fill the mandatory fields and correct the invalid inputs.");
      } else if (mandatoryFieldsEmpty) {
        this.api.showError("Please fill the mandatory fields.");
      } else if (nonMandatoryFieldsInvalid) {
        this.api.showError("Correct the invalid inputs.");
      }
    } 
      else{
        this._baseService.postData(`${environment.lead_list}`,data).subscribe((res:any)=>{
          if(res){
            this.addLead.emit('ADD')
            this.api.showSuccess(res.message)
            this._addLeadEmitter.triggerGet();
            this.addNewLead.reset()
            this.initForm()
          }
         
        },((error:any)=>{
          this.api.showError(error?.error?.message)
        }))
      }
    }
}

