import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-select-searchable',
  templateUrl: './select-searchable.component.html',
  styleUrls: ['./select-searchable.component.scss'],
})
export class SelectSearchableComponent implements OnInit {
  @Input() items = [];
  @Input() selectedItems: string[] = [];
  @Input() title = 'Select Items';

  @Output() selectionCancel = new EventEmitter<void>();
  @Output() selectionChange = new EventEmitter<string[]>();
 constructor(){}
  filteredItems = [];
  workingSelectedValues: string[] = [];

  ngOnInit() {
    this.filteredItems = [...this.items];
    this.workingSelectedValues = [...this.selectedItems];
  }

  trackItems(index: number, item:any) {
    return item.value;
  }

  cancelChanges() {
    this.selectionCancel.emit();
  }

  confirmChanges() {
    this.selectionChange.emit(this.workingSelectedValues);
  }

  searchbarInput(ev) {
    this.filterList(ev.target.value);
  }

  /**
   * Update the rendered view with
   * the provided search query. If no
   * query is provided, all data
   * will be rendered.
   */
  filterList(searchQuery: string | undefined) {
    /**
     * If no search query is defined,
     * return all options.
     */
    if (searchQuery === undefined) {
      this.filteredItems = [...this.items];
    } else {
      /**
       * Otherwise, normalize the search
       * query and check to see which items
       * contain the search query as a substring.
       */
      const normalizedQuery = searchQuery.toLowerCase();
      this.filteredItems = this.items.filter((item) => {
        return item.name.toLowerCase().includes(normalizedQuery);
      });
    }
  }

  isChecked(value: string) {
    return this.workingSelectedValues.find((item) => item === value);
  }

  // checkboxChange(ev) {
  //   const { checked, value } = ev.detail;

  //   if (checked) {
  //     this.workingSelectedValues = [...this.workingSelectedValues, value];
  //   } else {
  //     this.workingSelectedValues = this.workingSelectedValues.filter((item) => item !== value);
  //   }
  // }
  checkboxChange(ev) {
    const { checked, value } = ev.detail;

    if (checked) {
        // Set workingSelectedValues to contain only the current value
        this.workingSelectedValues = [value];
    } else {
        // If unchecked, clear the workingSelectedValues
        this.workingSelectedValues = [];
    }
}

}


