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

  private _secDrs: SecDoctor[] = [];
  private _curDr!: SecDoctor;

  constructor(
    private _usrSvc: UserService,
    private _sSvc: StoreService,
    private _enc: EncryptGCM,
    private _logSvc: LoggerService,
  ) { }

  public get secDrs(): SecDoctor[] {
    return this._secDrs;
  }

  public get curDr(): SecDoctor {
    return this._curDr;
  }

  public fetchSecDrs(): Promise<void> {
    if (!this._usrSvc.user ||
      this._usrSvc.user.userType !== UserType.SECRETARY ||
      this._secDrs.length > 0) {
      return Promise.resolve();
    }

    return this._sSvc.get(Helper.defStore).allDocs<{ p: string }>({
      include_docs: true,
      startkey: `sd${this._usrSvc.user.signature}`,
      endkey: `sd${this._usrSvc.user.signature}\ufff0`
    }).then(res => {
      res.rows.forEach(row => {
        const doc = row.doc;
        if (doc) {
          const p = this._enc.decrypt(doc.p, this._usrSvc.user.UUID);
          this._secDrs.push(SecDoctor.parse(p));
        }
      });
    }).catch(e => this._logSvc.log(e));
  }

  public fetchCurDr(): void {
    if (!this._usrSvc.user ||
      this._usrSvc.user.userType !== UserType.DOCTOR ||
      this._curDr) {
      return;
    }

    const curDr = SecDoctor.UserToDr(this._usrSvc.user);
    if (curDr) {
      this._curDr = curDr;
    }
  }

  public getDrBySignature(sig: string): SecDoctor {
    if (this._usrSvc.user.userType === UserType.DOCTOR) {
      return this._curDr;
    } else {
      return this._secDrs.find(e => {
        return e.signature === sig;
      }) || SecDoctor.Default;
    }
  }
}
