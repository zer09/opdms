import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Helper } from './helper';
import { StoreService } from './service/store.service';
import { ServerAddressService } from './service/server-address.service';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html'
})
export class AppComponent {

    public appPages: any[] = [];

    constructor(
        private _sSvc: StoreService,
        private _saSvc: ServerAddressService,
        private _platform: Platform,
        private _splashScreen: SplashScreen,
        private _statusBar: StatusBar
    ) {
        this._sSvc.monitorStore();
        this.initializeApp();
    }

    initializeApp() {
        this._platform.ready().then(() => {
            this._statusBar.styleDefault();
            this._splashScreen.hide();

            this._initDoctorPage();
        });
    }

    private _initDoctorPage() {
        this.appPages = [
            { title: 'Home', url: '/home', icon: 'home' },
            { title: 'Medicines', url: '/page/medicines', icon: 'medkit' },
            { title: 'Settings', url: '/page/settings', icon: 'settings' }
        ];
    }
}
