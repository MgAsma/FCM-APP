// auth.service.ts

import { Injectable } from '@angular/core';
import { TimerService } from './timer.service';
import { IdleDetectionService } from './idle-detection.service';
import { Router } from '@angular/router';
import { AddLeadEmitterService } from './add-lead-emitter.service';
import { ApiService } from './api/api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private timerService: TimerService,
    private idleDetectionService: IdleDetectionService,
    private api:ApiService,
    private router:Router,
    private addEmit:AddLeadEmitterService
  ) {}

  isLoggedIn() {
    // Check authentication status
    // Return true if authenticated, false otherwise
  }

  startLogoutTimer(duration: number): void {
    this.idleDetectionService.userActivity.subscribe(() => {
      this.timerService.startTimer(duration).subscribe(() => {
        this.logout();
      });
    });
  }

  logout(): void {
   localStorage.clear();
   this.api.showSuccess("Your Session Has Been Expired")
  }
}
