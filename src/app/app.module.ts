import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddRemovePopoverPageModule } from './page/common/add-remove-popover/add-remove-popover.module';
import { MedInstructionQuickAddPageModule } from './page/modal/med-instruction-quick-add-modal/med-instruction-quick-add.module';
import { MedicationInstructionModalPageModule } from './page/modal/medication-instruction-modal/medication-instruction-modal.module';
import { MedicineQuickAddModalPageModule } from './page/modal/medicine-quick-add-modal/medicine-quick-add-modal.module';
import { ServerListPageModule } from './page/server-list/server-list.module';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot({
      name: '__OPDMSStorage',
      driverOrder: ['indexeddb', 'sqlite', 'websql'],
    }),
    AppRoutingModule,
    HttpClientModule,
    ServerListPageModule,
    MedicineQuickAddModalPageModule,
    MedInstructionQuickAddPageModule,
    AddRemovePopoverPageModule,
    MedicationInstructionModalPageModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    BrowserAnimationsModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
