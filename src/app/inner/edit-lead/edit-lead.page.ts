import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { environment } from '../../../environments/environment';
import { ApiService } from '../../service/api/api.service';
import { BaseServiceService } from '../../service/base-service.service';
import { CommonServiceService } from '../../service/common-service.service';
import { AddLeadEmitterService } from '../../service/add-lead-emitter.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-edit-lead',
  templateUrl: './edit-lead.page.html',
  styleUrls: ['./edit-lead.page.scss'],
})
export class EditLeadPage implements OnInit {
   _inputData: any;
  showPicker: boolean = false;
  @Input() set data(value:any){
    this._inputData = value;
    console.log(this._inputData,"ssdgdgg")
  }
  editLead!: FormGroup;
 
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
  zone:string[] = ['South','North', 'East', 'West'];
  seasons:any = [];
  @Output() addLead = new EventEmitter()
  minDateAdapter: string;
  streamList: any;
  adminList: any = [];
  leadStage: any = [];
  user_id: any;
 
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
    this.minDateAdapter = this._datePipe.transform(dob,'yyyy-MM-dd')
    }
    dateChanged(value){
      this.editLead.patchValue({
        dateOfBirth:this._datePipe.transform(value,'yyyy-MM-dd')
      })
      this.showPicker = false
    }
  ngOnInit(): void {
    this.user_id = sessionStorage.getItem('user_id')
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
    this.getLeadById()
  }
  get f() {
    return this.editLead.controls;
  }
  getLeadById() {
    this._baseService.getByID(`${environment.lead_list}${this._inputData.user_data.id}/`).subscribe(
      (res: any) => {
        if (res && res.result && res.result.length > 0) {
          const lead = res.result[0];
          this.editLead.patchValue({
            firstName: lead.user_data.first_name,
            mobile: lead.user_data.mobile_number,
            alternateNumber: lead.alternate_mobile_number,
            email: lead.user_data.email,
            dateOfBirth: lead.date_of_birth,
            state: lead.state,
            zone: lead.zone,
            course:lead.stream,
            cityName: lead.city,
            pincode: lead.pincode,
            countryId: lead.country,
            referenceName: lead.reference_name,
            referencePhoneNumber: lead.reference_mobile_number,
            fatherName: lead.father_name,
            fatherOccupation: lead.father_occupation,
            fatherPhoneNumber: lead.father_mobile_number,
            tenthPercentage: lead.tenth_per,
            twelthPercentage: lead.twelfth_per,
            degree: lead.degree_per,
            otherCourse: lead.others,
            entranceExam: lead.enterance_exam,
            courseLookingfor: lead.course_looking_for_id,
            preferredCollege1: lead.preferred_college1,
            preferredCollege2: lead.preferred_college2,
            preferredLocation1: lead.preferred_location1,
            preferredLocation2: lead.preferred_location2,
            counsellor: lead.referred_to,
            counsellorAdmin: lead.counselled_by,
            leadSource: lead.source,
            leadStages: lead.lead_stage,
            leadStatus: lead.lead_list_status,
            notes: lead.note_name,
            remarks: lead.remark_name
          });
        }
      },
      (error) => {
        this.api.showError(error.error.message);
      }
    );
  }
  initForm(){
    this.editLead = this.fb.group({
      firstName: ['', [Validators.required,Validators.pattern(this._commonService.namePattern)]],
      mobile: ['', [Validators.required, Validators.pattern(this._commonService.mobilePattern)]],
      alternateNumber:['',[Validators.required,Validators.pattern(this._commonService.mobilePattern),this.notSameAsMobileValidator('mobile')]],
      email: ['', [Validators.required,Validators.pattern(this._commonService.emailPattern)]],
      dateOfBirth:[''],
      state: [''],
      zone:[''],
      cityName: [''],
      pincode:['',Validators.pattern(this._commonService.pincode)],
      countryId:[''],
      referenceName:[''],
      referencePhoneNumber:['',Validators.pattern(this._commonService.mobilePattern)],
      fatherName:[''],
      fatherOccupation:[''],
      fatherPhoneNumber:['',Validators.pattern(this._commonService.mobilePattern)],
      tenthPercentage :['',Validators.pattern(this._commonService.nonNegativeValidator)],
      twelthPercentage :['',Validators.pattern(this._commonService.nonNegativeValidator)],
      degree:['',Validators.pattern(this._commonService.nonNegativeValidator)],
      course:[''],
      otherCourse:[''],
      entranceExam:[''],
      courseLookingfor:[''],
      preferredCollege1:[''],
      preferredCollege2:[''],
      preferredLocation1:[''],
      preferredLocation2:[''],
      counsellor:['',[Validators.required]],
      counsellorAdmin:[''],
      leadSource:['',[Validators.required]],
      leadStages:['',[Validators.required]],
      leadStatus:[''],
      notes:[''],
      remarks:['']
    })
  }
   
  notSameAsMobileValidator(mobileControlName: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const mobile = control.root.get(mobileControlName)?.value;
      const alternateNumber = control.value;
      return mobile === alternateNumber ? { sameAsMobile: true } : null;
    };
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
      //console.log(error);
      
    }

    )
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
      this.editLead.get(fieldName)?.reset();
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
    this._addLeadEmitter.triggerGet();
  }
  onSubmit(){
  
  const formData = this.editLead.value;
  let data ={
    first_name: formData.firstName,
    last_name:"",
    email: formData.email,
    mobile_number: formData.mobile ,
    date_of_birth: this._datePipe.transform(formData.dateOfBirth,'YYYY-MM-dd') || null,
    alternate_mobile_number: formData.alternateNumber || null,
    role: 5,
    location:  formData.cityName,
    pincode: formData.pincode || null,
    country: formData.countryId,
    state: formData.state, 
    city: formData.cityName, 
    zone: formData.zone,
    lead_list_status: formData.leadStatus,
    lead_list_substatus: 1,
    counselled_by: formData.counsellorAdmin,
    lead_stage: formData.leadStages,
    updated_by:this.user_id,
    note: formData.notes,
    remark: formData.remarks,
    source: formData.leadSource,
    refered_to: formData.counsellor,
    education_details: {
    tenth_per: formData.tenthPercentage || null,
    twelfth_per: formData.twelthPercentage || null,
    degree_per: formData.degree || null,
    stream: formData.course,
    others: formData.otherCourse,
    enterance_exam: formData.entranceExam,
    course_looking_for: formData.courseLookingfor,
      preferance_college_and_location: 
        {
          preferred_college1: formData.preferredCollege1,
          preferred_college2: formData.preferredCollege2,
          preferred_location1: formData.preferredLocation1,
          preferred_location2: formData.preferredLocation2
        }
      
    },
    additional_info: {
      reference_name: formData.referenceName,
      reference_mobile_number:formData.referencePhoneNumber,
      father_name: formData.fatherName,
      father_occupation: formData.fatherOccupation,
      father_mobile_number: formData.fatherPhoneNumber
    }
  }

   data = JSON.parse(JSON.stringify(data));
   if (this.editLead.invalid) {
    let mandatoryFieldsEmpty = false;
    let nonMandatoryFieldsInvalid = false;
  
    // Check if any mandatory fields are empty
    const mandatoryFields = ['firstName', 'mobile', 'email', 'counsellor', 'leadSource', 'leadStages','alternateNumber'];
    mandatoryFields.forEach(field => {
      if (!this.editLead.get(field).value) {
        mandatoryFieldsEmpty = true;
        this.editLead.markAllAsTouched()
      }
    });
  
    // Check if any non-mandatory fields are invalid
    Object.keys(this.editLead.controls).forEach(key => {
      const control = this.editLead.get(key);
      if (control.invalid && !mandatoryFields.includes(key)) {
        nonMandatoryFieldsInvalid = true;
        this.editLead.markAllAsTouched()
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
      this._baseService.updateData(`${environment.lead_list}/${this._inputData.user_data.id}/`,data).subscribe((res:any)=>{
        if(res){
          this.addLead.emit('ADD')
          this.api.showSuccess(res.message)
          this._addLeadEmitter.triggerGet();
          this.initForm()
          this.modalController.dismiss()
        }
       
      },((error:any)=>{
        this.api.showError(error?.error?.message)
      }))
    }
  }
  
}
