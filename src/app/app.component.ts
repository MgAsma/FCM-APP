import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { SwUpdate } from "@angular/service-worker";
import { App as CapacitorApp } from "@capacitor/app";

import {
  MenuController,
  NavController,
  Platform,
  ToastController,
} from "@ionic/angular";

import { StatusBar } from "@capacitor/status-bar";
import { SplashScreen } from "@capacitor/splash-screen";

import { Storage } from "@ionic/storage-angular";

import { UserData } from "./providers/user-data";
import { AndroidPermissions } from "@ionic-native/android-permissions/ngx";
import { CallLog } from "@ionic-native/call-log/ngx";
import { IdleDetectionService } from "./service/idle-detection.service";
import { ApiService } from "./service/api/api.service";
import { filter } from "rxjs/operators";
import { Subscription, combineLatest } from "rxjs";
import { BaseServiceService } from "./service/base-service.service";
import { jwtDecode } from "jwt-decode";
import { AddLeadEmitterService } from "./service/add-lead-emitter.service";
import { AllocationEmittersService } from "./service/allocation-emitters.service";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
  loggedIn = false;
  dark = false;
  id: string;
  private subscriptions: Subscription = new Subscription();
  constructor(
    private menu: MenuController,
    private platform: Platform,
    private router: Router,
    private storage: Storage,
    private userData: UserData,
    private swUpdate: SwUpdate,
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    private androidPermissions: AndroidPermissions,
    private callLog: CallLog,
    private idleDetectionService: IdleDetectionService,
    private api: ApiService,
    private allocation:AllocationEmittersService,
    private addEmit:AddLeadEmitterService
  ) // private platform: Platform,
  {

    this.initializeApp();

  }
  ionViewWillEnter(){
    this.id = localStorage.getItem('user_id')
  }

  async checkPermissions() {
    try {
      const phoneStateResult = await this.androidPermissions.requestPermissions(
        [
          this.androidPermissions.PERMISSION.READ_CONTACTS,
          this.androidPermissions.PERMISSION.READ_PHONE_STATE,
          this.androidPermissions.PERMISSION.READ_CALL_LOG,
        ]
      );

      // if (!phoneStateResult.hasPermission) {
      //   this.androidPermissions.requestPermission(
      //     this.androidPermissions.PERMISSION.READ_PHONE_STATE
      //   );

      // }

      // const callLogResult = await this.androidPermissions.checkPermission(
      //   this.androidPermissions.PERMISSION.READ_CALL_LOG
      // );
      // if (!callLogResult.hasPermission) {
      //   this.androidPermissions.requestPermission(
      //     this.androidPermissions.PERMISSION.READ_CALL_LOG
      //   );
      // }
    } catch (error) {
      //console.log("Error!", error);
    }
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (this.platform.is("hybrid")) {
        StatusBar.hide();
        SplashScreen.hide();
      }
    });
  }
  async ngOnInit() {
   
    this.appVersion();
    this.checkPermissions();
 
    await this.storage.create();
    
     const userActivity$ = this.idleDetectionService.userActivity;

    
    this.idleDetectionService.userActivity.subscribe(isActive => {
    
        if (this.router.url !== '/outer/login' && !isActive) {
          this.logOut()
        }
      
    });
    this.subscriptions.add(
      userActivity$.subscribe((isActive) => {
        if (isActive && this.currentUrl !== undefined) {
          this.idleDetectionService.resetTimer();
        }
      })
    );
  }

  logOut() {
    this.id = localStorage.getItem('user_id')
    let data = {
      user_id: this.id,
      logged_in_from: "mobile",
    };

    this.api.logout(data).subscribe(
      (resp: any) => {
        if(resp){
        localStorage.clear();
        this.api.showSuccess(resp.message);
        this.router.navigate(["../outer"]);
        localStorage.clear();
        this.clearState()
        }
      },
      (error: any) => {
        this.api.showError(error.error.message);
      }
    );
  }
  

  currentUrl: any;
  backbuttonEvent: any;
  const = CapacitorApp.addListener("backButton", async ({ canGoBack }) => {
    this.currentUrl = this.router.url;
    this.platform.backButton.observers.pop();
    if (this.currentUrl === "/inner/home") {
      if (canGoBack) {
        if (this.backbuttonEvent === 0) {
          this.backbuttonEvent++;
          let toast = this.toastCtrl.create({
            message: "Press back again to exit App",
            duration: 5000,
            position: "bottom",
            cssClass: "toaster",
          });
          (await toast).present();
          setTimeout(() => {
            this.backbuttonEvent = 0;
          }, 5000);
        } else {
          this.backbuttonEvent = 0;
          CapacitorApp.exitApp();
        }
      } else {
        if (this.backbuttonEvent === 0) {
          this.backbuttonEvent++;
          let toast = this.toastCtrl.create({
            message: "Press back again to exit App",
            duration: 5000,
            position: "bottom",
            cssClass: "toaster",
          });
          (await toast).present();
          setTimeout(() => {
            this.backbuttonEvent = 0;
          }, 5000);
        } else {
          this.backbuttonEvent = 0;
          CapacitorApp.exitApp();
        }
      }
    }
  });
  clearState(){
    this.allocation.searchBar.next(false) 
    this.allocation.customerSearchBar.next(false) 
    this.allocation.callLogSearchBar.next(false) 
    this.allocation.tlsSearchBar.next(false) 
    this.allocation.allocationStatus.next([])
    this.allocation.callLogStatus.next([])
    this.allocation.tlsStatus.next('')
    this.allocation.callhistoryList.next([])
    this.allocation.logMemberDetails.next('')
    this.allocation.customerStatus.next('')

    this.addEmit.leadFilter.next('')
    this.addEmit.leadFilterIcon.next('')
    this.addEmit.filterStatus.next(false)
    this.addEmit.selectedCounsellor.next([])
    this.addEmit.callLogCounsellor.next([])
    this.addEmit.tlsCounsellor.next([])
    this.addEmit.customerCounsellor.next([])
    
  }
  appVersion() {
    // Define your current application version
    const currentVersion = "1.0.31";

    // Check if local storage contains a version number
    const storedVersion = localStorage.getItem("appVersion");

    // If there's no stored version or it's different from the current version
    if (!storedVersion || storedVersion !== currentVersion) {
      // Clear local storage
      localStorage.clear();

      // Update stored version to current version
      localStorage.setItem("appVersion", currentVersion);
    }

    // Listen for the update event
    window.addEventListener("appUpdated", function (event) {
      // Check if the stored version matches the current version
      if (localStorage.getItem("appVersion") !== currentVersion) {
        // Clear local storage
        localStorage.clear();

        // Update stored version to current version
        localStorage.setItem("appVersion", currentVersion);
      }
    });

    // Trigger the update event when the application is updated
    // Example: When a new version of the application is installed
   // window.dispatchEvent(new Event("appUpdated"));
  }
}
