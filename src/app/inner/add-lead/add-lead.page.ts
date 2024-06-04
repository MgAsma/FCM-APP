import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ModalController, PopoverController } from '@ionic/angular';
import { environment } from '../../../environments/environment';
import { ApiService } from '../../service/api/api.service';
import { BaseServiceService } from '../../service/base-service.service';
import { CommonServiceService } from '../../service/common-service.service';
import { AddLeadEmitterService } from '../../service/add-lead-emitter.service';
import { IonModal } from '@ionic/angular';
import { AddCountryComponent } from '../add-country/add-country.component';
import { AddStateComponent } from '../add-state/add-state.component';
import { AddCityComponent } from '../add-city/add-city.component';
import { AddStreamComponent } from '../add-stream/add-stream.component';
import { AddCourseLookingForComponent } from '../add-course-looking-for/add-course-looking-for.component';
@Component({
  selector: 'app-add-lead',
  templateUrl: './add-lead.page.html',
  styleUrls: ['./add-lead.page.scss'],
})
export class AddLeadPage implements OnInit {
  @ViewChild('modal', { static: true }) modalC!: IonModal;
  @ViewChild('modal2', { static: true }) modalC2!: IonModal;
  @ViewChild('modal3', { static: true }) modalC3!: IonModal;
  addNewLead!: FormGroup;
  
  isOpen = false;
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
  @Input()pageTitle;
  minDateAdapter: string;
  streamList: any;
  adminList: any = [];
  leadStage: any = [];
  user_id: any;
  showPicker = false;
  dateOfBirth = new Date()
  formatedDate: string;
  type = 'text';
  min:string;
  dropDownSelect:boolean = false
  levelofProgram: any = [];
  selectedCountry: any;
  selectedState: any;
  selectedCity: any;
  user_role: string;
  // dropdownSettings1:any;
  // dropdownSettings2:any;
  // dropdownSettings3:any;
 
  // @ViewChild('countryDropdown') countryDropdown: any;
  // @ViewChild('stateDropdown') stateDropdown: any;
  // @ViewChild('cityDropdown') cityDropdown: any;
  selectedCountryName: any;
  selectedCountryId: any;
  selectedStateName:any;
  selectedStateId:any;
  selectedCityName:any;
  selectedCityId:any;
  constructor(
    private fb: FormBuilder,
    private _baseService:BaseServiceService,
    private api:ApiService,
    private _commonService:CommonServiceService,
    private _datePipe:DatePipe,
    private modalController:ModalController,
    private _addLeadEmitter:AddLeadEmitterService,
    private popoverController:PopoverController
   ) {
    this.user_id = localStorage.getItem('user_id')
    this.user_role = localStorage.getItem('user_role')?.toUpperCase()
    let dob = new Date()
    let minimum = new Date('1900-01-01')
    this.minDateAdapter = this._datePipe.transform(dob,'yyyy-MM-dd')
    this.formatedDate = this._datePipe.transform(this.dateOfBirth,'dd/MM/YYYY')
    this.min = this._datePipe.transform(minimum,'yyyy-MM-dd')
    }
    countrySelectionChanged(event){
      this.selectedCountryId = event?.[0]['id']
      this.selectedCountryName = event?.[0]['name']
      this.addNewLead.patchValue({
        countryId:this.selectedCountryId
      })
      this.model2Close(event)
      this.model3Close(event)
      this.getState(this.selectedCountryName, this.countryOptions);
      this.modalC.dismiss();
    }
    stateSelectionChanged(event){
      this.selectedStateId = event?.[0]['id']
      this.selectedStateName = event?.[0]['name']
      this.addNewLead.patchValue({
        state:this.selectedStateId
      })
      this.model3Close(event)
      this.getCity(this.selectedStateName, this.stateOptions)
      this.modalC2.dismiss();
    }
    citySelectionChanged(event){
      this.selectedCityId = event?.[0]['id']
      this.selectedCityName = event?.[0]['name']
      this.addNewLead.patchValue({
        cityName:this.selectedCityId
      })
      this.modalC3.dismiss();
    }
    modelClose(event){
      this.selectedCountryId = ''
      this.selectedCountryName = ''
      this.addNewLead.patchValue({
        countryId:null
      })
      this.modalC.dismiss();
    }
    model2Close(event){
      this.selectedStateId = ''
      this.selectedStateName = ''
      this.addNewLead.patchValue({
        state:null
      })
      this.modalC2.dismiss();
    }
    model3Close(event){
      this.selectedCityId = ''
      this.selectedCityName = ''
      this.addNewLead.patchValue({
        cityName:null
      })
      this.modalC3.dismiss();
    }
  dateChanged(value){
    this.addNewLead.patchValue({
      dateOfBirth:this._datePipe.transform(value,'yyyy-MM-dd')
    })
    this.showPicker = false
  }
  

  

  ngOnInit(): void {
    this.user_id = localStorage.getItem('user_id').toUpperCase()
    // this.dropdownSettings1 = {
    //   singleSelection: true,
    //   idField: "id",
    //   textField: "name",
    //   selectAllText: "Select All",
    //   unSelectAllText: "UnSelect All",
    //   itemsShowLimit: 1,
    //   closeDropDownOnSelection:true,
    //   closeDropDownOnClick:true,
    //   allowSearchFilter: true
    // };
    // this.dropdownSettings2 = {
    //   singleSelection: true,
    //   idField: "id",
    //   textField: "name",
    //   selectAllText: "Select All",
    //   unSelectAllText: "UnSelect All",
    //   itemsShowLimit: 1,
    //   allowSearchFilter: true
    // };
    // this.dropdownSettings3 = {
    //   singleSelection: true,
    //   idField: "id",
    //   textField: "name",
    //   selectAllText: "Select All",
    //   unSelectAllText: "UnSelect All",
    //   itemsShowLimit: 1,
    //   allowSearchFilter: true
    // };
    this.getCountry();
    //this.getState();
    this.getChannel();
    this.getSource();
    //this.getCity();
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
  }
  initForm(){
    this.addNewLead = this.fb.group({
      firstName: ['', [Validators.required,Validators.pattern(this._commonService.namePattern)]],
      mobile: ['', [Validators.required, Validators.pattern(this._commonService.mobilePattern)]],
      alternateNumber:['',[Validators.pattern(this._commonService.mobilePattern)]],
      email: ['', [Validators.pattern(this._commonService.emailPattern)]],
      dateOfBirth:[''],
      countryId:[''],
      state: [''],
      zone:[''],
      cityName: [''],
      pincode:['',[Validators.pattern(this._commonService.pincode)]],
      referenceName:['',[Validators.pattern(this._commonService.namePattern)]],
      referencePhoneNumber:['',[Validators.pattern(this._commonService.mobilePattern)]],
      fatherName:['',[Validators.pattern(this._commonService.namePattern)]],
      fatherOccupation:['',[Validators.pattern(this._commonService.namePattern)]],
      fatherPhoneNumber:['',[Validators.pattern(this._commonService.mobilePattern)]],
      tenthPercentage :['',[Validators.pattern(this._commonService.nonNegativeValidator)]],
      twelthPercentage :['',[Validators.pattern(this._commonService.nonNegativeValidator)]],
      degree:['',[Validators.pattern(this._commonService.nonNegativeValidator)]],
      course:[''],
      otherCourse:[''],
      entranceExam:['',[Validators.pattern(this._commonService.namePattern)]],
      courseLookingfor:[''],
      preferredCollege1:['',[Validators.pattern(this._commonService.namePattern)]],
      preferredCollege2:['',[Validators.pattern(this._commonService.namePattern)]],
      preferredLocation1:['',[Validators.pattern(this._commonService.namePattern)]],
      preferredLocation2:['',[Validators.pattern(this._commonService.namePattern)]],
      counsellor:['',[Validators.required]],
      counsellorAdmin:[''],
      leadSource:[''],
      levelOfProgram:['']
    })
  }
  get f() {
    return this.addNewLead.controls;
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
   toTitleCase(str: string): string {
    return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }
  getCountry(){
    this.api.getAllCountry().subscribe((res:any)=>{
      if(res.results){
        this.countryOptions = res.results.map((item: any) => ({
          ...item,
          name: this.toTitleCase(item.name)
        })).sort((a: any, b: any) => a.name.localeCompare(b.name));
      }
    },(error:any)=>{
       this.api.showToast(error?.error?.message)
      
    })
  }
  getState(event,countryOptions){
    let selectedCountryName:any;
    if(event && countryOptions.length >0){
    //  countryOptions.forEach((f:any)=>{
    //   if(f.id == event.id){
    //     selectedCountryName = f.name
    //   }
      
    // })
    selectedCountryName = event
    }
    
    let country = selectedCountryName
      let params = `?country_name=${country}`
   
    this.api.getAllState(params).subscribe((res:any)=>{
      if(res.results){
        this.stateOptions = res.results.map((item: any) => ({
          ...item,
          name: this.toTitleCase(item.name)
        })).sort((a: any, b: any) => a.name.localeCompare(b.name));
      }
    },(error:any)=>{
       this.api.showToast(error?.error?.message)
      
    })
  }
 
  getCity(event,stateOptions){
    let selectedStateName:any;
    if(event && stateOptions.length >0){
      selectedStateName = event
    }
    
    let state = selectedStateName
      let params = `?state_name=${state}`
   
    this.api.getAllCity(params).subscribe((res:any)=>{
      if(res.results){
        this.cityOptions = res.results.map((item: any) => ({
          ...item,
          name: this.toTitleCase(item.name)
        })).sort((a: any, b: any) => a.name.localeCompare(b.name));
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
    let query = ""
    const counsellorRoles = ['COUNSELLOR', 'COUNSELOR'];
      const superAdminRoles = ['SUPERADMIN', 'SUPER ADMIN'];
      const adminRoles = ['ADMIN'];
    
      if (counsellorRoles.includes(this.user_role)) {
       query = `?user_id=${this.user_id}`
      } else if (superAdminRoles.includes(this.user_role)) {
        query = ``
      } else if (adminRoles.includes(this.user_role)) {
        query = `?user_id=${this.user_id}`
      } 
    this._baseService.getData(`${environment._user}${query}`).subscribe((res:any)=>{
      if(res.results){
      this.referredTo = res.results
      }
    },((error:any)=>{
       this.api.showToast(error?.error?.message)
    }))
  }
  getCounselledBy(){
    let query = `?role_name=superadmin`
    
    this._baseService.getData(`${environment._user}${query}`).subscribe((res:any)=>{
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
  
  async addCountry() {
    const modal = await this.popoverController.create({
      component: AddCountryComponent, // Replace with your modal content page
      componentProps: {
        // You can pass data to the modal using componentProps
        // key: "value",
        // data: allocate,
      },
    });
    await modal.present();
    const data  = await modal.onDidDismiss();
    if(data){
      this.getCountry()
    }
  }
  async addCity() {
    const modal = await this.popoverController.create({
      component: AddCityComponent, // Replace with your modal content page
      componentProps: {
        // You can pass data to the modal using componentProps
        // key: "value",
        data: this.selectedStateId,
      },
    });
    await modal.present();
    const data  = await modal.onDidDismiss();
    if(data){
      this.getCity(this.selectedStateName,this.stateOptions)
    }
  }
  async addState() {
    const modal = await this.popoverController.create({
      component: AddStateComponent, // Replace with your modal content page
      componentProps: {
        // You can pass data to the modal using componentProps
        //key: "value",
        data: this.selectedCountryId,
      },
    });
    await modal.present();
    const data  = await modal.onDidDismiss();
    if(data){
      this.getState(this.selectedCountryName,this.countryOptions)
    }
  }
  async addStream() {
    const modal = await this.popoverController.create({
      component: AddStreamComponent, // Replace with your modal content page
      componentProps: {
        // You can pass data to the modal using componentProps
        //key: "value",
        //data: '',
      },
    });
    await modal.present();
    const data  = await modal.onDidDismiss();
    if(data){
      this.getStream()
    }
  }
  async addCourseLookingFor(){
    const modal = await this.popoverController.create({
      component: AddCourseLookingForComponent, // Replace with your modal content page
      componentProps: {
        // You can pass data to the modal using componentProps
        //key: "value",
        //data: '',
      },
    });
    await modal.present();
    const data  = await modal.onDidDismiss();
    if(data){
      this.getCourse();
    }
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
      country:f['countryId'] || null,
      state: f['state'] || null,
      city: f['cityName'] || null,
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
      course_looking_for: f["courseLookingfor"] || [],
      lead_list_substatus: null,
      counselled_by:f['counsellorAdmin'],
      source: f['leadSource'],
      level_of_program:f['levelOfProgram'],
      preferance_college_and_location: 
              {
                preferred_college1: f["preferredCollege1"],
                preferred_college2: f["preferredCollege2"],
                preferred_location1: f["preferredLocation1"],
                preferred_location2: f["preferredLocation2"]
              },
      created_note_remark_by:this.user_id,
    }
     data = JSON.parse(JSON.stringify(data));
     if (this.addNewLead.invalid) {
      let mandatoryFieldsEmpty = false;
      let nonMandatoryFieldsInvalid = false;
    
      // Check if any mandatory fields are empty
      const mandatoryFields = ['firstName', 'mobile', 'counsellor'];
      mandatoryFields.forEach(field => {
        if (!this.addNewLead.get(field).value) {
          mandatoryFieldsEmpty = true;
          this.addNewLead.markAllAsTouched()
        }
      });
    
      // Check if any non-mandatory fields are invalid
      Object.keys(this.addNewLead.controls).forEach(key => {
        const control = this.addNewLead.get(key);
        if (control.invalid && !mandatoryFields.includes(key)|| control.invalid && mandatoryFields.includes(key)) {
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

