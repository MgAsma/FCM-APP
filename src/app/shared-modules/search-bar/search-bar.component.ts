import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
import { AllocationEmittersService } from '../../service/allocation-emitters.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent  implements OnInit {
  @Input()placeholder:any;
  @Output()search = new EventEmitter();
  @Output()close = new EventEmitter();
  term:any;
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
