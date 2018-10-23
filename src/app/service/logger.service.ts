import { Injectable } from '@angular/core';
import { ULID, monotonicFactory } from 'ulid';
import * as moment from 'moment';
import { StoreService } from './store.service';

@Injectable({
    providedIn: 'root'
})
export class LoggerService {

    public errLogName = 'errlog';

    private _errLog: any;
    private _ulid: ULID;
    constructor(
        private _sp: StoreService
    ) {
        this._errLog = this._sp.get(this.errLogName);
        this._ulid = monotonicFactory();
    }

    public log(e) {
        this._errLog.put({
            _id: this._ulid(),
            t: moment().unix(),
            e: e.mssage
        });
    }

}
