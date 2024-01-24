import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AllocationEmittersService {
  searchBar = new BehaviorSubject(false)
  allocationStatus = new BehaviorSubject('')
  callLogStatus = new BehaviorSubject('')
  tlsStatus = new BehaviorSubject('')
  callhistoryList = new BehaviorSubject([])
  constructor() { }
}
