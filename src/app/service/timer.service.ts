
import { Injectable } from '@angular/core';
import { Observable, timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  constructor() {}

  startTimer(duration: number): Observable<number> {
    return timer(duration);
  }
}
