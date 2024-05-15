import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IntervalService {

  private intervalId: any;

  constructor() { }

  startInterval(callback: () => void, interval: number): void {
    this.intervalId = setInterval(callback, interval);
  }

  stopInterval(): void {
    clearInterval(this.intervalId);
  }
}
