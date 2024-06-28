import { Injectable } from '@angular/core';
import { Observable, fromEvent, merge, timer, BehaviorSubject } from 'rxjs';
import { mapTo, startWith, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IdleDetectionService {
  private userActivity$: Observable<boolean>;
  private lastActivityTime!: number;
  private idleTimeout: number = 900000; // 15 minutes in milliseconds
  private isActiveSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor() {
    const activityEvents = [
      'mousemove',
      'keydown',
      'mousedown',
      'touchstart',
      'scroll'
    ];

    this.userActivity$ = merge(
      ...activityEvents.map(event => fromEvent(document, event))
    ).pipe(
      mapTo(true),
      startWith(true),
      switchMap(() => {
        this.lastActivityTime = Date.now();
        this.isActiveSubject.next(true);
        return timer(this.idleTimeout).pipe(mapTo(false));
      })
    );
  }

  get userActivity(): Observable<boolean> {
    return this.userActivity$;
  }

  get isActive(): Observable<boolean> {
    return this.isActiveSubject.asObservable();
  }

  resetTimer() {
    this.lastActivityTime = Date.now();
    this.isActiveSubject.next(true);
  }

  checkIdleTimeout() {
    const currentTime = Date.now();
    const elapsedTime = currentTime - this.lastActivityTime;
    if (elapsedTime > this.idleTimeout) {
      this.isActiveSubject.next(false);
    }
  }
}
