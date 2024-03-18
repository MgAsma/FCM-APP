import { HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { BasicAuthInterceptor } from './service/Auth-interceptor/auth-interceptor';
import { DatePipe } from '@angular/common';
import { RouteReuseStrategy } from '@angular/router';
import { RecFollowupListPage } from './shared-modules/rec-followup-list/rec-followup-list.page';
import { MaterialModule } from './shared-modules/material/material/material.module';

// import {
//   NgxUiLoaderHttpModule, NgxUiLoaderModule,
//   NgxUiLoaderConfig,
//   SPINNER,
//   POSITION,
//   PB_DIRECTION,
// } from "ngx-ui-loader";
import { ToastrModule } from 'ngx-toastr';
// const ngxUiLoaderConfig: NgxUiLoaderConfig = {
//   bgsColor: "red",
//   bgsPosition: POSITION.bottomCenter,
//   bgsSize: 20,
//   bgsType: SPINNER.rectangleBouncePulseOutRapid, // background spinner type
//   fgsType: SPINNER.rectangleBouncePulseOutRapid, // foreground spinner type
//   pbDirection: PB_DIRECTION.leftToRight, // progress bar direction
//   pbThickness: 5, // progress bar thickness
//   fgsSize:50
// };
@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    MaterialModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production
    }),
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass:"toast-top-full-width",
      preventDuplicates: true,
      // closeButton:true,
    }),
  ],exports:[
    MaterialModule
  ],
  declarations: [AppComponent],
  providers: [
    InAppBrowser,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {provide: HTTP_INTERCEPTORS, useClass: BasicAuthInterceptor, multi: true },
    DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule {}
