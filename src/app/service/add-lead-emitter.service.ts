import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddLeadEmitterService {

  private triggerGetSource = new Subject<void>();
  triggerGet$ = this.triggerGetSource.asObservable();
  private triggerGetFilter = new Subject<void>();
  triggerGetFilter$ = this.triggerGetFilter.asObservable();
  leadFilter = new BehaviorSubject('')
  leadFilterIcon = new BehaviorSubject('')
  triggerGet() {
    this.triggerGetSource.next();
  }
  triggerFilter():any {
    this.triggerGetFilter.next();
  }
}
