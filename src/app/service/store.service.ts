import { Injectable } from '@angular/core';
import { Events } from '@ionic/angular';

import cordovaSqlitePlugin from 'pouchdb-adapter-cordova-sqlite';
import PouchDB from 'pouchdb';

import { ServerAddressService } from './server-address.service';

import { Helper } from '../helper';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  private _sMap: Map<string, PouchDB.Database> =
    new Map<string, PouchDB.Database>();

  private _storeLocation: string[] = [];
  private _serverAddress: string[] = [];

  public serverUUID!: string;

  constructor(
    private _saSvc: ServerAddressService,
    private _events: Events,
  ) {
    if (Helper.isApp) {
      PouchDB.plugin(cordovaSqlitePlugin);
    }
  }

  public monitorStore(): void {
    this._monitorAddress();

    this._registerStore(Helper.defStore);
    this._saSvc.listServers().forEach(sa => {
      this._registerAddress(sa);
    });
  }

  public get(name: string): PouchDB.Database {
    return this._sMap.get(name) || this._registerStore(name);
  }

  private _monitorAddress(): void {
    this._events.subscribe('server:address', sa => {
      this._registerAddress(sa);
    });
  }

  private _registerAddress(sa: string): void {
    if (!sa || this._serverAddress.indexOf(sa) > -1) {
      return;
    }

    this._serverAddress.push(sa);
    this._storeLocation.forEach(sl => {
      const s = this._sMap.get(sl);
      if (s) {
        s.sync(new PouchDB(sa + '/store/' + sl), { live: true, retry: true });
      }
    });
  }

  private _registerStore(sl: string): PouchDB.Database {
    const s: PouchDB.Database = this._sMap.get(sl) ||
      Helper.isApp ? new PouchDB(sl, { adapter: 'cordova-sqlite' })
      : new PouchDB(sl);

    this._sMap.set(sl, s);
    this._storeLocation.push(sl);

    this._serverAddress.forEach(sa => {
      s.sync(new PouchDB(sa + '/store/' + sl), { live: true, retry: true });
    });

    return s;
  }
}
