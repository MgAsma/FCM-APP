import { Component, OnInit, Optional, ViewEncapsulation } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { SwUpdate } from "@angular/service-worker";
import { App as CapacitorApp } from "@capacitor/app";
import { App } from '@capacitor/app';
import {
  AlertController,
  MenuController,
  NavController,
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
import { IonRouterOutlet, Platform } from '@ionic/angular';
import { NgxIndexedDBService } from "ngx-indexed-db";
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
  currentUrl: any;
  backbuttonEvent: any;
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
    private alertController:AlertController,
    private androidPermissions: AndroidPermissions,
    @Optional() private routerOutlet?: IonRouterOutlet
  ) // private platform: Platform,
  {
    this.initializeApp();
  }
  async ionViewWillEnter(){
    
  await this.appVersion();
  await this.checkPermissions();
  await this.storage.create();
    
 
    // this.platform.backButton.subscribeWithPriority(-1, async () => {
    //   if (!this.routerOutlet.canGoBack()) {
        const alert = await this.alertController.create({
          header: 'Confirm Exit',
          message: 'Do you want to exit the app?',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => {
                // Handle Cancel action
              }
            },
            {
              text: 'Exit',
              handler: () => {
                App.exitApp();
              }
            }
          ]
        });
  
        await alert.present();
    //   }
    // });
  
  
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
 
   await this.appVersion();
   await this.checkPermissions();
   await this.storage.create();
   
  }

  
  
  appVersion() {
    // Define your current application version
    const currentVersion = "1.0.33";

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
