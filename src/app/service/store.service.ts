import { Injectable } from '@angular/core';
import { Events } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

import cordovaSqlitePlugin from 'pouchdb-adapter-cordova-sqlite';
import upsert from 'pouchdb-upsert';
import PouchDB from 'pouchdb';

import { ServerAddressService } from './server-address.service';


import { Helper } from '../helper';
import { IGetResponse } from '../interface/response/iget-response';
import { LoggerService } from './logger.service';

@Injectable({
    providedIn: 'root'
})
export class StoreService {

    private _stores: any = {};

    private _storeLocation: string[] = [];
    private _serverAddress: string[] = [];

    public serverUUID: string;

    constructor(
        private _saSvc: ServerAddressService,
        private _http: HttpClient,
        private _events: Events,
    ) {
        if (Helper.isApp) {
            PouchDB.plugin(cordovaSqlitePlugin);
        }

        PouchDB.plugin(upsert);
    }

    public initMonitor() {
        this._monitorAddress();

        this._registerStore('18YZR9UJZ2nOYVQQzRR9wjWt9ii');

        const adrs = this._saSvc.listServers();
        for (let i = 0; i < adrs.length; i++) {
            this._registerAddress(adrs[i]);
        }
    }

    // public fetchServerUUID(): Promise<string> {
    //     return new Promise((resolve, reject) => {
    //         this._http.get(this._saSvc.getOriginAddress() + '/server/uuid')
    //             .subscribe((res: IGetResponse) => {
    //                 if (res.successful) {
    //                     resolve(res.msg);
    //                 } else {
    //                     reject('unable to get server uuid');
    //                 }
    //             }, err => {
    //                 reject(err);
    //             });
    //     });
    // }

    public get(name: string) {
        const s = this._stores[name];
        return !s ? this._registerStore(name) : s;
    }

    private _monitorAddress() {
        this._events.subscribe('server:address', sa => {
            this._registerAddress(sa);
        });
    }

    private _registerAddress(sa: string) {
        if (!sa || this._serverAddress.indexOf(sa) > -1) {
            return;
        }

        this._serverAddress.push(sa);
        for (let i = 0; i < this._storeLocation.length; i++) {
            const name = this._storeLocation[i];

            this._stores[name].sync(
                new PouchDB(sa + '/store/' + name), {
                    live: true, retry: true
                }
            );
        }
    }

    private _registerStore(sl: string) {
        if (!sl || this._stores[sl]) {
            return;
        }

        const s = Helper.isApp ? new PouchDB(sl, {
            adapter: 'cordova-sqlite'
        }) : new PouchDB(sl);

        this._stores[sl] = s;
        this._storeLocation.push(sl);

        for (let i = 0; i < this._serverAddress.length; i++) {
            s.sync(
                new PouchDB(this._serverAddress[i] + '/store/' + sl), {
                    live: true, retry: true
                }
            );
        }

        return s;
    }

}
