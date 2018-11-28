import { Injectable } from '@angular/core';
import { SecDoctor } from '../class/sec-doctor';
import { User } from '../class/user';
import { StoreService } from './store.service';
import { UserService } from './user.service';
import { PeersService } from './peers.service';
import { ItemListString } from '../interface/db/item-list-string';
import { PouchError } from '../interface/db/pouch-error';
import { ErrorHelper } from '../error-helper';

@Injectable({
  providedIn: 'root'
})
export class CurrentClinicalImpressionService {

  public static cciString = 'currentclinicalimpressions';

  private _sd: SecDoctor;
  private _usr: User;
  private _cciList: string[] = [];

  constructor(
    private _sSvc: StoreService,
    private _usrSvc: UserService,
    private _peerSvc: PeersService,
  ) {
    this._usr = this._usrSvc.user;
    this._sd = this._peerSvc.getDrBySignature(this._usr.signature);
  }

  public get cciList(): string[] {
    if (this._cciList.length < 1) {
      this._listItems();
    }

    return this._cciList;
  }

  private _listItems(): void {
    const vs = this._sSvc.get(this._sd.VS);

    vs.get<ItemListString>(CurrentClinicalImpressionService.cciString)
      .then(doc => {
        this._cciList = doc.l;
      })
      .catch((e: PouchError) => {
        if (ErrorHelper.IsPouchNotFound(e)) {
          vs.put<ItemListString>({
            _id: CurrentClinicalImpressionService.cciString,
            l: [],
          });
        }
      });
  }

  public save(cci: string): void {
    if (this._cciList.some(elem => elem.toLowerCase() === cci.toLowerCase())) {
      return;
    }

    const vs = this._sSvc.get(this._sd.VS);

    vs.get<ItemListString>(CurrentClinicalImpressionService.cciString)
      .then(doc => {
        if (!doc.l.some(elem => elem.toLowerCase() === cci.toLowerCase())) {
          doc.l.push(cci);
          vs.put(doc).then(() => this._cciList.push(cci));
        }
      })
      .catch((e: PouchError) => {
        if (ErrorHelper.IsPouchNotFound(e)) {
          vs.put<ItemListString>({
            _id: CurrentClinicalImpressionService.cciString,
            l: [cci],
          }).then(() => {
            this._cciList.push(cci);
          }).catch(() => this.save(cci));
        } else if (ErrorHelper.IsPouchDuplicate(e)) {
          this.save(cci);
        }
      });
  }
}
