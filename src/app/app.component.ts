import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

import { Platform, MenuController, Events } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { Helper } from './helper';
import { StoreService } from './service/store.service';
import { ServerAddressService } from './service/server-address.service';
import { IPage } from './interface/ipage';
import { User } from './class/user';
import { UserType } from './enum/user/user-type.enum';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html'
})
export class AppComponent {

    public appPages: IPage[] = [];
    public mainMenuId = 'main-menu';

    constructor(
        private _sSvc: StoreService,
        private _saSvc: ServerAddressService,
        private _localStorage: Storage,
        private _events: Events,
        private _route: Router,
        private _menuCtrl: MenuController,
        private _platform: Platform,
        private _splashScreen: SplashScreen,
        private _statusBar: StatusBar
    ) {
        this._sSvc.monitorStore();
        this.initializeApp();
    }

    initializeApp() {
        this._platform.ready().then(() => {
            this._menuCtrl.enable(false, this.mainMenuId);
            this._statusBar.styleDefault();
            this._splashScreen.hide();

            this._events.subscribe('usr:ses:chg', (usr: User) => {
                if (!usr) {
                    this.appPages = [];
                    this._menuCtrl.enable(false, this.mainMenuId);
                    this._route.navigate(['']);
                    return;
                }

                if (usr.userType === UserType.ADMIN) {
                } else if (usr.userType === UserType.DOCTOR) {
                    this._initDoctorPage();
                } else if (usr.userType === UserType.SECRETARY) {
                    this._initSecPage();
                } else {
                    this.logout();
                }
            });

            this._localStorage.get('session').then((usr: User) => {
                this._events.publish('usr:ses:chg', usr);
            });

        });
    }

    private _initDoctorPage() {
        this.appPages = [
            { title: 'Home', url: '', icon: 'home' },
            { title: 'Medicines', url: '/doctor/medicines', icon: 'medkit' },
            { title: 'Settings', url: '/settings', icon: 'settings' }
        ];
    }

    private _initSecPage() {
        this.appPages = [
            { title: 'Home', url: '', icon: 'home' },
            { title: 'Settings', url: '/settings', icon: 'settings' }
        ];
    }

    public logout() {
        this.appPages = [];
        this._menuCtrl.enable(false, this.mainMenuId);
        this._localStorage.set('session', undefined).then(() => {
            window.location.reload();
        });
    }

}
