import { Injectable } from '@angular/core';
import { StoreService } from './store.service';
import { Patient } from '../class/patient';
import { SecDoctor } from '../class/sec-doctor';
import { EncryptGCM } from '../class/encrypt-gcm';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  constructor(
    private _sSvc: StoreService,
    private _enc: EncryptGCM,
  ) { }

  private _indexName(pt: Patient, sc: SecDoctor): void {
    const pti = this._sSvc.get(sc.PTI);
    [
      pt.name.first.toLowerCase(),
      pt.name.last.toLowerCase(),
      pt.name.middle.toLowerCase(),
    ].forEach(ele => {
      pti.get<{ l: string[] }>(ele).then(doc => {
        if (doc.l.findIndex(e => e === pt.Id) >= 0) {
          return;
        }

        doc.l.push(pt.Id);
        pti.put(doc).catch(e => { throw e; });
      }).catch(() => {
        pti.put({ _id: ele, l: [pt.Id], }).catch(() => {
          pti.get<{ l: string[] }>(ele).then(doc => {
            if (doc.l.findIndex(e => e === pt.Id) >= 0) {
              return;
            }

            doc.l.push(pt.Id);
            pti.put(doc).catch(e => { throw e; });
          });
        });
      });
    });
  }

  public getPatient(id: string, sc: SecDoctor): Promise<Patient> {
    return this._sSvc.get(sc.PS).get<{ p: string }>(id).then(doc => {
      const p = this._enc.decrypt(doc.p, sc.UUID2);
      const pt = new Patient(doc._id);
      pt.unminified(p);
      return pt;
    }).catch(e => {
      throw e;
    });
  }

  public save(pt: Patient, sc: SecDoctor): Promise<Patient> {
    pt.name.first = pt.name.first.trim();
    pt.name.last = pt.name.last.trim();
    pt.name.middle = pt.name.middle.trim();
    pt.name.suffix = pt.name.suffix.trim();
    pt.name.nickname = pt.name.nickname.trim();

    const s = this._sSvc.get(sc.PS);
    return s.get<{ p: string }>(pt.Id).then(doc => {
      const oldP = this._enc.decrypt(doc.p, sc.UUID2);
      const newP = pt.minified();
      if (oldP === newP) {
        return pt;
      }

      doc.p = this._enc.encrypt(newP, sc.UUID2);
      return s.put(doc).then(() => {
        this._indexName(pt, sc);
        return pt;
      });
    }).catch(() => {
      return s.put({
        _id: pt.Id,
        p: this._enc.encrypt(pt.minified(), sc.UUID2)
      }).then(() => {
        this._indexName(pt, sc);
        return pt;
      });
    });
  }
}
