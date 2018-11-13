import { Injectable } from '@angular/core';
import moment from 'moment';
import { StoreService } from './store.service';
import { Helper } from '../helper';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  public errLogName = 'errlog';

  private _errLog: any;

  constructor(
    private _sp: StoreService
  ) {
    this._errLog = this._sp.get(this.errLogName);
  }

  public log(e) {
    this._errLog.put({
      _id: Helper.ulidString,
      t: moment().unix(),
      e: e.message
    });
  }

}
