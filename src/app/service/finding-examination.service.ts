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
export class FindingExaminationService {

  public static fexamString = 'findingexaminations';

  private _sd: SecDoctor;
  private _usr: User;
  private _feList: string[] = [];

  constructor(
    private _sSvc: StoreService,
    private _usrSvc: UserService,
    private _peerSvc: PeersService,
  ) {
    this._usr = this._usrSvc.user;
    this._sd = this._peerSvc.getDrBySignature(this._usr.signature);
  }

  public get feList(): string[] {
    if (this._feList.length < 1) {
      this._listItems();
    }

    return this._feList;
  }

  private _listItems(): void {
    const vs = this._sSvc.get(this._sd.VS);

    vs.get<ItemListString>(FindingExaminationService.fexamString).then(doc => {
      this._feList = doc.l;
    }).catch((e: PouchError) => {
      if (ErrorHelper.IsPouchNotFound(e)) {
        vs.put<ItemListString>({
          _id: FindingExaminationService.fexamString,
          l: [],
        });
      }
    });
  }

  public save(fe: string): void {
    if (this._feList.some(elem => elem.toLowerCase() === fe.toLowerCase())) {
      return;
    }

    const vs = this._sSvc.get(this._sd.VS);

    vs.get<ItemListString>(FindingExaminationService.fexamString).then(doc => {
      if (!doc.l.some(elem => elem.toLowerCase() === fe.toLowerCase())) {
        doc.l.push(fe);
        vs.put(doc).then(() => this._feList.push(fe));
      }
    }).catch((e: PouchError) => {
      if (ErrorHelper.IsPouchNotFound(e)) {
        vs.put<ItemListString>({
          _id: FindingExaminationService.fexamString,
          l: [fe],
        }).then(() => {
          this._feList.push(fe);
        }).catch(() => this.save(fe));
      } else if (ErrorHelper.IsPouchDuplicate(e)) {
        this.save(fe);
      }
    });
  }
}
