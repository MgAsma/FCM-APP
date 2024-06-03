import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { Storage } from '@capacitor/storage';
import { DatePipe } from '@angular/common';
import { timer, Subject } from 'rxjs';
import { map, takeUntil, takeWhile } from 'rxjs/operators';
import { ApiService } from '../../service/api/api.service';

@Component({
  selector: 'app-meeting',
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.scss'],
})
export class MeetingComponent implements OnInit {
  meetingForm!: FormGroup;
  id: any;
  lastLoginDate: any;

  breakTime:any;

  constructor(
    private popoverController: PopoverController,
    private api: ApiService,
    private _fb: FormBuilder,
    private router: Router,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.id = localStorage.getItem('user_id');
    this.initForm();
    this.breakTime=localStorage.getItem('storedDate')
  }
  initForm() {
    this.meetingForm = this._fb.group({
      user: ['', [Validators.required]],
      status: ['', [Validators.required]],
    });
  }
  close() {
    this.popoverController.dismiss();
  }
  break() {
    this.meetingForm.patchValue({ user: this.id });
    this.meetingForm.patchValue({ status: 7 });

    ////console.log(this.meetingForm.value);

    if (this.meetingForm.invalid) {
      //console.log('Invalid');
    } else {
      this.api.showLoading();
      this.api.break(this.meetingForm.value).subscribe(
        (resp: any) => {
          this.api.loaderDismiss();
          this.close();
          Storage.remove({ key: 'meeting' });
          localStorage.removeItem('storedDate')
          this.api.showToast('Meeting Ended Sucessfully!');
        },
        (error: any) => {
          this.api.loaderDismiss();
          this.api.showToast(error.error.message);
        }
      );
    }
  }
}
