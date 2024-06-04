import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { IonModal, ModalController, PopoverController } from "@ionic/angular";
import { environment } from "../../../environments/environment";
import { ApiService } from "../../service/api/api.service";
import { BaseServiceService } from "../../service/base-service.service";
import { CommonServiceService } from "../../service/common-service.service";
import { AddLeadEmitterService } from "../../service/add-lead-emitter.service";
import { DatePipe } from "@angular/common";
import { CallPermissionsService } from "../../service/api/call-permissions.service";
import { AddCityComponent } from "../add-city/add-city.component";
import { AddCountryComponent } from "../add-country/add-country.component";
import { AddStateComponent } from "../add-state/add-state.component";
import { AddCourseLookingForComponent } from "../add-course-looking-for/add-course-looking-for.component";
import { AddStreamComponent } from "../add-stream/add-stream.component";
@Component({
  selector: "app-edit-lead",
  templateUrl: "./edit-lead.page.html",
  styleUrls: ["./edit-lead.page.scss"],
})
export class EditLeadPage implements OnInit {
  @ViewChild("modal", { static: true }) modalC!: IonModal;
  @ViewChild("modal2", { static: true }) modalC2!: IonModal;
  @ViewChild("modal3", { static: true }) modalC3!: IonModal;
  _inputData: any;
  showPicker: boolean = false;
  min: string;
  levelofProgram: any = [];
  tagId: any;
  user_role: string;
  lead: any;
  selectedCountryId: any;
  selectedCountryName: any;

  selectedStateId: any;
  selectedStateName: any;

  selectedCityId: any;
  selectedCityName: any;

  @Input() set data(value: any) {
    this._inputData = value;
  }
  editLead!: FormGroup;

  countryOptions: any = [];
  stateOptions: any = [];
  cityOptions: any = [];
  newChannelOptions: any = [];
  channels: any = [];
  sources: any = [];
  priorities: any = [];
  departmentOptions: any = [];
  courseOptions: any = [];
  yearOfPassingOptions: any = [];
  campaignOptions: any = [];
  mediumOptions: any = [];
  subStatus: any = [];
  referredTo: any = [];
  stat_us: any = [];
  time: any = ["Morning", "Afternoon", "Evening", "Night", "Other"];
  zone: string[] = ["South", "North", "East", "West"];
  seasons: any = [];
  @Output() addLead = new EventEmitter();
  minDateAdapter: string;
  streamList: any;
  adminList: any = [];
  leadStage: any = [];
  user_id: any;
 
  constructor(
    private fb: FormBuilder,
    private _baseService: BaseServiceService,
    private api: ApiService,
    private _commonService: CommonServiceService,
    private _datePipe: DatePipe,
    private modalController: ModalController,
    private _addLeadEmitter: AddLeadEmitterService,
    private callPermissionService: CallPermissionsService,
    private popoverController: PopoverController
  ) {
    let dob = new Date();
    let minimum = new Date("1900-01-01");
    this.minDateAdapter = this._datePipe.transform(dob, "yyyy-MM-dd");
    this.min = this._datePipe.transform(minimum, "yyyy-MM-dd");
    this.user_role = localStorage.getItem("user_role")?.toUpperCase();
    this.user_id = localStorage.getItem("user_id");
    this.getCountry();
    // this.getState();
    this.getChannel();
    this.getSource();
    // this.getCity();
    this.getCampign();
    this.getNewChannel();
    this.getDepartment();
    this.getCourse();
    this.getMedium();
    this.getLevelOfProgram();
    this.getPriority();
    this.getStatus();
    this.getSubStatus();
    this.getSeason();
    this.getCounselor();
    this.getStream();
    this.getCounselledBy();
    this.getLeadStage();
    this.initForm();
  }
  dateChanged(value) {
    this.editLead.patchValue({
      dateOfBirth: this._datePipe.transform(value, "yyyy-MM-dd"),
    });
    this.showPicker = false;
  }
  ngOnInit(): void {
    this.getLeadById();
  }

  get f() {
    return this.editLead.controls;
  }
  getLeadById() {
    this._baseService
      .getByID(`${environment.lead_list}${this._inputData.user_data.id}/`)
      .subscribe(
        (res: any) => {
          if (res && res.result && res.result.length > 0) {
            this.lead = res.result[0];
            let courseId = [];
            if (this.lead.course_looking_for?.length > 0) {
              courseId = this.lead.course_looking_for.map((m: any) => m.id);
            }
            this.getCountry();

            this.api.getAllCity().subscribe((res: any) => {
              if (res.results) {
                this.cityOptions = res.results;
                if (this.cityOptions.length > 0) {
                  this.getState(this.lead.country_name, this.countryOptions);
                }
              }
            });
            this.api.getAllState().subscribe((res: any) => {
              if (res.results) {
                this.stateOptions = res.results;

                this.getCity(this.lead.state_name, this.stateOptions);
              }
            });

            this.selectedCountryId = this.lead.country;
            this.selectedCityId = this.lead.city;
            this.selectedStateId = this.lead.state;

            this.selectedCountryName = this.lead.country_name;
            this.selectedCityName = this.lead.city_name;
            this.selectedStateName = this.lead.state_name;

            this.editLead.patchValue({
              firstName: this.lead.user_data?.first_name ?? "",
              mobile: this.lead.user_data?.mobile_number ?? "",
              alternateNumber: this.lead.alternate_mobile_number ?? "",
              email: this.lead.user_data?.email ?? "",
              dateOfBirth: this.lead.date_of_birth ?? "",
              state: this.lead.state ?? "",
              zone: this.lead.zone ?? "",
              course: this.lead.stream ?? "",
              cityName: this.lead.city ?? "",
              pincode: this.lead.pincode ?? "",
              countryId: this.lead.country ?? "",
              referenceName: this.lead.reference_name ?? "",
              referencePhoneNumber: this.lead.reference_mobile_number ?? "",
              fatherName: this.lead.father_name ?? "",
              fatherOccupation: this.lead.father_occupation ?? "",
              fatherPhoneNumber: this.lead.father_mobile_number ?? "",
              tenthPercentage: this.lead.tenth_per ?? "",
              twelthPercentage: this.lead.twelfth_per ?? "",
              degree: this.lead.degree_per ?? "",
              otherCourse: this.lead.others ?? "",
              entranceExam: this.lead.enterance_exam ?? "",
              courseLookingfor: courseId ?? "",
              levelOfProgram: this.lead.level_of_program ?? "",
              preferredCollege1: this.lead.preferred_college1 ?? "",
              preferredCollege2: this.lead.preferred_college2 ?? "",
              preferredLocation1: this.lead.preferred_location1 ?? "",
              preferredLocation2: this.lead.preferred_location2 ?? "",
              counsellor: this.lead.referred_to ?? "",
              counsellorAdmin: this.lead.counselled_by ?? "",
              leadSource: this.lead.source ?? "",
              leadStages: this.lead.lead_stage ?? "",
              leadStatus: this.lead.lead_list_status ?? "",
              notes: this.lead.note_name ?? "",
              remarks: this.lead.remark_name ?? "",
            });
          }
        },
        (error) => {
          this.api.showError(error.error.message);
        }
      );
  }
  initForm() {
    this.editLead = this.fb.group({
      firstName: [
        "",
        [
          Validators.required,
          Validators.pattern(this._commonService.namePattern),
        ],
      ],
      mobile: [
        "",
        [
          Validators.required,
          Validators.pattern(this._commonService.mobilePattern),
        ],
      ],
      alternateNumber: [
        "",
        [Validators.pattern(this._commonService.mobilePattern)],
      ],
      email: ["", [Validators.pattern(this._commonService.emailPattern)]],
      dateOfBirth: [""],
      state: [""],
      zone: [""],
      cityName: [""],
      countryId: [""],
      pincode: ["", Validators.pattern(this._commonService.pincode)],
      referenceName: ["", Validators.pattern(this._commonService.namePattern)],
      referencePhoneNumber: [
        "",
        Validators.pattern(this._commonService.mobilePattern),
      ],
      fatherName: ["", Validators.pattern(this._commonService.namePattern)],
      fatherOccupation: [
        "",
        Validators.pattern(this._commonService.namePattern),
      ],
      fatherPhoneNumber: [
        "",
        Validators.pattern(this._commonService.mobilePattern),
      ],
      tenthPercentage: [
        "",
        Validators.pattern(this._commonService.nonNegativeValidator),
      ],
      twelthPercentage: [
        "",
        Validators.pattern(this._commonService.nonNegativeValidator),
      ],
      degree: [
        "",
        Validators.pattern(this._commonService.nonNegativeValidator),
      ],
      course: [""],
      otherCourse: [""],
      entranceExam: ["", Validators.pattern(this._commonService.namePattern)],
      courseLookingfor: [""],
      levelOfProgram: [""],
      preferredCollege1: [
        "",
        Validators.pattern(this._commonService.namePattern),
      ],
      preferredCollege2: [
        "",
        Validators.pattern(this._commonService.namePattern),
      ],
      preferredLocation1: [
        "",
        Validators.pattern(this._commonService.namePattern),
      ],
      preferredLocation2: [
        "",
        Validators.pattern(this._commonService.namePattern),
      ],
      counsellor: ["", [Validators.required]],
      counsellorAdmin: [""],
      leadSource: [""],
      leadStages: [""],
      leadStatus: ["", [Validators.required]],
      notes: [
        "",
        [
          Validators.required,
          Validators.pattern(this._commonService.namePattern),
        ],
      ],
      // remarks:['',Validators.pattern(this._commonService.namePattern)]
    });
  }
  pincodeLengthValidator(control: FormControl) {
    const value = control.value;

    if (value && value.toString().length !== 6) {
      return { invalidPincodeLength: true };
    }

    return null;
  }
  getStream() {
    this._baseService.getData(`${environment.studying_stream}`).subscribe(
      (resp: any) => {
        if (resp) {
          this.streamList = resp;
        }
      },
      (error: any) => {
        ////console.log(error);
      }
    );
  }
  countrySelectionChanged(event) {
    this.selectedCountryId = event?.[0]["id"];
    this.selectedCountryName = event?.[0]["name"];
    this.editLead.patchValue({
      countryId: this.selectedCountryId,
    });

    this.getState(this.selectedCountryName, this.countryOptions);
    this.selectedStateId = "";
    this.selectedStateName = "";
    this.selectedCityId = "";
    this.selectedCityName = "";
    this.editLead.patchValue({
      state: null,
      cityName: null,
    });
    this.modalC.dismiss();
  }
  stateSelectionChanged(event) {
    this.selectedStateId = event?.[0]["id"];
    this.selectedStateName = event?.[0]["name"];
    this.editLead.patchValue({
      state: this.selectedStateId,
    });

    this.selectedCityId = "";
    this.selectedCityName = "";
    this.editLead.patchValue({
      cityName: null,
    });
    this.getCity(this.selectedStateName, this.stateOptions);
    this.modalC2.dismiss();
  }
  citySelectionChanged(event) {
    this.selectedCityId = event?.[0]["id"];
    this.selectedCityName = event?.[0]["name"];
    this.editLead.patchValue({
      cityName: this.selectedCityId,
    });
    this.modalC3.dismiss();
  }
  modelClose(event) {
    this.selectedCountryId = "";
    this.selectedCountryName = "";
    this.editLead.patchValue({
      countryId: null,
    });
    this.modalC.dismiss();
  }
  model2Close(event) {
    this.selectedStateId = "";
    this.selectedStateName = "";
    this.editLead.patchValue({
      state: null,
    });
    this.modalC2.dismiss();
  }
  model3Close(event) {
    this.selectedCityId = "";
    this.selectedCityName = "";
    this.editLead.patchValue({
      cityName: null,
    });
    this.modalC3.dismiss();
  }

  toTitleCase(str: string): string {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
  getCountry() {
    this.api.getAllCountry().subscribe(
      (res: any) => {
        if (res.results) {
          this.countryOptions = res.results
            .map((item: any) => ({
              ...item,
              name: this.toTitleCase(item.name),
            }))
            .sort((a: any, b: any) => a.name.localeCompare(b.name));
        }
      },
      (error: any) => {
        this.api.showToast(error?.error?.message);
      }
    );
  }
  getState(event, countryOptions) {
    let selectedCountryName: any;
    if (event && countryOptions.length > 0) {
      selectedCountryName = event;
    }

    let country = selectedCountryName;
    let params = `?country_name=${country}`;
    this.api.getAllState(params).subscribe(
      (res: any) => {
        if (res.results) {
          this.stateOptions = res.results
            .map((item: any) => ({
              ...item,
              name: this.toTitleCase(item.name),
            }))
            .sort((a: any, b: any) => a.name.localeCompare(b.name));
        }
      },
      (error: any) => {
        this.api.showToast(error?.error?.message);
      }
    );
  }
  getCity(event, stateOptions) {
    let selectedStateName: any;
    if (event && stateOptions.length > 0) {
      selectedStateName = event;
    }

    let state = selectedStateName;
    let params = `?state_name=${state}`;

    this.api.getAllCity(params).subscribe(
      (res: any) => {
        if (res.results) {
          this.cityOptions = res.results
            .map((item: any) => ({
              ...item,
              name: this.toTitleCase(item.name),
            }))
            .sort((a: any, b: any) => a.name.localeCompare(b.name));
        }
      },
      (error: any) => {
        this.api.showToast(error?.error?.message);
      }
    );
    return this.cityOptions;
  }
  getChannel() {
    this.api.getAllChannel().subscribe(
      (resp: any) => {
        if (resp.results) {
          this.channels = resp.results;
        } else {
          this.api.showToast("ERROR");
        }
      },
      (error: any) => {
        this.api.showToast(error?.error?.message);
      }
    );
  }
  getSource() {
    this.api.getAllSource().subscribe(
      (res: any) => {
        if (res.results) {
          this.sources = res.results;
        } else {
          this.api.showToast("ERROR");
        }
      },
      (error: any) => {
        this.api.showToast(error?.error?.message);
      }
    );
  }

  getCampign() {
    this.api.getAllCampign().subscribe(
      (res: any) => {
        if (res.results) {
          this.campaignOptions = res.results;
        } else {
          this.api.showToast("ERROR");
        }
      },
      (error: any) => {
        this.api.showToast(error?.error?.message);
      }
    );
  }
  getNewChannel() {
    this.api.getAllNewChannel().subscribe(
      (res: any) => {
        if (res.results) {
          this.newChannelOptions = res.results;
        } else {
          this.api.showToast("ERROR");
        }
      },
      (error: any) => {
        this.api.showToast(error?.error?.message);
      }
    );
  }
  getDepartment() {
    this.api.getAllDepartment().subscribe(
      (res: any) => {
        if (res.results) {
          this.departmentOptions = res.results;
        } else {
          this.api.showToast("ERROR");
        }
      },
      (error: any) => {
        this.api.showToast(error?.error?.message);
      }
    );
  }
  getCourse() {
    this.api.getAllCourse().subscribe(
      (res: any) => {
        if (res) {
          this.courseOptions = res;
        } else {
          this.api.showToast("ERROR");
        }
      },
      (error: any) => {
        this.api.showToast(error?.error?.message);
      }
    );
  }
  getMedium() {
    this.api.getAllMedium().subscribe(
      (res: any) => {
        if (res.results) {
          this.mediumOptions = res.results;
        } else {
          this.api.showToast("ERROR");
        }
      },
      (error: any) => {
        this.api.showToast(error?.error?.message);
      }
    );
  }
  getLevelOfProgram() {
    this.api.getAllLevelOfProgram().subscribe(
      (res: any) => {
        if (res.results) {
          this.levelofProgram = res.results;
        } else {
          this.api.showToast("ERROR");
        }
      },
      (error: any) => {
        this.api.showToast(error?.error?.message);
      }
    );
  }
  getPriority() {
    this._baseService.getData(environment.lead_priority).subscribe(
      (res: any) => {
        if (res.results) {
          this.priorities = res.results;
        } else {
          this.api.showToast("ERROR");
        }
      },
      (error: any) => {
        this.api.showToast(error?.error?.message);
      }
    );
  }
  getStatus() {
    this._baseService.getData(`${environment.lead_status}`).subscribe(
      (res: any) => {
        if (res.results) {
          this.stat_us = res.results;
        }
      },
      (error: any) => {
        this.api.showToast(error?.error?.message);
      }
    );
  }
  getSubStatus() {
    this._baseService.getData(`${environment.lead_subStatus}`).subscribe(
      (res: any) => {
        if (res.results) {
          this.subStatus = res.results;
        }
      },
      (error: any) => {
        this.api.showToast(error?.error?.message);
      }
    );
  }
  getSeason() {
    this._baseService.getData(environment.lead_season).subscribe(
      (res: any) => {
        if (res.results) {
          this.seasons = res.results;
        } else {
          this.api.showToast("ERROR");
        }
      },
      (error: any) => {
        this.api.showToast(error?.error?.message);
      }
    );
  }
  getCounselor() {
    let query = "";
    const counsellorRoles = ["COUNSELLOR", "COUNSELOR"];
    const superAdminRoles = ["SUPERADMIN", "SUPER ADMIN"];
    const adminRoles = ["ADMIN"];

    if (counsellorRoles.includes(this.user_role)) {
      query = `?user_id=${this.user_id}`;
    } else if (superAdminRoles.includes(this.user_role)) {
      query = ``;
    } else if (adminRoles.includes(this.user_role)) {
      query = `?user_id=${this.user_id}`;
    }
    this._baseService.getData(`${environment._user}${query}`).subscribe(
      (res: any) => {
        if (res.results) {
          this.referredTo = res.results;
        }
      },
      (error: any) => {
        this.api.showToast(error?.error?.message);
      }
    );
  }
  getCounselledBy() {
    let query = `?role_name=superadmin`;

    this._baseService.getData(`${environment._user}${query}`).subscribe(
      (res: any) => {
        if (res.results) {
          this.adminList = res.results;
        }
      },
      (error: any) => {
        this.api.showError(this.api.toTitleCase(error.error.message));
      }
    );
  }
  getLeadStage() {
    this._baseService.getData(environment.leadStage).subscribe(
      (res: any) => {
        if (res) {
          this.leadStage = res;
        }
      },
      (error: any) => {
        this.api.showError(error.error.message);
      }
    );
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
  close() {
    this.callPermissionService.isToggleddataSubject.next(false);
    this.callPermissionService.closeCancelEditLeadPagedataSubject.next("close");
    this.modalController.dismiss();
  }
  closeModal() {
    this.callPermissionService.isToggleddataSubject.next(false);
    this.callPermissionService.closeCancelEditLeadPagedataSubject.next(
      "cancel"
    );
    this.modalController.dismiss();
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
    const data = await modal.onDidDismiss();
    if (data) {
      this.getCountry();
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
    const data = await modal.onDidDismiss();
    if (data) {
      this.getCity(this.selectedStateName, this.stateOptions);
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
    const data = await modal.onDidDismiss();
    if (data) {
      this.getState(this.selectedCountryName, this.countryOptions);
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
  onSubmit() {
    let formData = this.editLead.value;
    let data = {
      first_name: formData.firstName,
      last_name: "",
      email: formData.email || "",
      mobile_number: formData.mobile || null,
      date_of_birth:
        this._datePipe.transform(formData.dateOfBirth, "YYYY-MM-dd") || null,
      alternate_mobile_number: formData.alternateNumber || null,
      role: 5,
      location: null,
      pincode: formData.pincode || null,
      country: formData.countryId,
      state: formData.state,
      city: formData.cityName,
      zone: formData.zone,
      lead_list_status: formData.leadStatus,
      lead_list_substatus: 1,
      counselled_by: formData.counsellorAdmin,
      lead_stage: formData.leadStages,
      updated_by: this.user_id,
      note: formData.notes,
      remark: formData.remarks || null,
      source: formData.leadSource,
      refered_to: formData.counsellor,
      level_of_program: formData.levelOfProgram,
      education_details: {
        tenth_per: formData.tenthPercentage || null,
        twelfth_per: formData.twelthPercentage || null,
        degree_per: formData.degree || null,
        stream: formData.course,
        others: formData.otherCourse,
        enterance_exam: formData.entranceExam,
        course_looking_for: formData.courseLookingfor || [],
        preferance_college_and_location: {
          preferred_college1: formData.preferredCollege1,
          preferred_college2: formData.preferredCollege2,
          preferred_location1: formData.preferredLocation1,
          preferred_location2: formData.preferredLocation2,
        },
      },
      additional_info: {
        reference_name: formData.referenceName,
        reference_mobile_number: formData.referencePhoneNumber || null,
        father_name: formData.fatherName,
        father_occupation: formData.fatherOccupation,
        father_mobile_number: formData.fatherPhoneNumber || null,
      },
    };

    data = JSON.parse(JSON.stringify(data));
    if (this.editLead.invalid) {
      let mandatoryFieldsEmpty = false;
      let nonMandatoryFieldsInvalid = false;

      // Check if any mandatory fields are empty
      const mandatoryFields = [
        "firstName",
        "mobile",
        "counsellor",
        "leadStatus",
        "notes",
      ];
      mandatoryFields.forEach((field) => {
        if (!this.editLead.get(field).value) {
          mandatoryFieldsEmpty = true;
          this.editLead.markAllAsTouched();
        }
      });

      // Check if any non-mandatory fields are invalid
      Object.keys(this.editLead.controls).forEach((key) => {
        const control = this.editLead.get(key);
        if (
          (control.invalid && !mandatoryFields.includes(key)) ||
          (control.invalid && mandatoryFields.includes(key))
        ) {
          nonMandatoryFieldsInvalid = true;
          this.editLead.markAllAsTouched();
        }
      });

      if (mandatoryFieldsEmpty && nonMandatoryFieldsInvalid) {
        this.api.showError(
          "Please fill the mandatory fields and correct the invalid inputs."
        );
      } else if (mandatoryFieldsEmpty) {
        this.api.showError("Please fill the mandatory fields.");
      } else if (nonMandatoryFieldsInvalid) {
        this.api.showError("Correct the invalid inputs.");
      }
    } else {
      this._baseService
        .updateData(
          `${environment.lead_list}${this._inputData.user_data.id}/`,
          data
        )
        .subscribe(
          (res: any) => {
            if (res) {
              this.addLead.emit("ADD");
              this.api.showSuccess(res.message);
              this.callPermissionService.closeCancelEditLeadPagedataSubject.next(
                "submit"
              );
              this._addLeadEmitter.triggerGet();
              this.initForm();
              this.modalController.dismiss();
            }
          },
          (error: any) => {
            this.api.showError(error?.error?.message);
          }
        );
    }
  }
}
