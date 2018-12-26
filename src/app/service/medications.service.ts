import { Injectable } from '@angular/core';
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

  private _medsList: string[] = [];
  private _medsS2List: string[] = [];
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

    // this._listMedicines();
    // this._listMedForms();
    // this._listMedStrs();
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

  public get medsList(): string[] {
    if (this._medsList.length < 1) {
      this._listMedicines();
    }

    return this._medsList;
  }

  public get medsForms(): string[] {
    if (this._medsFrmList.length < 1) {
      this._listMedForms();
    }

    return this._medsFrmList;
  }

  public get medsStrengths(): string[] {
    if (this._medsStrList.length < 1) {
      this._listMedStrs();
    }

    return this._medsStrList;
  }

  public get qtyList(): number[] {
    return [7, 10, 14, 21, 30, 50, 90, 100, 200, 300];
  }

  private _listMedicines(): void {
    const ms = this._sSvc.get(this._sd.MS);

    ms.allDocs<Payload & { s2: boolean }>({
      include_docs: true,
      startkey: MedicationsService.medString,
      endkey: MedicationsService.medString + '\ufff0',
    }).then(res => {
      res.rows.forEach(row => {
        const doc = row.doc;
        if (doc) {
          if (doc.s2) {
            this._medsS2List.push(doc.p);
          }

          this._medsList.push(doc.p.toLowerCase());
        }
      });
    }).catch(e => this._logSvc.log(e));
  }

  public isS2(med: string): boolean {
    return this._medsS2List.includes(med.toLowerCase());
  }

  public save(med: string, s2: boolean): void {
    med = med.trim();
    if (this._medsList.some(e => e.toLowerCase() === med.toLowerCase())) {
      return;
    }

    const ms = this._sSvc.get(this._sd.MS);
    ms.put<Payload & { s2: boolean }>({
      _id: MedicationsService.medString + Helper.ulidString,
      p: med,
      s2: s2,
    })
      .then(() => this._medsList.push(med))
      .catch(() => this.save(med, s2));
  }

  private _listMedForms(): void {
    const ms = this._sSvc.get(this._sd.MS);

    ms.allDocs<Payload>({
      include_docs: true,
      startkey: MedicationsService.medFormString,
      endkey: MedicationsService.medFormString + '\ufff0,'
    }).then(res => {
      res.rows.forEach(row => {
        const doc = row.doc;
        if (doc) {
          this._medsFrmList.push(doc.p);
        }
      });
    }).catch(e => this._logSvc.log(e));
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

  private _listMedStrs(): void {
    const ms = this._sSvc.get(this._sd.MS);

    ms.allDocs<Payload>({
      include_docs: true,
      startkey: MedicationsService.medStrengthString,
      endkey: MedicationsService.medStrengthString + '\ufff0',
    }).then(res => {
      res.rows.forEach(row => {
        const doc = row.doc;
        if (doc) {
          this._medsStrList.push(doc.p);
        }
      });
    }).catch(e => this._logSvc.log(e));
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
