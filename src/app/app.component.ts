import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { App as CapacitorApp } from '@capacitor/app';

import { MenuController, NavController, Platform, ToastController } from '@ionic/angular';

import { StatusBar } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';

import { Storage } from '@ionic/storage-angular';

import { UserData } from './providers/user-data';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  
  loggedIn = false;
  dark = false;

  constructor(
    private menu: MenuController,
    private platform: Platform,
    private router: Router,
    private storage: Storage,
    private userData: UserData,
    private swUpdate: SwUpdate,
    private toastCtrl: ToastController,
    private navCtrl:NavController,
    private androidPermissions:AndroidPermissions
  ) {
    this.initializeApp();


    let token = localStorage.getItem('token');
if(token){
  this.navCtrl.navigateRoot("/inner")
}
else{
  this.navCtrl.navigateRoot("/outer/login")

}
  }


  async checkPermissions() {
    try {
      const phoneStateResult = await this.androidPermissions.checkPermission(
        this.androidPermissions.PERMISSION.READ_PHONE_STATE
      );
      if (!phoneStateResult.hasPermission) {
        this.androidPermissions.requestPermission(
          this.androidPermissions.PERMISSION.READ_PHONE_STATE
        );
      }

      const callLogResult = await this.androidPermissions.checkPermission(
        this.androidPermissions.PERMISSION.READ_CALL_LOG
      );
      if (!callLogResult.hasPermission) {
        this.androidPermissions.requestPermission(
          this.androidPermissions.PERMISSION.READ_CALL_LOG
        );
      }
    } catch (error) {
      console.log("Error!", error);
    }
  }








  async ngOnInit() {
    this.checkPermissions();
    await this.storage.create();
    this.checkLoginStatus();
    this.listenForLoginEvents();

    this.swUpdate.available.subscribe(async res => {
      const toast = await this.toastCtrl.create({
        message: 'Update available!',
        position: 'bottom',
        buttons: [
          {
            role: 'cancel',
            text: 'Reload'
          }
        ]
      });

      await toast.present();

      toast
        .onDidDismiss()
        .then(() => this.swUpdate.activateUpdate())
        .then(() => window.location.reload());
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (this.platform.is('hybrid')) {
        StatusBar.hide();
        SplashScreen.hide();
      }
    });
  }

  checkLoginStatus() {
    return this.userData.isLoggedIn().then(loggedIn => {
      return this.updateLoggedInStatus(loggedIn);
    });
  }

  updateLoggedInStatus(loggedIn: boolean) {
    setTimeout(() => {
      this.loggedIn = loggedIn;
    }, 300);
  }

  listenForLoginEvents() {
    window.addEventListener('user:login', () => {
      this.updateLoggedInStatus(true);
    });

    window.addEventListener('user:signup', () => {
      this.updateLoggedInStatus(true);
    });

    window.addEventListener('user:logout', () => {
      this.updateLoggedInStatus(false);
    });
  }

 


  currentUrl:any
  backbuttonEvent:any
    const =  CapacitorApp.addListener('backButton', async ({canGoBack}) => {
      this.currentUrl=this.router.url;
      this.platform.backButton.observers.pop();
      if(this.currentUrl === '/inner/home') {
        if(canGoBack){
          if(this.backbuttonEvent===0){
            this.backbuttonEvent++;
            let toast = this.toastCtrl.create({
              message: 'Press back again to exit App',
              duration: 5000,
              position: 'bottom','cssClass':'toaster'
              });
              (await toast).present();
              setTimeout(() => {
                this.backbuttonEvent=0;
              }, 5000);
              }else{
                this.backbuttonEvent=0;
                CapacitorApp.exitApp();
              }
          }else {
            if(this.backbuttonEvent===0){
              this.backbuttonEvent++;
              let toast = this.toastCtrl.create({
                message: 'Press back again to exit App',
                duration: 5000,
                position: 'bottom','cssClass':'toaster'
                });
                (await toast).present();
                setTimeout(() => {
                  this.backbuttonEvent=0;
                }, 5000);
                }else{
                  this.backbuttonEvent=0;
                  CapacitorApp.exitApp();
                }
          }
        }
        
       
    });
}
