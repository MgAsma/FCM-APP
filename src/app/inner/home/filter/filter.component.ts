import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-filter-home',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent  implements OnInit {
  // <div class="chip">Today</div>
  // <div class="chip">Last 7 days</div>
  // <div class="chip">Last 30 days</div>
  // <div class="chip">Select filter</div>
  data = [
    
    {
      name:'Today',
      id:1
     },
     {
      name:'Last 7 days',
      id:2
     },
     {
      name:'Last 30 days',
      id:3
     },
     {
      name:'Select filter',
      id:1
     },
  ]
  constructor() { }

  ngOnInit() {}

}
