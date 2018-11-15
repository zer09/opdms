import { Injectable } from '@angular/core';
import { StoreService } from './store.service';
import { EncryptGCM } from '../class/encrypt-gcm';
import { Appointment } from '../class/appointment';
import { SecDoctor } from '../class/sec-doctor';
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
    return this._sSvc.get(sc.APS).get<{ p: string }>(id).then(doc => {
      return this._ptSvc.getPatient(Appointment.extractPatientId(id), sc)
        .then(pt => {
          const apt = new Appointment(pt, doc._id);
          apt.unminified(this._enc.decrypt(doc.p, sc.UUID2));

          return apt;
        }).catch(e => {
          throw e;
        });
    }).catch(e => {
      throw e;
    });
  }

  public save(apt: Appointment, sc: SecDoctor): Promise<Appointment> {
    const s = this._sSvc.get(sc.APS);
    return s.get<{ p: string }>(apt.Id).then(doc => {
      const oldP = this._enc.decrypt(doc.p, sc.UUID2);
      const newP = apt.minified();
      if (oldP === newP) {
        return apt;
      }

      doc.p = this._enc.encrypt(newP, sc.UUID2);
      return s.put(doc).then(() => apt);
    }).catch(() => {
      return s.put({
        _id: apt.Id,
        p: this._enc.encrypt(apt.minified(), sc.UUID2),
      }).then(() => apt);
    });
  }
}
