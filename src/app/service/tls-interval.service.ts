import { Injectable } from '@angular/core';
import { Observable, Subscription, interval } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TlsIntervalService {

  // startInterval(callback: () => void, period: number): Observable<void> {
  //   return new Observable(observer => {
  //     const intervalId = setInterval(() => {
  //       callback();
  //       observer.next();
  //     }, period);

  //     return () => clearInterval(intervalId);
  //   });
  // }
  startInterval(callback: () => void, period: number): Subscription {
    const intervalId = setInterval(callback, period);

    return new Subscription(() => clearInterval(intervalId));
  }
}
