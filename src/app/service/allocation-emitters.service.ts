import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AllocationEmittersService {
  searchBar = new BehaviorSubject(false)
  allocationStatus = new BehaviorSubject('')
  callLogStatus = new BehaviorSubject('')
  tlsStatus = new BehaviorSubject('')
  callhistoryList = new BehaviorSubject([])


  private phoneStateSubject = new Subject<string>();

  // Observable string stream
  phoneState$: Observable<string> = this.phoneStateSubject.asObservable();

  private currentCallState: string = 'IDLE';

  // Function to update phone state
  updatePhoneState(newState: string) {
    this.currentCallState = newState;
    this.phoneStateSubject.next(newState);
  }

  // Check if a call is currently active
  isCallActive(): boolean {
    return this.currentCallState !== 'IDLE';
  }
  constructor() { }
}
