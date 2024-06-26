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
  selector: 'app-on-break',
  templateUrl: './on-break.component.html',
  styleUrls: ['./on-break.component.scss'],
})
export class OnBreakComponent implements OnInit {
  breakForm!: FormGroup;
  id: any;
  lastLoginDate: any;

  breakTime = new Date();

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
  }
  initForm() {
    this.breakForm = this._fb.group({
      user: ['', [Validators.required]],
      status: ['', [Validators.required]],
    });
  }
  close() {
    this.popoverController.dismiss();
  }
  break() {
    this.breakForm.patchValue({ user: this.id });
    this.breakForm.patchValue({ status: 1 });

    console.log(this.breakForm.value);

    if (this.breakForm.invalid) {
      console.log('Invalid');
    } else {
      this.api.showLoading();
      this.api.break(this.breakForm.value).subscribe(
        (resp: any) => {
          this.api.loaderDismiss();
          this.close();
          Storage.remove({ key: 'break' });
          this.api.showToast('Break Ended Sucessfully!');
        },
        (error: any) => {
          this.api.loaderDismiss();
          this.api.showToast(error.error.message);
        }
      );
    }
  }
}
