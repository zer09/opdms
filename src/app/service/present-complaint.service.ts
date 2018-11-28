import { Injectable } from '@angular/core';
import { StoreService } from './store.service';
import { UserService } from './user.service';
import { SecDoctor } from '../class/sec-doctor';
import { User } from '../class/user';
import { PeersService } from './peers.service';
import { ItemListString } from '../interface/db/item-list-string';
import { PouchError } from '../interface/db/pouch-error';
import { ErrorHelper } from '../error-helper';

@Injectable({
  providedIn: 'root'
})
export class PresentComplaintService {

  public static pcString = 'presentcomplaints';

  private _sd: SecDoctor;
  private _usr: User;
  private _pcList: string[] = [];

  constructor(
    private _sSvc: StoreService,
    private _usrSvc: UserService,
    private _peerSvc: PeersService,
  ) {
    this._usr = this._usrSvc.user;
    this._sd = this._peerSvc.getDrBySignature(this._usr.signature);
  }

  public get pcList(): string[] {
    if (this._pcList.length < 1) {
      this._listItems();
    }

    return this._pcList;
  }

  private _listItems() {
    const vs = this._sSvc.get(this._sd.VS);

    vs.get<ItemListString>(PresentComplaintService.pcString).then(doc => {
      this._pcList = doc.l;
    }).catch((e: PouchError) => {
      if (ErrorHelper.IsPouchNotFound(e)) {
        vs.put<ItemListString>({
          _id: PresentComplaintService.pcString,
          l: [],
        });
      }
    });
  }

  public save(pc: string): void {
    if (this._pcList.some(elem => elem.toLowerCase() === pc.toLowerCase())) {
      return;
    }

    const vs = this._sSvc.get(this._sd.VS);

    vs.get<ItemListString>(PresentComplaintService.pcString).then(doc => {
      if (!doc.l.some(elem => elem.toLowerCase() === pc.toLowerCase())) {
        doc.l.push(pc);
        vs.put(doc).then(() => this._pcList.push(pc));
      }
    }).catch((e: PouchError) => {
      if (ErrorHelper.IsPouchNotFound(e)) {
        vs.put<ItemListString>({
          _id: PresentComplaintService.pcString,
          l: [pc],
        }).then(() => {
          this._pcList.push(pc);
        }).catch(() => this.save(pc));
      } else if (ErrorHelper.IsPouchDuplicate(e)) {
        this.save(pc);
      }
    });
  }
}
