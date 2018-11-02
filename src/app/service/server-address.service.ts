import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Events } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { IGetResponse } from '../interface/response/iget-response';
import { Helper } from '../helper';

export interface ServerKeyAddress {
    key: string;
    address: string;
}

@Injectable({
    providedIn: 'root'
})
export class ServerAddressService {

    private _keyPrefix = 'server:address:';
    private _defaultAddress = 'server:default:address';
    private _addressMap = new Map<string, string>();

    public remote = ['remote', 'http://localhost:3000'];

    constructor(
        private _localStorage: Storage,
        private _events: Events,
        private _http: HttpClient,
    ) {
        this._addressMap.set(this.remote[0], this.remote[1]);
        this._localStorage.forEach((val, key) => {
            if (!key.startsWith(this._keyPrefix)) { return; }

            this._addressMap.set(key.substring(15), val);
        });
    }

    public get remoteName(): string {
        return this.remote[0];
    }

    public listServers(): string[] {
        return Array.from(this._addressMap.values());
    }

    public listServerKeys(): string[] {
        return Array.from(this._addressMap.keys());
    }

    public addressMaps(): Map<string, string> {
        return this._addressMap;
    }

    public addServer(name: string, address: string): void {
        name = (name || '').trim().toLowerCase();
        if (name === this.remote[0]) {
            return;
        }

        this._localStorage.set(this._keyPrefix + name, address).then(() => {
            this._addressMap.set(name, address);
            this._events.publish('server:address', address);
        });
    }

    public getServer(name: string): string {
        return this._addressMap.get(name);
    }

    public getServerAPI(name: string): string {
        return this._addressMap.get(name) + '/api';
    }

    public getServerStore(name: string): string {
        return this._addressMap.get(name) + '/store';
    }

    public setDefaultServer(name: string): Promise<void> {
        name = (name || '').trim().toLowerCase();
        if (name === this.remoteName) {
            return Promise.reject(
                new Error('the "remote" server is not allowed to be default')
            );
        }

        if (name === '') {
            return Promise.resolve();
        }

        return new Promise<void>((resolve, reject) => {
            this.getDefaultServer().then(ska => {
                this._localStorage.set(this._defaultAddress, name)
                    .then(() => this._localStorage.get(this._keyPrefix + name))
                    .then((adr: ServerKeyAddress) => this._http.get(
                        adr + '/server/uuid'
                    )).then(g => g.subscribe((res: IGetResponse) => {
                        this._localStorage.set(Helper.strDefNode, res.msg)
                            .then(() => {
                                Helper.clinicNode = res.msg;
                            })
                            .catch(e => reject(e));
                    }, err => {
                        reject(err);
                    })).catch(e => {
                        reject(e);
                    });
            });
        });
    }

    public getDefaultServer(): Promise<ServerKeyAddress> {
        return new Promise<ServerKeyAddress>(resolve => {
            this._localStorage.get(this._defaultAddress)
                .then(adrName => {
                    this._localStorage.get(this._keyPrefix + adrName)
                        .then(adr => {
                            resolve({
                                key: adrName,
                                address: adr
                            });
                        });
                });
        });
    }

    public getDefaultServerAPI(): Promise<string> {
        return this.getDefaultServer()
            .then(ska => ska.address + '/api');
    }

    public getDefaultServerStore(): Promise<string> {
        return this.getDefaultServer()
            .then(ska => ska.address + '/store');
    }

}
