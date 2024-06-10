import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { MatSlideToggleChange } from "@angular/material/slide-toggle";
import { IonModal, ModalController, AlertController } from "@ionic/angular";
import { AllocationEmittersService } from "../../../service/allocation-emitters.service";
import { CallPermissionsService } from "../../../service/api/call-permissions.service";
import {
  SortingCard,
  sortingCards,
  arrayOfObjects,
} from "../../../shared-modules/sample-data";
import { FilterComponent } from "../filter/filter.component";
import { ToolbarCustomerComponent } from "../toolbar-customer/toolbar-customer.component";
import { AddLeadEmitterService } from "../../../service/add-lead-emitter.service";

@Component({
  selector: "app-allocation-toolbar-top",
  templateUrl: "./allocation-toolbar-top.component.html",
  styleUrls: ["./allocation-toolbar-top.component.scss"],
})
export class AllocationToolbarTopComponent implements OnInit {
  searchBar = false;
  @ViewChild("modal") modal!: IonModal;
  @Input() data: any = [];
  @Input() statusList: any = [];
  sortingCards: SortingCard[] = sortingCards;
  arrayOfObjects = arrayOfObjects;
  @Output() people = new EventEmitter();
  user_role: string;
  counsellor_ids: any[];
  selectedStatus: any[];
  constructor(
    private allocate: AllocationEmittersService,
    private modalController: ModalController,
    private callPermissionService: CallPermissionsService,
    private alertController: AlertController,
    private _addLeadEmitter: AddLeadEmitterService
  ) {
    this.user_role = localStorage.getItem("user_role").toLowerCase();
  }

  ngOnInit() {
    this.callPermissionService.isToggleddataSubject.subscribe((res: any) => {
      this.isToggled = res;
    });
    this.callPermissionService.closeCancelEditLeadPagedataSubject.subscribe(
      (res: any) => {
        if (res == "close" || res == "cancel") {
          this.isToggled = false;
        }
      }
    );
    this._addLeadEmitter.selectedCounsellor.subscribe((res) => {
      if (res) {
        this.counsellor_ids = res;
      } else {
        this.counsellor_ids = [];
      }
    });

    this.allocate.allocationStatus.subscribe((res: any) => {
      this.selectedStatus = res;
    });
  }
  enableSearchOption() {
    this.allocate.searchBar.next(true);
  }
  toggleSelection(card: SortingCard): void {
    card.selected = !card.selected;
  }
  toggleChipSelection(item: any) {
    item.selected = !item.selected;
  }
  selectedColumn: string = "Selected Users"; // By default, 'Selected Users' is selected

  selectColumn(column: string) {
    this.selectedColumn = column;
  }

  async openModal() {
    const modal = await this.modalController.create({
      component: ToolbarCustomerComponent,
      componentProps: {
        key: "value",
        data: this.data,
      },
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        let uniqueArray = Array.from(new Set(dataReturned.data));
        this.people.emit(uniqueArray);
      }
    });

    return await modal.present();
  }
  async openFilter() {
    const modal = await this.modalController.create({
      component: FilterComponent,
      componentProps: {
        key: "value",
        data: this.statusList,
      },
    });
    return await modal.present();
  }

  isToggled: boolean = false;

  evValue: boolean;
  setValue1(event: MatSlideToggleChange) {
    let prevVal = this.isToggled;
    this.enbaleAutoDiallingWarning(prevVal);
    this.isToggled = event.source.checked;
  }

  async enbaleAutoDiallingWarning(ischecked: any) {
    return new Promise(async (resolve) => {
      const confirm = await this.alertController.create({
        header: "Begin Auto Dialler",
        backdropDismiss: false,

        message: this.isToggled
          ? "Do you want to disable Auto Dialling ? "
          : "Do you want to enable Auto Dialling ?",
        buttons: [
          {
            text: "Cancel",
            role: "cancel",
            handler: () => {
              this.isToggled = ischecked;
              this.callPermissionService.isToggleddataSubject.next(
                this.isToggled
              );
              return resolve(ischecked);
            },
          },
          {
            text: "OK",
            handler: () => {
              this.isToggled = !ischecked;
              this.callPermissionService.isToggleddataSubject.next(
                this.isToggled
              );

              return resolve(!ischecked);
            },
          },
        ],
      });

      await confirm.present();
    });
  }
}
