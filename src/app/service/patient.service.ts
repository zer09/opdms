import { Injectable } from '@angular/core';
import { StoreService } from './store.service';
import { Patient } from '../class/patient';
import { SecDoctor } from '../class/sec-doctor';
import { EncryptGCM } from '../class/encrypt-gcm';
import { IUpsertResult } from '../interface/db/iupsert-result';

@Injectable({
    providedIn: 'root'
})
export class PatientService {

    constructor(
        private _sSvc: StoreService,
        private _enc: EncryptGCM,
    ) { }

    private _indexName(pt: Patient, sc: SecDoctor) {
        const pti = this._sSvc.get(sc.PTI);

        [
            pt.name.first.toLowerCase(),
            pt.name.last.toLowerCase(),
            pt.name.middle.toLowerCase(),
        ].forEach(ele => {
            pti.upsert(ele, doc => {
                if (!doc.l) {
                    doc.l = [];
                } else if (doc.l.find(e => e === pt.Id) !== -1) {
                    return doc;
                }

                doc.l.push(pt.Id);
                return doc;
            });
        });
    }

    public getPatient(id: string, sc: SecDoctor): Promise<Patient> {
        return this._sSvc.get(sc.PS).get(id).then(doc => {
            const p = this._enc.decrypt(doc.p, sc.UUID2);
            const pt = new Patient(doc._id);

            pt.unminified(p);
            return pt;
        });
    }

    public save(pt: Patient, sc: SecDoctor): Promise<IUpsertResult> {
        pt.name.first = pt.name.first.trim();
        pt.name.last = pt.name.last.trim();
        pt.name.middle = pt.name.middle.trim();
        pt.name.suffix = pt.name.suffix.trim();
        pt.name.nickname = pt.name.nickname.trim();

        return this._sSvc.get(sc.PS).upsert(pt.Id, doc => {
            const p = pt.minified();
            doc.p = this._enc.encrypt(p, sc.UUID2);
            return doc;
        }).then((res: IUpsertResult) => {
            if (res.updated) {
                this._indexName(pt, sc);
            }

            return res;
        });
    }

}
