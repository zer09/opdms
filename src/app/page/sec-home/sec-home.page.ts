import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ServerAddressService } from '../../service/server-address.service';
import { AlertController, Events } from '@ionic/angular';
import { LoggerService } from '../../service/logger.service';

@Component({
    selector: 'app-sec-home',
    templateUrl: './sec-home.page.html',
    styleUrls: ['./sec-home.page.scss'],
})
export class SecHomePage implements OnInit {

    private _node: string;

    constructor(
        private _saSvc: ServerAddressService,
        private _logSvc: LoggerService,
        private _event: Events,
        private _localStorage: Storage,
        private _alertCtrl: AlertController,
    ) { }

    ngOnInit() {
        this._getClinicNode()
            .then(node => this._node = node)
            .catch(e => {
                this._logSvc.log(e);
                this._alertCtrl.create({
                    header: 'Unexpected Error!',
                    message: 'Unable to locate clinic ID.'
                }).then(a => {
                    a.onDidDismiss().then(() => {
                        this._event.publish('usr:ses:logout');
                    });

                    a.present();
                });
            });
    }

    private _getClinicNode(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this._localStorage.get('user:clinic:node').then((node: string) => {
                if (!node) {
                    this._saSvc.fetchDefaultServerUUID().then(db => {
                        this._localStorage.set('user:clinic:node', db['uuid'])
                            .then(() => resolve(db['uuid']));
                    }).catch(e => reject(e));
                }
            });
        });
    }

}
