import { Injectable } from '@angular/core';
import { StoreService } from './store.service';
import { EncryptGCM } from '../class/encrypt-gcm';
import { Appointment } from '../class/appointment';
import { SecDoctor } from '../class/sec-doctor';
import { UpsertResult } from '../interface/db/upsert-result';
import { PatientService } from './patient.service';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  constructor(
    private _sSvc: StoreService,
    private _enc: EncryptGCM,
    private _ptSvc: PatientService,
  ) { }

  public getAppointment(id: string, sc: SecDoctor): Promise<Appointment> {
    return this._sSvc.get(sc.APS).get(id).then(doc => {
      const p = this._enc.decrypt(doc.p, sc.UUID2);
      let ptId = JSON.parse(p);
      ptId = ptId[0];

      return this._ptSvc.getPatient(ptId, sc).then(pt => {
        const apt = new Appointment(pt, doc._id);
        apt.unminified(p);
        return apt;
      });
    });
  }

  public save(apt: Appointment, sc: SecDoctor): Promise<UpsertResult> {
    return this._sSvc.get(sc.APS).upsert(apt.Id, doc => {
      const p = apt.minified();
      doc.p = this._enc.encrypt(p, sc.UUID2);
      return doc;
    });
  }

}
