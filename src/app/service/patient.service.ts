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

    public getPatient(id: string, sc: SecDoctor): Promise<Patient> {
        return this._sSvc.get(sc.PS).get(id).then(doc => {
            const p = this._enc.decrypt(doc.p, sc.UUID2);
            const pt = new Patient(doc._id);

            pt.unminified(p);
            return pt;
        });
    }

    public save(pt: Patient, sc: SecDoctor): Promise<IUpsertResult> {
        return this._sSvc.get(sc.PS).upsert(pt.Id, doc => {
            const p = pt.minified();
            doc.p = this._enc.encrypt(p, sc.UUID2);
            return doc;
        });
    }

}
