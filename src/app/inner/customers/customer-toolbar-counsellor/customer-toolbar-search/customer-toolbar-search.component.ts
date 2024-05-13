import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AllocationEmittersService } from '../../../../service/allocation-emitters.service';

@Component({
  selector: 'app-customer-toolbar-search',
  templateUrl: './customer-toolbar-search.component.html',
  styleUrls: ['./customer-toolbar-search.component.scss'],
})
export class CustomerToolbarSearchComponent implements OnInit {
  @Input()placeholder:any;

  @Output()search = new EventEmitter();
  @Output()close = new EventEmitter();
  term:any;
  @Input()
  set searchTerm(value: any) {
    this.term = value;
  }
  constructor(
    private allocation:AllocationEmittersService,
    private router:Router,
    private route:ActivatedRoute){
    //console.log(this.router.url)
  }
  
  // Function to trigger the passed search handler
  triggerSearch(event:any) {
    if(event){
      this.search.emit(this.term)
    }
  }
  ngOnInit() {}
  pageReset(){
    this.allocation.searchBar.next(false)
     this.router.navigate([this.router.url])
     this.close.emit(true)
     this.search.emit('')
  }
}
