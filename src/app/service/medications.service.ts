import { Injectable } from '@angular/core';
import { Medicine } from '../class/medicine';
import { SecDoctor } from '../class/sec-doctor';
import { User } from '../class/user';
import { Helper } from '../helper';
import { Payload } from '../interface/payload';
import { LoggerService } from './logger.service';
import { PeersService } from './peers.service';
import { StoreService } from './store.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class MedicationsService {

  private _sd: SecDoctor;
  private _usr: User;

  private _medsList: Medicine[] = [];
  private _medsFrmList: string[] = [];
  private _medsStrList: string[] = [];

  constructor(
    private _sSvc: StoreService,
    private _usrSvc: UserService,
    private _peerSvc: PeersService,
    private _logSvc: LoggerService,
  ) {
    this._usr = this._usrSvc.user;
    this._sd = this._peerSvc.getDrBySignature(this._usr.signature);

    this._listMedicines();
    this._listMedForms();
    this._listMedStrs();
  }

  public static get medString(): string {
    return 'meds:';
  }

  public static get medFormString(): string {
    return 'medfrm:';
  }

  public static get medStrengthString(): string {
    return 'medstr:';
  }

  public get medsList(): Medicine[] {
    return this._medsList;
  }

  public get medsForms(): string[] {
    return this._medsFrmList;
  }

  public get medsStrengths(): string[] {
    return this._medsStrList;
  }

  public get qtyList(): number[] {
    return [7, 10, 14, 21, 30, 50, 90, 100, 200, 300];
  }

  private async _listMedicines(): Promise<void> {
    const ms = this._sSvc.get(this._sd.MS);
    this._medsList.length = 0;

    try {
      const docs = await ms.allDocs<Payload>({
        include_docs: true,
        startkey: MedicationsService.medString,
        endkey: MedicationsService.medString + '\ufff0',
      });

      for (const row of docs.rows) {
        const doc = row.doc;
        if (doc) {
          if (!this._medsList.some((s) => s.minified().toLowerCase() ===
            doc.p.toLowerCase())) {
            const med = Medicine.unminified(doc.p);
            this._medsList.push(med);
          }
        }
      }
    } catch (e) {
      this._logSvc.log(e);
    }
  }

  public async save(med: Medicine): Promise<void> {
    med.generic = med.generic.trim();
    med.brand = med.brand.trim();
    med.str = med.str.trim();

    if (this._medsList.some(e => e.minified().toLowerCase() ===
      med.minified().toLowerCase())) {
      return;
    }

    const ms = this._sSvc.get(this._sd.MS);
    try {
      await ms.put<Payload>({
        _id: MedicationsService.medString + Helper.ulidString,
        p: med.minified(),
      });

      this._medsList.push(med);
    } catch (e) {
      this.save(med);
    }
  }

  private async _listMedForms(): Promise<void> {
    const ms = this._sSvc.get(this._sd.MS);

    try {
      const docs = await ms.allDocs<Payload>({
        include_docs: true,
        startkey: MedicationsService.medFormString,
        endkey: MedicationsService.medFormString + '\ufff0,'
      });

      for (const row of docs.rows) {
        const doc = row.doc;
        if (doc) {
          if (!this._medsFrmList.some((s) => s.toLowerCase() === doc.p.toLowerCase())) {
            this._medsFrmList.push(doc.p);
          }
        }
      }
    } catch (e) {
      this._logSvc.log(e);
    }
  }

  public saveMedForm(medForm: string): void {
    medForm = medForm.trim();
    if (this._medsFrmList.some(e => e.toLowerCase() === medForm.toLowerCase())) {
      return;
    }

    const ms = this._sSvc.get(this._sd.MS);
    ms.put<Payload>({
      _id: MedicationsService.medFormString + Helper.ulidString,
      p: medForm,
    })
      .then(() => this._medsFrmList.push(medForm))
      .catch(() => this.saveMedForm(medForm));
  }

  private async _listMedStrs(): Promise<void> {
    const ms = this._sSvc.get(this._sd.MS);

    try {
      const docs = await ms.allDocs<Payload>({
        include_docs: true,
        startkey: MedicationsService.medStrengthString,
        endkey: MedicationsService.medStrengthString + '\ufff0',
      });

      for (const row of docs.rows) {
        const doc = row.doc;
        if (doc) {
          if (!this._medsStrList.some((s) => s.toLowerCase() === doc.p.toLowerCase())) {
            this._medsStrList.push(doc.p);
          }
        }
      }
    } catch (e) {
      this._logSvc.log(e);
    }
  }

  public saveMedStr(str: string): void {
    str = str.trim();
    if (this._medsStrList.some(e => e.toLowerCase() === str.toLowerCase())) {
      return;
    }

    const ms = this._sSvc.get(this._sd.MS);
    ms.put<Payload>({
      _id: MedicationsService.medStrengthString + Helper.ulidString,
      p: str,
    })
      .then(() => this._medsStrList.push(str))
      .catch(() => this.saveMedStr(str));
  }
}
