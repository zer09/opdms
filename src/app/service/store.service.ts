import { Injectable } from '@angular/core';
import { Events } from '@ionic/angular';

import cordovaSqlitePlugin from 'pouchdb-adapter-cordova-sqlite';
import upsert from 'pouchdb-upsert';
import PouchDB from 'pouchdb';

import { ServerAddressService } from './server-address.service';

import { Helper } from '../helper';

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
        private _events: Events,
    ) {
        if (Helper.isApp) {
            PouchDB.plugin(cordovaSqlitePlugin);
        }

        PouchDB.plugin(upsert);
    }

    public monitorStore() {
        this._monitorAddress();

        this._registerStore(Helper.defStore);

        const adrs = this._saSvc.listServers();
        for (let i = 0; i < adrs.length; i++) {
            this._registerAddress(adrs[i]);
        }
    }

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
