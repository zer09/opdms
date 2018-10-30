import { Injectable } from '@angular/core';

import { StoreService } from './store.service';
import { SecDoctor } from '../class/sec-doctor';
import { LoggerService } from './logger.service';
import { UserService } from './user.service';

import { UserType } from '../enum/user/user-type.enum';
import { Helper } from '../helper';
import { EncryptGCM } from '../class/encrypt-gcm';

@Injectable({
    providedIn: 'root'
})
export class PeersService {

    public _secDrs: SecDoctor[] = [];

    constructor(
        private _usrSvc: UserService,
        private _sSvc: StoreService,
        private _enc: EncryptGCM,
        private _logSvc: LoggerService,
    ) { }

    public get secDrs(): SecDoctor[] {
        return this._secDrs;
    }

    public fetchSecDrs(): Promise<void> {
        if (!this._usrSvc.user ||
            this._usrSvc.user.userType !== UserType.SECRETARY ||
            this._secDrs.length > 0) {
            return Promise.resolve();
        }

        return this._sSvc.get(Helper.defStore).allDocs({
            include_docs: true,
            startkey: `sd${this._usrSvc.user.signature}`,
            endkey: `sd${this._usrSvc.user.signature}\ufff0`
        }).then(res => {
            const rows = res.rows;
            for (let i = 0; i < rows.length; i++) {
                let p = rows[i].doc.p;
                p = this._enc.decrypt(p, this._usrSvc.user.UUID);
                this._secDrs.push(SecDoctor.parse(p));
            }
        }).catch(e => this._logSvc.log(e));
    }

}
