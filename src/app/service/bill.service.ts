import { Injectable } from '@angular/core';
import { StoreService } from './store.service';
import { Bill } from '../class/bills';
import { SecDoctor } from '../class/sec-doctor';
import { User } from '../class/user';
import { UserService } from './user.service';
import { PeersService } from './peers.service';
import { LoggerService } from './logger.service';
import { Payload } from '../interface/payload';
import { Helper } from '../helper';

@Injectable({
  providedIn: 'root'
})
export class BillService {

  private _sd: SecDoctor;
  private _usr: User;
  private _billsList: Bill[] = [];

  public static get billString(): string {
    return 'bill:';
  }

  constructor(
    private _sSvc: StoreService,
    private _usrSvc: UserService,
    private _peerSvc: PeersService,
    private _logSvc: LoggerService,
  ) {
    this._usr = this._usrSvc.user;
    this._sd = this._peerSvc.getDrBySignature(this._usr.signature);

    this._listBills();
  }

  public get bills(): Bill[] {
    return this._billsList;
  }

  public async save(bill: Bill): Promise<void> {
    if (!bill.bill) {
      throw new Error('please specify the bill name');
    }

    const ms = this._sSvc.get(this._sd.MS);

    try {
      await ms.put<Payload>({
        _id: BillService.billString + Helper.ulidString,
        p: bill.minified(),
      });

      this._billsList.push(bill);
    } catch (e) {
      this.save(bill);
    }
  }

  private async _listBills(): Promise<void> {
    const ms = this._sSvc.get(this._sd.MS);
    this._billsList.length = 0;

    try {
      const docs = await ms.allDocs<Payload>({
        include_docs: true,
        startkey: BillService.billString,
        endkey: BillService.billString + '\ufff0',
      });

      for (const row of docs.rows) {
        const doc = row.doc;
        if (doc) {
          if (!this._billsList.some((s) => s.minified().toLowerCase() ===
            doc.p.toLowerCase())) {
            const bill = Bill.unminified(doc.p);
            this._billsList.push(bill);
          }
        }
      }
    } catch (e) {
      this._logSvc.log(e);
    }

    for (let i = 0; i < 10; i++) {
      const b = new Bill();
      b.bill = 'bill ' + i;
      b.amount = i;
      this._billsList.push(b);
    }
  }

}
